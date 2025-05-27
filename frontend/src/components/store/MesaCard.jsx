// src/components/MesaCard.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import { Add, Visibility, AttachMoney } from '@mui/icons-material';
import { obtenerPedidosDelDia, crearPedido } from '../../API/pedidosApi';
import { obtenerProductosDePedido, agregarProductoAPedido } from '../../API/contieneApi';
import { obtenerProductos } from '../../API/productsApi';

const MesaCard = ({ numeroMesa }) => {
  const [pedido, setPedido] = useState(null);
  const [detallePedido, setDetallePedido] = useState([]);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    buscarPedido();
    obtenerProductos().then(setProductos);
  }, []);

  const buscarPedido = async () => {
    const res = await obtenerPedidosDelDia();
    const mesa = res.find(p => p.nombre === `MESA ${numeroMesa}`);
    setPedido(mesa || null);
  };

  const crearNuevoPedido = async () => {
    const nuevo = await crearPedido({ nombre: `MESA ${numeroMesa}` });
    setPedido(nuevo.data);
  };

  const verDetalle = async () => {
    if (!pedido) return;
    const detalle = await obtenerProductosDePedido(pedido.id);
    setDetallePedido(detalle);
    setOpenDetalle(true);
  };

  const agregarProducto = async () => {
    await agregarProductoAPedido({
      id_pedido: pedido.id,
      id_producto: productoSeleccionado,
      cantidad
    });
    const detalle = await obtenerProductosDePedido(pedido.id);
    setDetallePedido(detalle);
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const calcularTotal = () => {
    return detallePedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Mesa {numeroMesa}</Typography>
        {!pedido ? (
          <Button startIcon={<Add />} onClick={crearNuevoPedido}>Crear Pedido</Button>
        ) : (
          <Button startIcon={<Visibility />} onClick={verDetalle}>Ver Pedido</Button>
        )}

        <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Pedido</DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unitario</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detallePedido.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>${item.precio}</TableCell>
                    <TableCell>${(item.precio * item.cantidad).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Total: ${calcularTotal()}
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Agregar Producto:</Typography>
            <TextField
              select
              fullWidth
              label="Producto"
              SelectProps={{ native: true }}
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              sx={{ mt: 1 }}
            >
              <option value="">Seleccione...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              sx={{ mt: 1 }}
            />

            <Button fullWidth onClick={agregarProducto} sx={{ mt: 1 }}>Agregar</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
            <Button variant="contained" color="success" startIcon={<AttachMoney />}>
              Pagar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MesaCard;
