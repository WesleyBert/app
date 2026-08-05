import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ouvirReservasDoCliente } from '@/services/reservas';
import type { Reserva, StatusReserva } from '@/types/models';

const rotuloStatus: Record<StatusReserva, string> = {
  pendente: '⏳ Pendente',
  confirmada: '✅ Confirmada',
  pronta: '🥖 Pronta para retirar',
  concluida: '📦 Concluída',
  cancelada: '❌ Cancelada',
};

export default function MeusPedidos() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    if (!usuario) return;
    return ouvirReservasDoCliente(usuario.uid, setReservas);
  }, [usuario]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.vazio}>
            Você ainda não tem reservas. Vá em &ldquo;Agendar&rdquo; para reservar um produto.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{item.produtoNome}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {item.quantidade}x · retirada em{' '}
              {new Date(item.horarioRetirada).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>
            <ThemedText>{rotuloStatus[item.status]}</ThemedText>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  lista: { padding: Spacing.three, gap: Spacing.three, flexGrow: 1 },
  vazio: { textAlign: 'center', paddingTop: Spacing.six, paddingHorizontal: Spacing.four },
  card: { borderRadius: 16, padding: 16, gap: 4 },
});
