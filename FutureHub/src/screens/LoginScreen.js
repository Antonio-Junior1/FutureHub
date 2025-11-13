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
import { loginUser, getErrorMessage } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/validators';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const handleLogin = async () => {
    // Validações
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
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

    setLoading(true);
    
    const result = await loginUser(email, password);
    
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } else {
      const errorMessage = getErrorMessage(result.error.code);
      Alert.alert('Erro no Login', errorMessage);
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
          {/* Logo/Título */}
          <View style={styles.header}>
            <Ionicons name="bulb" size={80} color={theme.accent[500]} />
            <Text style={[styles.title, { color: theme.text.inverse }]}>
              FutureHub
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Conecte-se ao futuro do trabalho
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
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
                placeholder="Senha"
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

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.secondary[500] }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              style={styles.linkContainer}
            >
              <Text style={[styles.linkText, { color: theme.text.inverse }]}>
                Não tem uma conta?{' '}
                <Text style={{ color: theme.accent[500], fontWeight: 'bold' }}>
                  Cadastre-se
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
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
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

export default LoginScreen;
