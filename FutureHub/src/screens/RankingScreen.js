import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import RankingItem from '../components/RankingItem';
import { getTopUsers } from '../services/firestoreService';

const RankingScreen = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, userProfile } = useUser();

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const result = await getTopUsers(50);
      
      if (result.success) {
        setTopUsers(result.data);
        
        // Encontrar posição do usuário atual
        const position = result.data.findIndex(u => u.id === user.uid);
        if (position !== -1) {
          setUserPosition(position + 1);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRanking();
  };

  const renderPodium = () => {
    if (topUsers.length < 3) return null;

    const podiumUsers = [
      { user: topUsers[1], position: 2, height: 120 }, // 2º lugar
      { user: topUsers[0], position: 1, height: 160 }, // 1º lugar
      { user: topUsers[2], position: 3, height: 100 }, // 3º lugar
    ];

    const getPodiumColor = (position) => {
      if (position === 1) return '#FFD700';
      if (position === 2) return '#C0C0C0';
      return '#CD7F32';
    };

    return (
      <View style={styles.podiumContainer}>
        {podiumUsers.map(({ user, position, height }) => (
          <View key={position} style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, { backgroundColor: getPodiumColor(position) }]}>
              <Text style={styles.podiumAvatarText}>
                {user.nome?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={[styles.podiumCrown, { backgroundColor: getPodiumColor(position) }]}>
              <Ionicons name="trophy" size={20} color="#fff" />
            </View>
            <Text style={[styles.podiumName, { color: theme.text.inverse }]} numberOfLines={1}>
              {user.nome?.split(' ')[0] || 'Usuário'}
            </Text>
            <Text style={[styles.podiumPoints, { color: theme.accent[500] }]}>
              {user.pontos || 0} pts
            </Text>
            <View 
              style={[
                styles.podiumBase, 
                { 
                  height, 
                  backgroundColor: getPodiumColor(position),
                  opacity: 0.3 
                }
              ]}
            >
              <Text style={styles.podiumPosition}>#{position}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary[500]} />
        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
          Carregando ranking...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.primary[900], theme.background]}
        style={styles.gradient}
      >
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
            <Ionicons name="trophy" size={40} color={theme.accent[500]} />
            <Text style={[styles.title, { color: theme.text.inverse }]}>
              Ranking Global
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Top {topUsers.length} Inovadores
            </Text>
          </View>

          {/* Pódio (Top 3) */}
          {renderPodium()}

          {/* Sua Posição */}
          {userPosition && userPosition > 3 && (
            <View style={styles.yourPositionContainer}>
              <Text style={[styles.yourPositionLabel, { color: theme.text.secondary }]}>
                Sua Posição
              </Text>
              <RankingItem
                user={userProfile}
                position={userPosition}
                theme={theme}
                isCurrentUser={true}
              />
            </View>
          )}

          {/* Lista Completa */}
          <View style={styles.listContainer}>
            <Text style={[styles.listTitle, { color: theme.text.primary }]}>
              Ranking Completo
            </Text>
            {topUsers.map((rankUser, index) => (
              <RankingItem
                key={rankUser.id}
                user={rankUser}
                position={index + 1}
                theme={theme}
                isCurrentUser={rankUser.id === user.uid}
              />
            ))}
          </View>

          {/* Info sobre Pontuação */}
          <View style={[styles.infoCard, { backgroundColor: theme.primary[800] }]}>
            <Ionicons name="information-circle" size={24} color={theme.accent[500]} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: theme.text.inverse }]}>
                Como ganhar pontos?
              </Text>
              <Text style={[styles.infoText, { color: theme.text.secondary }]}>
                • Publicar ideia: +10 pontos{'\n'}
                • Receber curtida: +5 pontos{'\n'}
                • Receber avaliação: +3 pontos por estrela
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 1,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  podiumAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  podiumCrown: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  podiumPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumPosition: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  yourPositionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  yourPositionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
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
  infoCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    gap: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default RankingScreen;
