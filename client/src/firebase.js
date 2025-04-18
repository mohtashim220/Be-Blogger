// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-10a41.firebaseapp.com",
  projectId: "real-estate-10a41",
  storageBucket: "real-estate-10a41.appspot.com",
  messagingSenderId: "474089008752",
  appId: "1:474089008752:web:0b3c8b1fff0244fa2b4eb5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
