import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfigKey =
  | "apiKey"
  | "appId"
  | "authDomain"
  | "messagingSenderId"
  | "projectId";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
};

const firebaseConfigKeyToEnvMap: Record<FirebaseConfigKey, string> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
};

let firebaseApp: FirebaseApp | null = null;

export function getMissingFirebaseEnvironmentVariables() {
  return Object.entries(firebaseConfigKeyToEnvMap)
    .filter(([configKey]) => !firebaseConfig[configKey as FirebaseConfigKey])
    .map(([, environmentVariable]) => environmentVariable);
}

export function isFirebaseConfigured() {
  return getMissingFirebaseEnvironmentVariables().length === 0;
}

export function getFirestoreDatabase(): Firestore | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp =
      getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig as FirebaseOptions);
  }

  return getFirestore(firebaseApp);
}
