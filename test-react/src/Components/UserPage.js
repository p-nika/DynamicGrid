import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchTable from './SearchTable';
import SignOutButton from './SignOut';
import { Button } from '@mui/material';
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
            <h2>Welcome</h2>
            <h2>{user.email}</h2>
            <SignOutButton />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Button
                variant="contained"
                color="secondary"
                onClick={handleAccessedTablesPage}
                >
                Go to Tables Page
                </Button>
            </div>
        </div>
    );
};

export default UserPage;
