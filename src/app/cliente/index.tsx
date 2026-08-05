import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FornadaCard } from '@/components/fornada-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ouvirFornadasDisponiveis } from '@/services/fornadas';
import { alternarFavorito } from '@/services/usuarios';
import type { Fornada } from '@/types/models';

export default function InicioCliente() {
  const { usuario, recarregarUsuario } = useAuth();
  const [fornadas, setFornadas] = useState<Fornada[]>([]);
  const router = useRouter();

  useEffect(() => ouvirFornadasDisponiveis(setFornadas), []);

  if (!usuario) return null;

  async function favoritar(produtoId: string) {
    const jaFavoritado = usuario!.favoritos.includes(produtoId);
    await alternarFavorito(usuario!.uid, produtoId, !jaFavoritado);
    await recarregarUsuario();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={fornadas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <ThemedView style={styles.vazio}>
            <ThemedText type="title" style={{ fontSize: 40 }}>
              🥐
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
              Nada saiu do forno ainda. Assim que a padaria publicar, você vê aqui — e recebe uma
              notificação se for um dos seus favoritos.
            </ThemedText>
          </ThemedView>
        }
        renderItem={({ item }) => (
          <FornadaCard
            fornada={item}
            favoritado={usuario.favoritos.includes(item.produtoId)}
            onAlternarFavorito={() => favoritar(item.produtoId)}
            onReservar={() =>
              router.push({ pathname: '/cliente/agendar', params: { produtoId: item.produtoId, produtoNome: item.produtoNome } })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  lista: { padding: Spacing.three, gap: Spacing.three, flexGrow: 1 },
  vazio: { alignItems: 'center', gap: Spacing.three, paddingTop: Spacing.six, paddingHorizontal: Spacing.four },
});
