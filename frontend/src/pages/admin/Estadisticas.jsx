import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { obtenerTodasLasEstadisticas, obtenerIngresosHistoricos } from '../../API/estadisticasApi';

const Estadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ingresosHistoricos, setIngresosHistoricos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, historicosData] = await Promise.all([
        obtenerTodasLasEstadisticas(),
        obtenerIngresosHistoricos(page + 1, rowsPerPage)
      ]);
      
      console.log('Datos recibidos:', statsData);
      setStats(statsData);
      setIngresosHistoricos(historicosData.ingresos);
      setTotalIngresos(historicosData.total);
    } catch (error) {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al cargar las estadísticas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatMonto = (monto) => {
    const numero = Number(monto);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard de Estadísticas
        </Typography>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={fetchData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Ingresos Semanales */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ingresos Semanales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.ingresos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  name="Total ($)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_pedidos" 
                  stroke="#82ca9d" 
                  name="Cantidad de Pedidos"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Productos Más Vendidos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Ingresos ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.productosMasVendidos?.map((producto) => (
                    <TableRow key={producto.nombre}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell align="right">{producto.cantidad_total}</TableCell>
                      <TableCell align="right">${formatMonto(producto.ingresos_total)}</TableCell>
                    </TableRow>
                  ))}
                  {stats.productosMasVendidos?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Comparativa Semanal */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Comparativa Semanal
            </Typography>
            <Grid container spacing={2}>
              {stats.comparativaSemanal?.map((periodo) => (
                <Grid item xs={12} key={periodo.periodo}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {periodo.periodo}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Pedidos
                          </Typography>
                          <Typography variant="h6">
                            {periodo.total_pedidos}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Ventas
                          </Typography>
                          <Typography variant="h6">
                            ${formatMonto(periodo.total_ventas)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Ventas por Hora */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Hora
            </Typography>
            {stats.ventasPorHora?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar 
                    dataKey="total_ventas" 
                    fill="#8884d8" 
                    name="Ventas ($)"
                  />
                  <Bar 
                    dataKey="total_pedidos" 
                    fill="#82ca9d" 
                    name="Cantidad de Pedidos"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No hay datos disponibles
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Tabla de Ingresos Históricos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historial de Ingresos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Total Pedidos</TableCell>
                    <TableCell align="right">Total Ingresos</TableCell>
                    <TableCell align="right">Promedio por Pedido</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingresosHistoricos.map((ingreso) => (
                    <TableRow key={ingreso.fecha}>
                      <TableCell>
                        {new Date(ingreso.fecha).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {ingreso.total_pedidos}
                      </TableCell>
                      <TableCell align="right">
                        ${formatMonto(ingreso.total)}
                      </TableCell>
                      <TableCell align="right">
                        ${formatMonto(ingreso.total / ingreso.total_pedidos)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {ingresosHistoricos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalIngresos}
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Estadisticas; 