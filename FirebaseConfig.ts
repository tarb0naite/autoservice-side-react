import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';  // Updated import



const firebaseConfig = {
    apiKey: "AIzaSyBG8oXePNk0nYkk780WgKyf8YYYwrnCulk",
    authDomain: "project-7312a.firebaseapp.com",
    projectId: "project-7312a",
    storageBucket: "project-7312a.appspot.com",
    messagingSenderId: "762429711240",
    appId: "1:762429711240:web:50af3208a000901632d03d",
    measurementId: "G-9EJNHZD395"
  };



  export const FIREBASE_APP = initializeApp(firebaseConfig);
  export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
  export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
  
  const auth = FIREBASE_AUTH;