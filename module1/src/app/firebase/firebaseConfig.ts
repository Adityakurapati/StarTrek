import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, getDocs, addDoc , onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD04GBzKKyxBrSGL7LeLq99Y37YsEB6aOg",
  authDomain: "thirdeye-c5b2e.firebaseapp.com",
  databaseURL: "https://thirdeye-c5b2e-default-rtdb.firebaseio.com",
  projectId: "thirdeye-c5b2e",
  storageBucket: "thirdeye-c5b2e.firebasestorage.app",
  messagingSenderId: "97667042020",
  appId: "1:97667042020:web:4178bc2c8e9d6818fb7af1",
  measurementId: "G-FE8WSFS1B7"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs,addDoc, onSnapshot };


export const auth = typeof window !== "undefined" ? getAuth(app) : null

