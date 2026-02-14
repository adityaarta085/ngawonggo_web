import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  LocationOn as MapMarkerIcon,
  Group as UsersIcon,
  ArrowBack as ArrowLeftIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Map3D from './Map3D';

const DUSUN_DATA = {
  'sedayu': {
    name: 'Sedayu',
    desc: 'Dusun yang asri dengan pemandangan alam yang memukau.',
    stats: { population: '750', area: '1.5 km²', houses: '180' },
    coords: [110.121, -7.452],
    color: '#38a169',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1000'
  },
  'gemuh': {
    name: 'Gemuh',
    desc: 'Wilayah yang dikenal dengan keramahan warganya.',
    stats: { population: '820', area: '1.2 km²', houses: '205' },
    coords: [110.128, -7.459],
    color: '#3182ce',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000'
  },
  'krajan-ngawonggo': {
    name: 'Krajan Ngawonggo',
    desc: 'Pusat administrasi dan detak jantung perekonomian desa.',
    stats: { population: '1.240', area: '0.8 km²', houses: '310' },
    coords: [110.123, -7.456],
    color: '#ed8936',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000'
  }
};

const DusunPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const fallbackName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const data = DUSUN_DATA[slug] || {
    name: fallbackName,
    desc: `Wilayah Dusun ${fallbackName} yang merupakan bagian integral dari Desa Ngawonggo.`,
    stats: { population: '-', area: '-', houses: '-' },
    coords: [110.123, -7.456],
    color: '#137fec',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000'
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ height: { xs: '40vh', md: '60vh' }, position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src={data.image}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
        />
        <Container maxWidth="lg" sx={{ height: '100%', position: 'relative' }}>
          <Stack sx={{ position: 'absolute', bottom: 48, left: 16 }} spacing={2} alignItems="flex-start">
            <Button
              startIcon={<ArrowLeftIcon />}
              variant="text"
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              onClick={() => navigate('/')}
            >
              Kembali
            </Button>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 800 }}>
              Dusun {data.name}
            </Typography>
            <Chip label="Wilayah Administratif" color="primary" sx={{ fontWeight: 600 }} />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Profil Wilayah</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {data.desc} Dusun {data.name} terus berkontribusi pada kemajuan Desa Ngawonggo.
                </Typography>
              </Paper>

              <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Peta 3D Wilayah</Typography>
                <Box sx={{ height: '500px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                  <Map3D center={data.coords} color={data.color} />
                </Box>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box sx={{ position: { lg: 'sticky' }, top: '100px' }}>
              <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Statistik</Typography>
                <Stack spacing={2.5}>
                  <StatRow icon={UsersIcon} label="Penduduk" value={data.stats.population} />
                  <StatRow icon={MapMarkerIcon} label="Luas" value={data.stats.area} />
                  <StatRow icon={InfoIcon} label="Rumah" value={data.stats.houses} />
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const StatRow = ({ icon: IconComponent, label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <IconComponent sx={{ color: 'primary.main', fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Stack>
    <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
  </Box>
);

export default DusunPage;
