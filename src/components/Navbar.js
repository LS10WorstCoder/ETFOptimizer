import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure 'Link' is imported for navigation
import '../App.css';
import { signInWithGoogle } from '../firebase/firebase'; // Import Firebase Google login function

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      setUser(loggedInUser);
      navigate('/profile'); // Redirect to profile page after login
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <Link to="/">  {/* This link takes users to the home page */}
        <img src="/images/logo-no-background.png" alt="ETF Optimizer Logo" className="logo" />
      </Link>

      {/* Right-aligned Google login button and profile icon */}
      <div className="navbar-right">
        {!user ? (
          <button className="login-btn" onClick={handleLogin}>
            Sign in with Google
          </button>
        ) : (
          <div className="navbar-user">
            <img
              src={'/images/profileBlack.png'} 
              alt="Profile"
              className="profile-icon"
              onClick={() => navigate('/profile')}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
