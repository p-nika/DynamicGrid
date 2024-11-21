import { deleteColumns } from '../Api/tableApi';
import { fetchTable } from '../Api/tableApi';

const handleRemoveColumns = async (tableId, selectedColumns, setTable, setSelectedColumns) => {
    const columnIndexes = (selectedColumns[tableId] || []).map((index) => index + 1);

    try {
        await deleteColumns(tableId, columnIndexes);
        const data = await fetchTable(tableId);
        setTable(data);
        setSelectedColumns((prevSelectedColumns) => ({
        ...prevSelectedColumns,
        [tableId]: [],
        }));
    } catch (error) {
        console.error('Failed to delete columns:', error);
    }
};

export default handleRemoveColumns;
