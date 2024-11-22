import React, { useEffect, useState } from 'react';
import { fetchTable } from '../Api/tableApi';
import TableRenderer from './TableRenderer';
import AddColumn from '../ColumnCreation';
import toggleRowSelection from '../Utilities/RowSelection';
import toggleColumnSelection from '../Utilities/ColumnSelection';
import handleRemoveColumns from '../Utilities/HandleRemoveColumns';
import handleRemoveRows from '../Utilities/HandleRemoveRows';
import handleAddRow from '../Utilities/HandleAddRow';
import handleInputChange from '../Utilities/HandleCellChange';

const FetchTable = ({ id }) => {
  const [table, setTable] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedColumns, setSelectedColumns] = useState({});
  useEffect(() => {
    const reloadTable = async () => {
      try {
        const data = await fetchTable(id);
        setTable(data);
      } catch (error) {
        console.error('Failed to fetch table:', error);
      }
    };

    reloadTable();
  }, [id]);

  const reloadTable = async () => {
    try {
      const data = await fetchTable(id);
      setTable(data);
    } catch (error) {
      console.error('Failed to fetch table:', error);
    }
  };

  return (
    <div style={{ width: '100%', marginTop: '10px' }}> 
      <AddColumn tableName = {table.name} reloadTable={reloadTable} style={{ marginBottom: '10px' }} /> 
      <TableRenderer
        key={table.id}
        table={table}
        handleInputChange={(tableId, rowIndex, colIndex, newValue, setError) =>
          handleInputChange(tableId, rowIndex, colIndex, newValue, setTable, setError)
        }
        toggleRowSelection={(tableId, rowIndex) =>
          toggleRowSelection(tableId, rowIndex, setSelectedRows)
        }
        handleAddRow={(tableId) => handleAddRow(tableId, setTable)}
        handleRemoveRows={(tableId) =>
          handleRemoveRows(tableId, selectedRows, setTable, setSelectedRows)
        }
        handleRemoveColumns={(tableId) =>
          handleRemoveColumns(tableId, selectedColumns, setTable, setSelectedColumns)
        }
        selectedRows={selectedRows}
        selectedColumns={selectedColumns}
        toggleColumnSelection={(tableId, colIndex) =>
          toggleColumnSelection(tableId, colIndex, setSelectedColumns)
        }
      />
    </div>
  );
};

export default FetchTable;
