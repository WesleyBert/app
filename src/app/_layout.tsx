import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { ToastHost } from '@/components/toast-host';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { registrarParaNotificacoes } from '@/services/notificacoes';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { carregando, usuario } = useAuth();

  useEffect(() => {
    if (!carregando) SplashScreen.hideAsync();
  }, [carregando]);

  useEffect(() => {
    if (usuario) {
      registrarParaNotificacoes(usuario.uid).catch((erro) =>
        console.warn('Falha ao registrar notificações', erro),
      );
    }
  }, [usuario]);

  if (carregando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cliente" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
        <ToastHost />
      </AuthProvider>
    </ThemeProvider>
  );
}
