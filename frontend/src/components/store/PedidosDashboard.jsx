// src/pages/admin/PedidosDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import MesaCard from './MesaCard';
import ParaLlevarCard from './ParaLLevarCard';
import { crearPedido,
  obtenerPedidoPorId,
  obtenerPedidosDelDia} from '../../API/pedidosApi';

const PedidosDashboard = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const res = await obtenerPedidosDelDia();
        setPedidos(res.data);
      } catch (err) {
        console.error('Error cargando pedidos del día:', err);
      }
    };

    cargarPedidos();
  }, []);

  const pedidosMesa = pedidos.filter(p => p.nombre?.startsWith('MESA-'));
  const pedidosLlevar = pedidos.filter(p => !p.nombre?.startsWith('MESA-'));

  return (
    <>
      <Typography variant="h4" gutterBottom>Gestión de Pedidos</Typography>
      <Grid container spacing={2}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <MesaCard
              numero={i + 1}
              pedido={pedidosMesa.find(p => p.nombre === `MESA-${i + 1}`)}
              recargarPedidos={() => window.location.reload()}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <ParaLlevarCard pedidos={pedidosLlevar} recargarPedidos={() => window.location.reload()} />
        </Grid>
      </Grid>
    </>
  );
};

export default PedidosDashboard;
