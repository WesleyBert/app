import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
// A persistência em AsyncStorage só existe no build React Native do SDK, que fica atrás
// da condição "react-native" do pacote @firebase/auth — por isso importamos dele
// diretamente em vez do wrapper "firebase/auth" (que não expõe essa condição).
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Preencha com as chaves do SEU projeto Firebase (Configurações do projeto > Geral > Seus apps > Config).
// Veja o README para o passo a passo de como criar o projeto gratuito.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === 'web') {
  // No build web, o pacote não carrega a condição "react-native" — a persistência
  // padrão do navegador (getAuth) já resolve isso sozinha.
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth só pode ser chamado uma vez; no fast refresh do Expo o módulo
    // pode reexecutar, então na segunda vez só recuperamos a instância já criada.
    auth = getAuth(app);
  }
}

export const db = getFirestore(app);
export const functions = getFunctions(app);
export { app, auth };
