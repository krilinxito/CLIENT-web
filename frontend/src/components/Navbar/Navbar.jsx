import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mi App
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              <Typography sx={{ alignSelf: 'center' }}>
                {user.nombre}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/registro">
                Registro
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;