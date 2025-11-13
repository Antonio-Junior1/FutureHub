import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import { logoutUser } from '../services/authService';
import { AREAS } from '../data/areas';

const ProfileScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, userProfile } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (!result.success) {
              Alert.alert('Erro', 'Erro ao sair. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const getBadge = (points) => {
    if (points >= 301) return { icon: '💎', name: 'Visionário', color: '#9b59b6' };
    if (points >= 151) return { icon: '🥇', name: 'Inovador', color: '#f39c12' };
    if (points >= 51) return { icon: '🥈', name: 'Colaborador', color: '#95a5a6' };
    return { icon: '🥉', name: 'Iniciante', color: '#cd7f32' };
  };

  const badge = getBadge(userProfile?.pontos || 0);

  const getUserInterests = () => {
    if (!userProfile?.interesses) return [];
    return AREAS.filter(area => userProfile.interesses.includes(area.id));
  };

  const userInterests = getUserInterests();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header do Perfil */}
      <View style={[styles.header, { backgroundColor: theme.primary[900] }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.secondary[500] }]}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeEmoji}>{badge.icon}</Text>
          </View>
        </View>
        
        <Text style={[styles.name, { color: theme.text.inverse }]}>
          {user?.displayName || 'Usuário'}
        </Text>
        <Text style={[styles.email, { color: theme.text.secondary }]}>
          {user?.email}
        </Text>
        
        <View style={[styles.badgeContainer, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeName}>{badge.name}</Text>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="trophy" size={32} color={theme.accent[500]} />
          <Text style={[styles.statValue, { color: theme.text.primary }]}>
            {userProfile?.pontos || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
            Pontos
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="bulb" size={32} color={theme.secondary[500]} />
          <Text style={[styles.statValue, { color: theme.text.primary }]}>
            {userInterests.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
            Interesses
          </Text>
        </View>
      </View>

      {/* Áreas de Interesse */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Minhas Áreas de Interesse
        </Text>
        {userInterests.map((interest) => (
          <View 
            key={interest.id}
            style={[styles.interestItem, { backgroundColor: theme.surface }]}
          >
            <Ionicons name={interest.icon} size={24} color={interest.color} />
            <Text style={[styles.interestName, { color: theme.text.primary }]}>
              {interest.nome}
            </Text>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: theme.secondary[500] }]}
          onPress={() => navigation.navigate('InterestsSelection')}
        >
          <Ionicons name="create-outline" size={20} color={theme.secondary[500]} />
          <Text style={[styles.editButtonText, { color: theme.secondary[500] }]}>
            Editar Interesses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 50,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  badgeEmoji: {
    fontSize: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    marginBottom: 15,
  },
  badgeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  interestName: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 10,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
