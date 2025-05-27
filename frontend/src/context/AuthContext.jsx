import { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../API/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 const verifyAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token desde localStorage:', token);

    const response = await authApi.verifyToken(token);
    console.log('Respuesta de verify-token:', response.data);

    setUser(response.data.user);    
    return response.data.user;
  } catch (error) {
    console.error('Error en verifyAuth:', error.response?.data || error.message);
    logout();
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    verifyAuth();
  } else {
    setIsLoading(false);
  }
}, []);


const login = async (email, password, captchaToken) => {
  try {
    const response = await authApi.login(email, password, captchaToken);
    
    // Verificar estructura CORRECTA de respuesta
    if (!response.data?.token) {
      throw new Error('El backend no devolvió un token válido');
    }
    
    localStorage.setItem('token', response.data.token);
    
    // Forzar nueva verificación
    const user = await verifyAuth(); // <-- devuelve el usuario
    return user;
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', {
      message: error.message,
      response: error.response?.data
    });
    localStorage.removeItem('token');
    throw error;
  }
};

  const register = async (nombre, email, password, captchaToken) => {
    try {
      const response = await authApi.register(nombre, email, password, captchaToken);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      verifyAuth  // Expone verifyAuth para poder forzar revalidaciones
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);