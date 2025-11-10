// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fast-food-delivery-47981.firebaseapp.com",
  projectId: "fast-food-delivery-47981",
  storageBucket: "fast-food-delivery-47981.firebasestorage.app",
  messagingSenderId: "74917371088",
  appId: "1:74917371088:web:8f32080d1f54cb575cd2d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };