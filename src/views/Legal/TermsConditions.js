import React from 'react';
import { Box, Container, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            Beranda
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>Syarat & Ketentuan</Typography>
        </Breadcrumbs>

        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>Syarat & Ketentuan</Typography>
            <Typography variant="body2" color="text.secondary">Terakhir Diperbarui: 1 Mei 2024</Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>1. Penerimaan Syarat</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Dengan mengakses dan menggunakan website resmi Desa Ngawonggo, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini serta semua hukum dan peraturan yang berlaku di Republik Indonesia.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>2. Penggunaan Layanan</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Anda setuju untuk menggunakan website ini hanya untuk tujuan yang sah secara hukum. Anda dilarang memposting atau mengirimkan materi yang bersifat mengancam, memfitnah, cabul, atau melanggar hukum dalam fitur komentar maupun pengaduan.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>3. Akurasi Informasi</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Meskipun kami berupaya memberikan informasi yang akurat, Pemerintah Desa Ngawonggo tidak menjamin bahwa semua konten dalam website ini selalu mutakhir atau bebas dari kesalahan teknis. Informasi dalam website ini tidak dapat dijadikan satu-satunya dasar hukum tanpa verifikasi langsung ke kantor desa.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>4. Konten Pengguna</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Setiap komentar atau pengaduan yang Anda kirimkan tetap menjadi tanggung jawab Anda. Kami berhak menghapus komentar yang dianggap tidak pantas tanpa pemberitahuan terlebih dahulu.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>5. Hak Kekayaan Intelektual</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Semua teks, gambar, logo, dan desain dalam website ini adalah milik Pemerintah Desa Ngawonggo kecuali dinyatakan lain. Penggunaan ulang materi untuk tujuan komersial tanpa izin tertulis adalah dilarang.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>6. Perubahan Ketentuan</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Kami berhak untuk mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah diposting di halaman ini.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>7. Hukum yang Berlaku</Typography>
            <Typography variant="body1">
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di wilayah Kabupaten Magelang.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default TermsConditions;
