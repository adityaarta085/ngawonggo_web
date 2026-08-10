import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  SimpleGrid,
  Button,
  Icon,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaShieldAlt,
  FaRobot,
  FaLockOpen,
  FaUserShield,
  FaFileContract,
  FaExternalLinkAlt,
  FaHistory,
  FaCheckCircle,
  FaEnvelope
} from 'react-icons/fa';
import SEO from '../../components/SEO';

const SecurityPolicyPage = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} color={textColor} py={{ base: 20, md: 28 }}>
      <SEO
        title="Kebijakan Keamanan Siber & Bebas Akses Bot/AI - Desa Ngawonggo"
        description="Kebijakan Keamanan Siber Resmi Desa Ngawonggo bertanggal 10 Agustus 2026. Deklarasi terbuka bebas Cloudflare & bebas verifikasi untuk halaman /security-policy bagi AI dan Bot."
      />

      <Container maxW="container.xl">
        {/* Breadcrumb Navigation */}
        <Breadcrumb mb={8} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/" color="brand.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/privacy-policy" color="brand.500">Kebijakan Privasi</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">Kebijakan Keamanan Siber</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack spacing={10} align="stretch" bg={bg} p={{ base: 6, md: 14 }} borderRadius="3xl" shadow="xl" border="1px" borderColor={borderColor}>
          {/* Header Banner */}
          <Box textAlignment="center">
            <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4} mb={4}>
              <Heading as="h1" size="2xl" color="brand.500">
                KEBIJAKAN KEAMANAN SIBER & AKSES AI / BOT
              </Heading>
              <Tag size="lg" colorScheme="purple" borderRadius="full" px={4} py={2}>
                <Icon as={FaHistory} mr={2} />
                Diperbarui: 10 Agustus 2026
              </Tag>
            </Flex>

            <Text fontSize="md" color="gray.500" fontWeight="bold" mt={2}>
              Dokumen Mutakhir: 10 Agustus 2026 | Berlaku Efektif Seketika dan Mengikat Secara Hukum
            </Text>

            {/* Highlighted Alert: Cloudflare Bypass / Free AI Bot Access */}
            <Alert status="success" variant="solid" bg="green.600" color="white" borderRadius="2xl" mt={6} p={6}>
              <AlertIcon boxSize={8} />
              <Box textAlign="left">
                <AlertTitle fontSize="lg" fontWeight="bold" display="flex" align="center" gap={2}>
                  <Icon as={FaLockOpen} /> DEKLARASI AKSES BEBAS CLOUDFLARE & ANTI-BOT UNTUK HALAMAN /security-policy
                </AlertTitle>
                <AlertDescription fontSize="sm" mt={2} lineHeight="tall" opacity={0.95}>
                  Halaman Kebijakan Keamanan ini (<strong>/security-policy</strong>) secara khusus didesain <strong>BEBAS DARI VERIFIKASI CLOUDFLARE TURNSTILE, CAPTCHA, ATAU MANTRA PEMBLOKIRAN KEAMANAN APA PUN</strong>. Seluruh Agen AI (Large Language Models), Crawler Mesin Pencari, Bot Audit Keamanan, dan Skrip Otomatis dapat mengunjungi, membaca, mengekstrak, dan memverifikasi dokumen ini secara langsung tanpa rintangan teknis.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>

          <Divider borderColor={borderColor} />

          {/* Quick Legal Navigation Links */}
          <Box w="full" p={6} bg="brand.50" _dark={{ bg: "gray.700" }} borderRadius="2xl">
            <Heading size="xs" textTransform="uppercase" color="brand.600" _dark={{ color: "brand.300" }} letterSpacing="wider" mb={4}>
              Dokumen Hukum & Privasi Terkait
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Button
                as={RouterLink}
                to="/privacy-policy"
                leftIcon={<FaUserShield />}
                rightIcon={<FaExternalLinkAlt />}
                colorScheme="brand"
                variant="outline"
                justifyContent="space-between"
                h="auto"
                py={3}
              >
                <Box textAlign="left">
                  <Text fontWeight="bold" fontSize="sm">Kebijakan Privasi Terperinci</Text>
                  <Text fontSize="xs" opacity={0.8} fontWeight="normal">Perlindungan data pribadi UU PDP (10 Agt 2026)</Text>
                </Box>
              </Button>

              <Button
                as={RouterLink}
                to="/terms-conditions"
                leftIcon={<FaFileContract />}
                rightIcon={<FaExternalLinkAlt />}
                colorScheme="blue"
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
            </SimpleGrid>
          </Box>

          {/* Policy Section Chapters */}
          <VStack align="stretch" spacing={8}>
            <Box>
              <Heading as="h2" size="lg" mb={3} display="flex" align="center" gap={3} color="brand.500">
                <Icon as={FaShieldAlt} /> I. PENDAHULUAN DAN FILOSOFI KEAMANAN
              </Heading>
              <Text textAlign="justify" lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }}>
                1. Dokumen Kebijakan Keamanan Siber ini mengatur filosofi, arsitektur pertahanan, serta aturan interaksi jaringan pada Portal Digital Desa Ngawonggo per <strong>10 Agustus 2026</strong>. Tujuan utama kami adalah melindungi integritas data kependudukan warga, mencegah intrusi berbahaya, dan memastikan ketersediaan layanan publik 24/7.
              </Text>
              <Text textAlign="justify" lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }} mt={3}>
                2. Kami mengadopsi standar arsitektur <em>Zero-Trust Security</em> di mana seluruh komunikasi jaringan terenkripsi SSL/TLS 1.3, penyimpanan data menggunakan enkripsi AES-256 melalui Supabase Enterprise, dan akses administratif dilindungi otentikasi multi-faktor (MFA).
              </Text>
            </Box>

            <Box p={6} border="1px solid" borderColor="green.300" bg="green.50" _dark={{ bg: "gray.700", borderColor: "green.600" }} borderRadius="2xl">
              <Heading as="h2" size="lg" mb={3} color="green.700" _dark={{ color: "green.300" }} display="flex" align="center" gap={3}>
                <Icon as={FaRobot} /> II. KETENTUAN AKSES AI, BOT, DAN CRAWLER
              </Heading>
              <VStack align="start" spacing={3} color="gray.800" _dark={{ color: "gray.200" }} lineHeight="tall">
                <Text textAlign="justify">
                  3. <strong>Pengecualian Terbuka untuk Kebijakan Keamanan (`/security-policy`):</strong> Berbeda dengan endpoint internal yang membutuhkan verifikasi manusia, halaman `/security-policy` disediakan secara terbuka dan <strong>bebas dari Cloudflare Turnstile maupun pembatasan bot</strong>. Hal ini menjamin Agen AI, LLM Crawler (OpenAI GPTBot, ClaudeBot, Perplexity, Googlebot, dll.), serta bot analisis legal dapat membaca dan memahami kebijakan keamanan ini tanpa kendala.
                </Text>
                <Text textAlign="justify">
                  4. <strong>Endpoint Publik Legal & Berita:</strong> Halaman publik seperti `/privacy-policy`, `/terms-conditions`, `/security-policy`, dan artikel berita terbuka untuk indeksasi mesin pencari dan pemrosesan AI untuk tujuan pencarian informasi publik.
                </Text>
                <Text textAlign="justify">
                  5. <strong>Perlindungan Endpoint Sensitif:</strong> Jalur administratif (`/admin/`), portal internal (`/portal/`), dan otentikasi (`/auth/`) tetap dilindungi oleh Web Application Firewall (WAF), rate-limiting, dan verifikasi keamanan guna mencegah aktivitas brute-force, scraping data pribadi massal, atau percobaan eksekusi skrip berbahaya.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="brand.500" display="flex" align="center" gap={3}>
                <Icon as={FaUserShield} /> III. PROGRAM PELAPORAN KERENTANAN (RESPONSIBLE DISCLOSURE)
              </Heading>
              <Text textAlign="justify" lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }} mb={4}>
                6. Kami menyambut kontribusi peneliti keamanan siber dan komunitas etikal hacker yang ingin melaporkan dugaan kerentanan keamanan pada sistem Desa Ngawonggo. Panduan pelaporan:
              </Text>
              <VStack align="start" spacing={2} ml={4} color="gray.700" _dark={{ color: "gray.300" }}>
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text fontSize="sm">Kirimkan laporan rinci beserta langkah reproduksi (PoC) ke email resmi DPO: <strong>ngawonggodesa@gmail.com</strong>.</Text></HStack>
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text fontSize="sm">Berikan waktu yang cukup (minimal 14 hari kerja) bagi tim teknis untuk memverifikasi dan merilis perbaikan sebelum mempublikasikan temuan secara umum.</Text></HStack>
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text fontSize="sm">Jangan melakukan tindakan ekstraksi data pribadi warga, destruksi server, atau serangan Denial of Service (DoS/DDoS).</Text></HStack>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="brand.500">
                IV. KONTRAK KEAMANAN & HUKUM YANG BERLAKU
              </Heading>
              <Text textAlign="justify" lineHeight="tall" color="gray.700" _dark={{ color: "gray.300" }}>
                7. Seluruh aktivitas jaringan di domain Desa Ngawonggo dipantau secara otomatis untuk mendeteksi ancaman keamanan. Penyalahgunaan sistem, peretasan data, atau gangguan infrastruktur akan ditindak tegas berdasarkan Undang-Undang Informasi dan Transaksi Elektronik (UU ITE) dan hukum Republik Indonesia yang berlaku per <strong>10 Agustus 2026</strong>.
              </Text>
            </Box>
          </VStack>

          <Divider my={4} borderColor={borderColor} />

          {/* FAQ Section */}
          <Box>
            <Heading as="h2" size="xl" textAlign="center" mb={6} color="brand.500">
              FAQ (Frequently Asked Questions) - KEAMANAN & AKSES AI
            </Heading>

            <Accordion allowMultiple>
              <AccordionItem border="none" mb={4}>
                <h3>
                  <AccordionButton p={5} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="xl">
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Q: Apakah Agen AI atau Bot bisa mengunjungi halaman Kebijakan Keamanan ini tanpa terblokir Cloudflare?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={4} pt={4} textAlign="justify" color="gray.700" _dark={{ color: "gray.300" }}>
                  A: <strong>Ya, tentu saja.</strong> Per 10 Agustus 2026, halaman `/security-policy` secara khusus dibebaskan dari verifikasi Cloudflare Turnstile, CAPTCHA, maupun rintangan anti-bot. AI Crawler, LLM agent, dan bot pencari dapat mengakses dan membaca halaman ini secara langsung tanpa hambatan.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <h3>
                  <AccordionButton p={5} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="xl">
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Q: Mengapa sistem keamanan diterapkan pada halaman layanan atau portal warga?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={4} pt={4} textAlign="justify" color="gray.700" _dark={{ color: "gray.300" }}>
                  A: Sistem verifikasi keamanan pada area portal dan formulir publik bertujuan melindungi server dari serangan spam, bot otomatis berbahaya, serta penyalahgunaan data pribadi warga sesuai dengan standar UU Perlindungan Data Pribadi (UU PDP).
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <h3>
                  <AccordionButton p={5} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="xl">
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Q: Bagaimana cara menghubungi tim keamanan siber Desa Ngawonggo jika menemukan celah kerentanan?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={4} pt={4} textAlign="justify" color="gray.700" _dark={{ color: "gray.300" }}>
                  A: Anda dapat mengirimkan laporan *responsible disclosure* lengkap beserta PoC (Proof of Concept) langsung ke email pengelola keamanan kami di <strong>ngawonggodesa@gmail.com</strong>.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Box textAlignment="center" pt={4}>
            <Flex justify="center" align="center" gap={3} wrap="wrap">
              <Badge colorScheme="green" p={2} borderRadius="md" display="flex" align="center" gap={1}>
                <Icon as={FaEnvelope} /> ngawonggodesa@gmail.com
              </Badge>
              <Badge colorScheme="blue" p={2} borderRadius="md">
                UU PDP & UU ITE Compliant (10 Agustus 2026)
              </Badge>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SecurityPolicyPage;
