import { Button } from '@mui/material';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; 
import firebaseConfig from './FireBaseAuthenticator';

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);  
      const provider = new GoogleAuthProvider();  
      const result = await signInWithPopup(auth, provider);  

      const user = result.user;
      console.log('User Logged in: ', user);
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
