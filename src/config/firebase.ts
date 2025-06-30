import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators if in development mode
if (import.meta.env.DEV) {
  try {
    // Only connect to emulators if they haven't been connected already
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    
    // Check if Firestore emulator is already connected
    if (!(db as any)._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    console.log('Emulators not available, using production Firebase');
  }
}

export default app;