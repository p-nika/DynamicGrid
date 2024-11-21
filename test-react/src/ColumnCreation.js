import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const AddColumn = ({ reloadTables }) => {
  const [columnName, setColumnName] = useState('');
  const [tableName, setTableName] = useState('');
  const [columnType, setColumnType] = useState(0); // Default to 'Text'
  const [referringToTableId, setReferringToTableId] = useState('');
  const [referringToColumnId, setReferringToColumnId] = useState('');
  const [isValidated, setIsValidated] = useState(false); // State for the "Validated" checkbox

  const handleColumnNameChange = (e) => setColumnName(e.target.value);
  const handleTableNameChange = (e) => setTableName(e.target.value);
  const handleReferringToTableIdChange = (e) => setReferringToTableId(e.target.value);
  const handleReferringToColumnIdChange = (e) => setReferringToColumnId(e.target.value);

  const handleColumnTypeChange = (type) => () => setColumnType(type);

  // Function to handle the "Validated" checkbox change
  const handleValidatedChange = (e) => setIsValidated(e.target.checked);

  const handleAddColumn = async () => {
    if (!columnName || !tableName) return;

    const requestBody = {
      tableName,
      columnName,
      columnType,
      isValidated, // Add isValidated to the request body
      ...(columnType === 1 && {
        referringToTableId: parseInt(referringToTableId, 10),
        referringToColumnId: parseInt(referringToColumnId, 10),
      }),
    };

    try {
      await axios.post('http://localhost:7001/api/Table/add-column', requestBody);
      console.log('Column added successfully');
      reloadTables();
    } catch (error) {
      alert(`Failed to add column: ${error.response.data}`);
      // console.error('Failed to add column:', error);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <TextField
        label="Table Name"
        variant="outlined"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ marginRight: '10px' }}
      />
      <TextField
        label="Column Name"
        variant="outlined"
        value={columnName}
        onChange={handleColumnNameChange}
        style={{ marginRight: '10px' }}
      />
      {columnType === 1 && (
        <>
          <TextField
            label="Referring Table ID"
            variant="outlined"
            value={referringToTableId}
            onChange={handleReferringToTableIdChange}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Referring Column ID"
            variant="outlined"
            value={referringToColumnId}
            onChange={handleReferringToColumnIdChange}
            style={{ marginRight: '10px' }}
          />
        </>
      )}
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={columnType === 0}
              onChange={handleColumnTypeChange(0)} // Text column type
            />
          }
          label="Text"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={columnType === 1}
              onChange={handleColumnTypeChange(1)} // External Collection
            />
          }
          label="External Collection"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={columnType === 2}
              onChange={handleColumnTypeChange(2)} // Numeric column type
            />
          }
          label="Numeric"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={columnType === 3}
              onChange={handleColumnTypeChange(3)} // Email column type
            />
          }
          label="Email"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={columnType === 4}
              onChange={handleColumnTypeChange(4)} // Regex column type
            />
          }
          label="Regex"
        />
      </div>
      {/* Add the "Validated" checkbox here */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isValidated}
            onChange={handleValidatedChange} // Handle the checkbox state change
          />
        }
        label="Validated"
      />
      <Button onClick={handleAddColumn} variant="contained" color="primary">
        Add Column
      </Button>
    </div>
  );
};

export default AddColumn;
