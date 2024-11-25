import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddColumn = ({ tableName, reloadTable }) => {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState(0);
  const [referringToTableName, setReferringToTableName] = useState('');
  const [referringToColumnName, setReferringToColumnName] = useState('');
  const [regex, setRegex] = useState('');
  const [isValidated, setIsValidated] = useState(true);
  const [tableNames, setTableNames] = useState([]);
  const [columnNames, setColumnNames] = useState([]);

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/Table/get-table-names');
        setTableNames(response.data);
      } catch (error) {
        console.error('Failed to fetch table names:', error);
      }
    };

    fetchTableNames();
  }, []);

  useEffect(() => {
    if (referringToTableName) {
      const fetchColumnNames = async () => {
        try {
          const response = await axios.get(`http://localhost:7001/api/Table/get-column-names/${referringToTableName}`);
          setColumnNames(response.data);
        } catch (error) {
          console.error('Failed to fetch column names:', error);
        }
      };

      fetchColumnNames();
    }
  }, [referringToTableName]);

  const handleColumnNameChange = (e) => setColumnName(e.target.value);
  const handleReferringToTableNameChange = (e) => setReferringToTableName(e.target.value);
  const handleReferringToColumnNameChange = (e) => setReferringToColumnName(e.target.value);
  const handleRegexChange = (e) => setRegex(e.target.value);

  const handleColumnTypeChange = (type) => () => setColumnType(type);

  const handleAddColumn = async () => {
    if (!columnName || !tableName) return;

    const requestBody = {
      tableName,
      columnName,
      columnType,
      isValidated,
      ...(columnType === 1 && {
        referringToTableName: referringToTableName,
        referringToColumnName: referringToColumnName,
      }),
      ...(columnType === 4 && { regex }),
    };

    try {
      await axios.post('http://localhost:7001/api/Table/add-column', requestBody);
      console.log('Column added successfully');
      reloadTable();
    } catch (error) {
      alert(`Failed to add column: ${error.response?.data || error.message}`);
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
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Referring Table</InputLabel>
              <Select
                value={referringToTableName}
                onChange={handleReferringToTableNameChange}
                label="Referring Table"
              >
                {tableNames.map((table) => (
                  <MenuItem key={table} value={table}>
                    {table}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Referring Column</InputLabel>
              <Select
                value={referringToColumnName} // Bind to referringToColumnName
                onChange={handleReferringToColumnNameChange}
                label="Referring Column"
              >
                {columnNames.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {columnType === 4 && (
          <TextField
            label="Input Regex"
            variant="outlined"
            value={regex}
            onChange={handleRegexChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
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
        <Button onClick={handleAddColumn} variant="contained" color="primary" fullWidth>
          Add Column
        </Button>
      </div>
    </div>
  );
};

export default AddColumn;
