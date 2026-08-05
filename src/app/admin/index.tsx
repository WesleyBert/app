import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ouvirFornadasDisponiveis, marcarFornadaEsgotada, publicarFornada } from '@/services/fornadas';
import { ouvirProdutosAtivos } from '@/services/produtos';
import type { Fornada, Produto } from '@/types/models';

export default function ProntoAgora() {
  const theme = useTheme();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornadas, setFornadas] = useState<Fornada[]>([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(10);
  const [publicando, setPublicando] = useState(false);

  useEffect(() => ouvirProdutosAtivos(setProdutos), []);
  useEffect(() => ouvirFornadasDisponiveis(setFornadas), []);

  async function publicar() {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) {
      Alert.alert('Escolha um produto', 'Selecione o que acabou de ficar pronto.');
      return;
    }
    setPublicando(true);
    try {
      await publicarFornada({ produtoId: produto.id, produtoNome: produto.nome, quantidade });
      Alert.alert('Publicado! 📣', `Os clientes interessados em ${produto.nome} já foram notificados.`);
      setProdutoId('');
      setQuantidade(10);
    } finally {
      setPublicando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.form}>
        <ThemedText type="smallBold">O que acabou de sair do forno?</ThemedText>
        <View style={styles.chips}>
          {produtos.map((produto) => {
            const selecionado = produto.id === produtoId;
            return (
              <Pressable
                key={produto.id}
                onPress={() => setProdutoId(produto.id)}
                style={[
                  styles.chip,
                  { backgroundColor: selecionado ? theme.primary : theme.backgroundElement },
                ]}>
                <ThemedText style={{ color: selecionado ? '#fff' : theme.text }}>{produto.nome}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="smallBold">Quantidade</ThemedText>
        <View style={styles.stepper}>
          <Pressable
            style={[styles.stepperBotao, { backgroundColor: theme.backgroundElement }]}
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}>
            <ThemedText type="title" style={{ fontSize: 20 }}>
              −
            </ThemedText>
          </Pressable>
          <ThemedText type="title" style={{ fontSize: 20, minWidth: 40, textAlign: 'center' }}>
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

        <Button title="🔔 Publicar e notificar clientes" onPress={publicar} loading={publicando} />
      </View>

      <FlatList
        data={fornadas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={<ThemedText type="smallBold">Disponíveis agora</ThemedText>}
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold">{item.produtoNome}</ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                {item.quantidadeDisponivel} disponíveis
              </ThemedText>
            </View>
            <Pressable onPress={() => marcarFornadaEsgotada(item.id)}>
              <ThemedText themeColor="danger" type="smallBold">
                Esgotar
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  form: { padding: Spacing.three, gap: Spacing.three },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  stepperBotao: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: Spacing.three, gap: Spacing.two },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, gap: 12 },
});
