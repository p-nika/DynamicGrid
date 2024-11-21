import { updateCell } from '../Api/tableApi';

const handleInputChange = async (tableId, rowIndex, colIndex, newValue, setTable) => {
  setTable((prevTable) => ({
    ...prevTable,
    rows: prevTable.rows.map((row, rowInd) =>
      rowInd === rowIndex
        ? {
            ...row,
            values: row.values.map((value, colInd) =>
              colInd === colIndex ? { ...value, value: newValue } : value
            ),
          }
        : row
    ),
  }));

  try {
    await updateCell(tableId, rowIndex, colIndex, newValue);
  } catch (error) {
    console.error('Failed to update cell:', error);
  }
};

export default handleInputChange;
