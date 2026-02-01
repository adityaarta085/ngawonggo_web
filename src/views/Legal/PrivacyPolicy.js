import React from 'react';
import { Box, Container, Heading, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Box py={10}>
      <Container maxW="container.lg">
        <Breadcrumb mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Kebijakan Privasi</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack align="start" spacing={6}>
          <Heading as="h1" size="xl" color="brand.500">Kebijakan Privasi</Heading>
          <Text color="gray.500">Terakhir Diperbarui: 1 Mei 2024</Text>

          <Box>
            <Heading size="md" mb={3}>1. Pendahuluan</Heading>
            <Text mb={4}>
              Pemerintah Desa Ngawonggo ("Kami") berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan website resmi Desa Ngawonggo, sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
            </Text>

            <Heading size="md" mb={3}>2. Data yang Kami Kumpulkan</Heading>
            <Text mb={2}>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami melalui:</Text>
            <Box as="ul" ml={8} mb={4}>
              <li>Formulir Pengaduan (Nama dan isi pesan).</li>
              <li>Kolom Komentar Berita (Nama dan Email).</li>
              <li>Interaksi dengan Chatbot AI.</li>
            </Box>

            <Heading size="md" mb={3}>3. Penggunaan Informasi</Heading>
            <Text mb={2}>Informasi yang dikumpulkan digunakan untuk:</Text>
            <Box as="ul" ml={8} mb={4}>
              <li>Menanggapi pengaduan dan aspirasi warga.</li>
              <li>Menampilkan komentar yang telah disetujui pada artikel berita.</li>
              <li>Meningkatkan layanan digital Desa Ngawonggo.</li>
              <li>Keperluan administrasi pemerintahan desa.</li>
            </Box>

            <Heading size="md" mb={3}>4. Keamanan Data</Heading>
            <Text mb={4}>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi data pribadi Anda dari akses yang tidak sah, pengungkapan, atau penghancuran. Data disimpan secara aman menggunakan enkripsi dan infrastruktur backend Supabase yang terpercaya.
            </Text>

            <Heading size="md" mb={3}>5. Hak Anda</Heading>
            <Text mb={2}>Sesuai UU PDP, Anda memiliki hak untuk:</Text>
            <Box as="ul" ml={8} mb={4}>
              <li>Mengakses data pribadi Anda.</li>
              <li>Memperbarui atau memperbaiki data yang tidak akurat.</li>
              <li>Meminta penghapusan data pribadi Anda dari sistem kami.</li>
            </Box>

            <Heading size="md" mb={3}>6. Kontak Kami</Heading>
            <Text>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui email: <strong>ngawonggodesa@gmail.com</strong> atau kunjungi kantor Desa Ngawonggo.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
