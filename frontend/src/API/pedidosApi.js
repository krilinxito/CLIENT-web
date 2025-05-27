import axios from './axios';

export const crearPedido = (pedidoData) => 
  axios.post('/pedidos', pedidoData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const obtenerPedidoPorId = (id) => 
  axios.get(`/pedidos/${id}`);

export const obtenerPedidosDelDia = () => 
  axios.get('/pedidos/pedidos-dia');
