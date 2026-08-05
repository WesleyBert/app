import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { Usuario } from '@/types/models';

export async function criarUsuario(uid: string, nome: string, email: string) {
  const usuario: Usuario = {
    uid,
    nome,
    email,
    papel: 'cliente', // promova para 'admin' direto no console do Firestore
    favoritos: [],
    notificarTudo: true,
    criadoEm: Date.now(),
  };
  await setDoc(doc(db, 'usuarios', uid), usuario);
  return usuario;
}

export async function buscarUsuario(uid: string): Promise<Usuario | null> {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() ? (snap.data() as Usuario) : null;
}

export async function salvarPushToken(uid: string, token: string) {
  await updateDoc(doc(db, 'usuarios', uid), { expoPushToken: token });
}

export async function alternarFavorito(uid: string, produtoId: string, favoritado: boolean) {
  await updateDoc(doc(db, 'usuarios', uid), {
    favoritos: favoritado ? arrayUnion(produtoId) : arrayRemove(produtoId),
  });
}

export async function definirNotificarTudo(uid: string, valor: boolean) {
  await updateDoc(doc(db, 'usuarios', uid), { notificarTudo: valor });
}
