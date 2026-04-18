import React from 'react';
import { Box } from '@chakra-ui/react';

const GoogleMap = ({ src, height = '400px', borderRadius = 'xl' }) => {
  if (!src) return <Box h={height} bg="gray.100" borderRadius={borderRadius} display="flex" alignItems="center" justifyContent="center">Peta tidak tersedia</Box>;

  return (
    <Box
      as="iframe"
      src={src}
      width="100%"
      height={height}
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      borderRadius={borderRadius}
      boxShadow="md"
    />
  );
};

export default GoogleMap;
