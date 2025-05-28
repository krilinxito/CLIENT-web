import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Typography,
  Grid,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { obtenerTodosLosPedidos } from '../../API/pedidosApi';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    estado: '',
    usuario: ''
  });
  const [error, setError] = useState(null);

  const estados = ['pendiente', 'completado', 'cancelado', 'pagado'];

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Crear una copia de los filtros
      const filtrosLimpios = {};
      
      // Procesar cada filtro
      Object.entries(filtros).forEach(([key, value]) => {
        if (value != null && value !== '') {
          // Formatear fechas
          if (key === 'fechaInicio' || key === 'fechaFin') {
            filtrosLimpios[key] = value instanceof Date ? value.toISOString().split('T')[0] : value;
          } else {
            filtrosLimpios[key] = value;
          }
        }
      });
      
      const response = await obtenerTodosLosPedidos(
        page + 1,
        rowsPerPage,
        filtrosLimpios
      );
      
      setPedidos(response.pedidos || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      let mensajeError = 'Error al cargar los pedidos';
      if (error.response) {
        if (error.response.status === 500) {
          mensajeError = 'Error interno del servidor. Por favor, intente más tarde.';
        } else if (error.response.data?.message) {
          mensajeError = error.response.data.message;
        }
      }
      setError(mensajeError);
      setPedidos([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFiltrar = () => {
    setPage(0);
    fetchPedidos();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      estado: '',
      usuario: ''
    });
    setPage(0);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      completado: 'success',
      cancelado: 'error',
      pagado: 'info'
    };
    return colores[estado] || 'default';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Historial de Pedidos
          </Typography>
          
          {/* Filtros */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid xs={12} sm={6} md={3}>
              <DatePicker
                label="Fecha inicio"
                value={filtros.fechaInicio}
                onChange={(newValue) => setFiltros(prev => ({ ...prev, fechaInicio: newValue }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <DatePicker
                label="Fecha fin"
                value={filtros.fechaFin}
                onChange={(newValue) => setFiltros(prev => ({ ...prev, fechaFin: newValue }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Estado"
                value={filtros.estado}
                onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              >
                <MenuItem value="">Todos</MenuItem>
                {estados.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Usuario"
                value={filtros.usuario}
                onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} md={2} sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleFiltrar}
                startIcon={<SearchIcon />}
              >
                Filtrar
              </Button>
              <Button
                variant="outlined"
                onClick={handleLimpiarFiltros}
              >
                Limpiar
              </Button>
              <Tooltip title="Actualizar">
                <IconButton onClick={fetchPedidos}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Tabla */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell align="right">Total Pagado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : pedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No hay pedidos que coincidan con los filtros</TableCell>
                  </TableRow>
                ) : (
                  pedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{formatearFecha(pedido.fecha)}</TableCell>
                      <TableCell>{pedido.nombre_pedido}</TableCell>
                      <TableCell>{pedido.nombre_usuario}</TableCell>
                      <TableCell>
                        <Chip 
                          label={pedido.estado} 
                          color={getEstadoColor(pedido.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {pedido.productos || 'Sin productos'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        ${Number(pedido.total_pagado).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default HistorialPedidos; 