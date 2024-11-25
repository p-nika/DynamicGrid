import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TableCreation from '../TableCreation';
import NavigationHeader from './NavigationHeader';
import { deleteTable } from '../Api/tableApi';

const AccessedTablesPage = (excludeHeader) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = location.state;
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7001/api/User/get-user-tables/${user.email}`);
      setTables(response.data);
    } catch (err) {
      setError('Failed to fetch accessed tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchTables();
    }
  }, [user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleEditPageNavigation = (tableId) => {
    navigate('/editTablePage', { state: { user, isAdmin, tableId } });
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await deleteTable(tableId);
      fetchTables();
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!excludeHeader.excludeHeader && <NavigationHeader user={user} isAdmin={isAdmin} />}
      {isAdmin && <TableCreation />}
      <Typography variant="h4" gutterBottom>
        Accessed Tables
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Table ID</strong></TableCell>
              <TableCell><strong>Table Name</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.tableId}>
                <TableCell>{table.tableId}</TableCell>
                <TableCell>{table.tableName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditPageNavigation(table.tableId)}
                  >
                    Edit
                  </Button>
                  {isAdmin && <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTable(table.tableId)}
                  >
                    Remove
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AccessedTablesPage;
