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
  Stack,
  Button,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
  Link,
  HStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaUserLock,
  FaDatabase,
  FaBullhorn,
  FaAd,
  FaGavel,
  FaLock,
  FaEnvelope,
  FaFileContract,
  FaExternalLinkAlt,
  FaUserCheck,
  FaHistory
} from 'react-icons/fa';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
      <SEO
        title="Kebijakan Privasi Lengkap & Transparan - Desa Ngawonggo"
        description="Kebijakan privasi resmi dan terperinci Pemerintah Desa Ngawonggo mengenai perlindungan data pribadi sesuai UU PDP No. 27 Tahun 2022. Diperbarui 10 Agustus 2026."
      />

      <Container maxW="container.xl">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/terms-conditions" color="brand.500">Syarat & Ketentuan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Kebijakan Privasi</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Box
          layerStyle="glassCard"
          p={{ base: 6, md: 16 }}
          bg="white" _dark={{ bg: "gray.800" }}
          borderRadius="3xl"
          boxShadow="soft"
        >
          <VStack align="start" spacing={10}>
            <Box w="full">
              <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                <Heading as="h1" size="2xl" color="brand.500">
                  Kebijakan Privasi Desa Ngawonggo
                </Heading>
                <Tag size="lg" colorScheme="green" borderRadius="full" px={4} py={2}>
                  <Icon as={FaHistory} mr={2} />
                  Versi Komprehensif 3.0 (10 Agustus 2026)
                </Tag>
              </Flex>
              
              <Text color="gray.500" fontWeight="600" fontSize="lg" mb={4}>
                Landasan Perlindungan Data & Hak Privasi Digital Warga Desa Ngawonggo
              </Text>

              <Alert status="info" variant="left-accent" borderRadius="2xl">
                <AlertIcon />
                <Box>
                  <AlertTitle fontWeight="bold">Komitmen Keamanan & Perlindungan Data</AlertTitle>
                  <AlertDescription fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                    Pemerintah Desa Ngawonggo berkomitmen penuh melindungi hak privasi setiap warga dan pengguna portal. Kebijakan ini diperbarui secara menyeluruh pada <strong>10 Agustus 2026</strong> untuk menyelaraskan seluruh tata kelola data dengan Undang-Undang Perlindungan Data Pribadi (UU PDP).
                  </AlertDescription>
                </Box>
              </Alert>

              <Text mt={6} color="gray.600" _dark={{ color: "gray.300" }} lineHeight="tall" fontSize="md">
                Selamat datang di Kebijakan Privasi Portal Desa Digital Ngawonggo. Dokumen komprehensif ini menjelaskan secara transparan bagaimana kami mengumpulkan, mengelola, mengamankan, dan memproses data pribadi Anda dari saat Anda mengakses halaman kami hingga penggunaan seluruh fitur digital desa.
              </Text>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Quick Navigation Links to Other Legal Docs */}
            <Box w="full" p={6} bg="brand.50" _dark={{ bg: "gray.700" }} borderRadius="2xl">
              <Heading size="xs" textTransform="uppercase" color="brand.600" _dark={{ color: "brand.300" }} letterSpacing="wider" mb={4}>
                Dokumen Hukum & Keamanan Terkait
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/terms-conditions"
                  leftIcon={<FaFileContract />}
                  rightIcon={<FaExternalLinkAlt />}
                  colorScheme="brand"
                  variant="outline"
                  justifyContent="space-between"
                  h="auto"
                  py={3}
                >
                  <Box textAlign="left">
                    <Text fontWeight="bold" fontSize="sm">Syarat & Ketentuan Penggunaan</Text>
                    <Text fontSize="xs" opacity={0.8} fontWeight="normal">Aturan hukum & kewajiban pengguna (10 Agt 2026)</Text>
                  </Box>
                </Button>

                <Button
                  as={RouterLink}
                  to="/security-policy"
                  leftIcon={<FaLock />}
                  rightIcon={<FaExternalLinkAlt />}
                  colorScheme="red"
                  variant="outline"
                  justifyContent="space-between"
                  h="auto"
                  py={3}
                >
                  <Box textAlign="left">
                    <Text fontWeight="bold" fontSize="sm">Kebijakan Keamanan Siber (/security-policy)</Text>
                    <Text fontSize="xs" opacity={0.8} fontWeight="normal">Akses Bebas AI / Bot & arsitektur keamanan (10 Agt 2026)</Text>
                  </Box>
                </Button>
              </SimpleGrid>
            </Box>

            {/* Main Policy Sections Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
              <Stack spacing={8}>
                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaGavel} color="brand.500" boxSize={6} />
                    <Heading size="md">1. Dasar Hukum & Payung Regulasi</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }}>
                    Pengelolaan data di Portal Desa Ngawonggo beroperasi berdasarkan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>, UU ITE, serta Peraturan Pemerintah tentang Penyelenggaraan Sistem dan Transaksi Elektronik. Prinsip dasar kami adalah kesetaraan, transparansi, serta akuntabilitas publik.
                  </Text>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaDatabase} color="brand.500" boxSize={6} />
                    <Heading size="md">2. Klasifikasi Data yang Dikumpulkan</Heading>
                  </Flex>
                  
                  <Text mb={3} fontWeight="bold" color="brand.600" _dark={{ color: "brand.300" }}>
                    A. Data Identitas Akun Pengguna:
                  </Text>
                  <UnorderedList spacing={2} ml={6} mb={4} color="gray.700" _dark={{ color: "gray.300" }}>
                    <ListItem><strong>Profil Otentikasi:</strong> Nama lengkap, alamat email utama, foto profil, dan ID unik penyedia (Google OAuth / Discord OAuth / Supabase Auth).</ListItem>
                    <ListItem><strong>Kredensial Sesi:</strong> JSON Web Token (JWT) terenkripsi untuk mempertahankan status otentikasi login secara aman.</ListItem>
                  </UnorderedList>

                  <Text mb={3} fontWeight="bold" color="brand.600" _dark={{ color: "brand.300" }}>
                    B. Data Aktivitas & Interaksi Layanan:
                  </Text>
                  <UnorderedList spacing={2} ml={6} mb={4} color="gray.700" _dark={{ color: "gray.300" }}>
                    <ListItem><strong>Aspirasi & Layanan Desa:</strong> Formulir pengaduan masyarakat, lacak status laporan, histori keluhan, dan lampiran pendukung.</ListItem>
                    <ListItem><strong>Interaksi AI Chatbot:</strong> Log pertanyaan dan percakapan dengan Asisten AI Desa untuk membantu pelayanan publik dan evaluasi internal.</ListItem>
                    <ListItem><strong>Layanan Keagamaan & Edukasi:</strong> Bookmark bacaan Al-Quran, riwayat aktivitas Game Edukasi desa, dan partisipasi kuis.</ListItem>
                    <ListItem><strong>Kreativitas & Media:</strong> Unggahan karya warga, komentar publik, dan galeri interaktif komunitas.</ListItem>
                  </UnorderedList>

                  <Text mb={3} fontWeight="bold" color="brand.600" _dark={{ color: "brand.300" }}>
                    C. Data Telemetri & Keamanan:
                  </Text>
                  <UnorderedList spacing={2} ml={6} color="gray.700" _dark={{ color: "gray.300" }}>
                    <ListItem>Alamat IP, jenis peramban, stempel waktu akses, dan log verifikasi anti-bot Cloudflare Turnstile.</ListItem>
                  </UnorderedList>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaUserCheck} color="brand.500" boxSize={6} />
                    <Heading size="md">3. Hak-Hak Subjek Data (Pengguna)</Heading>
                  </Flex>
                  <Text mb={3} color="gray.700" _dark={{ color: "gray.300" }}>
                    Sesuai ketentuan UU PDP, Anda memiliki hak penuh atas data pribadi Anda yang tersimpan di sistem kami:
                  </Text>
                  <UnorderedList spacing={2} ml={6} color="gray.700" _dark={{ color: "gray.300" }}>
                    <ListItem><strong>Hak Akses & Transparansi:</strong> Mengetahui secara jelas data apa saja yang kami simpan.</ListItem>
                    <ListItem><strong>Hak Koreksi:</strong> Memperbarui atau memutus data yang tidak akurat melalui pengaturan profil atau layanan administrasi.</ListItem>
                    <ListItem><strong>Hak Penghapusan (Right to be Forgotten):</strong> Mengajukan permohonan penghapusan permanen akun dan data pribadi dari basis data kami.</ListItem>
                    <ListItem><strong>Hak Penarikan Konsen:</strong> Membatalkan persetujuan penggunaan data untuk notifikasi e-newsletter kapan saja.</ListItem>
                  </UnorderedList>
                </Box>
              </Stack>

              <Stack spacing={8}>
                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaBullhorn} color="brand.500" boxSize={6} />
                    <Heading size="md">4. Kebijakan Komunikasi & Notifikasi</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }} mb={4}>
                    Dengan membuat akun di Portal Desa Ngawonggo, Anda memberikan persetujuan kepada Pemerintah Desa untuk mengirimkan komunikasi elektronik resmi ke email Anda.
                  </Text>
                  <Box p={5} bg="blue.50" _dark={{ bg: "gray.700" }} borderRadius="2xl" borderLeft="4px solid" borderColor="brand.500">
                    <Text fontSize="sm" color="blue.900" _dark={{ color: "blue.200" }} fontWeight="bold" mb={2}>
                      Prinsip Korespondensi Resmi Desa:
                    </Text>
                    <UnorderedList spacing={1} ml={4} fontSize="sm" color="blue.800" _dark={{ color: "blue.300" }}>
                      <li>Pengumuman darurat kebencanaan atau situasi khusus wilayah Desa Ngawonggo.</li>
                      <li>Informasi program pemerintah desa, bantuan sosial, dan pelayanan kependudukan.</li>
                      <li>Update perkembangan transparansi anggaran dan pembangunan fisik/digital.</li>
                      <li>Warta mingguan (E-Newsletter) kabar prestasi warga dan potensi UMKM desa.</li>
                    </UnorderedList>
                  </Box>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaAd} color="brand.500" boxSize={6} />
                    <Heading size="md">5. Transparansi Iklan & Kemitraan UMKM</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }}>
                    Untuk mendukung keberlanjutan infrastruktur digital dan pemberdayaan ekonomi lokal, portal dapat menampilkan banner iklan atau promosi produk UMKM Desa Ngawonggo. Kami memberikan jaminan mutlak:
                  </Text>
                  <UnorderedList spacing={2} ml={6} mt={3} color="gray.700" _dark={{ color: "gray.300" }}>
                    <li><strong>Tidak Ada Penjualan Data:</strong> Data pribadi Anda tidak pernah dijual, disewakan, atau diperdagangkan kepada pihak pengiklan mana pun.</li>
                    <li><strong>Penandaan Jelas:</strong> Setiap konten promosi ditandai secara transparan sebagai "Promosi UMKM" atau "Mitra Desa".</li>
                    <li><strong>Penyaringan Etis:</strong> Materi promosi disaring secara ketat agar selaras dengan norma sosial, etika publik, dan hukum Indonesia.</li>
                  </UnorderedList>
                </Box>

                <Box>
                  <Flex align="center" mb={4} gap={3}>
                    <Icon as={FaUserLock} color="brand.500" boxSize={6} />
                    <Heading size="md">6. Keamanan Enkripsi & Penyimpanan Data</Heading>
                  </Flex>
                  <Text lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }}>
                    Seluruh data Anda disimpan menggunakan infrastruktur cloud <strong>Supabase Enterprise</strong> dengan enkripsi SSL/TLS 1.3 pada lalu lintas jaringan, serta enkripsi AES-256 pada penyimpanan terdiam (data-at-rest). Akses administratif dilindungi otentikasi bertingkat (MFA) dan dipantau melalui log audit tidak dapat diubah (immutable audit log).
                  </Text>
                </Box>
              </Stack>
            </SimpleGrid>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Additional Policy Clarifications */}
            <VStack align="start" spacing={6} w="full">
              <Heading size="md">7. Teknologi Penyimpanan Peramban (Storage & Cookies)</Heading>
              <Text color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                Portal kami menggunakan `LocalStorage` dan `SessionStorage` untuk menyimpan preferensi pengguna (seperti tema Dark/Light Mode, status verifikasi keamanan sesi, dan bookmark pribadi). Kami tidak menggunakan tracking cookies pihak ketiga yang bersifat invasif untuk profiling komersial luar.
              </Text>

              <Heading size="md">8. Akses Otomatis, Bot & Kebijakan Keamanan Siber</Heading>
              <Text color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                Demi menjaga kestabilan server dan perlindungan dari intrusi otomatis, portal ini menerapkan mekanisme deteksi keamanan. Namun khusus untuk halaman Kebijakan Keamanan Siber (<strong>/security-policy</strong>), kami memberlakukan kebijakan khusus <em>Open Access</em> agar dapat diindeks dan dikunjungi oleh AI/Bot crawler secara langsung tanpa rintangan verifikasi. Selengkapnya dapat dibaca pada dokumen <Link as={RouterLink} to="/security-policy" color="brand.500" fontWeight="bold">Kebijakan Keamanan Siber Desa Ngawonggo</Link>.
              </Text>

              <Heading size="md">9. Kontak Data Protection Officer (DPO) & Pengaduan</Heading>
              <Text color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                Jika Anda memiliki pertanyaan, permohonan eksekusi hak privasi (penghapusan/koreksi data), atau laporan dugaan pelanggaran privasi, silakan hubungi Tim Pengelola Data Desa Ngawonggo melalui:
              </Text>
              
              <Flex wrap="wrap" gap={4} p={5} bg="gray.100" _dark={{ bg: "gray.700" }} borderRadius="xl" w="full" align="center" justify="space-between">
                <HStack spacing={3}>
                  <Icon as={FaEnvelope} color="brand.500" boxSize={5} />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">Email DPO & Layanan Privasi:</Text>
                    <Text fontSize="sm" color="brand.600" _dark={{ color: "brand.300" }}>ngawonggodesa@gmail.com</Text>
                  </Box>
                </HStack>
                <Badge colorScheme="brand" px={3} py={1} borderRadius="md">
                  Respon Maksimal 2x24 Jam Kerja
                </Badge>
              </Flex>
            </VStack>

            <Box w="full" p={8} bg="brand.500" borderRadius="2xl" color="white" textAlign="center">
              <Heading size="md" mb={3}>Perlindungan Privasi Berkelanjutan</Heading>
              <Text fontSize="sm" opacity={0.9} maxW="container.md" mx="auto">
                Kebijakan Privasi ini diperbarui secara berkala dan versi berlaku per <strong>10 Agustus 2026</strong> ini mengikat secara hukum bagi seluruh pengguna Portal Desa Digital Ngawonggo.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
