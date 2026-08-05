import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { Produto } from '@/types/models';

const produtosRef = collection(db, 'produtos');

export function ouvirProdutosAtivos(callback: (produtos: Produto[]) => void) {
  const q = query(produtosRef, where('ativo', '==', true), orderBy('nome'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Produto, 'id'>) })));
  });
}

export function ouvirTodosProdutos(callback: (produtos: Produto[]) => void) {
  const q = query(produtosRef, orderBy('nome'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Produto, 'id'>) })));
  });
}

export async function criarProduto(dados: Omit<Produto, 'id' | 'criadoEm'>) {
  await addDoc(produtosRef, { ...dados, criadoEm: Date.now() });
}

export async function atualizarProduto(id: string, dados: Partial<Produto>) {
  await updateDoc(doc(db, 'produtos', id), dados);
}
