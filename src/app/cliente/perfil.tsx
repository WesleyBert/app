import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { ouvirTodosProdutos } from '@/services/produtos';
import { definirNotificarTudo } from '@/services/usuarios';
import type { Produto } from '@/types/models';

export default function Perfil() {
  const { usuario, recarregarUsuario, sair } = useAuth();
  const theme = useTheme();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => ouvirTodosProdutos(setProdutos), []);

  if (!usuario) return null;

  const favoritos = produtos.filter((p) => usuario.favoritos.includes(p.id));

  async function alternarNotificarTudo(valor: boolean) {
    await definirNotificarTudo(usuario!.uid, valor);
    await recarregarUsuario();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.secao}>
          <ThemedText type="title" style={{ fontSize: 28 }}>
            {usuario.nome}
          </ThemedText>
          <ThemedText themeColor="textSecondary">{usuario.email}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.linhaCard}>
          <ThemedView type="backgroundElement" style={{ flex: 1 }}>
            <ThemedText type="smallBold">Avisar de tudo</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Receba notificação de qualquer produto novo, não só dos favoritos
            </ThemedText>
          </ThemedView>
          <Switch
            value={usuario.notificarTudo}
            onValueChange={alternarNotificarTudo}
            trackColor={{ true: theme.primary }}
          />
        </ThemedView>

        <ThemedView style={styles.secao}>
          <ThemedText type="smallBold">Seus favoritos</ThemedText>
          {favoritos.length === 0 ? (
            <ThemedText themeColor="textSecondary">
              Nenhum favorito ainda. Toque no ❤️ na tela inicial para escolher os produtos que
              quer ser avisado.
            </ThemedText>
          ) : (
            favoritos.map((p) => <ThemedText key={p.id}>• {p.nome}</ThemedText>)
          )}
        </ThemedView>

        <Button title="Sair da conta" variant="secondary" onPress={sair} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.three, gap: Spacing.four },
  secao: { gap: Spacing.two },
  linhaCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, borderRadius: 16, padding: 16 },
});
