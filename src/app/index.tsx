import { Redirect } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function Entrada() {
  const { firebaseUser, usuario } = useAuth();

  if (!firebaseUser || !usuario) return <Redirect href="/login" />;
  if (usuario.papel === 'admin') return <Redirect href="/admin" />;
  return <Redirect href="/cliente" />;
}
