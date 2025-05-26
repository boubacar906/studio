
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// import { getFirestore, Firestore } from 'firebase/firestore'; // Example if you need Firestore
// import { getStorage, FirebaseStorage } from 'firebase/storage'; // Example if you need Storage

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log a warning if the API key appears to be a placeholder
if (firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.apiKey) {
  console.warn(
    `%cWARNING: Firebase API Key is not configured or is still a placeholder!`,
    "color: orange; font-weight: bold; font-size: 14px;"
  );
  console.warn(
    `%cPlease ensure you have set NEXT_PUBLIC_FIREBASE_API_KEY in your .env file with a valid key from your Firebase project.`,
    "color: orange; font-size: 12px;"
  );
}


let app: FirebaseApp;
let auth: Auth;
// let firestore: Firestore; // Example
// let storage: FirebaseStorage; // Example

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
// firestore = getFirestore(app); // Example
// storage = getStorage(app); // Example

export { app, auth /*, firestore, storage */ };
