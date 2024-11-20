import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api/Table';

export const fetchTables = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-tables`);
  return response.data;
};

export const addRow = async (tableId, values) => {
  await axios.post(`${API_BASE_URL}/add-row`, { TableId: tableId, Values: values });
};

export const deleteRows = async (tableId, rowInds) => {
  await axios.delete(`${API_BASE_URL}/delete-row`, {
    data: { TableId: tableId, RowInds: rowInds },
    headers: { 'Content-Type': 'application/json' },
  });
};

export const updateCell = async (tableId, rowIndex, colIndex, newValue) => {
  await axios.patch(`${API_BASE_URL}/change-cell`, {
    TableId: tableId,
    RowInd: rowIndex + 1,
    ColInd: colIndex + 1,
    Value: newValue,
  });
};
