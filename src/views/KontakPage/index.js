import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Link,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as MapMarkerIcon,
  WhatsApp as WhatsappIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';

const ContactInfo = ({ icon: IconComponent, label, value, href }) => {
  return (
    <Stack direction="row" spacing={3} alignItems="flex-start">
      <Avatar sx={{ bgcolor: 'primary.container', color: 'primary.main', borderRadius: '16px' }}>
        <IconComponent />
      </Avatar>
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>{label}</Typography>
        {href ? (
          <Link href={href} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            {value}
          </Link>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
        )}
      </Box>
    </Stack>
  );
};

const KontakPage = () => {
  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Stack spacing={8}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip label="HUBUNGI KAMI" color="primary" sx={{ fontWeight: 800, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Tetap Terhubung Dengan Kami
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', fontWeight: 400 }}>
              Silakan hubungi kami untuk informasi lebih lanjut, layanan administrasi, atau pertanyaan seputar Desa Ngawonggo. Kami siap melayani Anda.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: '32px', height: '100%' }} elevation={0}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Informasi Kontak</Typography>
                <Stack spacing={4}>
                  <ContactInfo
                    icon={MapMarkerIcon}
                    label="Alamat"
                    value="Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah 56153"
                  />
                  <ContactInfo
                    icon={PhoneIcon}
                    label="Telepon"
                    value="0812-1503-0896"
                    href="tel:081215030896"
                  />
                  <ContactInfo
                    icon={EmailIcon}
                    label="Email"
                    value="ngawonggodesa@gmail.com"
                    href="mailto:ngawonggodesa@gmail.com"
                  />
                  <ContactInfo
                    icon={WhatsappIcon}
                    label="WhatsApp Center"
                    value="+62 812-1503-0896"
                    href="https://wa.me/6281215030896"
                  />
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: '32px', height: '100%' }} elevation={0}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Media Sosial & Lokasi</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Link href="https://instagram.com/ngawonggo" target="_blank" rel="noopener noreferrer">
                    <Avatar sx={{ bgcolor: '#e1306c', color: 'white', borderRadius: '16px', '&:hover': { transform: 'scale(1.1)' }, transition: '0.2s' }}>
                      <InstagramIcon />
                    </Avatar>
                  </Link>
                  <Link href="https://facebook.com/desangawonggo" target="_blank" rel="noopener noreferrer">
                    <Avatar sx={{ bgcolor: '#1877f2', color: 'white', borderRadius: '16px', '&:hover': { transform: 'scale(1.1)' }, transition: '0.2s' }}>
                      <FacebookIcon />
                    </Avatar>
                  </Link>
                </Stack>

                <Box
                  component="iframe"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.800000000001!2d110.125!3d-7.485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e8f8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  sx={{
                    width: '100%',
                    height: '250px',
                    border: 0,
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default KontakPage;
