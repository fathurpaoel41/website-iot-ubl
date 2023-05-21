import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // Konfigurasi Firebase Anda (dapatkan dari Firebase Console)
  apiKey: "AIzaSyByB2ZL93llGy0U4F8y92YfuqhKP872_pE",
  authDomain: "smart-office-ubl.firebaseapp.com",
  databaseURL: "https://smart-office-ubl-default-rtdb.firebaseio.com",
  projectId: "smart-office-ubl",
  storageBucket: "smart-office-ubl.appspot.com",
  messagingSenderId: "868444213189",
  appId: "1:868444213189:web:fbd554f493c4eca80f85ac",
  measurementId: "G-7Y3QDLC6N8"
};

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);

// Dapatkan referensi ke realtime database Firebase
const database = getDatabase(app);

export default database;