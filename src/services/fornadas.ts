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
import type { Fornada } from '@/types/models';

const fornadasRef = collection(db, 'fornadas');

// Fornadas disponíveis nas últimas horas — a Cloud Function `onFornadaCreated`
// é quem dispara a notificação assim que este documento é criado.
export function ouvirFornadasDisponiveis(callback: (fornadas: Fornada[]) => void) {
  const q = query(fornadasRef, where('status', '==', 'disponivel'), orderBy('prontoEm', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Fornada, 'id'>) })));
  });
}

export async function publicarFornada(dados: {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
}) {
  await addDoc(fornadasRef, {
    produtoId: dados.produtoId,
    produtoNome: dados.produtoNome,
    quantidade: dados.quantidade,
    quantidadeDisponivel: dados.quantidade,
    status: 'disponivel',
    prontoEm: Date.now(),
  });
}

export async function marcarFornadaEsgotada(id: string) {
  await updateDoc(doc(db, 'fornadas', id), { status: 'esgotado', quantidadeDisponivel: 0 });
}
