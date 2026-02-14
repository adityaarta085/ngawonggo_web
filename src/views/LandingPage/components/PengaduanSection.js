import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
} from '@mui/material';
import { Campaign as BullhornIcon, ArrowForward as ArrowRightIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const PengaduanSection = () => {
  const { language } = useLanguage();

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }} id="pengaduan">
      <Container maxWidth="lg">
        <Paper
          sx={{
            bgcolor: 'primary.main',
            borderRadius: '40px',
            p: { xs: 4, md: 8 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(19, 127, 236, 0.2)',
          }}
          elevation={0}
        >
          {/* Decorative background circle */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '300px',
              height: '300px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
            }}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={6}
            alignItems="center"
            justifyContent="space-between"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack spacing={3} sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <BullhornIcon sx={{ fontSize: 32 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Layanan Pengaduan
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {language === 'id'
                  ? 'Sampaikan Aspirasi & Keluhan Anda'
                  : 'Submit Your Aspirations & Complaints'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                {language === 'id'
                  ? 'Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga. Sampaikan pengaduan atau saran Anda melalui sistem pengaduan mandiri kami.'
                  : 'Ngawonggo Village Government is committed to listening to citizens. Submit your complaints or suggestions through our independent complaint system.'}
              </Typography>
            </Stack>

            <Button
              component={RouterLink}
              to="/layanan"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2,
                fontSize: '1.25rem',
                fontWeight: 800,
                borderRadius: '20px',
                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' },
                transition: 'all 0.3s',
                textTransform: 'none'
              }}
              endIcon={<ArrowRightIcon />}
            >
              {language === 'id' ? 'Mulai Pengaduan' : 'Start Complaint'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PengaduanSection;
