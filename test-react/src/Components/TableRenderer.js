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
  removeColumns,
}) => {
  if (!table || !table.columns || !table.rows) {
    return <p>No table data available</p>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label={`table-${table.id || 'unknown'}`}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {table.columns.map((column, colIndex) => (
              <TableCell key={column.id || colIndex}>
                {removeColumns && <Checkbox
                  checked={selectedColumns[table.id]?.includes(colIndex) || false}
                  onChange={() => toggleColumnSelection(table.id, colIndex)}
                />}
                {column.name} {column.id}

                {column.columnInfo.referringToTableId && (
                <div>
                    <div>TableId: {column.columnInfo.referringToTableId}</div>
                    <div>ColumnId: {column.columnInfo.referringToColumnId || ''}</div>
                </div>
              )}
              {column.columnInfo.regex && (
                <div>Regex of type: {column.columnInfo.regex}</div>
              )}
              </TableCell>
            ))}
            {table.rows.length > 0 && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={table.columns.length + (table.rows.length > 0 ? 2 : 1)}>
              <strong>{table.name || 'Unnamed Table'} ID: {table.id || 'N/A'}</strong>
            </TableCell>
          </TableRow>
          {table.rows.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex}>
              <TableCell>{rowIndex + 1}</TableCell>
              {row.values.map((valueObject, colIndex) => (
                <TableCell key={colIndex}>
                  <CellRenderer
                    valueObject={valueObject || {}}
                    tableId={table.id}
                    onChange={(newValue, setError) => handleInputChange(table.id, rowIndex, colIndex, newValue, setError)}
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
              {removeColumns && <Button
                variant="contained"
                color="error"
                onClick={() => handleRemoveColumns(table.id)}
                sx={{ marginLeft: 2 }}
              >
                - Remove Columns
              </Button>}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRenderer;
