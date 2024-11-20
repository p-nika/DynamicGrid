const toggleRowSelection = (tableId, rowIndex, setSelectedRows) => {
    setSelectedRows((prevSelectedRows) => {
    const tableSelectedRows = prevSelectedRows[tableId] || [];
    const isSelected = tableSelectedRows.includes(rowIndex);

    return {
    ...prevSelectedRows,
    [tableId]: isSelected
        ? tableSelectedRows.filter((index) => index !== rowIndex)
        : [...tableSelectedRows, rowIndex],
    };
});
};

export default toggleRowSelection;
