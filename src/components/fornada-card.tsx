import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { Fornada } from '@/types/models';

function formatarHora(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function FornadaCard({
  fornada,
  favoritado,
  onAlternarFavorito,
  onReservar,
}: {
  fornada: Fornada;
  favoritado: boolean;
  onAlternarFavorito: () => void;
  onReservar: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.linha}>
        <ThemedText type="subtitle" style={styles.nome}>
          {fornada.produtoNome}
        </ThemedText>
        <Pressable onPress={onAlternarFavorito} hitSlop={10}>
          <ThemedText style={{ fontSize: 24 }}>{favoritado ? '❤️' : '🤍'}</ThemedText>
        </Pressable>
      </View>
      <ThemedText themeColor="textSecondary">
        Saiu do forno às {formatarHora(fornada.prontoEm)} · {fornada.quantidadeDisponivel} disponíveis
      </ThemedText>
      <Pressable
        onPress={onReservar}
        style={({ pressed }) => [styles.botao, { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }]}>
        <ThemedText style={{ color: '#fff' }} type="smallBold">
          Reservar agora
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, gap: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nome: { fontSize: 22 },
  botao: { marginTop: 4, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
});
