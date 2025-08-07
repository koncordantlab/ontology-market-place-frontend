import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLuCKPyzACSmpdMtxyy_5NP_iokPzUtXw",
  authDomain: "ontology-marketplace-efv1v3.firebaseapp.com",
  projectId: "ontology-marketplace-efv1v3",
  storageBucket: "ontology-marketplace-efv1v3.firebasestorage.app",
  messagingSenderId: "280410777728",
  appId: "1:280410777728:web:a0b11dced070904fff5e65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators if in development mode

export default app;