import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { lightTheme, darkTheme } from '../theme';
import { useUser } from '../contexts/UserContext';
import { createIdea, markMissionAsCompleted, updateUserPoints } from '../services/firestoreService';
import { validateIdeaTitle, validateIdeaDescription } from '../utils/validators';

const IdeaSubmissionScreen = ({ route, navigation }) => {
  const { mission } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, userProfile, refreshUserProfile } = useUser();

  const handleSubmit = async () => {
    // Validações
    if (!validateIdeaTitle(title)) {
      Alert.alert('Erro', 'O título deve ter pelo menos 5 caracteres');
      return;
    }

    if (!validateIdeaDescription(description)) {
      Alert.alert('Erro', 'A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Criar ideia no Firestore
      const ideaData = {
        titulo: title.trim(),
        descricao: description.trim(),
        id_usuario: user.uid,
        nome_usuario: user.displayName,
        id_missao: mission.id,
        area: mission.area,
        likedBy: [],
      };

      const ideaResult = await createIdea(ideaData);

      if (!ideaResult.success) {
        throw new Error('Erro ao criar ideia');
      }

      // Marcar missão como concluída
      await markMissionAsCompleted(user.uid, mission.id);

      // Adicionar pontos ao usuário (+10 por publicar ideia)
      await updateUserPoints(user.uid, 10);

      // Atualizar perfil do usuário
      await refreshUserProfile();

      setLoading(false);

      Alert.alert(
        'Sucesso! 🎉',
        'Sua ideia foi publicada com sucesso! Você ganhou 10 pontos.',
        [
          {
            text: 'Ver no Mural',
            onPress: () => {
              navigation.navigate('IdeasWall', { area: mission.area });
            }
          },
          {
            text: 'Voltar para Missões',
            onPress: () => {
              navigation.navigate('Missions');
            }
          }
        ]
      );

    } catch (error) {
      setLoading(false);
      console.error('Erro ao submeter ideia:', error);
      Alert.alert('Erro', 'Erro ao publicar ideia. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.primary[900], theme.primary[700]]}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={28} color={theme.text.inverse} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text.inverse }]}>
              Responder Missão
            </Text>
          </View>

          {/* Missão */}
          <View style={[styles.missionCard, { backgroundColor: theme.surface }]}>
            <View style={styles.missionHeader}>
              <Ionicons name="flash" size={24} color={theme.secondary[500]} />
              <Text style={[styles.missionTitle, { color: theme.text.primary }]}>
                {mission.titulo}
              </Text>
            </View>
            <Text style={[styles.missionDescription, { color: theme.text.secondary }]}>
              {mission.descricao}
            </Text>
            <View style={styles.missionFooter}>
              <Ionicons name="heart" size={16} color={theme.accent[500]} />
              <Text style={[styles.missionMoral, { color: theme.text.secondary }]}>
                {mission.moral}
              </Text>
            </View>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text.inverse }]}>
              Título da sua ideia *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface,
                color: theme.text.primary 
              }]}
              placeholder="Ex: Assistente virtual para produtividade"
              placeholderTextColor={theme.text.secondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: theme.text.secondary }]}>
              {title.length}/100
            </Text>

            <Text style={[styles.label, { color: theme.text.inverse }]}>
              Descreva sua ideia *
            </Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.surface,
                color: theme.text.primary 
              }]}
              placeholder="Explique sua ideia de forma clara e criativa. Como ela resolve o desafio proposto?"
              placeholderTextColor={theme.text.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={8}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: theme.text.secondary }]}>
              {description.length}/500
            </Text>
          </View>

          {/* Botão de Submissão */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.secondary[500] }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Publicar Ideia</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View style={[styles.infoBox, { backgroundColor: theme.primary[800] }]}>
            <Ionicons name="trophy" size={20} color={theme.accent[500]} />
            <Text style={[styles.infoText, { color: theme.text.inverse }]}>
              Você ganhará 10 pontos ao publicar esta ideia!
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  missionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  missionDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  missionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missionMoral: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 5,
  },
  textArea: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 5,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 10,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
});

export default IdeaSubmissionScreen;
