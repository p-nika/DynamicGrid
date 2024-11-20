import { updateCell } from '../Api/tableApi';

const handleInputChange = async (tableId, rowIndex, colIndex, newValue, setTables) => {
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

export default handleInputChange;
