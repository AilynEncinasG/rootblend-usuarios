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

export async function ensureFirebaseAuth() {
  if (firebaseAuth.currentUser) {
    return;
  }

  if (!authPromise) {
    authPromise = signInAnonymously(firebaseAuth)
      .then(() => undefined)
      .catch((error) => {
        authPromise = null;
        throw error;
      });
  }

  await authPromise;
}
