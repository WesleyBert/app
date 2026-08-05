export type Papel = 'cliente' | 'admin';

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  papel: Papel;
  favoritos: string[]; // ids de produtos
  notificarTudo: boolean; // avisar de qualquer produto novo, não só favoritos
  expoPushToken?: string;
  criadoEm: number;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  criadoEm: number;
}

export type StatusFornada = 'disponivel' | 'esgotado';

export interface Fornada {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  quantidadeDisponivel: number;
  status: StatusFornada;
  prontoEm: number; // timestamp
}

export type StatusReserva =
  | 'pendente'
  | 'confirmada'
  | 'pronta'
  | 'concluida'
  | 'cancelada';

export interface Reserva {
  id: string;
  clienteId: string;
  clienteNome: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  horarioRetirada: number; // timestamp
  status: StatusReserva;
  criadoEm: number;
  lembreteEnviado?: boolean;
}

export interface MensagemChat {
  id: string;
  autor: 'cliente' | 'ia';
  texto: string;
  criadoEm: number;
}
