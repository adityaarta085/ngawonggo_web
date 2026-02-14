import React from 'react';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LocationOn as MapMarkerIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';

const SocialLink = ({ icon: Icon, href }) => (
  <IconButton
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      bgcolor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      '&:hover': {
        bgcolor: 'primary.main',
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 20px rgba(19, 127, 236, 0.4)',
      },
      transition: 'all 0.3s',
      width: 40,
      height: 40,
    }}
  >
    <Icon fontSize="small" />
  </IconButton>
);

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#0F172A', // Very Dark Blue from theme
        color: 'white',
        pt: 10,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Footer background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '200px',
          background: 'radial-gradient(circle, rgba(19, 127, 236, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={3}>
              <NgawonggoLogo fontSize="1.5rem" color="white" />
              <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.8 }}>
                Website Resmi Pemerintah Desa Ngawonggo. Berkomitmen mewujudkan desa digital yang mandiri, berbudaya, dan sejahtera menuju Indonesia 2045.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <SocialLink icon={Facebook} href="https://www.facebook.com/search/top/?q=Radio%20Komunitas%20Pendowo%20FM%20Pendowo%20Gugah%20Nusantara" />
                <SocialLink icon={Instagram} href="https://www.instagram.com/cakwidodo" />
                <SocialLink icon={Twitter} href="https://twitter.com/rakompendowo" />
                <SocialLink icon={YouTube} href="https://www.youtube.com/@rakompendowo" />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Tautan Cepat</Typography>
              <Stack spacing={1.5}>
                {['Profil Desa', 'Pemerintahan', 'Layanan Publik', 'Berita Desa', 'Bioskop Desa'].map((item) => (
                  <Link
                    key={item}
                    component={RouterLink}
                    to={item === 'Profil Desa' ? '/profil' :
                        item === 'Pemerintahan' ? '/pemerintahan' :
                        item === 'Layanan Publik' ? '/layanan' :
                        item === 'Berita Desa' ? '/news' : '/media'}
                    sx={{ color: 'grey.400', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Kontak Kami</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <MapMarkerIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Desa Ngawonggo, Kec. Kaliangkrik, Kab. Magelang, Jawa Tengah 56153
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>0812-1503-0896</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>ngawonggodesa@gmail.com</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Layanan Pengaduan</Typography>
              <Link href="https://prod.lapor.go.id" target="_blank" rel="noopener noreferrer">
                <Box
                  component="img"
                  src="https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzIvMjEvOTFhZGU2OGEtY2JlNS00YjhmLTgzOTEtZDcxNmQ3ZDRmYWVkLnBuZw=="
                  alt="Logo LAPOR"
                  sx={{
                    height: '50px',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: 1,
                  }}
                />
              </Link>
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                Sampaikan aspirasi dan pengaduan Anda secara online melalui LAPOR!
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 800, mt: 2 }}>Lokasi</Typography>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', height: '150px', bgcolor: 'grey.800' }}>
                <iframe
                  title="Peta Lokasi Desa Ngawonggo"
                  src="https://maps.google.com/maps?q=Desa%20Ngawonggo%2C%20Kaliangkrik%2C%20Magelang&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'grey.600', fontStyle: 'italic', mb: 3 }}>
          Made With SMK Muhammadiyah Bandongan 2026 TJKT A
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'grey.600' }}>
            © 2026 Pemerintah Desa Ngawonggo. Hak Cipta Dilindungi.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/privacy-policy" sx={{ color: 'grey.600', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: 'white' } }}>
              Kebijakan Privasi
            </Link>
            <Link component={RouterLink} to="/terms-conditions" sx={{ color: 'grey.600', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: 'white' } }}>
              Syarat & Ketentuan
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
