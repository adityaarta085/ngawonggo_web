import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Link,
  Container,
  Paper,
} from '@mui/material';
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import ComplaintSystem from './ComplaintSystem';

export default function LayananPage() {
  const services = [
    {
      title: 'Kartu Keluarga (KK)',
      desc: 'Layanan pembuatan KK baru, perubahan data, atau penggantian karena hilang/rusak.',
      icon: InfoIcon,
    },
    {
      title: 'KTP Elektronik',
      desc: 'Panduan perekaman KTP-el dan pengurusan KTP yang hilang atau rusak.',
      icon: EditIcon,
    },
    {
      title: 'Surat Keterangan',
      desc: 'Pembuatan berbagai surat keterangan (Domisili, Tidak Mampu, Usaha, dll).',
      icon: EmailIcon,
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
          Layanan Publik
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', maxWidth: '800px' }}>
          Pemerintah Desa Ngawonggo berkomitmen memudahkan warga dalam mengurus administrasi kependudukan.
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ borderRadius: '28px', height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 4 }}>
                  <service.icon sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{service.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {service.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: '24px', borderStyle: 'dashed', bgcolor: 'grey.50', height: '100%' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <UploadIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Digitalisasi Layanan</Typography>
              </Stack>
              <Typography variant="body2">
                Sesuai Misi Desa, kami sedang mengembangkan sistem form pengajuan online untuk mempercepat proses administrasi warga.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'primary.container', color: 'primary.onContainer', height: '100%' }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Aspirasi & Pengaduan (LAPOR!)</Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Pemerintah Desa Ngawonggo terintegrasi dengan SP4N-LAPOR! Sampaikan keluhan atau saran Anda melalui kanal resmi nasional.
              </Typography>
              <Link href="https://prod.lapor.go.id" target="_blank" rel="noopener noreferrer">
                <Box
                  component="img"
                  src="https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzIvMjEvOTFhZGU2OGEtY2JlNS00YjhmLTgzOTEtZDcxNmQ3ZDRmYWVkLnBuZw=="
                  alt="Logo LAPOR"
                  sx={{
                    height: '40px',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: '8px',
                  }}
                />
              </Link>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10 }}>
          <ComplaintSystem />
        </Box>
      </Container>
    </Box>
  );
}
