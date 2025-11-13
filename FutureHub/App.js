import React, { useState, useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Appearance, useColorScheme, ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Contexts
import { UserProvider, useUser } from './src/contexts/UserContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import InterestsSelectionScreen from './src/screens/InterestsSelectionScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import IdeaSubmissionScreen from './src/screens/IdeaSubmissionScreen';
import IdeasWallScreen from './src/screens/IdeasWallScreen';
import RankingScreen from './src/screens/RankingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Theme
import { lightTheme, darkTheme } from './src/theme';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

// Stack de Autenticação (Login/Register)
function AuthNavigator({ currentTheme }) {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: currentTheme.background }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Tabs Principais (após autenticação)
function MainTabs({ currentTheme }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Missions') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'IdeasWall') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Ranking') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentTheme.secondary[500],
        tabBarInactiveTintColor: currentTheme.text.secondary,
        tabBarStyle: {
          backgroundColor: currentTheme.primary[900],
          borderTopColor: currentTheme.primary[700],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: currentTheme.primary[900],
        },
        headerTitleStyle: {
          color: currentTheme.text.inverse,
          fontWeight: 'bold',
        },
        headerTintColor: currentTheme.secondary[500],
      })}
    >
      <Tab.Screen 
        name="Missions" 
        component={MissionsScreen}
        options={{ 
          title: 'Missões',
          tabBarLabel: 'Missões'
        }}
      />
      <Tab.Screen 
        name="IdeasWall" 
        component={IdeasWallScreen}
        options={{ 
          title: 'Mural de Ideias',
          tabBarLabel: 'Mural'
        }}
      />
      <Tab.Screen 
        name="Ranking" 
        component={RankingScreen}
        options={{ 
          title: 'Ranking',
          tabBarLabel: 'Ranking'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Perfil',
          tabBarLabel: 'Perfil'
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Principal (inclui tabs + telas modais)
function MainNavigator({ currentTheme }) {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs">
        {() => <MainTabs currentTheme={currentTheme} />}
      </MainStack.Screen>
      <MainStack.Screen 
        name="InterestsSelection" 
        component={InterestsSelectionScreen}
        options={{
          headerShown: true,
          title: 'Áreas de Interesse',
          headerStyle: {
            backgroundColor: currentTheme.primary[900],
          },
          headerTitleStyle: {
            color: currentTheme.text.inverse,
          },
          headerTintColor: currentTheme.secondary[500],
        }}
      />
      <MainStack.Screen 
        name="IdeaSubmission" 
        component={IdeaSubmissionScreen}
      />
    </MainStack.Navigator>
  );
}

// Componente principal de navegação
function AppNavigator() {
  const scheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState(scheme === 'dark' ? darkTheme : lightTheme);
  const { user, userProfile, loading } = useUser();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });
    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTheme.background }}>
        <ActivityIndicator size="large" color={currentTheme.secondary[500]} />
      </View>
    );
  }

  const navigationTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  navigationTheme.colors.background = currentTheme.background;
  navigationTheme.colors.card = currentTheme.primary[900];
  navigationTheme.colors.text = currentTheme.text.primary;
  navigationTheme.colors.primary = currentTheme.secondary[500];

  // Se não está autenticado, mostrar telas de login/registro
  if (!user) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <AuthNavigator currentTheme={currentTheme} />
      </NavigationContainer>
    );
  }

  // Se está autenticado mas não tem interesses selecionados, mostrar tela de seleção
  if (!userProfile?.interesses || userProfile.interesses.length === 0) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <InterestsSelectionScreen />
      </NavigationContainer>
    );
  }

  // Se está autenticado e tem interesses, mostrar app principal
  return (
    <NavigationContainer theme={navigationTheme}>
      <MainNavigator currentTheme={currentTheme} />
    </NavigationContainer>
  );
}

// App principal com Provider
export default function App() {
  const scheme = useColorScheme();
  
  return (
    <UserProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </UserProvider>
  );
}
