// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace this with your actual Firebase config object!
const firebaseConfig = {

    apiKey: "AIzaSyCOYedPgy1rtL_VE0GXe5Lv0Zfd2DdNNu0",
  
    authDomain: "project-chimera-app.firebaseapp.com",
  
    projectId: "project-chimera-app",
  
    storageBucket: "project-chimera-app.firebasestorage.app",
  
    messagingSenderId: "1021199965677",
  
    appId: "1:1021199965677:web:a7909d1b73ec6088a25be4",
  
    measurementId: "G-TM96DN057J"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);