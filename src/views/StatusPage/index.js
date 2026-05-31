import React from 'react';
import { Box } from '@chakra-ui/react';
import SEO from '../../components/SEO';

const StatusPage = () => {
  return (
    <Box minH="100vh" w="100%">
      <SEO
        title="Status Sistem - Desa Ngawonggo"
        description="Pantau status operasional sistem dan layanan Desa Ngawonggo."
      />
      <iframe
        src="https://status.ngawonggo.web.id"
        width="100%"
        height="800"
        style={{ border: 'none', minHeight: '100vh' }}
        title="System Status"
      ></iframe>
    </Box>
  );
};

export default StatusPage;
