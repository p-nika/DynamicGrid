import { deleteRows } from '../Api/tableApi';

const RemoveRows = async (tableId, selectedRows, tables, setTables, setSelectedRows) => {
  const rowIndexes = (selectedRows[tableId] || []).map((index) => index + 1);

  try {
    await deleteRows(tableId, rowIndexes);

    // Reload tables after successful row deletion
    const updatedTables = tables.map((table) =>
      table.id === tableId
        ? {
            ...table,
            rows: table.rows.filter((_, rowIndex) => !selectedRows[tableId]?.includes(rowIndex)),
          }
        : table
    );

    setTables(updatedTables);

    // Clear selected rows for the current table
    setSelectedRows((prev) => ({
      ...prev,
      [tableId]: [],
    }));
  } catch (error) {
    console.error('Failed to delete rows:', error);
  }
};

export default RemoveRows;
