import { deleteRows } from '../Api/tableApi';
import { fetchTable } from '../Api/tableApi';

const handleRemoveRows = async (tableId, selectedRows, setTable, setSelectedRows) => {
    const rowIndexes = (selectedRows[tableId] || []).map((index) => index + 1);

    try {
      await deleteRows(tableId, rowIndexes);
      const data = await fetchTable(tableId);
      setTable(data);
      setSelectedRows((prevSelectedRows) => ({
        ...prevSelectedRows,
        [tableId]: [],
      }));
    } catch (error) {
      console.error('Failed to delete rows:', error);
    }
  };

export default handleRemoveRows;
