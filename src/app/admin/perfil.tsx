import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function PerfilAdmin() {
  const { usuario, sair } = useAuth();
  if (!usuario) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ fontSize: 28 }}>
          {usuario.nome}
        </ThemedText>
        <ThemedText themeColor="textSecondary">{usuario.email}</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          Conta administradora da padaria
        </ThemedText>
        <Button title="Sair da conta" variant="secondary" onPress={sair} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.three, gap: Spacing.two },
});
