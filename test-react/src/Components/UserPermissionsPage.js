import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography, Box } from '@mui/material';
import NavigationHeader from './NavigationHeader';
import { useLocation } from 'react-router-dom';
import FetchTable from './FetchTables';
const UserPermissionsPage = () => {
  const location = useLocation();
  const { user, isAdmin } = location.state;

  // State for holding options and selected values
  const [userEmails, setUserEmails] = useState([]);
  const [tableNames, setTableNames] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedTableName, setSelectedTableName] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Fetch the user emails
  useEffect(() => {
    const fetchUserEmails = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get('http://localhost:7001/api/Admin/get-users-emails');
        setUserEmails(response.data);
      } catch (error) {
        console.error('Error fetching user emails:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUserEmails();
  }, []);

  // Fetch the table names
  useEffect(() => {
    const fetchTableNames = async () => {
      setLoadingTables(true);
      try {
        const response = await axios.get('http://localhost:7001/api/Table/get-table-names');
        setTableNames(response.data);
      } catch (error) {
        console.error('Error fetching table names:', error);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTableNames();
  }, []);

  // Handle form submissions
  const handleAddPermission = async () => {
    if (!selectedUserEmail || !selectedTableName) {
      setSuccessMessage('Please select both a user and a table.');
      return;
    }

    const requestBody = {
      userEmail: selectedUserEmail,
      tableName: selectedTableName,
    };

    try {
      await axios.post('http://localhost:7001/api/Table/add-permission', requestBody);
      setSuccessMessage('Permission added successfully!');
    } catch (error) {
      setSuccessMessage(`Failed to add permission: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <NavigationHeader user={user} isAdmin={isAdmin} />
      <div>
        <FetchTable id ={1} addColumn={false} removeColumns={false} editRows={true} rowId={0}/>   
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20vh',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <h3>Or Add Using Select</h3>
          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="user-email-label">User Email</InputLabel>
            <Select
              labelId="user-email-label"
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              label="User Email"
              disabled={loadingUsers}
            >
              {loadingUsers ? (
                <MenuItem value="">
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                userEmails.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="table-name-label">Table Name</InputLabel>
            <Select
              labelId="table-name-label"
              value={selectedTableName}
              onChange={(e) => setSelectedTableName(e.target.value)}
              label="Table Name"
              disabled={loadingTables}
            >
              {loadingTables ? (
                <MenuItem value="">
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                tableNames.map((tableName) => (
                  <MenuItem key={tableName} value={tableName}>
                    {tableName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddPermission}
            style={{ marginBottom: '20px' }}
          >
            Add Permission
          </Button>
          {successMessage && (
            <Box mt={2}>
              <Typography variant="body2" color={successMessage.includes('successfully') ? 'green' : 'red'}>
                {successMessage}
              </Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsPage;
