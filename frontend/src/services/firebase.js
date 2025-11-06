import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu7Ik7Wnsh6gCxSF53MV8TyGqMvmpme3Q",
  authDomain: "smart-city-rush-hour-pre-99112.firebaseapp.com",
  projectId: "smart-city-rush-hour-pre-99112",
  storageBucket: "smart-city-rush-hour-pre-99112.firebasestorage.app",
  messagingSenderId: "114332589607",
  appId: "1:114332589607:web:892ad216afdabedf6a3802",
  measurementId: "G-TBPH3782CE",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
