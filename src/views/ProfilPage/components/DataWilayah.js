import React from 'react';
import { Box, Typography, Stack, Grid, Paper } from '@mui/material';

const DataWilayah = () => {
  const data = [
    { label: 'Nama Resmi', value: 'Desa Ngawonggo' },
    { label: 'Luas Wilayah', value: '5,34 km²' },
    { label: 'Kecamatan', value: 'Kaliangkrik' },
    { label: 'Kabupaten', value: 'Magelang' },
    { label: 'Provinsi', value: 'Jawa Tengah' },
    { label: 'Koordinat Geografis', value: '-7.485, 110.125' },
    { label: 'Potensi Utama', value: 'Kopi Arabika, Hortikultura, Wisata Religi' },
  ];

  const boundaries = [
    { label: 'Utara', value: 'Desa Adipura' },
    { label: 'Timur', value: 'Desa Kaliangkrik' },
    { label: 'Selatan', value: 'Desa Temanggung' },
    { label: 'Barat', value: 'Desa Balekerto / Lereng Gunung Sumbing' },
  ];

  return (
    <Stack spacing={4}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Data Wilayah
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.5}>
            {data.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 150, color: 'text.secondary' }}>
                  {item.label}
                </Typography>
                <Typography variant="body2">{item.value}</Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Batas Wilayah:</Typography>
              {boundaries.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80, color: 'text.secondary' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2">: {item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              aspectRatio: '16/9'
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.392070388746!2d110.0765!3d-7.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e7e7e7e7e7e%3A0x1234567890abcdef!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1696338806586!5m2!1sen!2sid"
              title="embed_location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DataWilayah;
