import React, { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import { obtenerPedidosDelDia } from '../../API/pedidosApi';
import ProductosModal from './ProductosModal';
import PagosModal from './PagosModal';
import contieneApi from '../../API/contieneApi';
import { pagoApi } from '../../API/pagoApi';

const PedidosCancelados = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productosModalOpen, setProductosModalOpen] = useState(false);
  const [pagosModalOpen, setPagosModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPedidos = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerPedidosDelDia();
      
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('Formato de datos de pedidos inválido');
      }

      // Filtrar solo los pedidos cancelados del día
      const pedidosCancelados = response.data.data.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha);
        const hoy = new Date();
        return pedido.estado === 'cancelado' && 
               fechaPedido.toDateString() === hoy.toDateString();
      });

      // Obtener detalles adicionales para cada pedido
      const pedidosConDetalles = await Promise.all(
        pedidosCancelados.map(async (pedido) => {
          try {
            const [productosRes, pagosRes] = await Promise.all([
              contieneApi.obtenerProductosDePedido(pedido.id),
              pagoApi.obtenerPagosDePedido(pedido.id)
            ]);

            const productos = productosRes?.data?.productos || [];
            const pagos = pagosRes?.data?.pagos || [];
            const total = productos.reduce((sum, p) => {
              if (p.anulado) return sum;
              return sum + (Number(p.precio || 0) * Number(p.cantidad || 0));
            }, 0);

            return {
              ...pedido,
              productos,
              pagos,
              total
            };
          } catch (error) {
            console.error(`Error obteniendo detalles del pedido ${pedido.id}:`, error);
            return pedido;
          }
        })
      );

      setPedidos(pedidosConDetalles);
    } catch (error) {
      console.error('Error al obtener pedidos cancelados:', error);
      setError('Error al cargar los pedidos: ' + (error.response?.data?.message || error.message));
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await fetchPedidos();
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [fetchPedidos]);

  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setProductosModalOpen(true);
  };

  const handleViewPayments = (order) => {
    setSelectedOrder(order);
    setPagosModalOpen(true);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Pedidos Cancelados del Día
        </Typography>
        <Tooltip title="Actualizar">
          <span>
            <IconButton onClick={fetchPedidos} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : pedidos.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No hay pedidos cancelados hoy
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>{formatearFecha(pedido.fecha)}</TableCell>
                  <TableCell>{pedido.nombre}</TableCell>
                  <TableCell>{pedido.nombre_usuario}</TableCell>
                  <TableCell>
                    {pedido.productos?.map((producto, index) => (
                      <Chip
                        key={index}
                        label={`${producto.cantidad}x ${producto.nombre}`}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    ${Number(pedido.total || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Productos (solo lectura) */}
      {selectedOrder && (
        <ProductosModal
          open={productosModalOpen}
          onClose={() => {
            setProductosModalOpen(false);
            setSelectedOrder(null);
          }}
          productos={selectedOrder.productos || []}
          availableProducts={[]}
          selectedProduct=""
          setSelectedProduct={() => {}}
          cantidad={1}
          setCantidad={() => {}}
          readOnly={true}
        />
      )}

      {/* Modal de Pagos (solo lectura) */}
      {selectedOrder && (
        <PagosModal
          open={pagosModalOpen}
          onClose={() => {
            setPagosModalOpen(false);
            setSelectedOrder(null);
          }}
          pagos={selectedOrder.pagos || []}
          onAddPago={() => {}}
          totalPedido={selectedOrder.total || 0}
          totalPagado={selectedOrder.pagado || 0}
          readOnly={true}
        />
      )}
    </Paper>
  );
};

export default PedidosCancelados; 