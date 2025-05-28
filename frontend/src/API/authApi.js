import axios from './axios';

export default {
  login: (email, password, captchaToken) => 
    axios.post('/auth/login', { email, password, captchaToken }),
  
  register: (nombre, email, password, captchaToken) => 
    axios.post('/auth/register', { 
      nombre,    // Asegúrate que el backend espera "nombre" y no "name"
      email,
      password,
      captchaToken 
    }),
  
  verifyToken: (token) => 
    axios.post('/auth/verify-token'),

  
  getAdminData: () => 
    axios.get('/auth/admin', {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    }),

  actualizarPassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/auth/update-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};