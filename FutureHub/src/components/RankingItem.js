import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RankingItem = ({ user, position, theme, isCurrentUser }) => {
  const getBadge = (points) => {
    if (points >= 301) return { icon: '💎', name: 'Visionário', color: '#9b59b6' };
    if (points >= 151) return { icon: '🥇', name: 'Inovador', color: '#f39c12' };
    if (points >= 51) return { icon: '🥈', name: 'Colaborador', color: '#95a5a6' };
    return { icon: '🥉', name: 'Iniciante', color: '#cd7f32' };
  };

  const badge = getBadge(user.pontos || 0);

  const getMedalColor = (pos) => {
    if (pos === 1) return '#FFD700'; // Ouro
    if (pos === 2) return '#C0C0C0'; // Prata
    if (pos === 3) return '#CD7F32'; // Bronze
    return theme.text.secondary;
  };

  const getMedalIcon = (pos) => {
    if (pos <= 3) return 'medal';
    return 'trophy-outline';
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isCurrentUser ? theme.primary[800] : theme.surface,
          borderColor: isCurrentUser ? theme.secondary[500] : 'transparent',
          borderWidth: isCurrentUser ? 2 : 0,
        }
      ]}
    >
      {/* Posição */}
      <View style={styles.positionContainer}>
        <Ionicons 
          name={getMedalIcon(position)} 
          size={28} 
          color={getMedalColor(position)} 
        />
        <Text style={[styles.position, { color: getMedalColor(position) }]}>
          #{position}
        </Text>
      </View>

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: badge.color }]}>
        <Text style={styles.avatarText}>
          {user.nome?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>

      {/* Info do Usuário */}
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text 
            style={[
              styles.userName, 
              { color: isCurrentUser ? theme.text.inverse : theme.text.primary }
            ]}
            numberOfLines={1}
          >
            {user.nome || 'Usuário'}
          </Text>
          {isCurrentUser && (
            <View style={[styles.youBadge, { backgroundColor: theme.secondary[500] }]}>
              <Text style={styles.youText}>VOCÊ</Text>
            </View>
          )}
        </View>
        <Text style={[styles.badgeName, { color: badge.color }]}>
          {badge.icon} {badge.name}
        </Text>
      </View>

      {/* Pontos */}
      <View style={styles.pointsContainer}>
        <Text 
          style={[
            styles.points, 
            { color: isCurrentUser ? theme.accent[500] : theme.text.primary }
          ]}
        >
          {user.pontos || 0}
        </Text>
        <Text 
          style={[
            styles.pointsLabel, 
            { color: isCurrentUser ? theme.text.inverse : theme.text.secondary }
          ]}
        >
          pontos
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  positionContainer: {
    alignItems: 'center',
    width: 50,
  },
  position: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeName: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 12,
  },
});

export default RankingItem;
