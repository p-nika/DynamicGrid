import React, { useEffect, useState } from 'react';
import { getExtColumnInfo } from "../Api/tableApi";
import axios from 'axios';

const ExtCollectionCell = ({
    valueObject,
    tableId,
    onChange,
}) => {
    const [externalData, setExternalData] = useState(null);
    const [rowIds, setRowIds] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [referringRowIds, setReferringRowIds] = useState([]);

    useEffect(() => {
        const fetchExtColumnInfo = async () => {
            try {
                const data = await getExtColumnInfo(valueObject.rowId, valueObject.colInd);
                setExternalData(data);
                const parsedValue = JSON.parse(valueObject.value);
                setReferringRowIds(parsedValue.ReferringRowIds || []);
            } catch (error) {
                console.error('Failed to fetch external column info:', error);
            }
        };

        fetchExtColumnInfo();
    }, [valueObject.rowId, valueObject.colInd, valueObject.value]);

    const fetchRowIds = async () => {
        if (externalData) {
            const { referringToTableId, referringToColumnId } = externalData.columnInfo;
            try {
                const response = await axios.get(`http://localhost:7001/api/Table/get-col-values/${referringToTableId}/${referringToColumnId}`);
                setRowIds(response.data); // Assuming the API returns an array of row objects
            } catch (error) {
                console.error('Failed to fetch row IDs:', error);
            }
        }
    };

    const handleAddItem = async () => {
        if (!selectedRowId) {
            console.error('No row selected!');
            return;
        }

        try {
            await axios.post('http://localhost:7001/api/Table/add-ext-value', {
                tableId,
                rowId: valueObject.rowId,
                colInd: valueObject.colInd,
                referringRowId: selectedRowId, // Pass selected row ID
            });

            // Update ReferringRowIds to add the new row
            setReferringRowIds((prev) => [...prev, selectedRowId]);
            console.log('Item added successfully');
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '1rem' }}>
                {referringRowIds.map((id, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #ccc',
                            padding: '0.5rem',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                        }}
                        onClick={() => console.log(`Clicked on: ${id}`)}
                    >
                        {id}
                    </div>
                ))}
            </div>
            <div>
                {externalData ? (
                    <>
                        <select
                            onClick={fetchRowIds} // Fetch row IDs when dropdown is clicked
                            onChange={(e) => setSelectedRowId(e.target.value)} // Set selectedRowId to the selected option's value
                        >
                            <option value="" disabled selected>
                                Select a Row
                            </option>
                            {rowIds.map((row) => (
                                <option key={row.rowId} value={row.rowId}>
                                    {row.rowId} {row.value}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAddItem}>Add Item</button>
                    </>
                ) : (
                    <p>Loading external collection info...</p>
                )}
            </div>
        </div>
    );
};

export default ExtCollectionCell;
