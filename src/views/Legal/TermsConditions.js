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
  AccordionIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFileContract, FaUserCheck, FaBalanceScale, FaExclamationTriangle } from 'react-icons/fa';
import SEO from '../../components/SEO';

const TermsConditions = () => {
  return (
    <Box py={{ base: 20, md: 28 }} bg="gray.50" minH="100vh">
      <SEO
        title="Syarat & Ketentuan - Desa Ngawonggo"
        description="Syarat dan ketentuan penggunaan portal resmi Desa Ngawonggo."
      />

      <Container maxW="container.lg">
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Syarat & Ketentuan</BreadcrumbLink>
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
              <Heading as="h1" size="2xl" color="brand.500" mb={2}>Syarat & Ketentuan</Heading>
              <Text color="gray.500" fontWeight="600">Terakhir Diperbarui: 15 Januari 2026</Text>
            </Box>

            <Divider borderColor="gray.100" />

            <Box w="full">
              <Flex align="center" mb={4} gap={3}>
                <Icon as={FaFileContract} color="brand.500" boxSize={6} />
                <Heading size="md">1. Penerimaan Ketentuan</Heading>
              </Flex>
              <Text mb={4} lineHeight="tall">
                Dengan mengakses dan menggunakan portal <strong>Desa Digital Ngawonggo</strong>, Anda secara otomatis menyetujui seluruh ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, mohon untuk tidak melanjutkan penggunaan layanan kami.
              </Text>
            </Box>

            <Accordion allowMultiple w="full">
              <AccordionItem border="none" mb={4}>
                <AccordionButton p={4} bg="gray.50" borderRadius="xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaUserCheck} color="brand.500" mr={3} />
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    2. Akun dan Otentikasi
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <UnorderedList spacing={2} ml={6} color="gray.700">
                    <ListItem>Layanan Portal Warga memerlukan otentikasi melalui pihak ketiga (OAuth). Anda bertanggung jawab penuh atas keamanan akun pihak ketiga yang Anda gunakan.</ListItem>
                    <ListItem>Anda wajib memberikan informasi yang akurat dan jujur saat berinteraksi dengan layanan pemerintah desa (seperti fitur Pengaduan).</ListItem>
                    <ListItem>Satu akun hanya diperbolehkan digunakan oleh satu individu pemegang identitas yang sah.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <AccordionButton p={4} bg="gray.50" borderRadius="xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaBalanceScale} color="brand.500" mr={3} />
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    3. Penggunaan Layanan AI & Konten Digital
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <UnorderedList spacing={2} ml={6} color="gray.700">
                    <ListItem><strong>Chatbot AI:</strong> Merupakan asisten digital berbasis kecerdasan buatan. Jawaban yang diberikan bersifat informatif dan tidak dapat dianggap sebagai produk hukum formal tanpa verifikasi staf desa.</ListItem>
                    <ListItem><strong>Digital Quran:</strong> Konten Al-Quran digital disediakan untuk memfasilitasi ibadah warga. Dilarang menyalahgunakan fitur ini untuk tujuan yang tidak semestinya.</ListItem>
                    <ListItem><strong>Game Edukasi:</strong> Disediakan untuk sarana hiburan dan pendidikan. Skor yang tercatat murni untuk tujuan kompetisi sehat antar warga.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <AccordionButton p={4} bg="gray.50" borderRadius="xl" _hover={{ bg: "gray.100" }}>
                  <Icon as={FaExclamationTriangle} color="brand.500" mr={3} />
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    4. Batasan Tanggung Jawab
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text mb={2}>Pemerintah Desa Ngawonggo tidak bertanggung jawab atas:</Text>
                  <UnorderedList spacing={2} ml={6} color="gray.700">
                    <ListItem>Kerugian yang timbul akibat penyalahgunaan akun oleh pihak lain.</ListItem>
                    <ListItem>Ketidakakuratan data yang disebabkan oleh kesalahan input dari pengguna.</ListItem>
                    <ListItem>Gangguan layanan yang terjadi selama masa pemeliharaan (Takedown Mode) atau gangguan infrastruktur internet pihak ketiga.</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box w="full">
              <Heading size="md" mb={4}>5. Hak Kekayaan Intelektual</Heading>
              <Text mb={4} lineHeight="tall">
                Portal ini dikembangkan oleh <strong>SMK Muhammadiyah Bandongan (TJKT A 2026)</strong> atas nama Pemerintah Desa Ngawonggo. Seluruh aset visual, kode program, dan konten berita adalah milik Pemerintah Desa Ngawonggo. Penggunaan materi untuk kepentingan komersial tanpa izin tertulis merupakan pelanggaran hukum.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4}>6. Hukum yang Berlaku</Heading>
              <Text mb={4} lineHeight="tall">
                Syarat dan Ketentuan ini tunduk pada hukum Republik Indonesia. Segala sengketa yang tidak dapat diselesaikan secara musyawarah akan diselesaikan melalui jalur hukum yang berlaku di wilayah hukum Kabupaten Magelang.
              </Text>
            </Box>

            <Box w="full" p={6} bg="orange.50" borderRadius="2xl" border="1px solid" borderColor="orange.100">
              <Heading size="sm" mb={2} color="orange.700">Peringatan Penting</Heading>
              <Text fontSize="sm" color="orange.800">
                Kami berhak menonaktifkan akun atau membatasi akses warga yang terbukti melakukan provokasi, penyebaran berita bohong (hoax), atau tindakan asusila di dalam platform digital desa ini.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsConditions;
