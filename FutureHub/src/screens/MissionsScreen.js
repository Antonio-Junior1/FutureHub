import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import MissionCard from '../components/MissionCard';
import { MISSIONS, getRandomMission } from '../data/missions';
import { getUserCompletedMissions } from '../services/firestoreService';
import { buscarMissoes, gerarNovasMissoes, converterMissoesParaApp } from '../services/missoesApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MissionsScreen = ({ navigation }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [fromCache, setFromCache] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, userProfile } = useUser();

  useEffect(() => {
    loadMissions();
  }, [userProfile]);

  const loadMissions = async () => {
    if (!userProfile?.interesses || userProfile.interesses.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Buscar missões da API
      const apiResult = await buscarMissoes();
      
      if (apiResult.success) {
        // Converter missões da API para o formato do app
        const missoesConvertidas = converterMissoesParaApp(apiResult.data);
        
        // Filtrar missões baseadas nos interesses do usuário
        const generatedMissions = [];
        for (const interest of userProfile.interesses) {
          if (missoesConvertidas[interest] && missoesConvertidas[interest].length > 0) {
            generatedMissions.push(missoesConvertidas[interest][0]);
          }
        }

        setMissions(generatedMissions);
        setFromCache(apiResult.fromCache || false);
      } else {
        // Fallback: usar missões estáticas do arquivo local
        console.log('Usando missões estáticas (fallback)');
        const generatedMissions = [];
        for (const interest of userProfile.interesses) {
          const mission = getRandomMission(interest);
          if (mission) {
            generatedMissions.push(mission);
          }
        }
        setMissions(generatedMissions);
        setFromCache(false);
      }

    } catch (error) {
      console.error('Erro ao carregar missões:', error);
      
      // Fallback: usar missões estáticas
      const generatedMissions = [];
      for (const interest of userProfile.interesses) {
        const mission = getRandomMission(interest);
        if (mission) {
          generatedMissions.push(mission);
        }
      }
      setMissions(generatedMissions);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMissions();
  };

  const handleGenerateNew = async () => {
    Alert.alert(
      'Gerar Novas Missões',
      'Deseja gerar novas missões usando IA? Isso pode levar alguns segundos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Gerar',
          onPress: async () => {
            setGenerating(true);
            try {
              const result = await gerarNovasMissoes();
              
              if (result.success) {
                Alert.alert(
                  'Sucesso!',
                  'Novas missões foram geradas com sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: () => loadMissions(),
                    },
                  ]
                );
              } else {
                Alert.alert(
                  'Erro',
                  'Não foi possível gerar novas missões. Tente novamente mais tarde.'
                );
              }
            } catch (error) {
              console.error('Erro ao gerar missões:', error);
              Alert.alert(
                'Erro',
                'Ocorreu um erro ao gerar novas missões.'
              );
            } finally {
              setGenerating(false);
            }
          },
        },
      ]
    );
  };

  const handleMissionPress = (mission) => {
    navigation.navigate('IdeaSubmission', { mission });
  };

  if (!userProfile?.interesses || userProfile.interesses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="bulb-outline" size={80} color={theme.text.secondary} />
        <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
          Nenhuma área de interesse selecionada
        </Text>
        <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
          Vá até seu perfil e selecione suas áreas de interesse para receber missões personalizadas!
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary[500] }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Ir para o Perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary[500]} />
        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
          Carregando missões...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.secondary[500]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text.secondary }]}>
              Olá, {user?.displayName?.split(' ')[0] || 'Usuário'}!
            </Text>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Suas Missões do Dia
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.accent[500] }]}
              onPress={handleGenerateNew}
              disabled={generating}
            >
              {generating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="sparkles" size={24} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.secondary[500] }]}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cache Info */}
        {fromCache && (
          <View style={[styles.cacheInfo, { backgroundColor: theme.primary[800] }]}>
            <Ionicons name="cloud-offline-outline" size={20} color={theme.accent[500]} />
            <Text style={[styles.cacheText, { color: theme.text.inverse }]}>
              Exibindo missões do cache (offline)
            </Text>
          </View>
        )}

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.primary[900] }]}>
          <Ionicons name="information-circle" size={24} color={theme.accent[500]} />
          <Text style={[styles.infoText, { color: theme.text.inverse }]}>
            Complete missões para ganhar pontos e subir no ranking! Use o botão ✨ para gerar novas missões com IA.
          </Text>
        </View>

        {/* Missões */}
        <View style={styles.missionsContainer}>
          {missions.length > 0 ? (
            missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                theme={theme}
                onPress={() => handleMissionPress(mission)}
              />
            ))
          ) : (
            <View style={styles.emptyMissions}>
              <Ionicons name="checkmark-circle-outline" size={60} color={theme.text.secondary} />
              <Text style={[styles.emptyMissionsText, { color: theme.text.secondary }]}>
                Nenhuma missão disponível no momento
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cacheInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  cacheText: {
    fontSize: 14,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  missionsContainer: {
    gap: 15,
  },
  emptyMissions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMissionsText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default MissionsScreen;
