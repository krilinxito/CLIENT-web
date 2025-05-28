// AppRoutes.jsx actualizado
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProductosTable from './pages/admin/ProductosTable';
import Layout from './pages/admin/Layout';
import UserLayout from './pages/user/UserLayout';
import { useAuth } from './context/AuthContext';
import PedidosDashboard from './components/store/PedidosDashboard';
import PedidosCancelados from './components/store/PedidosCancelados';
import ResumenCaja from './components/store/ResumenCaja';
import ArqueosLista from './components/store/ArqueosLista';
import Estadisticas from './pages/admin/Estadisticas';
import HistorialPedidos from './pages/admin/HistorialPedidos';
import UserConfig from './pages/shared/UserConfig';

const AppRoutes = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando autenticación...</h2>;
  }

  // Componente para proteger rutas de admin
  const AdminRoute = ({ children }) => {
    return user?.rol === 'admin' ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Rutas protegidas de admin */}
      <Route element={<ProtectedRoute><AdminRoute><Layout /></AdminRoute></ProtectedRoute>}>
        <Route path="/menu" element={<ProductosTable />} />
        <Route path="/pedidos-dashboard" element={<PedidosDashboard/>}/>
        <Route path="/pedidos-cancelados" element={<PedidosCancelados/>}/>
        <Route path="/resumen-caja" element={<ResumenCaja/>}/>
        <Route path="/arqueos" element={<ArqueosLista/>}/>
        <Route path="/estadisticas" element={<Estadisticas/>}/>
        <Route path="/historial-pedidos" element={<HistorialPedidos/>}/>
        <Route path="/configuracion" element={<UserConfig />} />
      </Route>

      {/* Rutas protegidas de usuario */}
      <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route path="/usuario" element={<Navigate to="/usuario/pedidos-activos" replace />} />
        <Route path="/usuario/pedidos-activos" element={<PedidosDashboard/>}/>
        <Route path="/usuario/pedidos-cancelados" element={<PedidosCancelados/>}/>
        <Route path="/usuario/resumen-caja" element={<ResumenCaja/>}/>
        <Route path="/usuario/configuracion" element={<UserConfig />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;