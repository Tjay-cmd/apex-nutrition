// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5RBD7Sd2tROr-c2mBxJv1CseByi-4itA",
  authDomain: "cursorapp-df6ac.firebaseapp.com",
  projectId: "cursorapp-df6ac",
  storageBucket: "cursorapp-df6ac.firebasestorage.app",
  messagingSenderId: "1064591229818",
  appId: "1:1064591229818:web:a80d723283b78ba6f74cc3",
  measurementId: "G-HESLDSMQGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };

export default app;