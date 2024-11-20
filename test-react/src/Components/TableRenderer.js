import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  Button,
} from '@mui/material';

const TableRenderer = ({
  table,
  handleInputChange,
  toggleRowSelection,
  handleAddRow,
  handleRemoveRows,
  selectedRows,
}) => (
  <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
    <Table sx={{ minWidth: 650 }} aria-label={`table-${table.id}`}>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          {table.columns.map((column) => (
            <TableCell key={column.id}>{column.name}</TableCell>
          ))}
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={table.columns.length + 2}>
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
            <TableCell>
              <Checkbox
                checked={selectedRows[table.id]?.includes(rowIndex) || false}
                onChange={() => toggleRowSelection(table.id, rowIndex)}
              />
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={table.columns.length + 3} align="center">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddRow(table.id)}
            >
              + Add Row
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveRows(table.id)}
              sx={{ marginLeft: 2 }}
            >
              - Remove Rows
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default TableRenderer;
