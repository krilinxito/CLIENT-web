import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Snackbar,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import OnlinePaymentIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { PDFViewer } from '@react-pdf/renderer';
import { obtenerResumenDeCaja } from '../../API/cajaApi';
import { obtenerPedidosDelDia } from '../../API/pedidosApi';
import { crearArqueo, obtenerUltimoArqueo } from '../../API/arqueoApi';
import ResumenCajaPDF from '../pdf/ResumenCajaPDF';

const DENOMINACIONES = [
  { valor: 200, tipo: 'Billete' },
  { valor: 100, tipo: 'Billete' },
  { valor: 50, tipo: 'Billete' },
  { valor: 20, tipo: 'Billete' },
  { valor: 10, tipo: 'Billete' },
  { valor: 5, tipo: 'Billete' },
  { valor: 2, tipo: 'Moneda' },
  { valor: 1, tipo: 'Moneda' }
];

const ResumenCaja = () => {
  const [resumen, setResumen] = useState({
    totalDia: 0,
    totalEfectivo: 0,
    totalTarjeta: 0,
    totalQR: 0,
    totalOnline: 0,
    fecha: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [mostrarSoloCancelados, setMostrarSoloCancelados] = useState(true);
  const [datosCompletos, setDatosCompletos] = useState({
    pagos: [],
    pedidos: []
  });
  const [conteo, setConteo] = useState(
    DENOMINACIONES.reduce((acc, den) => ({
      ...acc,
      [den.valor]: 0
    }), {})
  );
  const [cajaChica, setCajaChica] = useState(0);
  const [diferencia, setDiferencia] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  // Función para formatear fecha en formato La Paz
  const formatearFecha = (fecha) => {
    try {
      // Convertir a zona horaria de La Paz
      const fechaLaPaz = new Date(new Date(fecha).toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
      return fechaLaPaz.toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Función para obtener solo la fecha (sin hora) en La Paz
  const obtenerFechaLaPaz = () => {
    const fecha = new Date();
    // Convertir a zona horaria de La Paz
    const fechaLaPaz = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
    
    try {
      return fechaLaPaz.toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
      });
    } catch (error) {
      console.error('Error generando fecha La Paz:', error);
      return fecha.toLocaleDateString('es-BO');
    }
  };

  // Función para verificar si una fecha UTC está en el día actual
  const esDelDiaActual = (fechaUTC) => {
    try {
      const fechaPedidoLaPaz = new Date(new Date(fechaUTC).toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
      const fechaHoyLaPaz = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
      
      return fechaPedidoLaPaz.getFullYear() === fechaHoyLaPaz.getFullYear() &&
             fechaPedidoLaPaz.getMonth() === fechaHoyLaPaz.getMonth() &&
             fechaPedidoLaPaz.getDate() === fechaHoyLaPaz.getDate();
    } catch (error) {
      console.error('Error comparando fechas:', error);
      return false;
    }
  };

  const calcularResumen = (pagos, pedidos) => {
    // Crear un mapa de pedidos para búsqueda más eficiente
    const pedidosMap = new Map(pedidos.map(pedido => [pedido.id, pedido]));

    // Filtrar pagos según el estado seleccionado y la fecha local
    const pagosFiltrados = pagos.filter(pago => {
      const idPedido = pago.id_pedido || pago.idPedido;
      // Buscar el pedido correspondiente usando el mapa
      const pedido = pedidosMap.get(idPedido);
      
      if (!pedido) return false;

      const esHoy = esDelDiaActual(pedido.fecha);
      const esCancelado = pedido.estado === 'cancelado';

      return esHoy && (mostrarSoloCancelados ? esCancelado : !esCancelado);
    });

    // Calcular totales por método
    const totales = pagosFiltrados.reduce((acc, pago) => {
      const monto = Number(pago.monto) || 0;

      switch (pago.metodo.toLowerCase()) {
        case 'efectivo':
          acc.totalEfectivo += monto;
          break;
        case 'tarjeta':
          acc.totalTarjeta += monto;
          break;
        case 'qr':
          acc.totalQR += monto;
          break;
        case 'online':
          acc.totalOnline += monto;
          break;
      }
      acc.totalDia += monto;

      return acc;
    }, {
      totalDia: 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      totalQR: 0,
      totalOnline: 0,
      fecha: new Date().toISOString()
    });

    setResumen(totales);
  };

  const fetchData = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    try {
      // Obtener datos del día
      const [resumenData, pedidosResponse] = await Promise.all([
        obtenerResumenDeCaja(),
        obtenerPedidosDelDia()
      ]);
      
      // Extraer los pedidos de la estructura anidada
      const pedidos = pedidosResponse?.data?.data || [];
      
      // Filtrar pedidos del día actual en hora local
      const pedidosDelDia = pedidos.filter(pedido => esDelDiaActual(pedido.fecha));

      // Si no hay array de pagos, usar los totales directamente
      if (!Array.isArray(resumenData.pagos)) {
        setResumen({
          totalDia: Number(resumenData.totalDia) || 0,
          totalEfectivo: Number(resumenData.totalEfectivo) || 0,
          totalTarjeta: Number(resumenData.totalTarjeta) || 0,
          totalQR: Number(resumenData.totalQR) || 0,
          totalOnline: Number(resumenData.totalOnline) || 0,
          fecha: obtenerFechaLaPaz()
        });
      } else {
        // Si hay array de pagos, calcular normalmente
        setDatosCompletos({
          pagos: resumenData.pagos,
          pedidos: pedidosDelDia
        });
        calcularResumen(resumenData.pagos, pedidosDelDia);
      }

      // Cargar último arqueo
      try {
        const ultimoArqueo = await obtenerUltimoArqueo();
        if (ultimoArqueo && ultimoArqueo.caja_chica !== undefined) {
          setCajaChica(ultimoArqueo.caja_chica);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error al obtener último arqueo:', error);
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      setError('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recalcular cuando cambie el filtro
  useEffect(() => {
    if (datosCompletos.pagos.length > 0) {
      calcularResumen(datosCompletos.pagos, datosCompletos.pedidos);
    }
  }, [mostrarSoloCancelados, datosCompletos]);

  const handleConteoChange = (denominacion) => (event) => {
    const valor = event.target.value === '' ? 0 : parseInt(event.target.value, 10);
    if (isNaN(valor)) return;

    setConteo(prev => ({
      ...prev,
      [denominacion]: valor
    }));
  };

  const handleCajaChicaChange = (event) => {
    const valor = event.target.value === '' ? 0 : parseFloat(event.target.value);
    if (isNaN(valor)) return;
    setCajaChica(valor);
  };

  const calcularTotalConteo = () => {
    return Object.entries(conteo).reduce((total, [denominacion, cantidad]) => {
      return total + (Number(denominacion) * Number(cantidad));
    }, 0);
  };

  useEffect(() => {
    if (resumen) {
      const totalContado = calcularTotalConteo();
      const totalEfectivoSistema = resumen.totalEfectivo;
      const diferenciaCalculada = totalContado - cajaChica - totalEfectivoSistema;
      setDiferencia(diferenciaCalculada);
    }
  }, [conteo, cajaChica, resumen]);

  const handleGuardarArqueo = async () => {
    try {
      const totalContado = calcularTotalConteo();
      const arqueoDatos = {
        conteo,
        cajaChica,
        totalContado,
        totalSistema: resumen.totalEfectivo,
        diferencia,
        observaciones,
        estado: diferencia === 0 ? 'cuadrado' : diferencia > 0 ? 'sobrante' : 'faltante'
      };

      await crearArqueo(arqueoDatos);
      setSuccess('Arqueo guardado exitosamente');
      
      // Resetear formulario
      setConteo(DENOMINACIONES.reduce((acc, den) => ({...acc, [den.valor]: 0}), {}));
      setObservaciones('');
      
      // Recargar datos
      fetchData();
    } catch (error) {
      setError('Error al guardar el arqueo');
      console.error(error);
    }
  };

  const formatMonto = (monto) => {
    const numero = Number(monto);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  const MetodoCard = ({ titulo, icono, monto, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icono}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {titulo}
          </Typography>
        </Box>
        <Typography variant="h4" color={color}>
          ${formatMonto(monto)}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">
            Resumen de Caja
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Fecha: {formatearFecha(new Date())}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarSoloCancelados}
                onChange={(e) => setMostrarSoloCancelados(e.target.checked)}
              />
            }
            label="Mostrar solo pedidos cancelados"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Ver PDF">
            <IconButton onClick={() => setPdfPreviewOpen(true)} disabled={loading}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={fetchData} disabled={loading}>
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

      {!loading && !error && (
        <>
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total {mostrarSoloCancelados ? 'de Pedidos Cancelados' : 'del Día'}
              </Typography>
              <Typography variant="h3">
                ${formatMonto(resumen.totalDia)}
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <MetodoCard
                titulo={`Efectivo${mostrarSoloCancelados ? ' Cancelado' : ''}`}
                icono={<MoneyIcon sx={{ fontSize: 30, color: 'success.main' }} />}
                monto={resumen.totalEfectivo}
                color="success.main"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MetodoCard
                titulo={`Tarjeta${mostrarSoloCancelados ? ' Cancelado' : ''}`}
                icono={<CreditCardIcon sx={{ fontSize: 30, color: 'info.main' }} />}
                monto={resumen.totalTarjeta}
                color="info.main"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MetodoCard
                titulo={`QR${mostrarSoloCancelados ? ' Cancelado' : ''}`}
                icono={<QrCodeIcon sx={{ fontSize: 30, color: 'secondary.main' }} />}
                monto={resumen.totalQR}
                color="secondary.main"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MetodoCard
                titulo={`Online${mostrarSoloCancelados ? ' Cancelado' : ''}`}
                icono={<OnlinePaymentIcon sx={{ fontSize: 30, color: 'warning.main' }} />}
                monto={resumen.totalOnline}
                color="warning.main"
              />
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Arqueo de Caja
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Conteo de Efectivo
                  </Typography>
                  <Grid container spacing={2}>
                    {DENOMINACIONES.map((den) => (
                      <Grid xs={12} sm={6} md={4} key={den.valor}>
                        <TextField
                          fullWidth
                          label={`${den.tipo} de $${den.valor}`}
                          type="number"
                          value={conteo[den.valor]}
                          onChange={handleConteoChange(den.valor)}
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen del Arqueo
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Caja Chica"
                      type="number"
                      value={cajaChica}
                      onChange={handleCajaChicaChange}
                      InputProps={{
                        inputProps: { min: 0, step: "0.01" }
                      }}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Observaciones"
                      multiline
                      rows={3}
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    Total Contado: ${formatMonto(calcularTotalConteo())}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Caja Chica: ${formatMonto(cajaChica)}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Total en Sistema: ${formatMonto(resumen.totalEfectivo)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" color={diferencia === 0 ? 'success.main' : 'error.main'}>
                    Diferencia: ${formatMonto(diferencia)}
                  </Typography>
                  
                  {diferencia !== 0 && diferencia !== null && (
                    <Alert severity={diferencia === 0 ? "success" : "warning"} sx={{ mt: 2 }}>
                      {diferencia > 0 
                        ? "Hay más dinero en caja que lo registrado en el sistema" 
                        : "Falta dinero en caja según lo registrado en el sistema"}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleGuardarArqueo}
                    sx={{ mt: 2 }}
                  >
                    Guardar Arqueo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Dialog
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ height: '90vh', p: 1 }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <ResumenCajaPDF
              resumen={resumen}
              conteo={conteo}
              cajaChica={cajaChica}
              diferencia={diferencia}
            />
          </PDFViewer>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ResumenCaja; 