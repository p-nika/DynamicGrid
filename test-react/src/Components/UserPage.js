import React from 'react';
import { useLocation} from 'react-router-dom';
import NavigationHeader from './NavigationHeader';
import AccessedTablesPage from './AcessedTablesPage';
const UserPage = () => {
    const location = useLocation();
    const user = location.state?.user;
    if (!user) {
        return <div>User data not found!</div>;
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
