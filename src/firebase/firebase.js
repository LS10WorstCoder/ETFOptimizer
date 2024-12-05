import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzodsGKARgOM3z7jcwQVu2bYoAE-RtO3k",
  authDomain: "etf-optimizer-3de60.firebaseapp.com",
  projectId: "etf-optimizer-3de60",
  storageBucket: "etf-optimizer-3de60.appspot.com",
  messagingSenderId: "919583751368",
  appId: "1:919583751368:web:f925adfb3032da3a68f9fd",
  measurementId: "G-CWC1DH4M3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
    .then((result) => result.user)
    .catch((error) => console.error('Error with Google sign-in:', error));
};

export { db };