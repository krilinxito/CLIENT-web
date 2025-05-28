import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Bienvenido a Taqueando
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
          La mejor experiencia en comida mexicana
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/login"
            sx={{
              backgroundColor: '#006838',
              '&:hover': {
                backgroundColor: '#005830'
              }
            }}
          >
            Iniciar Sesión
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/registro"
            sx={{
              borderColor: '#006838',
              color: '#006838',
              '&:hover': {
                borderColor: '#005830',
                backgroundColor: 'rgba(0,104,56,0.1)'
              }
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;