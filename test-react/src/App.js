import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './Components/FireBaseAuthenticator';
import AuthenticationPage from './Components/AuthenticationPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './Components/UserPage';
import AdminPage from './Components/AdminPage';
import UserPermissionsPage from './Components/UserPermissionsPage';
import AccessedTablesPage from './Components/AcessedTablesPage';
import EditTablePage from './Components/EditTablePage';
const App = () => {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);

  }, []);

  return (
    <Router>
    <Routes>
      <Route path="/authentication" element={<AuthenticationPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/userpermissions" element={<UserPermissionsPage />} />
      <Route path="/accessedTables" element={<AccessedTablesPage />} />
      <Route path="/editTablePage" element={<EditTablePage />} />
    </Routes>
  </Router>
  );
}

export default App;
