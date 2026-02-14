import React from 'react';
import { Box, Container, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            Beranda
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>Kebijakan Privasi</Typography>
        </Breadcrumbs>

        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>Kebijakan Privasi</Typography>
            <Typography variant="body2" color="text.secondary">Terakhir Diperbarui: 1 Mei 2024</Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>1. Pendahuluan</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Pemerintah Desa Ngawonggo ("Kami") berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan website resmi Desa Ngawonggo, sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>2. Data yang Kami Kumpulkan</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami melalui:</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <li><Typography variant="body1">Formulir Pengaduan (Nama dan isi pesan).</Typography></li>
              <li><Typography variant="body1">Kolom Komentar Berita (Nama dan Email).</Typography></li>
              <li><Typography variant="body1">Interaksi dengan Chatbot AI.</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>3. Penggunaan Informasi</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Informasi yang dikumpulkan digunakan untuk:</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <li><Typography variant="body1">Menanggapi pengaduan dan aspirasi warga.</Typography></li>
              <li><Typography variant="body1">Menampilkan komentar yang telah disetujui pada artikel berita.</Typography></li>
              <li><Typography variant="body1">Meningkatkan layanan digital Desa Ngawonggo.</Typography></li>
              <li><Typography variant="body1">Keperluan administrasi pemerintahan desa.</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>4. Keamanan Data</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi data pribadi Anda dari akses yang tidak sah, pengungkapan, atau penghancuran. Data disimpan secara aman menggunakan enkripsi dan infrastruktur backend Supabase yang terpercaya.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>5. Hak Anda</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Sesuai UU PDP, Anda memiliki hak untuk:</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <li><Typography variant="body1">Mengakses data pribadi Anda.</Typography></li>
              <li><Typography variant="body1">Memperbarui atau memperbaiki data yang tidak akurat.</Typography></li>
              <li><Typography variant="body1">Meminta penghapusan data pribadi Anda dari sistem kami.</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>6. Kontak Kami</Typography>
            <Typography variant="body1">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui email: <strong>ngawonggodesa@gmail.com</strong> atau kunjungi kantor Desa Ngawonggo.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
