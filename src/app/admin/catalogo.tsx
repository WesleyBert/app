import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { atualizarProduto, criarProduto, ouvirTodosProdutos } from '@/services/produtos';
import type { Produto } from '@/types/models';

export default function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => ouvirTodosProdutos(setProdutos), []);

  async function adicionar() {
    if (!nome.trim() || !categoria.trim()) {
      Alert.alert('Preencha nome e categoria.');
      return;
    }
    setSalvando(true);
    try {
      await criarProduto({
        nome: nome.trim(),
        categoria: categoria.trim(),
        preco: Number(preco.replace(',', '.')) || 0,
        ativo: true,
      });
      setNome('');
      setCategoria('');
      setPreco('');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.form}>
        <TextField label="Nome do produto" value={nome} onChangeText={setNome} placeholder="Pão francês" />
        <TextField label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Pães" />
        <TextField
          label="Preço (R$)"
          value={preco}
          onChangeText={setPreco}
          placeholder="0,80"
          keyboardType="decimal-pad"
        />
        <Button title="Adicionar ao catálogo" onPress={adicionar} loading={salvando} />
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold">{item.nome}</ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                {item.categoria} · R$ {item.preco.toFixed(2)}
              </ThemedText>
            </View>
            <Pressable onPress={() => atualizarProduto(item.id, { ativo: !item.ativo })}>
              <ThemedText themeColor={item.ativo ? 'danger' : 'primary'} type="smallBold">
                {item.ativo ? 'Desativar' : 'Ativar'}
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
  lista: { padding: Spacing.three, gap: Spacing.two },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, gap: 12 },
});
