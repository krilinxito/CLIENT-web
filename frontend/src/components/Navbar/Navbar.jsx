import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import taqueandoLogo from '../../assets/taqueando-logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
});

const LogoImage = styled('img')({
  height: 60,
  width: 'auto',
  objectFit: 'contain'
});

const LogoText = styled(Typography)({
  color: '#ffffff',
  fontSize: '1.5rem',
  fontWeight: 600,
  display: 'none',
  '@media (max-width: 600px)': {
    fontSize: '1.2rem',
  }
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#000000',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '3px solid #006838',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 2rem',
  minHeight: 80,
});

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  borderColor: '#006838',
  '&:hover': {
    borderColor: '#006838',
    backgroundColor: 'rgba(0,104,56,0.1)',
  },
  textTransform: 'none',
  fontSize: '1rem',
  padding: '6px 16px',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#006838',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogoClick = () => {
    navigate(user?.rol === 'admin' ? '/menu' : user ? '/usuario/pedidos-activos' : '/');
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const logoText = e.target.parentElement.querySelector('.logo-text');
    if (logoText) {
      logoText.style.display = 'block';
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate(user?.rol === 'admin' ? '/configuracion' : '/usuario/configuracion');
  };

  const getUserInitial = () => {
    if (!user || !user.nombre) return '?';
    return user.nombre.charAt(0).toUpperCase();
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <LogoContainer onClick={handleLogoClick}>
          <LogoImage
            src={taqueandoLogo}
            alt="Taqueando"
            onError={handleImageError}
          />
          <LogoText className="logo-text">
            Taqueando
          </LogoText>
        </LogoContainer>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              {user.nombre && (
                <Typography 
                  sx={{ 
                    fontWeight: 500,
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {user.nombre}
                </Typography>
              )}
              <Tooltip title="Cuenta">
                <UserAvatar onClick={handleMenuOpen}>
                  {getUserInitial()}
                </UserAvatar>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      typography: 'body2',
                      fontSize: '0.9rem',
                      py: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile}>
                  <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
                  Perfil
                </MenuItem>
                <MenuItem onClick={handleProfile}>
                  <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                  Configuración
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <StyledButton 
                component={Link} 
                to="/login"
                variant="outlined"
              >
                Iniciar Sesión
              </StyledButton>
              <StyledButton 
                component={Link} 
                to="/registro"
                variant="outlined"
              >
                Registro
              </StyledButton>
            </>
          )}
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;