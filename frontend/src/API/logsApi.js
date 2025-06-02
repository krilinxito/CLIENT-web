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

export default {
  // Obtener todos los logs (admin) o los logs del usuario actual (empleado)
  obtenerLogs: async () => {
    try {
      const response = await axios.get('/logs', getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener logs de un usuario específico (solo admin)
  obtenerLogsPorUsuario: async (userId) => {
    try {
      const response = await axios.get(`/logs/${userId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 