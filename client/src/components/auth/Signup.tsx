'use client';

import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock } from 'lucide-react';
import { InputField } from '@/components/ui/auth/InputField';
import { SocialButton } from '@/components/ui/auth/SocialButton';
import { Divider } from '@/components/ui/auth/Divider';
import { ContentSection } from '@/components/ui/auth/ContentSection';
import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { setUser } from '@/redux/slices/AuthSlice';
import { ClipLoader } from 'react-spinners'; // Add this import

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const dispatch = useAppDispatch();

  useAuthRedirect();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);

    try {
      setLoading(true); // Set loading to true when form is submitted
      const userCredentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredentials.user;

      const userToDispatch = {
        uid: user.uid,
        email: user.email || undefined,
      };
      dispatch(setUser(userToDispatch));
      console.log('User created:', user);
    } catch (error:any) {
      console.error('Error creating user:', error.code, error.message);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after the process is complete
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 p-12 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create account</h1>
          <p className="text-gray-600 mb-8">Start your 30-day free trial.</p>

          <SocialButton icon={<GoogleIcon />}>
            Sign up with Google
          </SocialButton>

          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <InputField
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <button 
              type="submit"
              className="w-full bg-[#27AE60] text-white py-3 rounded-lg hover:bg-[#219652] transition-colors duration-200"
              disabled={loading} // Disable button when loading
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : 'Create account'} // Show spinner when loading
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#27AE60] hover:text-[#219652] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="w-1/2 bg-[#27AE60] flex items-center justify-center p-12">
        <ContentSection
          title="Powered by advanced algorithms for accuracy and creativity."
          description="Say goodbye to the hassle of creating slides from scratch! Fanels is your smart AI agent designed to transform your ideas into professional, visually stunning presentations in minutes."
          userCount={10000}
        />
      </div>
    </div>
  );
};