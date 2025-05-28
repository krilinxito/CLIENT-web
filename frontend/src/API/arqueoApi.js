import axios from './axios';

export const crearArqueo = async (arqueoData) => {
  try {
    const response = await axios.post('/arqueos', arqueoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear arqueo:', error);
    throw error;
  }
};

export const obtenerArqueosPorFecha = async (fecha) => {
  try {
    const response = await axios.get(`/arqueos/fecha?fecha=${fecha}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener arqueos por fecha:', error);
    throw error;
  }
};

export const obtenerUltimoArqueo = async () => {
  try {
    const response = await axios.get('/arqueos/ultimo');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Si no hay arqueos, retornamos null en lugar de lanzar un error
      return null;
    }
    console.error('Error al obtener último arqueo:', error);
    throw error;
  }
};

export default {
  crearArqueo,
  obtenerArqueosPorFecha,
  obtenerUltimoArqueo
}; 