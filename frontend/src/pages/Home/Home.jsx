import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Bienvenido a nuestra plataforma
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Gestiona tus recursos de manera eficiente
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/login"
          >
            Iniciar Sesión
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/registro"
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;