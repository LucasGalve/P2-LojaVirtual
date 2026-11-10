import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors, theme } from './src/theme';

function Conteudo() {
  const { iniciando } = useAuth();
  if (iniciando) return <View style={{flex:1,justifyContent:'center',backgroundColor:colors.background}}>
    <ActivityIndicator size="large" />
  </View>;
  return <NavigationContainer><RootNavigator /></NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider>
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Conteudo />
        </ToastProvider>
      </AuthProvider>
    </PaperProvider>
  </SafeAreaProvider>;
}
