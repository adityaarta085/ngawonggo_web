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
  SimpleGrid
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFileContract, FaUserCheck, FaBalanceScale, FaExclamationTriangle, FaEnvelopeOpenText, FaAdn } from 'react-icons/fa';
import SEO from '../../components/SEO';

const TermsConditions = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" minH="100vh">
      <SEO
        title="Syarat & Ketentuan Terperinci - Desa Ngawonggo"
        description="Dokumen hukum resmi mengenai syarat, ketentuan, hak, dan kewajiban pengguna Portal Desa Digital Ngawonggo."
      />

      <Container maxW="container.xl">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Syarat & Ketentuan (Lengkap)</BreadcrumbLink>
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
              <Heading as="h1" size="2xl" color="brand.500" mb={4}>Syarat & Ketentuan Penggunaan</Heading>
              <Text color="gray.500" fontWeight="600" fontSize="lg">Perjanjian Layanan Digital | Terakhir Diperbarui: 15 Januari 2026</Text>
              <Alert status="info" variant="left-accent" mt={6} borderRadius="xl">
                <AlertIcon />
                <Box>
                  <AlertTitle>Persetujuan Penggunaan</AlertTitle>
                  <AlertDescription fontSize="sm">
                    Dokumen ini adalah kontrak yang mengikat secara hukum antara Anda dan Pemerintah Desa Ngawonggo. Dengan menggunakan portal ini, Anda menyetujui seluruh aspek teknis, etika, dan hukum yang kami tetapkan.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>

            <Divider borderColor="gray.100" />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
              <Box>
                <Flex align="center" mb={6} gap={3}>
                  <Icon as={FaFileContract} color="brand.500" boxSize={6} />
                  <Heading size="md">1. Hak Komunikasi & Notifikasi</Heading>
                </Flex>
                <Text mb={4} color="gray.700" lineHeight="tall">
                  Sebagai bagian integral dari layanan kami, Anda menyetujui bahwa Pemerintah Desa Ngawonggo memiliki hak untuk mengirimkan korespondensi elektronik (Email) ke alamat yang Anda gunakan saat login.
                </Text>
                <Box p={5} bg="green.50" borderRadius="xl" border="1px dashed" borderColor="green.300">
                  <Text fontWeight="bold" color="green.700" mb={2}>Lingkup Komunikasi Positif:</Text>
                  <Text fontSize="sm" color="green.800">
                    Email yang dikirimkan murni bertujuan untuk kemaslahatan warga, termasuk namun tidak terbatas pada: Informasi administrasi kependudukan, update pembangunan desa, berita duka/bahagia komunitas, dan pemberitahuan layanan publik digital terbaru. Kami menjamin tidak ada spam komersial yang tidak relevan.
                  </Text>
                </Box>
              </Box>

              <Box>
                <Flex align="center" mb={6} gap={3}>
                  <Icon as={FaAdn} color="brand.500" boxSize={6} />
                  <Heading size="md">2. Klausul Konten Sponsor & Iklan</Heading>
                </Flex>
                <Text mb={4} color="gray.700" lineHeight="tall">
                  Meskipun saat ini platform kami beroperasi tanpa iklan, Pemerintah Desa Ngawonggo memegang hak prerogatif untuk memperkenalkan penempatan iklan atau konten bersponsor di masa mendatang.
                </Text>
                <UnorderedList spacing={2} ml={6} fontSize="sm" color="gray.600">
                  <li>Iklan akan difokuskan pada pemberdayaan ekonomi lokal (UMKM Desa).</li>
                  <li>Pengguna tidak dapat menuntut kompensasi atas iklan yang muncul.</li>
                  <li>Kami menjaga agar estetika dan kenyamanan pengguna tetap menjadi prioritas utama meski terdapat iklan.</li>
                </UnorderedList>
              </Box>
            </SimpleGrid>

            <Accordion allowMultiple w="full">
              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaUserCheck} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    3. Kewajiban & Integritas Pengguna
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Text mb={4} color="gray.700">Setiap pengguna Portal Desa Digital Ngawonggo wajib:</Text>
                  <UnorderedList spacing={3} color="gray.600">
                    <li>Menggunakan identitas asli yang terverifikasi melalui provider sosial masing-masing.</li>
                    <li>Menjaga kesantunan dalam setiap fitur interaktif (Komentar, Pengaduan, Chatbot).</li>
                    <li>Tidak melakukan tindakan manipulasi data, hacking, atau percobaan perusakan infrastruktur digital milik desa.</li>
                    <li>Melaporkan jika menemukan bug atau kerentanan keamanan melalui saluran resmi.</li>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaBalanceScale} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    4. Konten Digital & Kekayaan Intelektual
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Text mb={4} color="gray.700">Seluruh materi dalam portal ini dilindungi oleh Undang-Undang Hak Cipta:</Text>
                  <UnorderedList spacing={3} color="gray.600">
                    <li><strong>Atribusi Pengembang:</strong> Portal ini adalah karya kolaboratif <strong>SMK Muhammadiyah Bandongan (TJKT A 2026)</strong>.</li>
                    <li><strong>Data Al-Quran:</strong> Diperoleh dari API terpercaya dan dilarang untuk dikomersialkan ulang oleh pihak manapun.</li>
                    <li><strong>Berita & Foto:</strong> Hak cipta ada pada Pemerintah Desa Ngawonggo. Penggunaan ulang wajib mencantumkan sumber link aktif.</li>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={6}>
                <AccordionButton p={6} bg="gray.50" borderRadius="2xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaExclamationTriangle} color="brand.500" mr={4} boxSize={5} />
                  <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                    5. Batasan Kewajiban & Pemeliharaan (Takedown)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={8}>
                  <Text mb={4} color="gray.700">Kami berupaya menjaga layanan tetap aktif 24/7, namun menyadari bahwa:</Text>
                  <UnorderedList spacing={3} color="gray.600">
                    <li><strong>Takedown Mode:</strong> Kami berhak mematikan akses website sewaktu-waktu untuk pemeliharaan rutin atau darurat keamanan tanpa pemberitahuan sebelumnya.</li>
                    <li><strong>AI Hallucination:</strong> Kami tidak bertanggung jawab atas saran teknis yang salah yang mungkin dihasilkan oleh Chatbot AI. Selalu verifikasi informasi penting secara langsung ke perangkat desa.</li>
                    <li><strong>Force Majeure:</strong> Kami tidak bertanggung jawab atas kegagalan sistem akibat bencana alam atau gangguan infrastruktur internet global.</li>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box w="full" p={8} bg="orange.50" borderRadius="2xl" border="1px solid" borderColor="orange.200">
              <Heading size="sm" mb={3} color="orange.700" display="flex" align="center" gap={2}>
                <Icon as={FaExclamationTriangle} /> Pelanggaran & Sanksi
              </Heading>
              <Text fontSize="sm" color="orange.900" lineHeight="tall">
                Pelanggaran terhadap syarat ini dapat mengakibatkan: (1) Peringatan keras melalui email; (2) Pemblokiran akses akun sementara atau permanen; (3) Pelaporan kepada pihak kepolisian jika ditemukan unsur tindak pidana siber sesuai UU ITE yang berlaku di Indonesia.
              </Text>
            </Box>

            <Flex justify="center" w="full" pt={4}>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Portal Desa Digital Ngawonggo - Mewujudkan Transparansi Melalui Teknologi Tepat Guna.
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsConditions;
