import React, { useEffect, useState } from 'react';
import { fetchTables, addRow, deleteRows, updateCell } from '../Api/tableApi';
import TableRenderer from './TableRenderer';
import TableCreation from '../TableCreation';
import AddColumn from '../ColumnCreation';


const FetchTables = () => {
  const [tables, setTables] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    const reloadTables = async () => {
      try {
        const data = await fetchTables();
        setTables(data);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      }
    };

    reloadTables();
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
      await updateCell(tableId, rowIndex, colIndex, newValue);
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
      await addRow(tableId, newRow.values);
      const data = await fetchTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

  const handleRemoveRows = async (tableId) => {
    const rowIndexes = (selectedRows[tableId] || []).map((index) => index + 1);

    try {
      await deleteRows(tableId, rowIndexes);
      const data = await fetchTables();
      setTables(data);
      setSelectedRows((prevSelectedRows) => ({
        ...prevSelectedRows,
        [tableId]: [],
      }));
    } catch (error) {
      console.error('Failed to delete rows:', error);
    }
  };

  const toggleRowSelection = (tableId, rowIndex) => {
    setSelectedRows((prevSelectedRows) => {
      const tableSelectedRows = prevSelectedRows[tableId] || [];
      const isSelected = tableSelectedRows.includes(rowIndex);

      return {
        ...prevSelectedRows,
        [tableId]: isSelected
          ? tableSelectedRows.filter((index) => index !== rowIndex)
          : [...tableSelectedRows, rowIndex],
      };
    });
  };

  return (
    <div>
      <TableCreation reloadTables={() => fetchTables().then(setTables)} />
      <AddColumn reloadTables={() => fetchTables().then(setTables)} />

      {tables.map((table) => (
        <TableRenderer
          key={table.id}
          table={table}
          handleInputChange={handleInputChange}
          toggleRowSelection={toggleRowSelection}
          handleAddRow={handleAddRow}
          handleRemoveRows={handleRemoveRows}
          selectedRows={selectedRows}
        />
      ))}
    </div>
  );
};

export default FetchTables;
