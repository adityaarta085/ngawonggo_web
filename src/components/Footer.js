
import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Icon,
  HStack,
  Link,
  Divider,
} from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import NgawonggoLogo from './NgawonggoLogo';

const SocialLink = ({ icon, href }) => (
  <Link
    href={href}
    isExternal
    w={10}
    h={10}
    borderRadius="full"
    bg="whiteAlpha.200"
    display="flex"
    alignItems="center"
    justifyContent="center"
    _hover={{ bg: 'brand.500', transform: 'translateY(-2px)' }}
    transition="all 0.3s"
  >
    <Icon as={icon} color="white" />
  </Link>
);

export default function Footer() {
  return (
    <Box bg="accent.blue" color="white" pt={16} pb={8}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12} mb={12}>
          <Stack spacing={6}>
            <NgawonggoLogo fontSize="2xl" />
            <Text color="gray.400" fontSize="sm" lineHeight="tall">
              Website Resmi Pemerintah Desa Ngawonggo. Berkomitmen mewujudkan desa digital yang mandiri, berbudaya, dan sejahtera menuju Indonesia 2045.
            </Text>
            <HStack spacing={4}>
              <SocialLink icon={FaFacebook} href="#" />
              <SocialLink icon={FaInstagram} href="#" />
              <SocialLink icon={FaTwitter} href="#" />
              <SocialLink icon={FaYoutube} href="#" />
            </HStack>
          </Stack>

          <Stack spacing={6}>
            <Text fontWeight="800" fontSize="lg">Tautan Cepat</Text>
            <Stack spacing={3} color="gray.400" fontSize="sm">
              <Link href="/profil" _hover={{ color: 'white' }}>Profil Desa</Link>
              <Link href="/pemerintahan" _hover={{ color: 'white' }}>Pemerintahan</Link>
              <Link href="/layanan" _hover={{ color: 'white' }}>Layanan Publik</Link>
              <Link href="/news" _hover={{ color: 'white' }}>Berita Desa</Link>
              <Link href="/media" _hover={{ color: 'white' }}>Bioskop Desa</Link>
            </Stack>
          </Stack>

          <Stack spacing={6}>
            <Text fontWeight="800" fontSize="lg">Kontak Kami</Text>
            <Stack spacing={4} color="gray.400" fontSize="sm">
              <HStack align="start" spacing={3}>
                <Icon as={FaMapMarkerAlt} color="brand.500" mt={1} />
                <Text>Desa Ngawonggo, Kec. Kaliangkrik, Kab. Magelang, Jawa Tengah 56153</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={FaPhone} color="brand.500" />
                <Text>0812-1503-0896</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={FaEnvelope} color="brand.500" />
                <Text>ngawonggodesa@gmail.com</Text>
              </HStack>
            </Stack>
          </Stack>

          <Stack spacing={6}>
            <Text fontWeight="800" fontSize="lg">Lokasi</Text>
            <Box borderRadius="xl" overflow="hidden" h="200px" bg="gray.700">
               {/* Placeholder for map */}
               <iframe
                title="Peta Lokasi Desa Ngawonggo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31637.36873967073!2d110.0768434!3d-7.5028454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8de97c724773%3A0x5027a76e35689b0!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
               ></iframe>
            </Box>
          </Stack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.200" mb={8} />

        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" color="gray.500" fontSize="xs">
          <Text>© 2024 Pemerintah Desa Ngawonggo. Hak Cipta Dilindungi.</Text>
          <HStack spacing={6} mt={{ base: 4, md: 0 }}>
            <Link href="#">Kebijakan Privasi</Link>
            <Link href="#">Syarat & Ketentuan</Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
