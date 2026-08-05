import { Tabs } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

export default function ClienteLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text },
        tabBarActiveTintColor: theme.primary,
        tabBarStyle: { backgroundColor: theme.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="agendar" options={{ title: 'Agendar' }} />
      <Tabs.Screen name="pedidos" options={{ title: 'Meus pedidos' }} />
      <Tabs.Screen name="chat" options={{ title: 'Assistente' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
