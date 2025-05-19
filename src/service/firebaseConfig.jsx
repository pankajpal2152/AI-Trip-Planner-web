// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCiJwjmhDO05kPoXgC_8cUkXEniBrgwRfA",
    authDomain: "ai-trip-planner-a67bc.firebaseapp.com",
    projectId: "ai-trip-planner-a67bc",
    storageBucket: "ai-trip-planner-a67bc.firebasestorage.app",
    messagingSenderId: "988902396285",
    appId: "1:988902396285:web:4c56bbe35a4d2ec9b8bc14",
    measurementId: "G-7KMYP0L3YD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);