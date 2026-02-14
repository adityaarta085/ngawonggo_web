import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,

} from '@mui/material';
import {
  Info as InfoIcon,
  VolunteerActivism as HeartIcon,
  Gavel as GavelIcon,
  Campaign as BullhornIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Link as RouterLink } from 'react-router-dom';

const QuickLinks = () => {
  const { language } = useLanguage();

  const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: InfoIcon,
      href: '/profil',
      color: '#137fec',
      description: language === 'id' ? 'Kenali sejarah dan visi kami' : 'Get to know our history'
    },
    {
      label: language === 'id' ? 'Layanan Publik' : 'Public Services',
      icon: HeartIcon,
      href: '/layanan',
      color: '#2D5A27',
      description: language === 'id' ? 'Urus dokumen & administrasi' : 'Manage documents'
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: GavelIcon,
      href: '/pemerintahan',
      color: '#ed8936',
      description: language === 'id' ? 'Struktur organisasi desa' : 'Village organization'
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: BullhornIcon,
      href: '#pengaduan',
      color: '#e53e3e',
      description: language === 'id' ? 'Sampaikan aspirasi Anda' : 'Submit your feedback'
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 6 }}>
          {language === 'id' ? 'Akses Cepat Layanan' : 'Quick Service Access'}
        </Typography>
        <Grid container spacing={3}>
          {links.map((link, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: '28px',
                  height: '100%',
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    borderColor: link.color,
                  },
                }}
              >
                <CardActionArea
                  component={link.href.startsWith('#') ? 'a' : RouterLink}
                  to={link.href.startsWith('#') ? undefined : link.href}
                  href={link.href.startsWith('#') ? link.href : undefined}
                  sx={{ height: '100%', p: 3 }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: `${link.color}15`, // Transparent background
                        color: link.color,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        mx: 'auto',
                      }}
                    >
                      <link.icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                      {link.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {link.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default QuickLinks;
