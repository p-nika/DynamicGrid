import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';  // Modular import for initializing the app
import { getAuth } from 'firebase/auth';  // Modular import for Firebase Authentication
import firebaseConfig from './Components/FireBaseAuthenticator'; // Import your Firebase config file
import AuthenticationPage from './Components/AuthenticationPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './Components/UserPage';
import AdminPage from './Components/AdminPage';
import FetchTable from './Components/FetchTables';
const App = () => {
  useEffect(() => {
    // Initialize Firebase only if it's not already initialized
    const app = initializeApp(firebaseConfig);  // Initialize Firebase app

    // If you need Firebase Auth instance, you can get it here
    const auth = getAuth(app); // Get auth instance for authentication

    // If you need to perform other Firebase operations, you can use the `app` and `auth` objects

  }, []);

  return (
    <Router>
    <Routes>
      <Route path="/authentication" element={<AuthenticationPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </Router>
  );
}

export default App;
