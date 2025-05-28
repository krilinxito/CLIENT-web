import axios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const obtenerTodasLasEstadisticas = async () => {
  try {
    // Verificar autenticación
    const headers = getAuthHeaders();
    if (!headers.headers.Authorization) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener todas las estadísticas en una sola llamada
    const response = await axios.get('/estadisticas', headers);
    
    // Los datos ya vienen en el formato correcto desde el backend
    const {
      ingresos = [],
      ingresosPorMetodo = [],
      productosMasVendidos = [],
      ventasPorHora = [],
      productosCancelados = [],
      rendimientoUsuarios = [],
      comparativaSemanal = []
    } = response.data || {};

    // Formatear fechas para el gráfico de ingresos
    const ingresosFormateados = ingresos.map(ingreso => ({
      ...ingreso,
      fecha: new Date(ingreso.fecha).toLocaleDateString(),
      total: Number(ingreso.total),
      total_pedidos: Number(ingreso.total_pedidos)
    }));

    // Formatear datos para la comparativa semanal
    const comparativaFormateada = comparativaSemanal.map(periodo => ({
      ...periodo,
      total_ventas: Number(periodo.total_ventas),
      total_pedidos: Number(periodo.total_pedidos),
      usuarios_activos: Number(periodo.usuarios_activos)
    }));

    // Formatear datos para ventas por hora
    const ventasPorHoraFormateadas = ventasPorHora.map(venta => ({
      ...venta,
      total_ventas: Number(venta.total_ventas),
      total_pedidos: Number(venta.total_pedidos)
    }));

    return {
      ingresos: ingresosFormateados,
      ingresosPorMetodo,
      productosMasVendidos,
      ventasPorHora: ventasPorHoraFormateadas,
      productosCancelados,
      rendimientoUsuarios,
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
    return response.data;
  } catch (error) {
    console.error('Error al obtener ingresos:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerProductosMasVendidos = async () => {
  try {
    const response = await axios.get('/estadisticas/productos-mas-vendidos', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerVentasPorHora = async () => {
  try {
    const response = await axios.get('/estadisticas/ventas-por-hora', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas por hora:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerComparativaSemanal = async () => {
  try {
    const response = await axios.get('/estadisticas/comparativa-semanal', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener comparativa semanal:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerIngresosPorMetodo = async () => {
  try {
    const response = await axios.get('/estadisticas/ingresos-por-metodo', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener ingresos por método:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerProductosCancelados = async () => {
  try {
    const response = await axios.get('/estadisticas/productos-cancelados', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos cancelados:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerRendimientoUsuarios = async () => {
  try {
    const response = await axios.get('/estadisticas/rendimiento-usuarios', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener rendimiento de usuarios:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener ingresos históricos paginados
export const obtenerIngresosHistoricos = async (pagina = 1, limite = 10) => {
  try {
    const response = await axios.get(`/estadisticas/ingresos-historicos?pagina=${pagina}&limite=${limite}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener ingresos históricos:', error.response?.data || error.message);
    throw error;
  }
}; 