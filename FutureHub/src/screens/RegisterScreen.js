import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';
import { registerUser, getErrorMessage } from '../services/authService';
import { createUserProfile } from '../services/firestoreService';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const handleRegister = async () => {
    // Validações
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validateName(name)) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'E-mail inválido');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    
    // Registrar usuário no Firebase Auth
    const result = await registerUser(email, password, name);
    
    if (result.success) {
      // Criar perfil no Firestore
      const profileResult = await createUserProfile(result.user.uid, {
        nome: name,
        email: email,
        interesses: [], // Será preenchido na próxima tela
      });

      setLoading(false);

      if (profileResult.success) {
        Alert.alert(
          'Sucesso', 
          'Cadastro realizado com sucesso! Agora selecione suas áreas de interesse.',
          [
            {
              text: 'OK',
              onPress: () => {
                // A navegação será automática através do onAuthStateChanged
                // que redirecionará para InterestsSelectionScreen
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Erro ao criar perfil. Tente novamente.');
      }
    } else {
      setLoading(false);
      const errorMessage = getErrorMessage(result.error.code);
      Alert.alert('Erro no Cadastro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.primary[900], theme.primary[700], theme.primary[500]]}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
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
            <Text style={[styles.title, { color: theme.text.inverse }]}>
              Criar Conta
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Junte-se à comunidade FutureHub
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
              <Ionicons name="person-outline" size={24} color={theme.text.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                placeholder="Nome completo"
                placeholderTextColor={theme.text.secondary}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
              <Ionicons name="mail-outline" size={24} color={theme.text.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                placeholder="E-mail"
                placeholderTextColor={theme.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.text.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                placeholder="Senha (mínimo 6 caracteres)"
                placeholderTextColor={theme.text.secondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={theme.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.text.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                placeholder="Confirmar senha"
                placeholderTextColor={theme.text.secondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={theme.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.secondary[500] }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
                  Cadastrar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.linkContainer}
            >
              <Text style={[styles.linkText, { color: theme.text.inverse }]}>
                Já tem uma conta?{' '}
                <Text style={{ color: theme.accent[500], fontWeight: 'bold' }}>
                  Faça login
                </Text>
              </Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
  },
});

export default RegisterScreen;
