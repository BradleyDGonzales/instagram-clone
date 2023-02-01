// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDLl3bYKiM0u9OSw5fgc9AlteNnkhIn05s",
    authDomain: "instagram-clone-64d94.firebaseapp.com",
    projectId: "instagram-clone-64d94",
    storageBucket: "instagram-clone-64d94.appspot.com",
    messagingSenderId: "9093996011",
    appId: "1:9093996011:web:be75c3c6ef4b1f6e8e8dae",
    measurementId: "G-Z1EV97TC0E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);


