// contieneApi.js
// src/API/contieneApi.js
import axios from 'axios';

const contieneApi = axios.create({
  baseURL: '/api/contiene', // Asegúrate que coincida con tu backend
});

// Agregar producto a un pedido
export const agregarProductoAPedido = async ({ id_pedido, id_producto, cantidad }) => {
  const response = await contieneApi.post('/agregar', {
    id_pedido,
    id_producto,
    cantidad
  });
  return response.data;
};

// Anular producto de un pedido (por id de la tabla contiene)
export const anularProductoDePedido = async (id_contiene) => {
  const response = await contieneApi.put(`/anular/${id_contiene}`);
  return response.data;
};

// Obtener productos activos de un pedido
export const obtenerProductosDePedido = async (id_pedido) => {
  const response = await contieneApi.get(`/pedido/${id_pedido}`);
  return response.data;
};

export default {
  agregarProductoAPedido,
  anularProductoDePedido,
  obtenerProductosDePedido,
};