import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC9OyV3ZCNEEbyqSq6BhvBeetEWIDc_ViY",
  authDomain: "fanels-9fbf7.firebaseapp.com",
  projectId: "fanels-9fbf7",
  storageBucket: "fanels-9fbf7.firebasestorage.app",
  messagingSenderId: "147478012787",
  appId: "1:147478012787:web:ceb818c6dc568adb745b06"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
