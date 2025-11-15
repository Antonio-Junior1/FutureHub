import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MissionCard = ({ mission, theme, onPress }) => {
  const getAreaColor = (areaId) => {
    const colors = {
      ia: '#e94560',
      sustentabilidade: '#28a745',
      programacao: '#17a2b8',
      design: '#ff6b81',
      empreendedorismo: '#ffd93d',
      educacao: '#6f42c1',
      saude: '#fd7e14',
      inclusao: '#20c997',
    };
    return colors[areaId] || '#e94560';
  };

  const areaColor = getAreaColor(mission.area);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.badge, { backgroundColor: areaColor }]}>
        <Ionicons name="flash" size={16} color="#fff" />
      </View>

      <Text style={[styles.title, { color: theme.text.primary }]}>
        {mission.titulo}
      </Text>
      
      <Text style={[styles.description, { color: theme.text.secondary }]}>
        {mission.descricao}
      </Text>

      <View style={styles.footer}>
        <View style={styles.moralContainer}>
          <Ionicons name="heart-outline" size={16} color={theme.accent[500]} />
          <Text style={[styles.moral, { color: theme.text.secondary }]}>
            {mission.moral}
          </Text>
        </View>

        <View style={[styles.actionButton, { backgroundColor: areaColor }]}>
          <Text style={styles.actionText}>Aceitar Missão</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 18,
    padding: 22,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingRight: 40,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  footer: {
    marginTop: 10,
  },
  moralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  moral: {
    fontSize: 13,
    fontStyle: 'italic',
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MissionCard;
