import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth'; // Correct import for auth and signOut
import { useNavigate } from 'react-router-dom'; // Use useNavigate to redirect

const SignOutButton = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSignOut = () => {
    const auth = getAuth(); // Get Firebase authentication instance
    signOut(auth).then(() => {
      console.log('User signed out');
      navigate('/authentication'); // Navigate to authentication page after sign-out
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSignOut} // Trigger sign-out on button click
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutButton;
