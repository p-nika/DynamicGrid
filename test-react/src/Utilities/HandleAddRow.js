import { addRow } from '../Api/tableApi';
import { fetchTable } from '../Api/tableApi';

const handleAddRow = async (tableId, setTable) => {
    try {
      await addRow(tableId);
      const data = await fetchTable(tableId);
      setTable(data);
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

export default handleAddRow;
