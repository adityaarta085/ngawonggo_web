import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const Sejarah = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Sejarah Desa
      </Typography>
      <Box>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Desa Ngawonggo terletak di lereng Gunung Sumbing, sebuah wilayah yang dikenal dengan kesuburan tanah dan udara yang sejuk. Secara historis, Ngawonggo berkembang sebagai pusat pemukiman agraris yang kental dengan nilai-nilai religius.
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Keberadaan beberapa Pondok Pesantren berbasis Nahdlatul Ulama (NU) telah membentuk identitas desa ini sebagai 'Desa Santri' di wilayah Kaliangkrik. Masyarakat Ngawonggo dikenal memegang teguh adat istiadat Jawa yang dipadukan dengan nafas keislaman, menciptakan harmoni sosial yang kuat selama bergenerasi.
        </Typography>
      </Box>
    </Stack>
  );
};

export default Sejarah;
