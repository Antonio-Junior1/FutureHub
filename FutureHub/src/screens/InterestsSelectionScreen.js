import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lightTheme, darkTheme } from '../theme';
import { AREAS } from '../data/areas';
import InterestChip from '../components/InterestChip';
import { updateUserProfile } from '../services/firestoreService';
import { useUser } from '../contexts/UserContext';
import { validateInterests } from '../utils/validators';

const InterestsSelectionScreen = ({ navigation }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { user, refreshUserProfile } = useUser();

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, interestId]);
      } else {
        Alert.alert('Limite atingido', 'Você pode selecionar no máximo 3 áreas de interesse.');
      }
    }
  };

  const handleContinue = async () => {
    if (!validateInterests(selectedInterests)) {
      Alert.alert('Atenção', 'Selecione pelo menos 1 área de interesse (máximo 3).');
      return;
    }

    setLoading(true);

    const result = await updateUserProfile(user.uid, {
      interesses: selectedInterests
    });

    setLoading(false);

    if (result.success) {
      await refreshUserProfile();
      Alert.alert('Sucesso', 'Interesses salvos com sucesso!');
      // A navegação será automática para a tela principal
    } else {
      Alert.alert('Erro', 'Erro ao salvar interesses. Tente novamente.');
    }
  };

  return (
    <LinearGradient
      colors={[theme.primary[900], theme.primary[700]]}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.inverse }]}>
            Escolha suas Áreas de Interesse
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Selecione de 1 a 3 áreas que você deseja explorar
          </Text>
          <View style={styles.counter}>
            <Text style={[styles.counterText, { color: theme.accent[500] }]}>
              {selectedInterests.length}/3 selecionadas
            </Text>
          </View>
        </View>

        <View style={styles.interestsContainer}>
          {AREAS.map((area) => (
            <InterestChip
              key={area.id}
              interest={area}
              selected={selectedInterests.includes(area.id)}
              onPress={() => toggleInterest(area.id)}
              theme={theme}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button, 
            { 
              backgroundColor: selectedInterests.length > 0 
                ? theme.secondary[500] 
                : theme.text.disabled 
            }
          ]}
          onPress={handleContinue}
          disabled={loading || selectedInterests.length === 0}
        >
          {loading ? (
            <ActivityIndicator color={theme.text.inverse} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
              Continuar
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  counter: {
    alignItems: 'center',
    marginTop: 10,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  interestsContainer: {
    marginBottom: 20,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InterestsSelectionScreen;
