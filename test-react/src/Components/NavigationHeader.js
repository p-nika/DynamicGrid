import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const NavigationHeader = ({ user, isAdmin }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, {
      state: { user, isAdmin, includeHeader:true}
    });
  };
  const handleHomeNavigation = () => {
    if (isAdmin) {
      navigate('/admin', { state: { user, isAdmin } });
    } else {
      navigate('/user', { state: { user, isAdmin } });
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Panel
        </Typography>
        <Button color="inherit" onClick={() => handleHomeNavigation()}>
          Home
        </Button>
        <Button color="inherit" onClick={() => handleNavigation('/accessedTables')}>
          Tables
        </Button>
        {isAdmin && <Button color="inherit" onClick={() => handleNavigation('/userpermissions')}>
          User Permissions
        </Button>}
        <Button color="inherit" onClick={() => handleNavigation('/authentication')}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationHeader;
