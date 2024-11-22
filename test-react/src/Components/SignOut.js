import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate(); 

  const handleSignOut = () => {
    const auth = getAuth(); 
    signOut(auth).then(() => {
      console.log('User signed out');
      navigate('/authentication'); 
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutButton;
