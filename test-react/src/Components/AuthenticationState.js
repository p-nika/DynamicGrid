import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';  // Modular imports for Firebase Auth
import { initializeApp } from 'firebase/app';  // Modular import for initializing Firebase
import firebaseConfig from './FireBaseAuthenticator';  // Import your Firebase config file

const AuthStateObserver = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);  // Get the auth instance

    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <p>Welcome, {user.displayName}</p> : <p>Please log in</p>}
    </div>
  );
};

export default AuthStateObserver;
