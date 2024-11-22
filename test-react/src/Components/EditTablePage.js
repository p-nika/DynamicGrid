import React from 'react';
import { useLocation } from 'react-router-dom';
import TableCreation from '../TableCreation'; // Replace with the actual TableCreation component path
import FetchTables from './FetchTables'; // Replace with the actual FetchTables component path

const EditTablePage = () => {
    const location = useLocation();
    const { user, isAdmin, tableId } = location.state || {};

    if (!user || tableId == null) {
        return <p>Error: Missing required data.</p>;
    }

    return (
        <div>
            <FetchTables
                    id={tableId}
                    removeColumns={isAdmin}
                    addColumn={isAdmin}
            />
        </div>
    );
};

export default EditTablePage;
