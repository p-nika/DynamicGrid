import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

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
  editRows,
  viewOnly,
}) => {
  const [columnInfo, setColumnInfo] = useState({});

  useEffect(() => {
    if (table && table.columns) {
      const fetchColumnInfo = async (column) => {
        if (column.columnInfo.referringToTableId && column.columnInfo.referringToColumnId) {
          const { referringToTableId, referringToColumnId } = column.columnInfo;
          try {
            const response = await axios.get(`http://localhost:7001/api/Table/get-column-info/${referringToTableId}/${referringToColumnId}`);
            setColumnInfo((prev) => ({
              ...prev,
              [`${referringToTableId}-${referringToColumnId}`]: response.data
            }));
          } catch (error) {
            console.error('Failed to fetch column info:', error);
          }
        }
      };
      table.columns.forEach((column) => fetchColumnInfo(column));
    }
  }, [table]);

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
                {removeColumns && (
                  <Checkbox
                    checked={selectedColumns[table.id]?.includes(colIndex) || false}
                    onChange={() => toggleColumnSelection(table.id, colIndex)}
                  />
                )}
                {column.name}

                {column.columnInfo.referringToTableId && (
                  <div>
                    {columnInfo[`${column.columnInfo.referringToTableId}-${column.columnInfo.referringToColumnId}`] && (
                      <div>
                        <div>
                          TableName: {columnInfo[`${column.columnInfo.referringToTableId}-${column.columnInfo.referringToColumnId}`].tableName}
                        </div>
                        <div>
                          ColumnName: {columnInfo[`${column.columnInfo.referringToTableId}-${column.columnInfo.referringToColumnId}`].columnName}
                        </div>
                      </div>
                    )}
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
              <strong>{table.name || 'Unnamed Table'}</strong>
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
                    viewOnly={viewOnly}
                  />
                </TableCell>
              ))}
              <TableCell>
                {editRows && (
                  <Checkbox
                    checked={selectedRows[table.id]?.includes(rowIndex) || false}
                    onChange={() => toggleRowSelection(table.id, rowIndex)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={table.columns.length + 3} align="center">
              {editRows && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAddRow(table.id)}
                >
                  + Add Row
                </Button>
              )}
              {editRows && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveRows(table.id)}
                  sx={{ marginLeft: 2 }}
                >
                  - Remove Rows
                </Button>
              )}
              {removeColumns && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveColumns(table.id)}
                  sx={{ marginLeft: 2 }}
                >
                  - Remove Columns
                </Button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRenderer;
