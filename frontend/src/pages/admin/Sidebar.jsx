// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import {
  Inventory,
  ListAlt,
  Settings,
  History,
  AccountBalanceWallet,
  Assessment
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
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary="Productos" />
            </ListItemButton>
          )}
        </NavLink>
        
        <NavLink to="/pedidos-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Pedidos Activos" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink to="/pedidos-cancelados" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText primary="Pedidos Cancelados" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink to="/historial-pedidos" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText primary="Historial de Pedidos" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink to="/resumen-caja" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <AccountBalanceWallet />
              </ListItemIcon>
              <ListItemText primary="Resumen de Caja" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink to="/arqueos" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Historial de Arqueos" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink to="/estadisticas" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Estadísticas" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to="/configuracion" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </NavLink>
      </List>
    </Box>
  );
};

export default Sidebar;