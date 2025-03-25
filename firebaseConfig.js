import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ✅ No initializeAuth needed
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCv65Pg60uIpA_RKzwGySlKg1j_tJLX7jQ",
  authDomain: "bizkart-ce3fe.firebaseapp.com",
  projectId: "bizkart-ce3fe",
  storageBucket: "bizkart-ce3fe.appspot.com",
  messagingSenderId: "66722097023",
  appId: "1:66722097023:android:4cd0c85a0b252078dc1c4a",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use getAuth (No persistence for Expo Go)
export const auth = getAuth(app);  

// ✅ Initialize Firestore
export const db = getFirestore(app);
