import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, LinearProgress } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../context/AuthContext';

const passwordStrength = (password) => {
  if (!password) return 0;
  if (password.length < 6) return 0;
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[\W_]/.test(password);
  
  return [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
};

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setStrength(passwordStrength(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (strength < 2) {
      setError('La contraseña es demasiado débil');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(nombre, email, password, captchaToken);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Registro de Usuario
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre Completo"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Box sx={{ mt: 1, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(strength * 25, 100)}
              sx={{
                height: 8,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: strength >= 3 ? '#4caf50' : strength >= 2 ? '#ffc107' : '#f44336'
                }
              }}
            />
            <Typography variant="caption">
              {['Débil', 'Moderada', 'Fuerte', 'Muy fuerte'][strength - 1] || ''}
            </Typography>
          </Box>

          <Box sx={{ my: 2 }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={setCaptchaToken}
            />
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!captchaToken || isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;