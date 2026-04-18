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
  Flex,
  SimpleGrid,
  Stack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaShieldAlt, FaUserLock, FaDatabase, FaBullhorn, FaAd } from 'react-icons/fa';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" minH="100vh">
      <SEO
        title="Kebijakan Privasi Terperinci - Desa Ngawonggo"
        description="Kebijakan privasi resmi dan menyeluruh Pemerintah Desa Ngawonggo mengenai perlindungan, penggunaan, dan transparansi data pribadi."
      />

      <Container maxW="container.xl">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Kebijakan Privasi (Detail)</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Box
          layerStyle="glassCard"
          p={{ base: 6, md: 16 }}
          bg="white"
          borderRadius="3xl"
          boxShadow="soft"
        >
          <VStack align="start" spacing={10}>
            <Box>
              <Heading as="h1" size="2xl" color="brand.500" mb={4}>Kebijakan Privasi Desa Ngawonggo</Heading>
              <Text color="gray.500" fontWeight="600" fontSize="lg">Versi Komprehensif 2.0 | Terakhir Diperbarui: 15 Januari 2026</Text>
              <Text mt={4} color="gray.600" lineHeight="tall">
                Selamat datang di Kebijakan Privasi Portal Desa Digital Ngawonggo. Kami memahami bahwa data pribadi adalah aset berharga Anda. Dokumen ini menjelaskan secara sangat detail bagaimana kami mengelola informasi Anda dari hulu ke hilir untuk menciptakan ekosistem desa digital yang transparan dan aman.
              </Text>
            </Box>

            <Divider borderColor="gray.100" />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
              <Stack spacing={8}>
                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaShieldAlt} color="brand.500" boxSize={6} />
                    <Heading size="md">1. Dasar Hukum & Filosofi</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700">
                    Kami beroperasi di bawah payung hukum <strong>Undang-Undang Nomor 27 Tahun 2022 (UU PDP)</strong>. Filosofi kami adalah "Data untuk Pemberdayaan", di mana data yang dikumpulkan hanya digunakan untuk kemajuan sosial-ekonomi warga Ngawonggo tanpa mengorbankan privasi individu.
                  </Text>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaDatabase} color="brand.500" boxSize={6} />
                    <Heading size="md">2. Inventaris Data yang Dikumpulkan</Heading>
                  </Flex>
                  <Text mb={4} fontWeight="bold" color="brand.600">A. Data Identitas Langsung (Melalui Login):</Text>
                  <UnorderedList spacing={2} ml={6} mb={4} color="gray.700">
                    <ListItem><strong>Profil Sosial:</strong> Nama lengkap, alamat email primer, ID unik penyedia (Google, Discord, dll), dan foto profil publik.</ListItem>
                    <ListItem><strong>Kredensial Sesi:</strong> Token akses yang dienkripsi untuk menjaga status login Anda tetap aktif (JWT).</ListItem>
                  </UnorderedList>

                  <Text mb={4} fontWeight="bold" color="brand.600">B. Data Interaksi & Perilaku:</Text>
                  <UnorderedList spacing={2} ml={6} mb={4} color="gray.700">
                    <ListItem><strong>Jejak Spiritual:</strong> Progres bacaan surah dan ayat Al-Quran untuk fitur 'Lanjutkan Membaca'.</ListItem>
                    <ListItem><strong>Log Kecerdasan Buatan:</strong> Transkrip percakapan dengan AI Chatbot untuk pelatihan model internal (anonim) dan bantuan darurat.</ListItem>
                    <ListItem><strong>Gamifikasi:</strong> Skor kompetitif, waktu penyelesaian kuis, dan pencapaian dalam Game Edukasi.</ListItem>
                    <ListItem><strong>Aspirasi:</strong> Detail pengaduan, lampiran gambar/dokumen, dan histori balasan admin.</ListItem>
                  </UnorderedList>
                </Box>
              </Stack>

              <Stack spacing={8}>
                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaBullhorn} color="brand.500" boxSize={6} />
                    <Heading size="md">3. Hak Komunikasi & Korespondensi</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700" mb={4}>
                    Dengan mendaftarkan akun di Portal Desa Ngawonggo, Anda memberikan izin kepada Pemerintah Desa untuk menghubungi Anda melalui alamat email yang terdaftar.
                  </Text>
                  <Box p={4} bg="blue.50" borderRadius="xl" borderLeft="4px solid" borderColor="brand.500">
                    <Text fontSize="sm" color="blue.800" fontWeight="bold">Tujuan Komunikasi Positif:</Text>
                    <UnorderedList spacing={1} ml={4} mt={2} fontSize="sm" color="blue.700">
                      <li>Pengumuman resmi kegiatan desa dan bantuan sosial.</li>
                      <li>Informasi darurat terkait keamanan atau bencana wilayah.</li>
                      <li>Update fitur layanan digital terbaru.</li>
                      <li>Undangan partisipasi dalam survei pembangunan desa.</li>
                      <li>E-Newsletter mingguan mengenai kabar prestasi desa.</li>
                    </UnorderedList>
                  </Box>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaAd} color="brand.500" boxSize={6} />
                    <Heading size="md">4. Kebijakan Transparansi Iklan</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700">
                    Saat ini, Portal Desa Ngawonggo adalah <strong>bebas iklan</strong>. Namun, di masa depan, kami mungkin akan menampilkan konten bersponsor atau iklan dari mitra UMKM lokal untuk mendukung pendanaan infrastruktur digital desa. Kami menjamin:
                  </Text>
                  <UnorderedList spacing={2} ml={6} mt={2} color="gray.700">
                    <li>Iklan akan ditandai dengan jelas sebagai "Konten Bersponsor".</li>
                    <li>Kami tidak akan menjual data pribadi Anda kepada pengiklan pihak ketiga.</li>
                    <li>Iklan yang ditampilkan akan disaring agar tetap sesuai dengan norma sosial dan budaya desa.</li>
                  </UnorderedList>
                </Box>
              </Stack>
            </SimpleGrid>

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaUserLock} color="brand.500" boxSize={6} />
                <Heading size="md">5. Keamanan Tingkat Tinggi & Penyimpanan</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall" color="gray.700">
                Kami menggunakan infrastruktur <strong>Enterprise-Grade</strong> melalui Supabase yang berlokasi di data center terstandarisasi. Seluruh komunikasi data dienkripsi dengan protokol SSL/TLS 1.3. Akses administratif menggunakan otentikasi multi-faktor (MFA) dan dipantau 24/7 melalui sistem audit log yang tidak dapat diubah (immutable).
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4}>6. Teknologi Pelacakan (Cookies & Storage)</Heading>
              <Text color="gray.700" mb={4}>
                Kami menggunakan 'Local Storage' dan 'Session Storage' untuk menyimpan preferensi tampilan (Dark Mode), status verifikasi manusia (Anti-Bot), dan data sesi login. Kami tidak menggunakan tracking cookies pihak ketiga yang bersifat invasif untuk tujuan profil psikografis.
              </Text>
            </Box>

            <Box w="full" p={8} bg="brand.500" borderRadius="2xl" color="white" textAlign="center">
              <Heading size="md" mb={3}>Perlindungan Tanpa Henti</Heading>
              <Text fontSize="md" opacity={0.9}>
                Kami percaya privasi adalah hak asasi manusia di dunia digital. Jika Anda merasa data Anda disalahgunakan, segera laporkan kepada Tim Data Protection Officer (DPO) kami di <strong>ngawonggodesa@gmail.com</strong>.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
