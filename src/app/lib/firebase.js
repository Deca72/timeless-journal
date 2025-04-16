import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvBMBHaqockI7llx1Vj5Sx0dOctF-jr9k",
  authDomain: "timeless-journal-469d5.firebaseapp.com",
  projectId: "timeless-journal-469d5",
  storageBucket: "timeless-journal-469d5.firebasestorage.app",
  messagingSenderId: "648056828463",
  appId: "1:648056828463:web:bafe7534fd3689ac560cda"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Ensure Storage is initialized correctly

export { app, auth, db, storage };
