import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  UnorderedList,
  ListItem,
  Icon,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaShieldAlt, FaUserLock, FaDatabase, FaHandsHelping } from 'react-icons/fa';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" minH="100vh">
      <SEO
        title="Kebijakan Privasi - Desa Ngawonggo"
        description="Kebijakan privasi resmi Pemerintah Desa Ngawonggo terkait perlindungan data pribadi pengguna."
      />

      <Container maxW="container.lg">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Kebijakan Privasi</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Box
          layerStyle="glassCard"
          p={{ base: 6, md: 12 }}
          bg="white"
          borderRadius="3xl"
          boxShadow="soft"
        >
          <VStack align="start" spacing={8}>
            <Box>
              <Heading as="h1" size="2xl" color="brand.500" mb={2}>Kebijakan Privasi</Heading>
              <Text color="gray.500" fontWeight="600">Terakhir Diperbarui: 15 Januari 2026</Text>
            </Box>

            <Divider borderColor="gray.100" />

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaShieldAlt} color="brand.500" boxSize={6} />
                <Heading size="md">1. Komitmen Perlindungan Data</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall">
                Pemerintah Desa Ngawonggo ("Kami") berkomitmen penuh untuk melindungi privasi dan data pribadi setiap pengguna Portal Desa Digital Ngawonggo. Kebijakan ini disusun berdasarkan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong> untuk memastikan transparansi dalam pengelolaan informasi Anda.
              </Text>
            </Box>

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaDatabase} color="brand.500" boxSize={6} />
                <Heading size="md">2. Data yang Kami Kumpulkan</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall">Kami mengumpulkan informasi melalui berbagai interaksi di portal ini, antara lain:</Text>
              <UnorderedList spacing={3} ml={6} mb={4} color="gray.700">
                <ListItem><strong>Informasi Identitas Digital:</strong> Nama, alamat email, dan foto profil yang diperoleh saat Anda melakukan login melalui penyedia pihak ketiga (Google, Discord, X/Twitter, Spotify, Facebook).</ListItem>
                <ListItem><strong>Data Interaktif:</strong> Isi pengaduan masyarakat, komentar pada berita, dan log percakapan dengan Chatbot AI kami.</ListItem>
                <ListItem><strong>Data Aktivitas:</strong> Riwayat progres pembacaan Al-Quran, skor Game Edukasi, dan preferensi bahasa yang tersimpan secara aman di database Supabase.</ListItem>
                <ListItem><strong>Data Teknis:</strong> Alamat IP, jenis perangkat, dan metadata kunjungan yang digunakan murni untuk keamanan dan optimasi performa sistem.</ListItem>
              </UnorderedList>
            </Box>

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaHandsHelping} color="brand.500" boxSize={6} />
                <Heading size="md">3. Tujuan Penggunaan Informasi</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall">Data Anda digunakan secara bertanggung jawab untuk:</Text>
              <UnorderedList spacing={3} ml={6} mb={4} color="gray.700">
                <ListItem>Memberikan akses personal ke fitur-fitur Portal Warga.</ListItem>
                <ListItem>Memproses dan menindaklanjuti pengaduan layanan publik secara efektif.</ListItem>
                <ListItem>Personalisasi pengalaman ibadah pada fitur Digital Quran (penandaan terakhir dibaca).</ListItem>
                <ListItem>Keperluan audit internal dan peningkatan kualitas layanan digital desa.</ListItem>
                <ListItem>Pengiriman informasi penting atau broadcast melalui sistem notifikasi resmi desa.</ListItem>
              </UnorderedList>
            </Box>

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaUserLock} color="brand.500" boxSize={6} />
                <Heading size="md">4. Keamanan dan Penyimpanan</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall">
                Data Anda disimpan menggunakan infrastruktur cloud <strong>Supabase</strong> dengan standar enkripsi industri. Kami memastikan bahwa akses ke data sensitif dibatasi hanya untuk personel administratif yang berwenang melalui sistem otentikasi berlapis.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4}>5. Hak-Hak Pengguna</Heading>
              <Text mb={4} lineHeight="tall">Sebagai pemilik data, Anda memiliki hak penuh untuk:</Text>
              <UnorderedList spacing={3} ml={6} mb={4} color="gray.700">
                <ListItem>Mengakses dan meminta salinan data pribadi yang kami simpan.</ListItem>
                <ListItem>Memperbarui informasi profil melalui pengaturan Portal Warga.</ListItem>
                <ListItem>Meminta penghapusan akun dan data terkait dari database kami (Right to be Forgotten).</ListItem>
                <ListItem>Menarik persetujuan penggunaan data kapan saja dengan risiko kehilangan akses ke fitur tertentu.</ListItem>
              </UnorderedList>
            </Box>

            <Box w="full" p={6} bg="brand.50" borderRadius="2xl" border="1px solid" borderColor="brand.100">
              <Heading size="sm" mb={2} color="brand.700">Hubungi Kami</Heading>
              <Text fontSize="sm" color="brand.800">
                Jika Anda memiliki pertanyaan atau keluhan terkait privasi data, silakan hubungi Tim IT Desa Ngawonggo melalui email: <strong>ngawonggodesa@gmail.com</strong> atau kunjungi Kantor Balai Desa Ngawonggo pada jam kerja.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
