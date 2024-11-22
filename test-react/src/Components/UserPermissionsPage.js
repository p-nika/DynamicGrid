import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import FetchTable from './FetchTables';

const UserPermissionsPage = () => {

  return (
    <div>
        <p>User Permissions: </p>
        <FetchTable id ={1} addColumn={false} removeColumns={false}/>
    </div>
  );
};

export default UserPermissionsPage;
