import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
} from '@mui/material';
import CellRenderer from './CellRenderer';

const TableRenderer = ({
  table,
  handleInputChange,
  toggleRowSelection,
  handleAddRow,
  handleRemoveRows,
  handleRemoveColumns,
  selectedRows,
  selectedColumns,
  toggleColumnSelection,
}) => (
  <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
    <Table sx={{ minWidth: 650 }} aria-label={`table-${table.id}`}>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          {table.columns.map((column, colIndex) => (
            <TableCell key={column.id}>
              <Checkbox
                checked={selectedColumns[table.id]?.includes(colIndex) || false}
                onChange={() => toggleColumnSelection(table.id, colIndex)}
              />
              {column.name} {column.id}
            </TableCell>
          ))}
          {table.rows.length > 0 && <TableCell></TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={table.columns.length + (table.rows.length > 0 ? 2 : 1)}>
            <strong>{table.name}</strong>
          </TableCell>
        </TableRow>
        {table.rows.map((row, rowIndex) => (
          <TableRow key={row.id}>
            <TableCell>{rowIndex + 1}</TableCell>
            {row.values.map((valueObject, colIndex) => (
              <TableCell key={colIndex}>
                <CellRenderer
                  valueObject={valueObject}
                  onChange={(newValue) => handleInputChange(table.id, rowIndex, colIndex, newValue)}
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
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveColumns(table.id)}
              sx={{ marginLeft: 2 }}
            >
              - Remove Columns
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default TableRenderer;
