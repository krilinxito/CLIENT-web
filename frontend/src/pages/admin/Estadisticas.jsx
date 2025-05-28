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
  TablePagination,
  Modal,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 1200,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  height: '80vh',
  display: 'flex',
  flexDirection: 'column'
};

const Estadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ingresosHistoricos, setIngresosHistoricos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const handleOpenModal = (chartType, title) => {
    setSelectedChart({ type: chartType, title });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedChart(null);
  };

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

  const renderExpandedChart = () => {
    if (!selectedChart) return null;

    const commonProps = {
      width: "100%",
      height: "100%"
    };

    switch (selectedChart.type) {
      case 'ingresos':
        return (
          <LineChart data={stats.ingresos} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total ($)" strokeWidth={2} />
            <Line type="monotone" dataKey="total_pedidos" stroke="#82ca9d" name="Cantidad de Pedidos" strokeWidth={2} />
          </LineChart>
        );
      case 'ventasHora':
        return (
          <BarChart data={stats.ventasPorHora} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" name="Ventas ($)" />
            <Bar dataKey="total_pedidos" fill="#82ca9d" name="Cantidad de Pedidos" />
          </BarChart>
        );
      default:
        return null;
    }
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
        {/* Resumen General - Primera fila */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen Semanal
              </Typography>
              {stats.comparativaSemanal?.map((periodo) => (
                <Box key={periodo.periodo} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    {periodo.periodo}
                  </Typography>
                  <Typography>
                    Pedidos: {periodo.total_pedidos}
                  </Typography>
                  <Typography>
                    Ventas: ${formatMonto(periodo.total_ventas)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Ingresos Semanales
              </Typography>
              <IconButton onClick={() => handleOpenModal('ingresos', 'Ingresos Semanales')}>
                <FullscreenIcon />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.ingresos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total ($)" strokeWidth={2} />
                <Line type="monotone" dataKey="total_pedidos" stroke="#82ca9d" name="Cantidad de Pedidos" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Productos y Ventas por Hora - Segunda fila */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Ventas por Hora
              </Typography>
              <IconButton onClick={() => handleOpenModal('ventasHora', 'Ventas por Hora')}>
                <FullscreenIcon />
              </IconButton>
            </Box>
            {stats.ventasPorHora?.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="total_ventas" fill="#8884d8" name="Ventas ($)" />
                  <Bar dataKey="total_pedidos" fill="#82ca9d" name="Cantidad de Pedidos" />
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

        {/* Historial de Ingresos - Tercera fila */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
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

      {/* Modal para gráficos expandidos */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-chart"
        aria-describedby="modal-chart-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{selectedChart?.title}</Typography>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer>
              {renderExpandedChart()}
            </ResponsiveContainer>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Estadisticas; 