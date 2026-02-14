import React from 'react';
import { Box, Typography, Link, Stack, Divider, Container } from '@mui/material';
import DataWilayah from './components/DataWilayah';
import VisiMisi from './components/VisiMisi';
import LogoDesa from './components/LogoDesa';
import KondisiGeo from './components/KondisiGeo';
import Sejarah from './components/Sejarah';
import Demografi from './components/Demografi';

export default function ProfilPage() {
  const sections = [
    { id: 'sejarah', label: 'Sejarah Desa' },
    { id: 'visimisi', label: 'Visi Misi' },
    { id: 'kondisigeografis', label: 'Kondisi Geografis' },
    { id: 'datawilayah', label: 'Data Wilayah' },
    { id: 'demografi', label: 'Demografi' },
    { id: 'logodesa', label: 'Logo Desa' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={8} alignItems="flex-start">
        <Box sx={{ minWidth: '200px', position: { lg: 'sticky' }, top: '100px' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Profil Desa</Typography>
          <Stack spacing={1}>
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                }}
              >
                {section.label}
              </Link>
            ))}
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Stack spacing={6}>
            <Box id="sejarah">
              <Sejarah />
            </Box>
            <Divider />
            <Box id="visimisi">
              <VisiMisi />
            </Box>
            <Divider />
            <Box id="kondisigeografis">
              <KondisiGeo />
            </Box>
            <Divider />
            <Box id="datawilayah">
              <DataWilayah />
            </Box>
            <Divider />
            <Box id="demografi">
              <Demografi />
            </Box>
            <Divider />
            <Box id="logodesa">
              <LogoDesa />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
