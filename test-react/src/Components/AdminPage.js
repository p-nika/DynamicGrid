import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import SearchTable from './SearchTable'; 
import SignOutButton from './SignOut';
import TableCreation from '../TableCreation';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';
import EditTablePage from './EditTablePage';
import AccessedTablesPage from './AcessedTablesPage';
const AdminPage = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [userEmail, setUserEmail] = useState('');
  const [tableId, setTableId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleUserEmailChange = (e) => setUserEmail(e.target.value);
  const handleTableIdChange = (e) => setTableId(e.target.value);

  const handleUserPermissions = () => {
    navigate("/userpermissions");
  }
  const handleAccessedTablesPage = () => {
    const isAdmin = true;
    navigate("/accessedTables", {state : { user, isAdmin}});
  }
  const handleGrantPermission = async () => {
    if (!userEmail || !tableId) {
      setMessage('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7001/api/Admin/add-user-permission', {
        userEmail,
        tableId,
      });
      setMessage('Permission granted successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error granting permission:', error.response?.data || error.message);
      setMessage('Failed to grant permission. Please try again.');
    }
  };
  const handleRemovePermission = async () => {
    if (!userEmail || !tableId) {
      setMessage('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:7001/api/Admin/remove-user-permission', {
        data: { userEmail, tableId },
      });
      setMessage('Permission removed successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error removing permission:', error.response?.data || error.message);
      setMessage('Failed to remove permission. Please try again.');
    }
  };

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
