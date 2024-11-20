import { addRow } from '../Api/tableApi';
import { fetchTables } from '../Api/tableApi';

const handleAddRow = async (tableId, setTables) => {
    try {
      await addRow(tableId);
      const data = await fetchTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

export default handleAddRow;
