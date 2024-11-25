import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';
import AccessedTablesPage from './AcessedTablesPage';
const AdminPage = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <NavigationHeader user = {user} isAdmin = {true} />
      <h2>This is admin page</h2>
      <h4>Welcome, {user?.email}</h4>
      <AccessedTablesPage excludeHeader={true}/>
    </div>
  );
};

export default AdminPage;
