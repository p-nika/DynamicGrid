import { addRow } from '../Api/tableApi';

const AddRow = async (tableId, tables, setTables) => {
  const newRow = {
    values: tables
      .find((table) => table.id === tableId)
      .columns.map(() => ({ value: '' })),
  };

  try {
    await addRow(tableId, newRow.values);

    // Reload tables after successful row addition
    const updatedTables = tables.map((table) =>
      table.id === tableId
        ? {
            ...table,
            rows: [...table.rows, newRow],
          }
        : table
    );

    setTables(updatedTables);
  } catch (error) {
    console.error('Failed to add row:', error);
  }
};

export default AddRow;
