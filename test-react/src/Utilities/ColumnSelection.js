const toggleColumnSelection = (tableId, colIndex, setSelectedColumns) => {
    setSelectedColumns((prevSelectedColumns) => {
      const tableSelectedColumns = prevSelectedColumns[tableId] || [];
      const isSelected = tableSelectedColumns.includes(colIndex);

      return {
        ...prevSelectedColumns,
        [tableId]: isSelected
          ? tableSelectedColumns.filter((index) => index !== colIndex)
          : [...tableSelectedColumns, colIndex],
      };
    });
  };
  
  export default toggleColumnSelection;
  