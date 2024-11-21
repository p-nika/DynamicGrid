import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import FetchTable from './FetchTables';
import { accessTable } from '../Api/tableApi';

const SearchTable = ({ email }) => {
  const [tableName, setTableName] = useState('');
  const [tableId, setTableId] = useState(null); // State to store the table ID

  const handleSearch = async () => {
    if (!tableName.trim()) {
      alert('Please enter a table name.');
      return;
    }

    try {
      const data = await accessTable(tableName, email); // Call accessTable API
      if (data.success) {
        setTableId(data.tableId); // Store the returned table ID
      } else {
        alert('Access denied or table not found.');
      }
    } catch (error) {
      console.error('Failed to search table:', error);
      alert('Failed to search table. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Search Table</h2>
      <TextField
        label="Enter Table Name"
        variant="outlined"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        style={{ marginBottom: '10px', width: '300px' }} // Reduced marginBottom here
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginBottom: '10px' }} // Reduced marginBottom here
        >
          Search
        </Button>
      </div>

      {/* Render the fetched table if tableId is available */}
      {tableId && (
        <div style={{ width: '100%', marginTop: '10px' }}> {/* Reduced marginTop here */}
          <FetchTable key={tableId} id={tableId} style={{ width: '100%'} } />
        </div>
      )}
    </div>
  );
};

export default SearchTable;
