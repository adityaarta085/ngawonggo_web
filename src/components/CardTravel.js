import React from 'react';
import {
  Box,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { LocationOn as MapMarkerIcon } from '@mui/icons-material';

const CardTravel = ({ title, location, image }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        height: { xs: '300px', lg: '400px' },
        cursor: 'pointer',
        '&:hover .bg-image': { transform: 'scale(1.1)' },
      }}
    >
      <Box
        className="bg-image"
        sx={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          transition: 'all 0.5s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
          {title}
        </Typography>
        <Button
          component={Link}
          href={location}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          variant="contained"
          startIcon={<MapMarkerIcon />}
          sx={{
            borderRadius: '100px',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Cek Lokasi
        </Button>
      </Box>
    </Box>
  );
};
export default CardTravel;
