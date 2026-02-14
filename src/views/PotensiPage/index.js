import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Container,
  Stack,
  Paper,
} from '@mui/material';

export default function PotensiPage() {
  const potentials = [
    {
      title: 'Kopi Arabika Ngawonggo',
      desc: 'Salah satu penghasil Kopi Arabika terbaik di lereng Sumbing dengan cita rasa unik tanah vulkanik.',
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Komoditas Hortikultura',
      desc: 'Produksi Cabe (Cabai) dan sayuran segar menjadi andalan ekonomi warga desa.',
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Wisata Religi & Budaya',
      desc: 'Keberadaan Pondok Pesantren besar dan tradisi Nyadran yang tetap lestari.',
      category: 'Wisata',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    },
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
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Potensi & Ekonomi Desa</Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Ngawonggo memiliki kekayaan alam dan budaya yang melimpah, menjadi penggerak utama ekonomi masyarakat menuju kemandirian.
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {potentials.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ borderRadius: '28px', height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderColor: 'primary.main' } }}>
                  <CardMedia component="img" image={item.image} alt={item.title} sx={{ height: 240 }} />
                  <CardContent sx={{ p: 3 }}>
                    <Chip label={item.category} color="primary" size="small" sx={{ mb: 2, fontWeight: 700, borderRadius: '8px' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 4, borderRadius: '24px', borderLeft: '8px solid', borderColor: 'primary.main' }} elevation={0}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>UMKM Desa</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Pemerintah Desa terus mendukung pelaku UMKM lokal, khususnya pengolah kopi dan kerajinan tangan, untuk menembus pasar digital melalui program pemberdayaan ekonomi kreatif. Kami percaya produk lokal adalah masa depan Ngawonggo.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
