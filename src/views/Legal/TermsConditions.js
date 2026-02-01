import React from 'react';
import { Box, Container, Heading, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <Box py={10}>
      <Container maxW="container.lg">
        <Breadcrumb mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Syarat & Ketentuan</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack align="start" spacing={6}>
          <Heading as="h1" size="xl" color="brand.500">Syarat & Ketentuan</Heading>
          <Text color="gray.500">Terakhir Diperbarui: 1 Mei 2024</Text>

          <Box>
            <Heading size="md" mb={3}>1. Penerimaan Syarat</Heading>
            <Text mb={4}>
              Dengan mengakses dan menggunakan website resmi Desa Ngawonggo, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini serta semua hukum dan peraturan yang berlaku di Republik Indonesia.
            </Text>

            <Heading size="md" mb={3}>2. Penggunaan Layanan</Heading>
            <Text mb={4}>
              Anda setuju untuk menggunakan website ini hanya untuk tujuan yang sah secara hukum. Anda dilarang memposting atau mengirimkan materi yang bersifat mengancam, memfitnah, cabul, atau melanggar hukum dalam fitur komentar maupun pengaduan.
            </Text>

            <Heading size="md" mb={3}>3. Akurasi Informasi</Heading>
            <Text mb={4}>
              Meskipun kami berupaya memberikan informasi yang akurat, Pemerintah Desa Ngawonggo tidak menjamin bahwa semua konten dalam website ini selalu mutakhir atau bebas dari kesalahan teknis. Informasi dalam website ini tidak dapat dijadikan satu-satunya dasar hukum tanpa verifikasi langsung ke kantor desa.
            </Text>

            <Heading size="md" mb={3}>4. Konten Pengguna</Heading>
            <Text mb={4}>
              Setiap komentar atau pengaduan yang Anda kirimkan tetap menjadi tanggung jawab Anda. Kami berhak menghapus komentar yang dianggap tidak pantas tanpa pemberitahuan terlebih dahulu.
            </Text>

            <Heading size="md" mb={3}>5. Hak Kekayaan Intelektual</Heading>
            <Text mb={4}>
              Semua teks, gambar, logo, dan desain dalam website ini adalah milik Pemerintah Desa Ngawonggo kecuali dinyatakan lain. Penggunaan ulang materi untuk tujuan komersial tanpa izin tertulis adalah dilarang.
            </Text>

            <Heading size="md" mb={3}>6. Perubahan Ketentuan</Heading>
            <Text mb={4}>
              Kami berhak untuk mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah diposting di halaman ini.
            </Text>

            <Heading size="md" mb={3}>7. Hukum yang Berlaku</Heading>
            <Text>
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di wilayah Kabupaten Magelang.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsConditions;
