import { deleteRows } from '../Api/tableApi';
import { fetchTables } from '../Api/tableApi';

const handleRemoveRows = async (tableId, selectedRows, setTables, setSelectedRows) => {
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

export default handleRemoveRows;
