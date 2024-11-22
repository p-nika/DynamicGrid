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

const AccessedTablesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = location.state;
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/User/get-user-tables/${user.email}`);
        setTables(response.data);
      } catch (err) {
        setError('Failed to fetch accessed tables');
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div style={{ padding: '20px' }}>
        {isAdmin && (<TableCreation />)}
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
                    Edit Page
                  </Button>
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
