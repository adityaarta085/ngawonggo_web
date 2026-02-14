import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Stack,
  Paper,
  Chip,
} from '@mui/material';

export default function TransparansiPage() {
  const stats = [
    { label: 'Total Pendapatan 2024', value: 'Rp 1.250.000.000', help: 'Estimasi APBDes', color: 'primary.main' },
    { label: 'Realisasi Belanja', value: '85%', help: 'Update per Juni 2024', color: 'info.main' },
    { label: 'Indeks Stunting', value: 'Turun 12%', help: 'Capaian Kesehatan Desa', color: 'success.main' },
  ];

  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '32px',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
            }}
          >
            <Chip label="KETERBUKAAN INFORMASI" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Transparansi Dana Desa</Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Wujud keterbukaan informasi publik mengenai pengelolaan Anggaran Pendapatan dan Belanja Desa (APBDes) untuk mewujudkan pemerintahan yang bersih dan akuntabel.
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: '28px',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                  }}
                  elevation={0}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>{stat.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{stat.help}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 4, borderRadius: '24px', borderLeft: '8px solid', borderColor: 'primary.main' }} elevation={0}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Laporan Realisasi Anggaran</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Grafik dan rincian realisasi anggaran secara mendetail sedang dipersiapkan oleh tim keuangan desa untuk publikasi digital sesuai dengan standar keterbukaan informasi nasional (UU KIP). Kami berkomitmen untuk menyajikan data yang akurat dan mudah dipahami oleh seluruh warga.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
