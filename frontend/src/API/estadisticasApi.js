import axios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Función para normalizar IDs de pedidos
const normalizarIdPedido = (pago) => ({
  ...pago,
  id_pedido: pago.id_pedido || pago.idPedido,
  idPedido: pago.id_pedido || pago.idPedido
});

export const obtenerTodasLasEstadisticas = async () => {
  try {
    // Verificar autenticación
    const headers = getAuthHeaders();
    if (!headers.headers.Authorization) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener todas las estadísticas en una sola llamada
    const response = await axios.get('/estadisticas', headers);
    
    const {
      ingresos = [],
      ingresosPorMetodo = [],
      productosMasVendidos = [],
      ventasPorHora = [],
      productosCancelados = [],
      rendimientoUsuarios = [],
      comparativaSemanal = []
    } = response.data || {};

    // Formatear ingresos (las fechas ya vienen en formato YYYY-MM-DD del backend)
    const ingresosFormateados = ingresos.map(ingreso => ({
      ...ingreso,
      total: Number(ingreso.total || 0),
      total_pedidos: Number(ingreso.total_pedidos || 0)
    }));

    // Formatear ingresos por método
    const ingresosPorMetodoFormateados = ingresosPorMetodo.map(ingreso => ({
      ...ingreso,
      total: Number(ingreso.total || 0),
      cantidad: Number(ingreso.cantidad || 0)
    }));

    // Formatear ventas por hora
    const ventasPorHoraFormateadas = ventasPorHora.map(venta => ({
      ...venta,
      hora: Number(venta.hora),
      total_ventas: Number(venta.total_ventas || 0),
      total_pedidos: Number(venta.total_pedidos || 0)
    }));

    // Formatear productos más vendidos
    const productosMasVendidosFormateados = productosMasVendidos.map(producto => ({
      ...producto,
      cantidad_total: Number(producto.cantidad_total || 0),
      ingresos_total: Number(producto.ingresos_total || 0)
    }));

    // Formatear productos cancelados
    const productosCanceladosFormateados = productosCancelados.map(producto => ({
      ...producto,
      veces_cancelado: Number(producto.veces_cancelado || 0),
      cantidad_total_cancelada: Number(producto.cantidad_total_cancelada || 0),
      valor_perdido: Number(producto.valor_perdido || 0)
    }));

    // Formatear rendimiento usuarios
    const rendimientoUsuariosFormateado = rendimientoUsuarios.map(usuario => ({
      ...usuario,
      total_pedidos: Number(usuario.total_pedidos || 0),
      total_ventas: Number(usuario.total_ventas || 0),
      promedio_venta: Number(usuario.promedio_venta || 0)
    }));

    // Formatear comparativa semanal
    const comparativaFormateada = comparativaSemanal.map(periodo => ({
      ...periodo,
      total_pedidos: Number(periodo.total_pedidos || 0),
      total_ventas: Number(periodo.total_ventas || 0),
      usuarios_activos: Number(periodo.usuarios_activos || 0)
    }));

    return {
      ingresos: ingresosFormateados,
      ingresosPorMetodo: ingresosPorMetodoFormateados,
      productosMasVendidos: productosMasVendidosFormateados,
      ventasPorHora: ventasPorHoraFormateadas,
      productosCancelados: productosCanceladosFormateados,
      rendimientoUsuarios: rendimientoUsuariosFormateado,
      comparativaSemanal: comparativaFormateada
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// Funciones individuales por si necesitamos obtener datos específicos
export const obtenerIngresos = async () => {
  try {
    const response = await axios.get('/estadisticas/ingresos', getAuthHeaders());
    return response.data.map(ingreso => ({
      ...ingreso,
      total: Number(ingreso.total || 0),
      total_pedidos: Number(ingreso.total_pedidos || 0)
    }));
  } catch (error) {
    console.error('Error al obtener ingresos:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerProductosMasVendidos = async () => {
  try {
    const response = await axios.get('/estadisticas/productos-mas-vendidos', getAuthHeaders());
    return response.data.map(producto => ({
      ...producto,
      cantidad_total: Number(producto.cantidad_total || 0),
      ingresos_total: Number(producto.ingresos_total || 0)
    }));
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerVentasPorHora = async () => {
  try {
    const response = await axios.get('/estadisticas/ventas-por-hora', getAuthHeaders());
    return response.data.map(venta => ({
      ...venta,
      hora: Number(venta.hora),
      total_ventas: Number(venta.total_ventas || 0),
      total_pedidos: Number(venta.total_pedidos || 0)
    }));
  } catch (error) {
    console.error('Error al obtener ventas por hora:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerComparativaSemanal = async () => {
  try {
    const response = await axios.get('/estadisticas/comparativa-semanal', getAuthHeaders());
    return response.data.map(periodo => ({
      ...periodo,
      total_pedidos: Number(periodo.total_pedidos || 0),
      total_ventas: Number(periodo.total_ventas || 0),
      usuarios_activos: Number(periodo.usuarios_activos || 0)
    }));
  } catch (error) {
    console.error('Error al obtener comparativa semanal:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerIngresosPorMetodo = async () => {
  try {
    const response = await axios.get('/estadisticas/ingresos-por-metodo', getAuthHeaders());
    return response.data.map(ingreso => ({
      ...ingreso,
      total: Number(ingreso.total || 0),
      cantidad: Number(ingreso.cantidad || 0)
    }));
  } catch (error) {
    console.error('Error al obtener ingresos por método:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerProductosCancelados = async () => {
  try {
    const response = await axios.get('/estadisticas/productos-cancelados', getAuthHeaders());
    return response.data.map(producto => ({
      ...producto,
      veces_cancelado: Number(producto.veces_cancelado || 0),
      cantidad_total_cancelada: Number(producto.cantidad_total_cancelada || 0),
      valor_perdido: Number(producto.valor_perdido || 0)
    }));
  } catch (error) {
    console.error('Error al obtener productos cancelados:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerRendimientoUsuarios = async () => {
  try {
    const response = await axios.get('/estadisticas/rendimiento-usuarios', getAuthHeaders());
    return response.data.map(usuario => ({
      ...usuario,
      total_pedidos: Number(usuario.total_pedidos || 0),
      total_ventas: Number(usuario.total_ventas || 0),
      promedio_venta: Number(usuario.promedio_venta || 0)
    }));
  } catch (error) {
    console.error('Error al obtener rendimiento de usuarios:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener ingresos históricos paginados
export const obtenerIngresosHistoricos = async (pagina = 1, limite = 10) => {
  try {
    const response = await axios.get(
      `/estadisticas/ingresos-historicos?pagina=${pagina}&limite=${limite}`, 
      getAuthHeaders()
    );
    
    const ingresos = response.data;
    if (ingresos.data) {
      ingresos.data = ingresos.data.map(ingreso => ({
        ...ingreso,
        total: Number(ingreso.total || 0),
        total_pedidos: Number(ingreso.total_pedidos || 0)
      }));
    }
    
    return ingresos;
  } catch (error) {
    console.error('Error al obtener ingresos históricos:', error.response?.data || error.message);
    throw error;
  }
}; 