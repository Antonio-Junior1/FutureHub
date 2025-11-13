import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IdeaCard = ({ idea, theme, onLike, onRate, isLiked, currentUserId }) => {
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

  const areaColor = getAreaColor(idea.area);
  const isOwnIdea = idea.id_usuario === currentUserId;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Agora';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: areaColor }]}>
          <Text style={styles.avatarText}>
            {idea.nome_usuario?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.text.primary }]}>
            {idea.nome_usuario || 'Usuário'}
          </Text>
          <Text style={[styles.timestamp, { color: theme.text.secondary }]}>
            {formatDate(idea.createdAt)}
          </Text>
        </View>
        <View style={[styles.areaBadge, { backgroundColor: areaColor }]}>
          <Ionicons name="bookmark" size={14} color="#fff" />
        </View>
      </View>

      {/* Conteúdo */}
      <Text style={[styles.title, { color: theme.text.primary }]}>
        {idea.titulo}
      </Text>
      <Text style={[styles.description, { color: theme.text.secondary }]}>
        {idea.descricao}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onLike}
          disabled={isOwnIdea}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={isLiked ? theme.error : theme.text.secondary} 
          />
          <Text style={[styles.actionText, { color: theme.text.secondary }]}>
            {idea.likes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onRate}
          disabled={isOwnIdea}
        >
          <Ionicons 
            name="star" 
            size={22} 
            color={theme.accent[500]} 
          />
          <Text style={[styles.actionText, { color: theme.text.secondary }]}>
            {idea.media_notas ? idea.media_notas.toFixed(1) : '0.0'}
          </Text>
          <Text style={[styles.ratingCount, { color: theme.text.disabled }]}>
            ({idea.total_avaliacoes || 0})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  areaBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 12,
  },
});

export default IdeaCard;
