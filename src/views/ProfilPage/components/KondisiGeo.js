import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const KondisiGeo = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Kondisi Geografis
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
        Desa Ngawonggo terletak di lereng Gunung Sumbing, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah.
        Berada pada ketinggian yang cukup signifikan, desa ini menawarkan udara yang sejuk dan pemandangan alam yang memukau.
      </Typography>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Batas Wilayah Desa Ngawonggo:</Typography>
        <Box component="ol" sx={{ pl: 3, m: 0 }}>
          {[
            'Sebelah Utara : Desa Adipura',
            'Sebelah Timur : Desa Kaliangkrik',
            'Sebelah Selatan : Desa Temanggung',
            'Sebelah Barat : Desa Balekerto / Lereng Gunung Sumbing',
          ].map((item, index) => (
            <Typography component="li" key={index} variant="body1" sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Topografi desa didominasi oleh perbukitan and lahan pertanian terasering yang subur.
          Kondisi tanah vulkanik dari Gunung Sumbing menjadikannya sangat cocok untuk budidaya sayuran dan tanaman pangan lainnya.
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Iklim di Desa Ngawonggo tergolong tropis basah dengan curah hujan yang cukup tinggi,
          terutama di musim penghujan, yang mendukung ketersediaan sumber air alami bagi pertanian warga.
        </Typography>
      </Box>
    </Stack>
  );
};

export default KondisiGeo;
