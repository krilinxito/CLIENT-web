// src/components/ParaLlevarCard.jsx
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

const ParaLlevarCard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [openNuevoPedido, setOpenNuevoPedido] = useState(false);
  const [nombreCliente, setNombreCliente] = useState('');
  const [productos, setProductos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallePedido, setDetallePedido] = useState([]);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    obtenerPedidos();
    obtenerProductos().then(setProductos);
  }, []);

  const obtenerPedidos = async () => {
    const res = await obtenerPedidosDelDia();
    const pedidosParaLlevar = res.filter(p => p.nombre && !p.nombre.startsWith('MESA'));
    setPedidos(pedidosParaLlevar);
  };

  const crearNuevoPedido = async () => {
    const nuevo = await crearPedido({ nombre: nombreCliente });
    setNombreCliente('');
    setOpenNuevoPedido(false);
    obtenerPedidos();
  };

  const verDetalle = async (pedido) => {
    setSelectedPedido(pedido);
    const detalle = await obtenerProductosDePedido(pedido.id);
    setDetallePedido(detalle);
    setOpenDetalle(true);
  };

  const agregarProducto = async () => {
    await agregarProductoAPedido({
      id_pedido: selectedPedido.id,
      id_producto: productoSeleccionado,
      cantidad
    });
    const detalle = await obtenerProductosDePedido(selectedPedido.id);
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
        <Typography variant="h6">Pedidos para llevar</Typography>
        <Button startIcon={<Add />} onClick={() => setOpenNuevoPedido(true)}>Agregar Pedido</Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map(pedido => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={() => verDetalle(pedido)}><Visibility /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal nuevo pedido */}
        <Dialog open={openNuevoPedido} onClose={() => setOpenNuevoPedido(false)}>
          <DialogTitle>Nuevo Pedido para Llevar</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre del Cliente"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNuevoPedido(false)}>Cancelar</Button>
            <Button onClick={crearNuevoPedido}>Crear</Button>
          </DialogActions>
        </Dialog>

        {/* Modal detalle */}
        <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Pedido - {selectedPedido?.nombre}</DialogTitle>
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

export default ParaLlevarCard;
