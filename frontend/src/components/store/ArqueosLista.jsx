import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  TextField
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { obtenerArqueosPorFecha } from '../../API/arqueoApi';

const ArqueosLista = () => {
  const [arqueos, setArqueos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const fetchArqueos = async (fecha) => {
    setLoading(true);
    setError(null);
    try {
      const fechaFormateada = fecha.toISOString().split('T')[0];
      const data = await obtenerArqueosPorFecha(fechaFormateada);
      setArqueos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar los arqueos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArqueos(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const formatMonto = (monto) => {
    const numero = Number(monto);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ p: 3, m: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Historial de Arqueos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DatePicker
              label="Seleccionar fecha"
              value={fechaSeleccionada}
              onChange={(newValue) => setFechaSeleccionada(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <Tooltip title="Actualizar">
              <IconButton onClick={() => fetchArqueos(fechaSeleccionada)}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && arqueos.length === 0 ? (
          <Alert severity="info">
            No hay arqueos registrados para esta fecha
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hora</TableCell>
                  <TableCell align="right">Total Contado</TableCell>
                  <TableCell align="right">Caja Chica</TableCell>
                  <TableCell align="right">Total Sistema</TableCell>
                  <TableCell align="right">Diferencia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Observaciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arqueos.map((arqueo) => (
                  <TableRow key={arqueo.id}>
                    <TableCell>
                      {new Date(arqueo.fecha).toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">
                      ${formatMonto(arqueo.total_contado)}
                    </TableCell>
                    <TableCell align="right">
                      ${formatMonto(arqueo.caja_chica)}
                    </TableCell>
                    <TableCell align="right">
                      ${formatMonto(arqueo.total_sistema)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={arqueo.diferencia === 0 ? 'success.main' : 'error.main'}
                      >
                        ${formatMonto(arqueo.diferencia)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={arqueo.estado}
                        color={
                          arqueo.estado === 'cuadrado' ? 'success' :
                          arqueo.estado === 'sobrante' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{arqueo.nombre_usuario}</TableCell>
                    <TableCell>{arqueo.observaciones}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default ArqueosLista; 