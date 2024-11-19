import React, { useState } from 'react';
import axios from 'axios';

const TableCreation = ({ reloadTables }) => {
  const [tableName, setTableName] = useState('');

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    try {
      await axios.post('http://localhost:7001/api/Table/create-table', { name: tableName });
      reloadTables();
      setTableName('');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  return (
    <div>
      <h2>Create Table</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Table Name" 
          value={tableName} 
          onChange={handleTableNameChange} 
          required 
        />
        <button type="submit">Create Table</button>
      </form>
    </div>
  );
};

export default TableCreation;
