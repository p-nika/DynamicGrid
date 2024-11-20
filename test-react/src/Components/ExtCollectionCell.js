import React, { useEffect, useState } from 'react';
import { getExtColumnInfo } from "../Api/tableApi";

const ExtCollectionCell = ({
    valueObject,
    onChange,
}) => {
    const [externalData, setExternalData] = useState(null);
    useEffect(() => {
        const fetchExtColumnInfo = async () => {
            try {
                const data = await getExtColumnInfo(valueObject.rowId, valueObject.colInd);
                setExternalData(data); 
            } catch (error) {
                console.error('Failed to fetch external column info:', error);
            }
        };

        fetchExtColumnInfo();
    }, [valueObject.rowId, valueObject.colInd]);

    return (
        <div>
            {externalData ? (
                <div>
                    <p>Referring Table ID: {externalData.columnInfo.referringToTableId}</p>
                    <p>Referring Column ID: {externalData.columnInfo.referringToColumnId}</p>
                </div>
            ) : (
                <p>Loading external collection info...</p>
            )}
        </div>
    );
};

export default ExtCollectionCell;
