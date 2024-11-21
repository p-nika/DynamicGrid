import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const TableCreation = ({ reloadTable }) => {
  const [tableName, setTableName] = useState('');

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    try {
      await axios.post('http://localhost:7001/api/Table/create-table', { name: tableName });
      reloadTable();
      setTableName('');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
    setTableName('');
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      style={{ marginBottom: '20px' }}
    >
      <h2>Create Table</h2>
      <form 
        onSubmit={onSubmit} 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
      >
        <TextField
          label="Table Name"
          variant="outlined"
          value={tableName}
          onChange={handleTableNameChange}
          required
          style={{ width: '300px' }}
        />
        <Button type="submit" variant="contained" color="primary" style={{ width: '150px' }}>
          Create Table
        </Button>
      </form>
    </Box>
  );
};

export default TableCreation;
