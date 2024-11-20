import React, { useEffect, useState } from 'react';
import { fetchTables } from '../Api/tableApi';
import TableRenderer from './TableRenderer';
import TableCreation from '../TableCreation';
import AddColumn from '../ColumnCreation';
import toggleRowSelection from '../Utilities/RowSelection';
import toggleColumnSelection from '../Utilities/ColumnSelection';
import handleRemoveColumns from '../Utilities/HandleRemoveColumns';
import handleRemoveRows from '../Utilities/HandleRemoveRows';
import handleAddRow from '../Utilities/HandleAddRow';
import handleInputChange from '../Utilities/HandleCellChange';


const FetchTables = () => {
  const [tables, setTables] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedColumns, setSelectedColumns] = useState({});

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

  return (
    <div>
      <TableCreation reloadTables={() => fetchTables().then(setTables)} />
      <AddColumn reloadTables={() => fetchTables().then(setTables)} />

      {tables.map((table) => (
        <TableRenderer
          key={table.id}
          table={table}
          handleInputChange={(tableId, rowIndex, colIndex, newValue) => handleInputChange(tableId, rowIndex, colIndex, newValue, setTables)}
          toggleRowSelection={(tableId, rowIndex) => toggleRowSelection(tableId, rowIndex, setSelectedRows)}
          handleAddRow={(tableId) => handleAddRow(tableId, setTables)}
          handleRemoveRows={(tableId) => handleRemoveRows(tableId, selectedRows, setTables, setSelectedRows)}
          handleRemoveColumns={(tableId) => handleRemoveColumns(tableId, selectedColumns, setTables, setSelectedColumns)} 
          selectedRows={selectedRows}
          selectedColumns={selectedColumns} 
          toggleColumnSelection={(tableId, colIndex) => toggleColumnSelection(tableId, colIndex, setSelectedColumns)} 
        />
      ))}
    </div>
  );
};

export default FetchTables;
