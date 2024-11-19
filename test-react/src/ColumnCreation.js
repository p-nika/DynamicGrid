// ColumnCreation.js

import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

const AddColumn = ({ reloadTables }) => {
  const [columnName, setColumnName] = useState('');
  const [tableName, setTableName] = useState('');

  const handleColumnNameChange = (e) => setColumnName(e.target.value);
  const handleTableNameChange = (e) => setTableName(e.target.value);

  const handleAddColumn = async () => {
    if (!columnName || !tableName) return;

    try {
      await axios.post('http://localhost:7001/api/Table/add-column', {
        tableName,
        columnName,
      });
      console.log('Column added successfully');
      reloadTables();
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Table Name"
        variant="outlined"
        value={tableName}
        onChange={handleTableNameChange}
      />
      <TextField
        label="Column Name"
        variant="outlined"
        value={columnName}
        onChange={handleColumnNameChange}
      />
      <Button onClick={handleAddColumn} variant="contained" color="primary">
        Add Column
      </Button>
    </div>
  );
};

export default AddColumn;
