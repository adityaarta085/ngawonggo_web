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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Button,
  Tag,
  Badge,
  HStack,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaFileContract,
  FaUserCheck,
  FaBalanceScale,
  FaExclamationTriangle,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaLock,
  FaHistory,
  FaCode
} from 'react-icons/fa';
import SEO from '../../components/SEO';

const TermsConditions = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
      <SEO
        title="Syarat & Ketentuan Penggunaan Resmi - Desa Ngawonggo"
        description="Dokumen hukum resmi mengenai syarat, ketentuan, hak, dan kewajiban penggunaan Portal Desa Digital Ngawonggo. Diperbarui 10 Agustus 2026."
      />

      <Container maxW="container.xl">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/privacy-policy" color="brand.500">Kebijakan Privasi</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Syarat & Ketentuan</BreadcrumbLink>
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
                  Syarat & Ketentuan Penggunaan
                </Heading>
                <Tag size="lg" colorScheme="blue" borderRadius="full" px={4} py={2}>
                  <Icon as={FaHistory} mr={2} />
                  Diperbarui: 10 Agustus 2026
                </Tag>
              </Flex>

              <Text color="gray.500" fontWeight="600" fontSize="lg" mb={4}>
                Perjanjian Lisensi Layanan Digital & Aturan Penggunaan Portal Desa Ngawonggo
              </Text>

              <Alert status="info" variant="left-accent" borderRadius="2xl">
                <AlertIcon />
                <Box>
                  <AlertTitle fontWeight="bold">Persetujuan Perjanjian Hukum yang Mengikat</AlertTitle>
                  <AlertDescription fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                    Dokumen ini merupakan kontrak mengikat secara hukum antara Anda (Pengguna) dan Pemerintah Desa Ngawonggo. Dengan mengakses atau menggunakan portal ini, Anda menyatakan menyetujui seluruh ketentuan per <strong>10 Agustus 2026</strong>.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Links to Other Legal Documents */}
            <Box w="full" p={6} bg="brand.50" _dark={{ bg: "gray.700" }} borderRadius="2xl">
              <Heading size="xs" textTransform="uppercase" color="brand.600" _dark={{ color: "brand.300" }} letterSpacing="wider" mb={4}>
                Tautan Dokumen Legal & Kebijakan Keamanan
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/privacy-policy"
                  leftIcon={<FaShieldAlt />}
                  rightIcon={<FaExternalLinkAlt />}
                  colorScheme="brand"
                  variant="outline"
                  justifyContent="space-between"
                  h="auto"
                  py={3}
                >
                  <Box textAlign="left">
                    <Text fontWeight="bold" fontSize="sm">Kebijakan Privasi Terperinci</Text>
                    <Text fontSize="xs" opacity={0.8} fontWeight="normal">Perlindungan data pribadi & hak subjek data (10 Agt 2026)</Text>
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

            {/* Core Terms Columns */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
              <Box>
                <Flex align="center" mb={4} gap={3}>
                  <Icon as={FaFileContract} color="brand.500" boxSize={6} />
                  <Heading size="md">1. Hak Komunikasi & Korespondensi Resmi</Heading>
                </Flex>
                <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                  Sebagai bagian dari ekosistem digital desa, pengguna yang mendaftarkan akun menyetujui bahwa Pemerintah Desa Ngawonggo berhak mengirimkan informasi publik resmi ke email yang terdaftar.
                </Text>
                <Box p={5} bg="green.50" _dark={{ bg: "gray.700" }} borderRadius="xl" border="1px dashed" borderColor="green.300">
                  <Text fontWeight="bold" color="green.700" _dark={{ color: "green.300" }} mb={2}>
                    Cakupan Komunikasi Publik Positif:
                  </Text>
                  <Text fontSize="sm" color="green.800" _dark={{ color: "green.200" }} lineHeight="tall">
                    Pengiriman email hanya dilakukan untuk kepentingan masyarakat: Pengumuman administrasi kependudukan, update bantuan sosial, peringatan darurat wilayah, kabar pembangunan desa, serta buletin mingguan. Kami menjamin tidak ada spam komersial di luar ketentuan ini.
                  </Text>
                </Box>
              </Box>

              <Box>
                <Flex align="center" mb={4} gap={3}>
                  <Icon as={FaBalanceScale} color="brand.500" boxSize={6} />
                  <Heading size="md">2. Ketentuan Iklan & Promosi UMKM</Heading>
                </Flex>
                <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                  Pemerintah Desa Ngawonggo memegang hak prerogatif untuk menampilkan iklan atau konten bersponsor dari pelaku UMKM lokal guna mendukung operasional platform digital desa.
                </Text>
                <UnorderedList spacing={2} ml={6} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  <ListItem>Prioritas penayangan diberikan pada produk & jasa warga desa Ngawonggo.</ListItem>
                  <ListItem>Pengguna menyetujui keberadaan banner promo yang relevan dan etis.</ListItem>
                  <ListItem>Iklan disajikan tanpa mengorbankan privasi atau menjual data pribadi pengguna.</ListItem>
                </UnorderedList>
              </Box>
            </SimpleGrid>

            {/* Accordion Detailed Terms */}
            <Accordion allowMultiple w="full">
              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaUserCheck} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    3. Kewajiban & Integritas Pengguna Portal
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }}>Setiap pengguna Portal Desa Digital Ngawonggo berkewajiban:</Text>
                  <UnorderedList spacing={3} color="gray.600" _dark={{ color: "gray.400" }}>
                    <ListItem>Menggunakan identitas asli yang terverifikasi melalui penyedia akun OAuth resmi.</ListItem>
                    <ListItem>Menjaga etika, kesantunan, dan kebenaran data dalam fitur interaktif (Komentar, Form Layanan, Pengaduan, AI Chatbot).</ListItem>
                    <ListItem>Dilarang keras melakukan upaya sniffing, kejahatan siber, peretasan, atau injeksi malware ke sistem desa.</ListItem>
                    <ListItem>Segera melaporkan temuan celah keamanan secara bertanggung jawab sesuai panduan di <Link as={RouterLink} to="/security-policy" color="brand.500" fontWeight="bold">Kebijakan Keamanan Siber</Link>.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaCode} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    4. Hak Kekayaan Intelektual & Atribusi Pengembang
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Alert status="success" variant="left-accent" mb={4} borderRadius="xl">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <Text fontWeight="bold">Tim Pengembang Utama:</Text>
                      <Text>
                        Siswa dari <strong>SMK Muhammadiyah Bandongan, Kelas 10 TJKT A, Tahun 2026</strong>. Detail karya dan pengembang dapat dilihat di halaman <Link as={RouterLink} to="/credits" color="brand.600" fontWeight="bold">/credits</Link>.
                      </Text>
                    </Box>
                  </Alert>
                  <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }}>Seluruh materi dan desain portal ini dilindungi hukum hak cipta:</Text>
                  <UnorderedList spacing={3} color="gray.600" _dark={{ color: "gray.400" }}>
                    <ListItem><strong>Hak Cipta Kode & Desain:</strong> Dimiliki oleh Pemerintah Desa Ngawonggo bersama Tim Pengembang SMK Muhammadiyah Bandongan.</ListItem>
                    <ListItem><strong>Data Keagamaan & Berita:</strong> Diperoleh dari sumber API sah / Pemdes Ngawonggo dan dilarang dikomersialkan secara sepihak.</ListItem>
                    <ListItem><strong>Penggunaan Kembali:</strong> Pengutipan materi berita/informasi desa wajib mencantumkan pranala (link) aktif ke `ngawonggo.web.id`.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaLock} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    5. Ketentuan Pengaksesan Otomatis (Bot & AI Crawler)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                    Secara umum, akses otomatis yang mengganggu performa server dilarang. Namun demikian, sesuai dengan prinsip transparansi publik:
                  </Text>
                  <Box p={4} bg="blue.50" _dark={{ bg: "gray.700" }} borderRadius="xl" borderLeft="4px solid" borderColor="blue.500" mb={4}>
                    <HStack mb={2}>
                      <Badge colorScheme="blue">Pengecualian Khusus AI / Bot</Badge>
                    </HStack>
                    <Text fontSize="sm" color="blue.900" _dark={{ color: "blue.200" }} lineHeight="tall">
                      Halaman Kebijakan Keamanan Siber (<strong>/security-policy</strong>) dan halaman hukum legal (<strong>/privacy-policy</strong>, <strong>/terms-conditions</strong>) secara eksplisit **DIBEBASKAN** dari halangan Cloudflare Turnstile, CAPTCHA, atau mekanisme pemblokiran bot, agar dapat dikunjungi dan diverifikasi oleh seluruh Agen AI dan Bot crawler secara terbuka.
                    </Text>
                  </Box>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                    Rincian tata kelola keamanan dan aturan crawling dapat dipelajari secara lengkap di dokumen <Link as={RouterLink} to="/security-policy" color="brand.500" fontWeight="bold">Kebijakan Keamanan Siber (/security-policy)</Link>.
                  </Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaExclamationTriangle} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    6. Batasan Tanggung Jawab & Takedown Maintenance Mode
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <UnorderedList spacing={3} color="gray.600" _dark={{ color: "gray.400" }}>
                    <ListItem><strong>Pemeliharaan (Takedown Mode):</strong> Pemdes Ngawonggo berhak mematikan sementara akses portal untuk perbaikan rutin atau darurat keamanan siber tanpa pemberitahuan terdahulu.</ListItem>
                    <ListItem><strong>Sanggahan AI Chatbot:</strong> Jawaban yang dihasilkan oleh AI Chatbot bersifat bantuan awal. Informasi resmi wajib diverifikasi langsung ke perangkat desa.</ListItem>
                    <ListItem><strong>Force Majeure:</strong> Pemdes Ngawonggo tidak bertanggung jawab atas kegagalan akses akibat bencana alam atau gangguan jaringan seluler/internet nasional.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {/* Sanctions & Law */}
            <Box w="full" p={8} bg="orange.50" _dark={{ bg: "gray.700" }} borderRadius="2xl" border="1px solid" borderColor="orange.200">
              <Heading size="sm" mb={3} color="orange.800" _dark={{ color: "orange.200" }} display="flex" align="center" gap={2}>
                <Icon as={FaExclamationTriangle} /> Sanksi Pelanggaran & Hukum yang Berlaku
              </Heading>
              <Text fontSize="sm" color="orange.900" _dark={{ color: "orange.100" }} lineHeight="tall">
                Pelanggaran terhadap syarat & ketentuan ini dapat berakibat pada pencabutan akses akun, blokir IP, hingga tindakan hukum sesuai Undang-Undang Informasi dan Transaksi Elektronik (UU ITE) dan hukum Republik Indonesia yang berlaku per <strong>10 Agustus 2026</strong>.
              </Text>
            </Box>

            <Flex justify="center" w="full" pt={4}>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Portal Desa Digital Ngawonggo - Dikelola oleh Pemdes Ngawonggo & Dikembangkan oleh SMK Muhammadiyah Bandongan (TJKT A 2026).
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsConditions;
