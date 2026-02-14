import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  Fade,
  FormControlLabel,
} from '@mui/material';

const HumanVerification = ({ onVerified }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [verificationType, setVerificationType] = useState(0);

  useEffect(() => {
     setVerificationType(Math.floor(Math.random() * 3));
  }, []);

  const prompts = [
    "Harap verifikasi bahwa Anda adalah manusia untuk melanjutkan ke portal digital Desa Ngawonggo.",
    "Verifikasi sistem diperlukan untuk mengamankan akses ke layanan digital Desa Ngawonggo.",
    "Pastikan Anda bukan robot untuk menikmati pengalaman digital Desa Ngawonggo 2045."
  ];

  const handleVerify = () => {
    if (isChecked) {
      setIsVerifying(true);
      setTimeout(() => {
        onVerified();
      }, 1200);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(15px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={true} timeout={500}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          elevation={24}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: 'primary.main' }} />

          <Stack spacing={3} alignItems="center">
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'primary.container', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Box
                component="img"
                src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png"
                sx={{ height: '50px' }}
               />
            </Box>

            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Verifikasi Keamanan
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {prompts[verificationType]}
              </Typography>
            </Stack>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 2,
                borderRadius: '16px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'grey.50',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
               <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Saya bukan robot
                  </Typography>
                }
               />
               {isVerifying ? (
                 <CircularProgress size={24} />
               ) : (
                 <Box
                   component="img"
                   src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                   sx={{ height: '24px', opacity: 0.6 }}
                 />
               )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!isChecked || isVerifying}
              onClick={handleVerify}
              sx={{
                height: '56px',
                borderRadius: '100px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 16px rgba(19, 127, 236, 0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(19, 127, 236, 0.3)',
                },
              }}
            >
              {isVerifying ? 'Memproses...' : 'Lanjutkan ke Portal'}
            </Button>

            <Typography variant="caption" sx={{ color: 'grey.400' }}>
              Powered by Desa Digital Ngawonggo Security Stack
            </Typography>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default HumanVerification;
