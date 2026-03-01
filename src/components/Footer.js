import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Link,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';

const Footer = ({ ml }) => {
  const bg = useColorModeValue('gray.900', 'gray.950');
  const color = 'gray.400';
  const headingColor = 'white';

  return (
    <Box
      bg={bg}
      color={color}
      pt={16}
      pb={8}
      ml={ml}
      transition="margin 0.3s"
    >
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12} mb={16}>
          {/* Brand & Mission */}
          <VStack align="start" spacing={6}>
            <NgawonggoLogo fontSize="2xl" color="white" />
            <Text fontSize="sm" lineHeight="tall">
              Transformasi Digital Desa Ngawonggo. Berkomitmen untuk transparansi,
              efisiensi pelayanan, dan pemberdayaan masyarakat melalui teknologi.
            </Text>
            <HStack spacing={4}>
              <Link href="#" isExternal _hover={{ color: 'brand.400' }}><Icon as={FaInstagram} boxSize={5} /></Link>
              <Link href="https://tiktok.com/@kelompok1xtjktasm" isExternal _hover={{ color: 'brand.400' }}><Icon as={SiTiktok} boxSize={5} /></Link>
              <Link href="#" isExternal _hover={{ color: 'brand.400' }}><Icon as={FaYoutube} boxSize={5} /></Link>
              <Link href="#" isExternal _hover={{ color: 'brand.400' }}><Icon as={FaFacebook} boxSize={5} /></Link>
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={6}>
            <Text color={headingColor} fontWeight="bold" fontSize="lg">Navigasi</Text>
            <Stack spacing={3} fontSize="sm">
              <Link as={RouterLink} to="/profil" _hover={{ color: 'brand.400' }}>Profil Desa</Link>
              <Link as={RouterLink} to="/pemerintahan" _hover={{ color: 'brand.400' }}>Pemerintahan</Link>
              <Link as={RouterLink} to="/layanan" _hover={{ color: 'brand.400' }}>Layanan Publik</Link>
              <Link as={RouterLink} to="/jelajahi" _hover={{ color: 'brand.400' }}>Potensi Wilayah</Link>
              <Link as={RouterLink} to="/news" _hover={{ color: 'brand.400' }}>Berita Terkini</Link>
            </Stack>
          </VStack>

          {/* Contacts */}
          <VStack align="start" spacing={6}>
            <Text color={headingColor} fontWeight="bold" fontSize="lg">Kontak Kami</Text>
            <Stack spacing={4} fontSize="sm">
              <HStack align="start" spacing={3}>
                <Icon as={FaMapMarkerAlt} color="brand.400" mt={1} />
                <Text>Jl. Raya Ngawonggo, Kec. Tajinan, Kab. Malang, Jawa Timur</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={FaPhone} color="brand.400" />
                <Text>(0341) 123456</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={FaEnvelope} color="brand.400" />
                <Text>info@ngawonggo.desa.id</Text>
              </HStack>
            </Stack>
          </VStack>

          {/* Map / Badge */}
          <VStack align="start" spacing={6}>
             <Text color={headingColor} fontWeight="bold" fontSize="lg">Legal & Kebijakan</Text>
             <Stack spacing={3} fontSize="sm">
                <Link as={RouterLink} to="/privacy-policy" _hover={{ color: 'brand.400' }}>Kebijakan Privasi</Link>
                <Link as={RouterLink} to="/terms-conditions" _hover={{ color: 'brand.400' }}>Syarat & Ketentuan</Link>
                <Link as={RouterLink} to="/admin" _hover={{ color: 'brand.400' }}>Login Administrator</Link>
             </Stack>
             <Image
                src="https://menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png"
                h="40px"
                filter="brightness(0) invert(1)"
                opacity={0.5}
             />
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mb={8} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
          fontSize="xs"
          opacity={0.6}
        >
          <Text textAlign={{ base: 'center', md: 'left' }}>
            © 2026 Pemerintah Desa Ngawonggo. Seluruh Hak Cipta Dilindungi.
          </Text>
          <Text fontStyle="italic" textAlign={{ base: 'center', md: 'right' }}>
            <Link as={RouterLink} to="/credits" _hover={{ color: 'brand.400' }}>Made With SMK Muhammadiyah Bandongan 2026 TJKT A</Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
