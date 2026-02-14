import React, { useState } from 'react';
import {
  Button,
  TextField,
  Stack,
  Typography,
  Container,
  Paper,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setSession }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .rpc('check_admin_credentials', {
          p_username: username,
          p_password: password
        });

      if (error || !data || data.length === 0) {
        setSnackbar({ open: true, message: 'Username atau password salah', severity: 'error' });
      } else {
        const user = data[0];
        localStorage.setItem('adminSession', JSON.stringify(user));
        if (setSession) {
          setSession(user);
        }
        setSnackbar({ open: true, message: 'Login Berhasil', severity: 'success' });
        setTimeout(() => navigate('/admin'), 1000);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Terjadi kesalahan sistem', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'grey.50' }}>
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{ p: 4, borderRadius: '32px' }}>
          <Stack spacing={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Admin Login</Typography>
              <Typography variant="body2" color="text.secondary">Desa Ngawonggo</Typography>
            </Box>
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ borderRadius: '100px', height: 56, fontWeight: 700 }}
                >
                  {loading ? 'Masuk...' : 'Masuk'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
