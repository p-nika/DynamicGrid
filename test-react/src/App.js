import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';  // Modular import for initializing the app
import { getAuth } from 'firebase/auth';  // Modular import for Firebase Authentication
import firebaseConfig from './Components/FireBaseAuthenticator'; // Import your Firebase config file
import AuthenticationPage from './Components/AuthenticationPage';

const App = () => {
  useEffect(() => {
    // Initialize Firebase only if it's not already initialized
    const app = initializeApp(firebaseConfig);  // Initialize Firebase app

    // If you need Firebase Auth instance, you can get it here
    const auth = getAuth(app); // Get auth instance for authentication

    // If you need to perform other Firebase operations, you can use the `app` and `auth` objects

  }, []);

  return (
    <div>
      <AuthenticationPage />
    </div>
  );
}

export default App;
