// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf7N4heoDa77KfYTLgEjg0tDA_HXTzDMg",
  authDomain: "inventory-management-97e92.firebaseapp.com",
  projectId: "inventory-management-97e92",
  storageBucket: "inventory-management-97e92.appspot.com",
  messagingSenderId: "793011463837",
  appId: "1:793011463837:web:c66b5c647efcef4f3f5674",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}