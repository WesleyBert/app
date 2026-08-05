import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { db, functions } from '@/lib/firebase';
import type { MensagemChat } from '@/types/models';

function mensagensRef(uid: string) {
  return collection(db, 'usuarios', uid, 'mensagens');
}

export function ouvirMensagens(uid: string, callback: (mensagens: MensagemChat[]) => void) {
  const q = query(mensagensRef(uid), orderBy('criadoEm', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MensagemChat, 'id'>) })));
  });
}

const chamarAiChat = httpsCallable<{ mensagem: string }, { resposta: string }>(functions, 'aiChat');

// Grava a mensagem do cliente e pede pra Cloud Function `aiChat` gerar (e salvar) a resposta da IA.
export async function enviarMensagem(uid: string, texto: string) {
  await addDoc(mensagensRef(uid), {
    autor: 'cliente',
    texto,
    criadoEm: Date.now(),
  });
  await chamarAiChat({ mensagem: texto });
}
