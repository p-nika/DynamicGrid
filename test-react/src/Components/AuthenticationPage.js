import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './FireBaseAuthenticator'; // Ensure your Firebase config is imported

const AuthenticationPage = () => {
  // State for email, password, error, and the form mode (login or register)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register mode

  // Handle input field changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle authentication logic (login or register)
  const handleAuthAction = async () => {
    if (!email || !password) {
      setError('Please fill out both fields.');
      return;
    }

    try {
      // Initialize Firebase App
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      if (isRegistering) {
        // Registration action
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Registration successful! Please log in.');
      } else {
        // Login action
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      }
    } catch (error) {
      setError(error.message); // Display error message
      console.error('Error during authentication:', error.message);
    }
  };

  // Toggle between login and register forms
  const toggleAuthMode = () => {
    setIsRegistering((prevMode) => !prevMode);
    setError(''); // Clear error when switching between login/register
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {isRegistering ? 'Register' : 'Login'}
      </Typography>

      {error && (
        <Typography variant="body2" color="error" style={{ marginBottom: '10px' }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAuthAction}
        fullWidth
      >
        {isRegistering ? 'Register' : 'Log In'}
      </Button>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={toggleAuthMode} color="secondary">
          {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Register"}
        </Button>
      </div>
    </div>
  );
};

export default AuthenticationPage;
