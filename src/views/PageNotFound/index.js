import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import img404 from '../../assets/Image404.png';

export default function PageNotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
      <Stack spacing={4} alignItems="center">
        <Box
          component="img"
          src={img404}
          alt="page_not_found"
          sx={{ width: '100%', maxWidth: { xs: '300px', lg: '500px' }, height: 'auto', borderRadius: '32px' }}
        />
        <Box>
          <Typography variant="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Halaman ini tidak ditemukan atau dalam tahap pengembangan
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
