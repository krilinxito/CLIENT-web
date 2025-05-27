// AppRoutes.jsx actualizado
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProductosTable from './pages/admin/ProductosTable';
import Layout from './pages/admin/Layout';
import UserLayout from './pages/user/UserLayout';
import { useAuth } from './context/AuthContext';
import PedidosDashboard from './components/store/PedidosDashboard';

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando autenticación...</h2>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Rutas protegidas con layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/menu" element={<ProductosTable />} />
        <Route path="/pedidos-dashboard" element={<PedidosDashboard/>}/>
        <Route path="/configuracion" element={<h1>Configuración</h1>} />
        {/* Agrega más rutas aquí */}
      </Route>

      <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route path="/usuario" element={<h1>Usuario</h1>} />
        {/* Agrega más rutas aquí */}
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;