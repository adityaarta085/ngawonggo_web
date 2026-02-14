import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import DownloadSection from './DownloadSection';

const LogoDesa = () => {
  return (
    <Stack spacing={4}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Logo Desa
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <NgawonggoLogo
          fontSize="4rem"
          iconSize={120}
          color="primary.main"
          flexDirection="column"
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>Makna Logo Desa Ngawonggo</Typography>
        <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
          Logo menampilkan siluet Gunung Sumbing yang melambangkan identitas geografis desa di lereng gunung yang megah.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
          Warna Hijau melambangkan kesuburan tanah dan potensi pertanian sayuran organik yang menjadi tumpuan ekonomi warga.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
          Warna Biru melambangkan kejernihan sumber mata air pegunungan dan langit yang cerah di lereng Sumbing.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <DownloadSection />
    </Stack>
  );
};

export default LogoDesa;
