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

const Sidebar = () => {
  return (
    <Box sx={{ 
      width: 240,
      height: '100vh',
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <List>
        <NavLink to="/menu" style={{ textDecoration: 'none', color: 'inherit' }}>
  {({ isActive }) => (
    <ListItem button selected={isActive}>
      <ListItemIcon>
        <Inventory />
      </ListItemIcon>
      <ListItemText primary="Productos" />
    </ListItem>
  )}
</NavLink>
        
        {/* Ejemplo de otros items del menú */}
        <NavLink to="/pedidos-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItem button selected={isActive}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItem>
          )}
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to="/configuracion" style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default Sidebar;