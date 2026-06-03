import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/*
|--------------------------------------------------------------------------
| Validate Required Env Variables
|--------------------------------------------------------------------------
*/

const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

requiredEnv.forEach((envName) => {
  if (!process.env[envName]) {
    console.warn(`⚠ Missing Firebase ENV: ${envName}`);
  }
});

/*
|--------------------------------------------------------------------------
| Initialize Firebase Once
|--------------------------------------------------------------------------
*/

export const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/

export const db = getDatabase(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export default app;