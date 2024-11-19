import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddColumn from './ColumnCreation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import TableCreation from './TableCreation';

export const reloadTables = async (setTables) => {
  try {
    const response = await axios.get('http://localhost:7001/api/Table/get-tables');
    setTables(response.data);
  } catch (error) {
    console.error('Failed to fetch tables:', error);
  }
};

const FetchTables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    reloadTables(setTables);
  }, []);

  const handleInputChange = async (tableId, rowIndex, colIndex, newValue) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              rows: table.rows.map((row, rowInd) =>
                rowInd === rowIndex
                  ? {
                      ...row,
                      values: row.values.map((value, colInd) =>
                        colInd === colIndex ? { ...value, value: newValue } : value
                      ),
                    }
                  : row
              ),
            }
          : table
      )
    );
  
    try {
      await axios.patch('http://localhost:7001/api/Table/change-cell', {
        TableId: tableId,
        RowInd: rowIndex + 1,
        ColInd: colIndex + 1,
        Value: newValue,
      });
    } catch (error) {
      console.error('Failed to update cell:', error);
    }
  };
  

  const handleAddRow = async (tableId) => {
    const newRow = {
      values: tables
        .find((table) => table.id === tableId)
        .columns.map(() => ({ value: '' })),
    };
  
    try {
      await axios.post('http://localhost:7001/api/Table/add-row', {
        TableId: tableId,
        Values: newRow.values,
      });
  
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                rows: [...table.rows, newRow],
              }
            : table
        )
      );
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };
  

  return (
    <div>
      <TableCreation reloadTables={() => reloadTables(setTables)} />
      <AddColumn reloadTables={() => reloadTables(setTables)} />

      {tables.map((table) => (
        <TableContainer key={table.id} component={Paper} sx={{ marginBottom: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label={`table-${table.id}`}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                {table.columns.map((column) => (
                  <TableCell key={column.id}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={table.columns.length + 1}>
                  <strong>{table.name}</strong>
                </TableCell>
              </TableRow>
              {table.rows.map((row, rowIndex) => (
                <TableRow key={row.id}>
                  <TableCell>{rowIndex + 1}</TableCell>
                  {row.values.map((valueObject, colIndex) => (
                    <TableCell key={colIndex}>
                      <TextField
                        value={valueObject.value || ''}
                        onChange={(e) =>
                          handleInputChange(table.id, rowIndex, colIndex, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={table.columns.length + 2} align="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAddRow(table.id)}
                  >
                    + Add Row
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
};

export default FetchTables;
