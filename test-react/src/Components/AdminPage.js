import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import SearchTable from './SearchTable'; 
import SignOutButton from './SignOut';
import TableCreation from '../TableCreation';
import { useNavigate } from 'react-router-dom';
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
    navigate("/userpermissions")
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
      <h2>This is admin page</h2>
      <h4>Welcome, {user?.email}</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
        <TextField
          label="User Email"
          value={userEmail}
          onChange={handleUserEmailChange}
          variant="outlined"
          fullWidth
        />

        <TextField
          label="Table ID"
          value={tableId}
          onChange={handleTableIdChange}
          variant="outlined"
          fullWidth
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGrantPermission}
          style={{ flex: 1, maxWidth: '150px' }}
        >
          Grant Permission
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleRemovePermission}
          style={{ flex: 1, maxWidth: '150px' }}
        >
          Remove Permission
        </Button>
      </div>

      <SignOutButton />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUserPermissions}
        >
          Go to User Permissions Page
        </Button>
      </div>
      {message && (
        <p style={{ marginTop: '20px', color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
        <TableCreation />
      <div style={{ width: '100%' }}>
        <SearchTable email={user?.email} />
      </div>
    </div>
  );
};

export default AdminPage;
