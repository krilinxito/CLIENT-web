// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import {
  Inventory,
  ListAlt,
  Settings,
  Dashboard
} from '@mui/icons-material';

const UserSidebar = () => {
  return (
    <Box sx={{ 
      width: 240,
      height: '100vh',
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <List>
        
        {/* Ejemplo de otros items del menú */}
      
        
        <Divider sx={{ my: 1 }} />
        
        <NavLink to="/usuario" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItem>
        </NavLink>
      </List>
    </Box>
  );
};

export default UserSidebar;