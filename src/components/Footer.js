import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  Image,
  VStack,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Link as RouterLink } from 'react-router-dom';

const Footer = ({ ml }) => {
  return (
    <Box bg="accent.blue" color="gray.400" ml={ml} transition="margin 0.3s">
      <Container maxW="container.xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12}>
          <VStack align="start" spacing={8}>
            <HStack spacing={4}>
                <Image src="/logo_desa.png" h="60px" alt="Logo Desa Ngawonggo" />
                <VStack align="start" spacing={0}>
                    <Text color="white" fontWeight="900" fontSize="lg" letterSpacing="tight">DESA NGAWONGGO</Text>
                    <Text fontSize="xs" fontWeight="700" color="brand.400">KABUPATEN MAGELANG</Text>
                </VStack>
            </HStack>
            <Text fontSize="sm" lineHeight="tall" fontWeight="500">
              Mewujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan berbasis digital untuk kesejahteraan masyarakat Ngawonggo.
            </Text>
            <Stack direction="row" spacing={6}>
              <Link href="#" isExternal aria-label="Facebook">
                <Icon as={FaFacebook} w={6} h={6} _hover={{ color: 'brand.400' }} transition="color 0.2s" />
              </Link>
              <Link href="#" isExternal aria-label="Instagram">
                <Icon as={FaInstagram} w={6} h={6} _hover={{ color: 'brand.400' }} transition="color 0.2s" />
              </Link>
              <Link href="#" isExternal aria-label="TikTok">
                <Icon as={SiTiktok} w={6} h={6} _hover={{ color: 'brand.400' }} transition="color 0.2s" />
              </Link>
              <Link href="#" isExternal aria-label="Youtube">
                <Icon as={FaYoutube} w={6} h={6} _hover={{ color: 'brand.400' }} transition="color 0.2s" />
              </Link>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Text color="white" fontWeight="900" fontSize="md" letterSpacing="widest">TAUTAN CEPAT</Text>
            <Stack spacing={4} fontSize="sm" fontWeight="600">
              <Link as={RouterLink} to="/profil" _hover={{ color: 'brand.400' }}>Profil Desa</Link>
              <Link as={RouterLink} to="/pemerintahan" _hover={{ color: 'brand.400' }}>Pemerintahan</Link>
              <Link as={RouterLink} to="/layanan" _hover={{ color: 'brand.400' }}>Layanan Publik</Link>
              <Link as={RouterLink} to="/jelajahi" _hover={{ color: 'brand.400' }}>Jelajahi Wilayah</Link>
              <Link as={RouterLink} to="/transparansi" _hover={{ color: 'brand.400' }}>Transparansi Dana</Link>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Text color="white" fontWeight="900" fontSize="md" letterSpacing="widest">KONTAK KAMI</Text>
            <Stack spacing={5} fontSize="sm" fontWeight="600">
              <Flex align="start" gap={4}>
                <Icon as={FaMapMarkerAlt} mt={1} color="brand.400" />
                <Text>Jl. Ngawonggo No. 1, Kec. Kaliangkrik, Kab. Magelang, Jawa Tengah 56153</Text>
              </Flex>
              <Flex align="center" gap={4}>
                <Icon as={FaPhone} color="brand.400" />
                <Text>+62 (0293) 123-456</Text>
              </Flex>
              <Flex align="center" gap={4}>
                <Icon as={FaEnvelope} color="brand.400" />
                <Text>info@ngawonggo.desa.id</Text>
              </Flex>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Text color="white" fontWeight="900" fontSize="md" letterSpacing="widest">LOKASI KANTOR</Text>
            <Box borderRadius="2xl" overflow="hidden" w="full" h="180px" border="1px solid" borderColor="whiteAlpha.200">
               <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.421455589133!2d110.1118749!3d-7.4479991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e235a8e0b07%3A0x5027a7613568c20!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1710398765432!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Peta Lokasi Desa Ngawonggo"
              ></iframe>
            </Box>
          </VStack>
        </SimpleGrid>

        <Divider mt={20} mb={10} borderColor="whiteAlpha.100" />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={6}
        >
          <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
             <Link as={RouterLink} to="/credits" fontSize="xs" fontStyle="italic" color="whiteAlpha.400" _hover={{ color: 'brand.400' }}>
               Made With SMK Muhammadiyah Bandongan 2026 TJKT A
             </Link>
             <Text fontSize="xs" fontWeight="700" letterSpacing="wider">
                © 2024 GOVERNMENT DESA NGAWONGGO. ALL RIGHTS RESERVED.
             </Text>
          </VStack>

          <Stack direction="row" spacing={8} fontSize="xs" fontWeight="800" color="whiteAlpha.400">
            <Link as={RouterLink} to="/privacy-policy" _hover={{ color: 'white' }}>PRIVACY POLICY</Link>
            <Link as={RouterLink} to="/terms-conditions" _hover={{ color: 'white' }}>TERMS & CONDITIONS</Link>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
