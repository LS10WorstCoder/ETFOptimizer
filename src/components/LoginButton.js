import React from 'react';
import { signInWithGoogle } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/profile'); // Redirect to profile page after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button className="login-btn" onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default LoginButton;
