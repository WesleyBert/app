import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { atualizarStatusReserva, ouvirReservasAtivas } from '@/services/reservas';
import type { Reserva, StatusReserva } from '@/types/models';

const proximoStatus: Partial<Record<StatusReserva, StatusReserva>> = {
  pendente: 'confirmada',
  confirmada: 'pronta',
  pronta: 'concluida',
};

const rotuloProximo: Partial<Record<StatusReserva, string>> = {
  pendente: 'Confirmar',
  confirmada: 'Marcar pronta',
  pronta: 'Marcar entregue',
};

export default function ReservasDoDia() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => ouvirReservasAtivas(setReservas), []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.vazio}>
            Nenhuma reserva ativa no momento.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText type="smallBold">
                {item.clienteNome} · {item.produtoNome}
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                {item.quantidade}x · retirada em{' '}
                {new Date(item.horarioRetirada).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            </View>
            <View style={styles.acoes}>
              {proximoStatus[item.status] && (
                <Pressable onPress={() => atualizarStatusReserva(item.id, proximoStatus[item.status]!)}>
                  <ThemedText themeColor="primary" type="smallBold">
                    {rotuloProximo[item.status]}
                  </ThemedText>
                </Pressable>
              )}
              <Pressable onPress={() => atualizarStatusReserva(item.id, 'cancelada')}>
                <ThemedText themeColor="danger" type="small">
                  Cancelar
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  lista: { padding: Spacing.three, gap: Spacing.two, flexGrow: 1 },
  vazio: { textAlign: 'center', paddingTop: Spacing.six },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, gap: 12 },
  acoes: { alignItems: 'flex-end', gap: 6 },
});
