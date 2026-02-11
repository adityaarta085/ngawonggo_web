import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiGlobe, FiLayers, FiZap } from 'react-icons/fi';
import heroImage from '../../assets/mockup/Display-Dekstop&Mobile.jpg';

const MotionBox = motion(Box);

const stats = [
  { label: 'Skor Lighthouse Target', value: '95+', desc: 'Fokus Core Web Vitals modern' },
  { label: 'Waktu Deploy', value: '< 2 Menit', desc: 'Optimal untuk CI/CD Vercel' },
  { label: 'Interaksi Animasi', value: '60fps', desc: 'Framer Motion + GPU acceleration' },
];

const pillars = [
  {
    title: 'Modern App Experience',
    description:
      'Tampilan baru dengan visual premium, grid responsif, dan transisi halus untuk pengalaman pengguna kelas atas.',
    icon: FiLayers,
  },
  {
    title: 'Enterprise Performance',
    description:
      'Struktur komponen ringan, lazy friendly, dan siap scaling untuk trafik tinggi tanpa mengorbankan UX.',
    icon: FiZap,
  },
  {
    title: 'Vercel-Ready Delivery',
    description:
      'Pipeline deployment dipersiapkan agar proses publish stabil, cepat, dan sangat mudah untuk iterasi rutin.',
    icon: FiGlobe,
  },
];

const features = [
  'Hero section sinematik dengan efek glow dan gradient generatif',
  'Kartu konten glassmorphism berlapis untuk nuansa futuristik',
  'Micro-interaction modern yang responsif pada hover dan scroll',
  'Arsitektur visual modular untuk pengembangan lanjutan yang cepat',
];

export default function LandingPage() {
  return (
    <Box
      bg="linear-gradient(160deg, #030712 0%, #111827 35%, #0f172a 100%)"
      color="white"
      minH="100vh"
      overflow="hidden"
      position="relative"
      py={{ base: 12, md: 16 }}
    >
      <MotionBox
        position="absolute"
        top="-180px"
        right="-120px"
        h="420px"
        w="420px"
        rounded="full"
        bg="radial-gradient(circle, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0) 65%)"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionBox
        position="absolute"
        bottom="-200px"
        left="-200px"
        h="520px"
        w="520px"
        rounded="full"
        bg="radial-gradient(circle, rgba(168,85,247,0.34) 0%, rgba(168,85,247,0) 70%)"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.65, 0.4, 0.65] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container maxW="7xl" position="relative" zIndex={2}>
        <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap={{ base: 10, lg: 14 }} alignItems="center">
          <Stack spacing={7}>
            <Badge colorScheme="cyan" px={4} py={1} rounded="full" w="fit-content">
              Next-Level Government Digital Experience
            </Badge>

            <Heading fontSize={{ base: '3xl', md: '5xl' }} lineHeight={{ base: 1.2, md: 1.05 }}>
              Website Super Modern untuk
              <Text as="span" display="block" bgGradient="linear(to-r, cyan.300, purple.300)" bgClip="text">
                Performa Maksimal & Animasi Tersmooth
              </Text>
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.200" maxW="2xl">
              Versi terbaru menghadirkan kombinasi visual premium, UX adaptif, dan optimisasi deployment.
              Desain ini disiapkan untuk mendorong akselerasi pengembangan yang jauh melampaui target biasa.
            </Text>

            <Flex gap={4} wrap="wrap">
              <Button
                size="lg"
                rightIcon={<FiArrowRight />}
                colorScheme="cyan"
                bgGradient="linear(to-r, cyan.400, blue.500)"
                _hover={{ bgGradient: 'linear(to-r, cyan.300, blue.400)', transform: 'translateY(-1px)' }}
                as="a"
                href="#inovasi"
              >
                Lihat Inovasi Terbaru
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.600' }}
                as="a"
                href="/kontak"
              >
                Konsultasi Pengembangan
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
              {stats.map((item) => (
                <Stat
                  key={item.label}
                  p={4}
                  rounded="xl"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  backdropFilter="blur(14px)"
                >
                  <StatLabel color="gray.200" fontSize="sm">
                    {item.label}
                  </StatLabel>
                  <StatNumber fontSize="2xl">{item.value}</StatNumber>
                  <StatHelpText color="gray.300" mb={0}>
                    {item.desc}
                  </StatHelpText>
                </Stat>
              ))}
            </SimpleGrid>
          </Stack>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            p={{ base: 3, md: 5 }}
            rounded="2xl"
            bg="linear-gradient(160deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
            border="1px solid"
            borderColor="whiteAlpha.300"
            backdropFilter="blur(18px)"
            boxShadow="0 20px 70px rgba(6, 182, 212, 0.2)"
          >
            <Image src={heroImage} alt="Modern Website Preview" rounded="xl" objectFit="cover" />
          </MotionBox>
        </Grid>

        <Box id="inovasi" mt={{ base: 16, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {pillars.map((pillar, index) => (
              <MotionBox
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                p={6}
                rounded="2xl"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{ transform: 'translateY(-6px)', borderColor: 'cyan.300' }}
              >
                <Flex align="center" gap={3} mb={4}>
                  <Flex h={11} w={11} rounded="xl" bg="cyan.400" align="center" justify="center" color="black">
                    <Icon as={pillar.icon} boxSize={5} />
                  </Flex>
                  <Heading size="md">{pillar.title}</Heading>
                </Flex>
                <Text color="gray.200">{pillar.description}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>

        <Box mt={{ base: 12, md: 16 }} p={{ base: 6, md: 8 }} rounded="2xl" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300">
          <Heading size="lg" mb={5}>
            Upgrade Besar yang Disiapkan
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {features.map((feature) => (
              <Flex key={feature} align="start" gap={3}>
                <Icon as={FiCheckCircle} color="cyan.300" mt={1} />
                <Text color="gray.100">{feature}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
