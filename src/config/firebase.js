
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA-LdV5vMWbzREqHTsGU-Y8zUNk6zpO8aQ",
  authDomain: "chabit-3bac0.firebaseapp.com",
  projectId: "chabit-3bac0",
  storageBucket: "chabit-3bac0.firebasestorage.app",
  messagingSenderId: "163275204694",
  appId: "1:163275204694:web:e2e2e40faf1a78b08af3f7",
  measurementId: "G-SELMBDRPY7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;