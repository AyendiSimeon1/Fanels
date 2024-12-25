// src/components/GoogleSignInButton.tsx
import React from 'react';

interface GoogleSignInButtonProps {
  onClick: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
  >
    Sign in with Google
  </button>
);

export default GoogleSignInButton;
