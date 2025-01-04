import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/store';
import { setUser } from '@/redux/slices/AuthSlice';
export const firebaseConfig = {
  apiKey: "AIzaSyC9OyV3ZCNEEbyqSq6BhvBeetEWIDc_ViY",
  authDomain: "fanels-9fbf7.firebaseapp.com",
  projectId: "fanels-9fbf7",
  storageBucket: "fanels-9fbf7.firebasestorage.app",
  messagingSenderId: "147478012787",
  appId: "1:147478012787:web:ceb818c6dc568adb745b06"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
auth.languageCode = 'en';
provider.setCustomParameters({
  login_hint: 'user@example.com',
});

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, provider);
      console.log('The result:', result);
      return result.user;

    } catch (error) {
      console.log('Error:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return { user, loading, error, signInWithGoogle, logout };
};
