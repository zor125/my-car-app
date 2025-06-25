import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2ksy8j2URtt7EO30bUnmjomWO6v5EGf0",
  authDomain: "car-sharing-app-f2548.firebaseapp.com",
  projectId: "car-sharing-app-f2548",
  storageBucket: "car-sharing-app-f2548.firebasestorage.app",
  messagingSenderId: "881343892551",
  appId: "1:881343892551:web:94e66c539e292d30c87562",
};

const app = initializeApp(firebaseConfig);

// Firebase 서비스 객체들 export
export const auth = getAuth(app);
export const db = getFirestore(app);
