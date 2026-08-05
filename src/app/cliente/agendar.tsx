import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { ouvirProdutosAtivos } from '@/services/produtos';
import { criarReserva } from '@/services/reservas';
import type { Produto } from '@/types/models';

export default function AgendarProduto() {
  const { usuario } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ produtoId?: string; produtoNome?: string }>();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoId, setProdutoId] = useState(params.produtoId ?? '');
  const [quantidade, setQuantidade] = useState(1);
  const [horario, setHorario] = useState(() => new Date(Date.now() + 60 * 60 * 1000));
  const [etapaPicker, setEtapaPicker] = useState<'nenhuma' | 'data' | 'hora'>('nenhuma');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => ouvirProdutosAtivos(setProdutos), []);

  const produtoSelecionado = produtos.find((p) => p.id === produtoId);

  async function confirmar() {
    if (!usuario) return;
    if (!produtoSelecionado) {
      Alert.alert('Escolha um produto', 'Selecione qual produto você quer reservar.');
      return;
    }
    if (horario.getTime() <= Date.now()) {
      Alert.alert('Horário inválido', 'Escolha um horário de retirada no futuro.');
      return;
    }

    setEnviando(true);
    try {
      await criarReserva({
        clienteId: usuario.uid,
        clienteNome: usuario.nome,
        produtoId: produtoSelecionado.id,
        produtoNome: produtoSelecionado.nome,
        quantidade,
        horarioRetirada: horario.getTime(),
      });
      Alert.alert('Reserva feita! 🎉', 'Você pode acompanhar o status em "Meus pedidos".', [
        { text: 'Ok', onPress: () => router.push('/cliente/pedidos') },
      ]);
    } catch {
      Alert.alert('Não foi possível reservar', 'Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={{ fontSize: 28 }}>
          Agendar retirada
        </ThemedText>

        <ThemedView style={styles.secao}>
          <ThemedText type="smallBold">Produto</ThemedText>
          <View style={styles.chips}>
            {produtos.map((produto) => {
              const selecionado = produto.id === produtoId;
              return (
                <Pressable
                  key={produto.id}
                  onPress={() => setProdutoId(produto.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selecionado ? theme.primary : theme.backgroundElement,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}>
                  <ThemedText style={{ color: selecionado ? '#fff' : theme.text }}>{produto.nome}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ThemedView>

        <ThemedView style={styles.secao}>
          <ThemedText type="smallBold">Quantidade</ThemedText>
          <View style={styles.stepper}>
            <Pressable
              style={[styles.stepperBotao, { backgroundColor: theme.backgroundElement }]}
              onPress={() => setQuantidade((q) => Math.max(1, q - 1))}>
              <ThemedText type="title" style={{ fontSize: 20 }}>
                −
              </ThemedText>
            </Pressable>
            <ThemedText type="title" style={{ fontSize: 20, minWidth: 32, textAlign: 'center' }}>
              {quantidade}
            </ThemedText>
            <Pressable
              style={[styles.stepperBotao, { backgroundColor: theme.backgroundElement }]}
              onPress={() => setQuantidade((q) => q + 1)}>
              <ThemedText type="title" style={{ fontSize: 20 }}>
                +
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        <ThemedView style={styles.secao}>
          <ThemedText type="smallBold">Horário de retirada</ThemedText>
          <Pressable
            onPress={() => setEtapaPicker(Platform.OS === 'ios' ? 'hora' : 'data')}
            style={[styles.horarioBotao, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText>
              {horario.toLocaleDateString('pt-BR')} às{' '}
              {horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </ThemedText>
          </Pressable>
          {etapaPicker !== 'nenhuma' && (
            <DateTimePicker
              value={horario}
              mode={Platform.OS === 'ios' ? 'datetime' : etapaPicker === 'data' ? 'date' : 'time'}
              minimumDate={new Date()}
              onChange={(_evento, novaData) => {
                if (Platform.OS === 'ios') {
                  if (novaData) setHorario(novaData);
                  return;
                }
                // Android: primeiro escolhe a data, depois a hora.
                if (!novaData) {
                  setEtapaPicker('nenhuma');
                  return;
                }
                if (etapaPicker === 'data') {
                  setHorario(novaData);
                  setEtapaPicker('hora');
                } else {
                  setHorario(novaData);
                  setEtapaPicker('nenhuma');
                }
              }}
            />
          )}
        </ThemedView>

        <Button title="Confirmar reserva" onPress={confirmar} loading={enviando} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.three, gap: Spacing.four },
  secao: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  stepperBotao: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  horarioBotao: { padding: 14, borderRadius: 10 },
});
