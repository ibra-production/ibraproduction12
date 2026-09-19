import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATSuJTP2UVZoYcfaGILaY1e0D7qbEtdMc",
  authDomain: "ibra-production-web.firebaseapp.com",
  projectId: "ibra-production-web",
  storageBucket: "ibra-production-web.firebasestorage.app",
  messagingSenderId: "794299708186",
  appId: "1:794299708186:web:e11b19267055588a0532a3",
  measurementId: "G-C5G56NW0CM"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const vapidKey = "BOZm_0LT3xDvXw3yKFAmzlIbqhDzpJ8IMbc-b13DsPBhOf0YEZxr4at5noBWb_O-igMGxSVixuZIyPrVCJmlUuQ";
