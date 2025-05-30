import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDljOeXWYEQnF7ZYB3JSo3uYv4hDyVrWG4",
  authDomain: "tvmaze-app2-c9141.firebaseapp.com",
  projectId: "tvmaze-app2-c9141",
  storageBucket: "tvmaze-app2-c9141.firebasestorage.app",
  messagingSenderId: "345873270230",
  appId: "1:345873270230:web:f150093ae989aeae3e5077"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
