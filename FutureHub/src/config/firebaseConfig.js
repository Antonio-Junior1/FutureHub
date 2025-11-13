import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration - FutureHub Challenge
const firebaseConfig = {
  apiKey: "AIzaSyBFQ9P-3BzAJHSKp6A2XiuPgRf72RcaS40",
  authDomain: "futurehub-4682b.firebaseapp.com",
  projectId: "futurehub-4682b",
  storageBucket: "futurehub-4682b.firebasestorage.app",
  messagingSenderId: "16557912065",
  appId: "1:16557912065:web:50bb439990241a7b619000",
  measurementId: "G-GVRYX28218"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
