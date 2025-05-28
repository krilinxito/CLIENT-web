import axios from './axios';

/**
 * Obtiene el resumen de caja del día actual
 * @returns {Promise<{
 *   fecha: string,
 *   totalDia: number,
 *   totalPedidos: number,
 *   totalEfectivo: number,
 *   totalTarjeta: number,
 *   totalQR: number,
 *   totalOnline: number,
 *   detallesPorMetodo: Array<{
 *     metodo: string,
 *     total: number,
 *     cantidad: number,
 *     porcentaje: string
 *   }>,
 *   pagos: Array<{
 *     id: number,
 *     idPedido: number,
 *     monto: number,
 *     metodo: string,
 *     hora: string,
 *     estadoPedido: string,
 *     nombrePedido: string,
 *     nombreUsuario: string
 *   }>,
 *   estadisticas: {
 *     promedioPorPedido: number,
 *     metodoPagoMasUsado: string,
 *     metodoPagoMayorMonto: string
 *   }
 * }>}
 */
export const obtenerResumenDeCaja = async () => {
  try {
    const response = await axios.get('/caja/resumen');
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen de caja:', error);
    throw error;
  }
};

/**
 * Obtiene el resumen de caja para una fecha específica
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Promise<{
 *   fecha: string,
 *   totalDia: number,
 *   totalPedidos: number,
 *   totalEfectivo: number,
 *   totalTarjeta: number,
 *   totalQR: number,
 *   totalOnline: number,
 *   detallesPorMetodo: Array<{
 *     metodo: string,
 *     total: number,
 *     cantidad: number,
 *     porcentaje: string
 *   }>,
 *   pagos: Array<{
 *     id: number,
 *     idPedido: number,
 *     monto: number,
 *     metodo: string,
 *     hora: string,
 *     estadoPedido: string,
 *     nombrePedido: string,
 *     nombreUsuario: string
 *   }>,
 *   estadisticas: {
 *     promedioPorPedido: number,
 *     metodoPagoMasUsado: string,
 *     metodoPagoMayorMonto: string
 *   }
 * }>}
 */
export const obtenerResumenPorFecha = async (fecha) => {
  try {
    const response = await axios.get(`/caja/resumen/fecha?fecha=${fecha}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen de caja por fecha:', error);
    throw error;
  }
};

/**
 * Formatea un monto a string con 2 decimales
 * @param {number} monto 
 * @returns {string}
 */
export const formatearMonto = (monto) => {
  const numero = Number(monto);
  return isNaN(numero) ? '0.00' : numero.toFixed(2);
};

/**
 * Formatea una fecha a formato local de Bolivia
 * @param {string|Date} fecha 
 * @returns {string}
 */
export const formatearFecha = (fecha) => {
  try {
    return new Date(fecha).toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
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

/**
 * Obtiene el color correspondiente a un método de pago
 * @param {string} metodo 
 * @returns {'success'|'info'|'secondary'|'warning'}
 */
export const obtenerColorMetodoPago = (metodo) => {
  switch (metodo.toLowerCase()) {
    case 'efectivo':
      return 'success';
    case 'tarjeta':
      return 'info';
    case 'qr':
      return 'secondary';
    case 'online':
      return 'warning';
    default:
      return 'default';
  }
};

export default {
  obtenerResumenDeCaja,
  obtenerResumenPorFecha,
  formatearMonto,
  formatearFecha,
  obtenerColorMetodoPago
}; 