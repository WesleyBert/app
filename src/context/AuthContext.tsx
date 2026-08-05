import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from '@/lib/firebase';
import { toast } from '@/lib/toast';
import { buscarUsuario, criarUsuario } from '@/services/usuarios';
import type { Usuario } from '@/types/models';
import { mensagemDeErro } from '@/utils/mensagem-erro';

interface AuthContextValue {
  firebaseUser: User | null;
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  recuperarSenha: (email: string) => Promise<void>;
  sair: () => Promise<void>;
  recarregarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const doc = await buscarUsuario(user.uid);
        setUsuario(doc);
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  async function entrar(email: string, senha: string) {
    toast.info('Entrando...');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      toast.success('Login realizado com sucesso!');
    } catch (erro) {
      toast.error(mensagemDeErro(erro));
      throw erro;
    }
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    toast.info('Criando sua conta...');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);

      toast.info('Conta criada! Configurando seu perfil...');
      const novoUsuario = await criarUsuario(cred.user.uid, nome, email);
      setUsuario(novoUsuario);
      toast.success('Tudo pronto! Bem-vindo(a).');
    } catch (erro) {
      toast.error(mensagemDeErro(erro));
      throw erro;
    }
  }

  async function recuperarSenha(email: string) {
    toast.info('Enviando e-mail de recuperação...');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Enviamos um link de recuperação para o seu e-mail.');
    } catch (erro) {
      toast.error(mensagemDeErro(erro));
      throw erro;
    }
  }

  async function sair() {
    await signOut(auth);
  }

  async function recarregarUsuario() {
    if (firebaseUser) {
      setUsuario(await buscarUsuario(firebaseUser.uid));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        usuario,
        carregando,
        entrar,
        cadastrar,
        recuperarSenha,
        sair,
        recarregarUsuario,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
