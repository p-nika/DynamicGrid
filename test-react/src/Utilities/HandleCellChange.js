import { updateCell } from '../Api/tableApi';

const handleInputChange = async (tableId, rowIndex, colIndex, newValue, setTable, setError) => {
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
    setError(null);
  } catch (error) {
    setError(error.response?.data || 'Failed to update the cell');
  }
};

export default handleInputChange;
