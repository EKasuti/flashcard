// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirebase, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqDlcZd2Q4tmHgszeJU6qOls4tE0spcMs",
  authDomain: "flashcards-4f1bb.firebaseapp.com",
  projectId: "flashcards-4f1bb",
  storageBucket: "flashcards-4f1bb.appspot.com",
  messagingSenderId: "229218181350",
  appId: "1:229218181350:web:b59602461cd9e727a61b27",
  measurementId: "G-5XVLQXWYFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export{db}