import { Button } from '@mui/material';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';  // Modular imports
import { initializeApp } from 'firebase/app';  // Modular import for initializing Firebase
import firebaseConfig from './FireBaseAuthenticator';  // Import your Firebase config file

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    try {
      const app = initializeApp(firebaseConfig);  // Initialize Firebase app
      const auth = getAuth(app);  // Get the authentication instance
      const provider = new GoogleAuthProvider();  // Create a new Google provider
      const result = await signInWithPopup(auth, provider);  // Sign in with popup

      // User info
      const user = result.user;
      console.log('User Logged in: ', user);

      // Optionally, you can store user information in your app state
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogin}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
