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
import type { Reserva, StatusReserva } from '@/types/models';

const reservasRef = collection(db, 'reservas');

export async function criarReserva(dados: {
  clienteId: string;
  clienteNome: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  horarioRetirada: number;
}) {
  const ref = await addDoc(reservasRef, {
    ...dados,
    status: 'pendente' as StatusReserva,
    criadoEm: Date.now(),
    lembreteEnviado: false,
  });
  return ref.id;
}

export function ouvirReservasDoCliente(clienteId: string, callback: (reservas: Reserva[]) => void) {
  const q = query(reservasRef, where('clienteId', '==', clienteId), orderBy('horarioRetirada', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Reserva, 'id'>) })));
  });
}

// Usado pelo admin: reservas de hoje em diante, ainda não concluídas/canceladas.
export function ouvirReservasAtivas(callback: (reservas: Reserva[]) => void) {
  const q = query(
    reservasRef,
    where('status', 'in', ['pendente', 'confirmada', 'pronta']),
    orderBy('horarioRetirada', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Reserva, 'id'>) })));
  });
}

export async function atualizarStatusReserva(id: string, status: StatusReserva) {
  await updateDoc(doc(db, 'reservas', id), { status });
}
