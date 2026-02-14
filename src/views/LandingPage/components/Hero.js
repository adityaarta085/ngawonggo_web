import React, { useRef, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const Hero = ({ isReady }) => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current && isReady) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay blocked, waiting for interaction:", error);
          });
        }
      }
    };

    if (isReady) {
        playVideo();
    }

    window.addEventListener('click', playVideo);
    window.addEventListener('touchstart', playVideo);

    return () => {
      window.removeEventListener('click', playVideo);
      window.removeEventListener('touchstart', playVideo);
    };
  }, [isReady]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: 'black',
      }}
    >
      {/* Video Background */}
      {isReady && (
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          src="https://api.deline.web.id/nKT00jDXVR.mp4"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.8,
          }}
        />
      )}

      {/* Gradient Overlay (IKN Inspired) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: 'linear-gradient(180deg, rgba(15, 47, 36, 0.4) 0%, rgba(15, 47, 36, 0.2) 50%, rgba(15, 47, 36, 0.9) 100%)',
        }}
      />

      <Container maxWidth="lg" sx={{ zIndex: 2, position: 'relative' }}>
        <Stack spacing={4} sx={{ maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                color: 'white',
                lineHeight: 1.1,
                fontWeight: 800,
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {t.title}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                mb: 4,
              }}
            >
              {t.subtitle}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <Button
                component={RouterLink}
                to="/profil"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  height: '60px',
                  fontSize: '1rem',
                  borderRadius: '100px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                {t.cta}
              </Button>
              <Button
                component={RouterLink}
                to="/media"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  height: '60px',
                  fontSize: '1rem',
                  borderRadius: '100px',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                {language === 'id' ? 'Lihat Video' : 'Watch Video'}
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
