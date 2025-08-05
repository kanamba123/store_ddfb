// src/utils/firebaseConfig.js

// Importer les fonctions nécessaires du SDK Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Pour Firestore
import { getStorage } from "firebase/storage"; // Pour Storage

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDG0j4YqwR2c2qbjQLy1KQllszFawCo6DM",
  authDomain: "dd-fb-144ed.firebaseapp.com",
  projectId: "dd-fb-144ed",
  storageBucket: "dd-fb-144ed.firebasestorage.app",
  messagingSenderId: "1098163604049",
  appId: "1:1098163604049:web:46f704ceefaa3b37d18670",
  measurementId: "G-6F6ZJWYEBQ",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase (Firestore et Storage)
const db = getFirestore(app); // Firestore
const storage = getStorage(app); // Storage

// Exporter l'application Firebase ainsi que Firestore et Storage pour une utilisation dans d'autres parties du projet
export { app, db, storage };


