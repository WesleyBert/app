import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { enviarMensagem, ouvirMensagens } from '@/services/chat';
import type { MensagemChat } from '@/types/models';

export default function ChatIA() {
  const { usuario } = useAuth();
  const theme = useTheme();
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const listaRef = useRef<FlatList<MensagemChat>>(null);

  useEffect(() => {
    if (!usuario) return;
    return ouvirMensagens(usuario.uid, setMensagens);
  }, [usuario]);

  useEffect(() => {
    if (mensagens.length) setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 50);
  }, [mensagens.length]);

  if (!usuario) return null;

  async function enviar() {
    const conteudo = texto.trim();
    if (!conteudo || enviando) return;
    setTexto('');
    setEnviando(true);
    try {
      await enviarMensagem(usuario!.uid, conteudo);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <FlatList
          ref={listaRef}
          data={mensagens}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary" style={styles.vazio}>
              Pergunte sobre horários, produtos, ou peça para reservar algo — ex: &ldquo;quero reservar
              5 pães doces para amanhã de manhã&rdquo;.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bolha,
                item.autor === 'cliente'
                  ? { alignSelf: 'flex-end', backgroundColor: theme.primary }
                  : { alignSelf: 'flex-start', backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText style={item.autor === 'cliente' ? { color: '#fff' } : undefined}>
                {item.texto}
              </ThemedText>
            </View>
          )}
        />
        <View style={styles.entrada}>
          <View style={{ flex: 1 }}>
            <TextField
              label=""
              value={texto}
              onChangeText={setTexto}
              placeholder="Escreva sua dúvida..."
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
          </View>
          <Pressable
            onPress={enviar}
            disabled={enviando}
            style={[styles.enviarBotao, { backgroundColor: theme.primary, opacity: enviando ? 0.6 : 1 }]}>
            <ThemedText style={{ color: '#fff' }}>➤</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  lista: { padding: Spacing.three, gap: Spacing.two, flexGrow: 1 },
  vazio: { textAlign: 'center', paddingTop: Spacing.six, paddingHorizontal: Spacing.four },
  bolha: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  entrada: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  enviarBotao: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
