import React from 'react';
import { useLocation } from 'react-router-dom';
import TableCreation from '../TableCreation'; // Replace with the actual TableCreation component path
import FetchTables from './FetchTables'; // Replace with the actual FetchTables component path
import NavigationHeader from './NavigationHeader';

const EditTablePage = () => {
    const location = useLocation();
    const { user, isAdmin, tableId } = location.state || {};

    if (!user || tableId == null) {
        return <p>Error: Missing required data.</p>;
    }

    return (
        <div>
            <NavigationHeader user={user} isAdmin={isAdmin}/>
            <FetchTables
                    id={tableId}
                    removeColumns={isAdmin}
                    addColumn={isAdmin}
                    rowId = {0}
                    editRows = {true}
            />
        </div>
    );
};

export default EditTablePage;
