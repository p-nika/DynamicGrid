import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const AddColumn = ({ tableName, reloadTable }) => {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState(0); // Default to 'Text'
  const [referringToTableId, setReferringToTableId] = useState('');
  const [referringToColumnId, setReferringToColumnId] = useState('');
  const [isValidated, setIsValidated] = useState(false); // State for the "Validated" checkbox

  const handleColumnNameChange = (e) => setColumnName(e.target.value);
  const handleReferringToTableIdChange = (e) => setReferringToTableId(e.target.value);
  const handleReferringToColumnIdChange = (e) => setReferringToColumnId(e.target.value);

  const handleColumnTypeChange = (type) => () => setColumnType(type);

  const handleValidatedChange = (e) => setIsValidated(e.target.checked);

  const handleAddColumn = async () => {
    if (!columnName || !tableName) return;

    const requestBody = {
      tableName,
      columnName,
      columnType,
      isValidated,
      ...(columnType === 1 && {
        referringToTableId: parseInt(referringToTableId, 10),
        referringToColumnId: parseInt(referringToColumnId, 10),
      }),
    };

    try {
      await axios.post('http://localhost:7001/api/Table/add-column', requestBody);
      console.log('Column added successfully');
      reloadTable();
    } catch (error) {
      alert(`Failed to add column: ${error.response.data}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h3 style={{ marginBottom: '20px' }}>Add Column</h3>
        <TextField
          label="Column Name"
          variant="outlined"
          value={columnName}
          onChange={handleColumnNameChange}
          fullWidth
          style={{ marginBottom: '10px' }}
        />
        {columnType === 1 && (
          <>
            <TextField
              label="Referring Table ID"
              variant="outlined"
              value={referringToTableId}
              onChange={handleReferringToTableIdChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Referring Column ID"
              variant="outlined"
              value={referringToColumnId}
              onChange={handleReferringToColumnIdChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
          </>
        )}
        <div style={{ marginBottom: '10px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={columnType === 0}
                onChange={handleColumnTypeChange(0)}
              />
            }
            label="Text"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={columnType === 1}
                onChange={handleColumnTypeChange(1)}
              />
            }
            label="External Collection"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={columnType === 2}
                onChange={handleColumnTypeChange(2)}
              />
            }
            label="Numeric"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={columnType === 3}
                onChange={handleColumnTypeChange(3)}
              />
            }
            label="Email"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={columnType === 4}
                onChange={handleColumnTypeChange(4)}
              />
            }
            label="Regex"
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isValidated}
              onChange={handleValidatedChange}
            />
          }
          label="Validated"
        />
        <Button onClick={handleAddColumn} variant="contained" color="primary" fullWidth>
          Add Column
        </Button>
      </div>
    </div>
  );
};

export default AddColumn;
