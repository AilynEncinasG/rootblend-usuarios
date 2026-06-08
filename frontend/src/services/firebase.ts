import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn(
    "Faltan variables de Firebase en frontend/.env:",
    missingKeys.join(", "),
  );
}

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const firebaseAuth = getAuth(app);

let authPromise: Promise<void> | null = null;
let anonymousAuthDisabled = false;

/**
 * Intenta autenticar con Firebase Anonymous Auth.
 *
 * IMPORTANTE:
 * Para la demo del proyecto, las reglas de Realtime Database permiten escritura pública.
 * Por eso, si Firebase Auth falla por API key inválida, Anonymous Auth desactivado
 * o configuración incompleta, NO bloqueamos el chat.
 *
 * Esto evita que el chat muera cuando Realtime Database sí está funcionando.
 */
export async function ensureFirebaseAuth() {
  if (anonymousAuthDisabled) {
    return;
  }

  if (firebaseAuth.currentUser) {
    return;
  }

  if (!authPromise) {
    authPromise = signInAnonymously(firebaseAuth)
      .then(() => undefined)
      .catch((error) => {
        authPromise = null;
        anonymousAuthDisabled = true;

        console.warn(
          "Firebase Auth anónimo falló. Se continuará usando Realtime Database sin autenticación porque las reglas permiten escritura pública para la demo.",
          error,
        );

        return undefined;
      });
  }

  await authPromise;
}