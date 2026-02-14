
import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Flex,
  Icon,
  Image,
  HStack,
  Link,
  Divider,
} from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';

const SocialLink = ({ icon, href }) => (
  <Link
    href={href}
    isExternal
    w={10}
    h={10}
    borderRadius="full"
    bg="whiteAlpha.100"
    layerStyle="glass"
    display="flex"
    alignItems="center"
    justifyContent="center"
    _hover={{ bg: 'brand.500', transform: 'translateY(-5px)', boxShadow: '0 0 20px rgba(72, 187, 120, 0.4)' }}
    transition="all 0.3s"
  >
    <Icon as={icon} color="white" />
  </Link>
);

export default function Footer() {


  return (
    <Box layerStyle="darkGlass" color="white" pt={20} pb={8} position="relative" overflow="hidden" mt={20} borderTop="1px solid" borderColor="whiteAlpha.200">
      {/* Footer background accent */}
      <Box position="absolute" top="-10%" left="50%" transform="translateX(-50%)" w="80%" h="200px" bgGradient="radial(brand.500 0%, transparent 70%)" opacity={0.1} />

      <Container maxW="container.xl" position="relative">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12} mb={16}>
          <Stack spacing={6}>
            <Box >
              <NgawonggoLogo fontSize="2xl" />
            </Box>
            <Text color="gray.400" fontSize="sm" lineHeight="tall">
              Website Resmi Pemerintah Desa Ngawonggo. Berkomitmen mewujudkan desa digital yang mandiri, berbudaya, dan sejahtera menuju Indonesia 2045.
            </Text>
            <HStack spacing={4}>
              <SocialLink icon={FaFacebook} href="https://www.facebook.com/search/top/?q=Radio%20Komunitas%20Pendowo%20FM%20Pendowo%20Gugah%20Nusantara" />
              <SocialLink icon={FaInstagram} href="https://www.instagram.com/cakwidodo" />
              <SocialLink icon={FaTwitter} href="https://twitter.com/rakompendowo" />
              <SocialLink icon={FaYoutube} href="https://www.youtube.com/@rakompendowo" />
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
            <Text fontWeight="800" fontSize="lg">Layanan Pengaduan</Text>
            <Link href="https://prod.lapor.go.id" isExternal>
              <Image
                src="https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzIvMjEvOTFhZGU2OGEtY2JlNS00YjhmLTgzOTEtZDcxNmQ3ZDRmYWVkLnBuZw=="
                alt="Logo LAPOR"
                h="50px"
                bg="white"
                p={2}
                borderRadius="md"
              />
            </Link>
            <Text color="gray.400" fontSize="xs">
              Sampaikan aspirasi dan pengaduan Anda secara online melalui LAPOR!
            </Text>

            <Text fontWeight="800" fontSize="lg" mt={4}>Lokasi</Text>
            <Box borderRadius="xl" overflow="hidden" h="150px" bg="gray.700">
               <iframe
                title="Peta Lokasi Desa Ngawonggo"
                src="https://maps.google.com/maps?q=Desa%20Ngawonggo%2C%20Kaliangkrik%2C%20Magelang&t=&z=13&ie=UTF8&iwloc=&output=embed"
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

        <VStack spacing={4} align="center" mb={6}>
          <Text fontSize="xs" color="gray.500" fontStyle="italic">
            Made With SMK Muhammadiyah Bandongan 2026 TJKT A
          </Text>
        </VStack>

        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" color="gray.500" fontSize="xs">
          <Text>© 2026 Pemerintah Desa Ngawonggo. Hak Cipta Dilindungi.</Text>
          <HStack spacing={6} mt={{ base: 4, md: 0 }}>
            <Link as={RouterLink} to="/privacy-policy">Kebijakan Privasi</Link>
            <Link as={RouterLink} to="/terms-conditions">Syarat & Ketentuan</Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
