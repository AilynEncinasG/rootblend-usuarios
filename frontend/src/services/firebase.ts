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
let anonymousAuthFailed = false;

function shouldUseFirebaseAuth() {
  const value = String(import.meta.env.VITE_FIREBASE_USE_AUTH || "false")
    .trim()
    .toLowerCase();

  return value === "true" || value === "1" || value === "yes";
}

/**
 * El chat de ROOT BLEND usa Realtime Database.
 *
 * Para la demo/local, las reglas de Firebase permiten escritura pública en
 * stream_chats y channel_moderators. Por eso NO obligamos a iniciar sesión
 * anónima, porque una API KEY incorrecta o Anonymous Auth desactivado rompe
 * el envío de mensajes.
 *
 * Si luego quieres activar seguridad con Anonymous Auth, agrega en frontend/.env:
 * VITE_FIREBASE_USE_AUTH=true
 * y usa una API KEY válida del mismo proyecto Firebase.
 */
export async function ensureFirebaseAuth() {
  if (!shouldUseFirebaseAuth()) {
    return;
  }

  if (anonymousAuthFailed) {
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
        anonymousAuthFailed = true;

        console.warn(
          "Firebase Auth anónimo falló. El chat continuará usando Realtime Database sin autenticación porque las reglas de demo permiten escritura pública.",
          error,
        );

        return undefined;
      });
  }

  await authPromise;
}
