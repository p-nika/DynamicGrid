import React, { useEffect, useState } from 'react';
import { getExtColumnInfo } from "../Api/tableApi";
import axios from 'axios';
import ExtCollectionDiagram from './ExtCollectionDiagram.js';

const ExtCollectionCell = ({
    valueObject,
    tableId,
    onChange,
    viewOnly,
}) => {
    const [externalData, setExternalData] = useState(null);
    const [rowIds, setRowIds] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [referringRowIds, setReferringRowIds] = useState([]);
    const [hoveredRowId, setHoveredRowId] = useState(null);

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
                setRowIds(response.data);
            } catch (error) {
                console.error('Failed to fetch row IDs:', error);
            }
        }
    };

    useEffect(() => {
        fetchRowIds();
    }, [externalData]);
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
                referringRowId: selectedRowId,
            });
            setReferringRowIds((prev) => [...prev, selectedRowId]);
            console.log('Item added successfully');
            await fetchRowIds();
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const handleRemoveItem = async (referringId) => {
        try {
            console.log(`table id: ${tableId} rowId: ${valueObject.rowId} colInd=${valueObject.colInd} referring=${referringId}`);
            await axios.delete(`http://localhost:7001/api/Table/remove-ext-value`, {
                data: { TableId: tableId, RowId: valueObject.rowId, ColInd: valueObject.colInd, ReferringRowId: referringId },
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Item removed successfully');
            setReferringRowIds((prev) => prev.filter((id) => id !== referringId));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '1rem' }}>
                {referringRowIds.map((id, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                        }}
                        onMouseEnter={() => setHoveredRowId(id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                    >
                        <div
                            style={{
                                border: '1px solid #ccc',
                                padding: '0.5rem',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <span>
                                {
                                    rowIds.find((row) => row.rowId === Number(id))?.value || "Unknown Value"
                                }
                            </span>

                            {!viewOnly && <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(id);
                                }}
                                style={{
                                    marginLeft: '1rem',
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.6rem',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                Remove
                            </button>}
                        </div>
                        {hoveredRowId === id && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '0',
                                    transform: 'translateX(0)',
                                    zIndex: 10,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    padding: '1rem',
                                    marginTop: '0.5rem',
                                    width: '400px',
                                    height: '250px',
                                }}
                            >
                                <ExtCollectionDiagram
                                    tableId={externalData?.columnInfo?.referringToTableId}
                                    rowId={id}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {!viewOnly && <div>
                <select
                    onClick={() => {}}
                    onChange={(e) => setSelectedRowId(e.target.value)}
                >
                    <option value="" disabled selected>
                        Select a Row
                    </option>
                    {rowIds.map((row) => (
                        <option key={row.rowId} value={row.rowId}>
                            {row.value}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddItem}>Add Item</button>
            </div>}
        </div>
    );
};

export default ExtCollectionCell;
