import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import FetchTable from './FetchTables';
import NavigationHeader from './NavigationHeader';
import { useLocation } from 'react-router-dom';

const UserPermissionsPage = () => {
  const location = useLocation();
  const { user, isAdmin } = location.state;
  return (
    <div>
      <NavigationHeader user = {user} isAdmin = {isAdmin} />
        <p>User Permissions: </p>
        <FetchTable id ={1} addColumn={false} removeColumns={false} editRows={true} rowId={0}/>
    </div>
  );
};

export default UserPermissionsPage;
