import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchTable from './SearchTable';
import SignOutButton from './SignOut';
import { Button } from '@mui/material';
import NavigationHeader from './NavigationHeader';
import AccessedTablesPage from './AcessedTablesPage';
const UserPage = () => {
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();
    if (!user) {
        return <div>User data not found!</div>;
    }
    const handleAccessedTablesPage = () => {
        navigate("/accessedTables", {state : { user }});
    }

    return (
        <div>
            <NavigationHeader user ={user} isAdmin={false} />
            <h2>This is user page</h2>
            <h2>Welcome {user.email}</h2>
            <AccessedTablesPage excludeHeader={true}/>
        </div>
    );
};

export default UserPage;
