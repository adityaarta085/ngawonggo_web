import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Card,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const DUSUNS = [
  { name: 'Sedayu', slug: 'sedayu', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=500' },
  { name: 'Gemuh', slug: 'gemuh', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500' },
  { name: 'Krajan Ngawonggo', slug: 'krajan-ngawonggo', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500' },
  { name: 'Baturan', slug: 'baturan', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=500' },
  { name: 'Bulusari', slug: 'bulusari', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=500' },
  { name: 'Kepering', slug: 'kepering', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=500' },
  { name: 'Nglarangan', slug: 'nglarangan', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=500' },
  { name: 'Maron', slug: 'maron', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500' },
  { name: 'Gunung Malang', slug: 'gunung-malang', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500' },
  { name: 'Pengkol', slug: 'pengkol', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=500' },
];

const DusunSection = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center" sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'block',
                mb: 1
              }}
            >
              Jelajahi Wilayah Kami
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Sepuluh Dusun Ngawonggo
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {DUSUNS.map((dusun) => (
            <Grid item xs={6} sm={4} md={2.4} key={dusun.slug}>
              <Card
                sx={{
                  position: 'relative',
                  height: '200px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
                  '&:hover .bg-image': { transform: 'scale(1.1)' }
                }}
              >
                <CardActionArea component={RouterLink} to={`/dusun/${dusun.slug}`} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    image={dusun.image}
                    alt={dusun.name}
                    className="bg-image"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      color: 'white'
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1 }}>
                        Dusun
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {dusun.name}
                      </Typography>
                    </Box>
                    <ChevronRightIcon sx={{ fontSize: 20 }} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DusunSection;
