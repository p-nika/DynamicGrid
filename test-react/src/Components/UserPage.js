import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchTable from './SearchTable';
import SignOutButton from './SignOut';
const UserPage = () => {
    const location = useLocation();
    const user = location.state?.user;
    if (!user) {
        return <div>User data not found!</div>;
    }

    return (
        <div>
            <h2>Welcome</h2>
            <h2>{user.email}</h2>
            <SignOutButton />
            <div style={{ width: '100%' }}>
                <SearchTable email={user.email} />
            </div>
        </div>
    );
};

export default UserPage;
