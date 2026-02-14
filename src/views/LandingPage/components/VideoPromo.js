import React from 'react';
import { Box, Container } from '@mui/material';

const VideoPromo = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          component="iframe"
          src="https://www.youtube.com/embed/Wc7lxuRx0LI"
          sx={{
            width: '100%',
            maxWidth: { md: "700px", lg: '1000px' },
            aspectRatio: '16/9',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: 'none'
          }}
          allowFullScreen
        />
      </Box>
    </Container>
  );
};

export default VideoPromo;
