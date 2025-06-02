import axios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const validateLogsResponse = (data) => {
  if (!data) {
    throw new Error('No se recibieron datos del servidor');
  }
  
  // Validar si los logs vienen directamente o dentro de una propiedad
  const logs = data.logs || data;
  
  if (!Array.isArray(logs)) {
    throw new Error('El formato de los logs recibidos no es válido');
  }
  
  return logs;
};

export default {
  // Obtener todos los logs (admin) o los logs del usuario actual (empleado)
  obtenerLogs: async () => {
    try {
      const response = await axios.get('/logs', getAuthHeaders());
      const logs = validateLogsResponse(response.data);
      return { logs }; // Mantener consistencia con el formato esperado
    } catch (error) {
      console.error('Error en obtenerLogs:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al obtener los logs');
      }
      throw error;
    }
  },

  // Obtener logs de un usuario específico (solo admin)
  obtenerLogsPorUsuario: async (userId) => {
    try {
      const response = await axios.get(`/logs/${userId}`, getAuthHeaders());
      const logs = validateLogsResponse(response.data);
      return { logs }; // Mantener consistencia con el formato esperado
    } catch (error) {
      console.error('Error en obtenerLogsPorUsuario:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al obtener los logs del usuario');
      }
      throw error;
    }
  }
}; 