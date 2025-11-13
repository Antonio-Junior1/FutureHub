import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import MissionCard from '../components/MissionCard';
import { MISSIONS, getRandomMission } from '../data/missions';
import { getUserCompletedMissions } from '../services/firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MissionsScreen = ({ navigation }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([]);
  
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
      // Buscar missões concluídas do Firestore
      const completedResult = await getUserCompletedMissions(user.uid);
      const completed = completedResult.success ? completedResult.data : [];
      setCompletedMissions(completed);

      // Buscar missões já exibidas do AsyncStorage
      const shownMissionsStr = await AsyncStorage.getItem(`shown_missions_${user.uid}`);
      const shownMissions = shownMissionsStr ? JSON.parse(shownMissionsStr) : [];

      // Gerar missões para cada área de interesse
      const generatedMissions = [];
      for (const interest of userProfile.interesses) {
        const mission = getRandomMission(interest, [...completed, ...shownMissions]);
        if (mission) {
          generatedMissions.push(mission);
        }
      }

      setMissions(generatedMissions);

      // Salvar IDs das missões exibidas
      const newShownMissions = generatedMissions.map(m => m.id);
      await AsyncStorage.setItem(
        `shown_missions_${user.uid}`, 
        JSON.stringify([...shownMissions, ...newShownMissions])
      );

    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMissions();
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
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: theme.secondary[500] }]}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.primary[900] }]}>
          <Ionicons name="information-circle" size={24} color={theme.accent[500]} />
          <Text style={[styles.infoText, { color: theme.text.inverse }]}>
            Complete missões e publique suas ideias para ganhar pontos e subir no ranking!
          </Text>
        </View>

        {/* Missões */}
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
            <Ionicons name="checkmark-circle" size={60} color={theme.success} />
            <Text style={[styles.emptyMissionsText, { color: theme.text.primary }]}>
              Você completou todas as missões disponíveis!
            </Text>
            <Text style={[styles.emptyMissionsSubtext, { color: theme.text.secondary }]}>
              Puxe para baixo para atualizar
            </Text>
          </View>
        )}
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
  greeting: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
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
    marginTop: 15,
    fontSize: 16,
  },
  emptyMissions: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyMissionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyMissionsSubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default MissionsScreen;
