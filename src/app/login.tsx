import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Spacing } from '@/constants/theme';
import { toast } from '@/lib/toast';

export default function Login() {
  const { firebaseUser, usuario, entrar, cadastrar, recuperarSenha } = useAuth();
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [recuperando, setRecuperando] = useState(false);

  if (firebaseUser && usuario) return <Redirect href="/" />;

  async function enviar() {
    setCarregando(true);
    try {
      if (modo === 'entrar') {
        await entrar(email.trim(), senha);
      } else {
        if (!nome.trim()) {
          toast.error('Informe seu nome.');
          return;
        }
        await cadastrar(nome.trim(), email.trim(), senha);
      }
    } catch {
      // A mensagem de erro já é exibida via toast pelo AuthContext.
    } finally {
      setCarregando(false);
    }
  }

  async function esqueciSenha() {
    if (!email.trim()) {
      toast.error('Informe seu e-mail para recuperar a senha.');
      return;
    }
    setRecuperando(true);
    try {
      await recuperarSenha(email.trim());
    } catch {
      // A mensagem de erro já é exibida via toast pelo AuthContext.
    } finally {
      setRecuperando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.emoji}>
            🥖
          </ThemedText>
          <ThemedText type="title">Padaria</ThemedText>
          <ThemedText themeColor="textSecondary">
            {modo === 'entrar' ? 'Entre para ver o que saiu do forno' : 'Crie sua conta de cliente'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {modo === 'cadastrar' && (
            <TextField label="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" />
          )}
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

          {modo === 'entrar' && (
            <Pressable onPress={esqueciSenha} disabled={recuperando} style={styles.esqueciSenha}>
              <ThemedText type="small" themeColor="primary">
                Esqueci minha senha
              </ThemedText>
            </Pressable>
          )}

          <Button
            title={modo === 'entrar' ? 'Entrar' : 'Cadastrar'}
            onPress={enviar}
            loading={carregando}
          />
          <Button
            title={modo === 'entrar' ? 'Criar uma conta nova' : 'Já tenho conta'}
            variant="secondary"
            onPress={() => setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')}
          />
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" style={styles.aviso}>
          Contas de administrador da padaria são promovidas manualmente no console do Firebase — o
          cadastro aqui sempre cria uma conta de cliente.
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, padding: Spacing.four, justifyContent: 'center', gap: Spacing.five },
  header: { alignItems: 'center', gap: Spacing.two },
  emoji: { fontSize: 56 },
  form: { gap: Spacing.three },
  esqueciSenha: { alignSelf: 'flex-end' },
  aviso: { textAlign: 'center' },
});
