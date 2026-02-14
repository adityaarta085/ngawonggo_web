import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const VisiMisi = () => {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Visi Misi
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Visi
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'primary.main', fontWeight: 600 }}>
          “Mewujudkan Desa Ngawonggo yang Mandiri, Religius, dan Berbudaya Berbasis Potensi Lokal Menuju Era Digital 2045.”
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Misi
        </Typography>
        <Box component="ol" sx={{ pl: 3, m: 0 }}>
          {[
            'Meningkatkan kualitas pelayanan publik melalui transformasi digital.',
            'Mengoptimalkan potensi pertanian kopi dan hortikultura sebagai penggerak ekonomi desa.',
            'Melestarikan nilai-nilai budaya lokal dan memperkuat identitas desa religius.',
            'Membangun infrastruktur desa yang berkelanjutan dan ramah lingkungan.',
          ].map((item, index) => (
            <Typography component="li" key={index} variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

export default VisiMisi;
