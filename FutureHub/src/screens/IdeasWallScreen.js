import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import IdeaCard from '../components/IdeaCard';
import { 
  getAllIdeas, 
  getIdeasByArea, 
  likeIdea, 
  unlikeIdea, 
  rateIdea,
  updateUserPoints 
} from '../services/firestoreService';
import { AREAS } from '../data/areas';

const IdeasWallScreen = ({ route, navigation }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArea, setSelectedArea] = useState(route.params?.area || 'all');
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedIdeaForRating, setSelectedIdeaForRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, refreshUserProfile } = useUser();

  useEffect(() => {
    loadIdeas();
  }, [selectedArea]);

  const loadIdeas = async () => {
    try {
      let result;
      if (selectedArea === 'all') {
        result = await getAllIdeas(50);
      } else {
        result = await getIdeasByArea(selectedArea, 50);
      }

      if (result.success) {
        setIdeas(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar ideias:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadIdeas();
  };

  const handleLike = async (idea) => {
    if (idea.id_usuario === user.uid) {
      Alert.alert('Ops!', 'Você não pode curtir sua própria ideia.');
      return;
    }

    const isLiked = idea.likedBy?.includes(user.uid);

    try {
      if (isLiked) {
        await unlikeIdea(idea.id, user.uid);
      } else {
        await likeIdea(idea.id, user.uid);
        // Adicionar pontos ao autor da ideia (+5 por curtida)
        await updateUserPoints(idea.id_usuario, 5);
      }

      // Atualizar lista de ideias
      loadIdeas();
      
      if (!isLiked) {
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Erro ao curtir ideia:', error);
      Alert.alert('Erro', 'Erro ao curtir ideia. Tente novamente.');
    }
  };

  const handleRatePress = (idea) => {
    if (idea.id_usuario === user.uid) {
      Alert.alert('Ops!', 'Você não pode avaliar sua própria ideia.');
      return;
    }

    setSelectedIdeaForRating(idea);
    setSelectedRating(0);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      Alert.alert('Atenção', 'Selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    try {
      await rateIdea(selectedIdeaForRating.id, user.uid, selectedRating);
      
      // Adicionar pontos ao autor da ideia (baseado na nota)
      const points = selectedRating * 3; // 3 pontos por estrela
      await updateUserPoints(selectedIdeaForRating.id_usuario, points);

      setRatingModalVisible(false);
      Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      
      // Atualizar lista de ideias
      loadIdeas();
      await refreshUserProfile();
    } catch (error) {
      console.error('Erro ao avaliar ideia:', error);
      Alert.alert('Erro', 'Erro ao avaliar ideia. Tente novamente.');
    }
  };

  const renderAreaFilter = () => {
    const allAreas = [{ id: 'all', nome: 'Todas', icon: 'apps', color: theme.secondary[500] }, ...AREAS];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {allAreas.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedArea === area.id ? area.color : theme.surface,
                borderColor: area.color,
              }
            ]}
            onPress={() => setSelectedArea(area.id)}
          >
            <Ionicons 
              name={area.icon} 
              size={18} 
              color={selectedArea === area.id ? '#fff' : area.color} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: selectedArea === area.id ? '#fff' : theme.text.primary }
              ]}
            >
              {area.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderRatingModal = () => {
    return (
      <Modal
        visible={ratingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
              Avaliar Ideia
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: theme.text.secondary }]}>
              {selectedIdeaForRating?.titulo}
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedRating(star)}
                >
                  <Ionicons
                    name={star <= selectedRating ? "star" : "star-outline"}
                    size={48}
                    color={star <= selectedRating ? theme.accent[500] : theme.text.disabled}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.text.disabled }]}
                onPress={() => setRatingModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.secondary[500] }]}
                onPress={handleSubmitRating}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary[500]} />
        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
          Carregando ideias...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filtros de Área */}
      {renderAreaFilter()}

      {/* Lista de Ideias */}
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
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              theme={theme}
              currentUserId={user.uid}
              isLiked={idea.likedBy?.includes(user.uid)}
              onLike={() => handleLike(idea)}
              onRate={() => handleRatePress(idea)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color={theme.text.secondary} />
            <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
              Nenhuma ideia ainda
            </Text>
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              Seja o primeiro a compartilhar uma ideia nesta área!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Avaliação */}
      {renderRatingModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterScroll: {
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
    paddingBottom: 40,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IdeasWallScreen;
