import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NgawonggoLogo from './NgawonggoLogo';

const SplashScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const logos = [
    { type: 'component', component: <NgawonggoLogo fontSize="2.5rem" iconSize={64} flexDirection="column" /> },
    { type: 'image', src: 'https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png', label: 'Kabupaten Magelang' },
    { type: 'image', src: 'https://www.menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png', label: '' },
    { type: 'image', src: 'https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png', label: '' },
  ];

  useEffect(() => {
    if (step < logos.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [step, logos.length, onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'white',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={6}>
        <AnimatePresence mode="wait">
          {logos[step] && (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {logos[step].type === 'component' ? (
                logos[step].component
              ) : (
                <Stack spacing={3} alignItems="center">
                  <Box
                    component="img"
                    src={logos[step].src}
                    sx={{ height: '150px', objectFit: 'contain' }}
                    alt={logos[step].label}
                  />
                  {logos[step].label && (
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: '0.1em' }}
                    >
                      {logos[step].label.toUpperCase()}
                    </Typography>
                  )}
                </Stack>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      <Box sx={{ position: 'absolute', bottom: 40, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'grey.400',
              fontWeight: 500,
              letterSpacing: '0.2em',
            }}
          >
            MADE WITH SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SplashScreen;
