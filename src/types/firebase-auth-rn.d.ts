// @firebase/auth aponta um "types" genérico antes da condição "react-native" no seu
// package.json, então o TypeScript nunca enxerga os tipos do build React Native (mesmo
// o Metro carregando o JS certo em tempo de execução). Este arquivo só complementa a
// tipagem que falta; não afeta o código que realmente roda.
import type { Persistence } from '@firebase/auth';

declare module '@firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
