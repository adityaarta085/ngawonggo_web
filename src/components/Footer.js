import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  Icon,
  HStack,
  Link,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaGlobe, FaRss, FaShareAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';
import { useLanguage } from '../contexts/LanguageContext';

const FooterLink = ({ children, href }) => (
  <Link
    as={RouterLink}
    to={href}
    fontSize="sm"
    color="gray.400"
    _hover={{ color: 'white', textDecoration: 'none' }}
    transition="color 0.2s"
  >
    {children}
  </Link>
);

export default function Footer() {
  const { language } = useLanguage();

  return (
    <Box bg="slate.900" color="gray.400" pt={20} pb={8} borderTop="1px solid" borderColor="whiteAlpha.100">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12} mb={12}>
          {/* Brand */}
          <VStack align="start" spacing={6}>
            <HStack spacing={3}>
              <Box p={2} bg="whiteAlpha.100" borderRadius="full" border="1px solid" borderColor="whiteAlpha.200">
                <NgawonggoLogo showText={false} iconSize={6} color="ikn.gold" />
              </Box>
              <Heading size="md" color="white" fontWeight="bold" letterSpacing="wide">
                Desa Ngawonggo
              </Heading>
            </HStack>
            <Text fontSize="sm" lineHeight="relaxed">
              {language === 'id'
                ? 'Menuju Desa Digital untuk Semua. Pusat kemandirian ekonomi yang cerdas, hijau, dan berkelanjutan.'
                : 'Towards a Digital Village for All. A center for smart, green, and sustainable economic independence.'}
            </Text>
          </VStack>

          {/* Links 1 */}
          <VStack align="start" spacing={4}>
            <Text color="white" fontWeight="bold" fontSize="base">
              {language === 'id' ? 'Tentang Kami' : 'About Us'}
            </Text>
            <FooterLink href="/profil">{language === 'id' ? 'Sejarah Desa' : 'Village History'}</FooterLink>
            <FooterLink href="/profil#visimisi">{language === 'id' ? 'Visi & Misi' : 'Vision & Mission'}</FooterLink>
            <FooterLink href="/pemerintahan">{language === 'id' ? 'Struktur Organisasi' : 'Organization Structure'}</FooterLink>
            <FooterLink href="/privacy-policy">{language === 'id' ? 'Regulasi' : 'Regulation'}</FooterLink>
          </VStack>

          {/* Links 2 */}
          <VStack align="start" spacing={4}>
            <Text color="white" fontWeight="bold" fontSize="base">
              {language === 'id' ? 'Informasi Publik' : 'Public Information'}
            </Text>
            <FooterLink href="/news">{language === 'id' ? 'Berita & Artikel' : 'News & Articles'}</FooterLink>
            <FooterLink href="/media">{language === 'id' ? 'Galeri & Video' : 'Gallery & Video'}</FooterLink>
            <FooterLink href="/layanan">{language === 'id' ? 'Layanan Mandiri' : 'Self-Service'}</FooterLink>
            <FooterLink href="/kontak">{language === 'id' ? 'Layanan Pengaduan' : 'Complaint Service'}</FooterLink>
          </VStack>

          {/* Contact */}
          <VStack align="start" spacing={4}>
            <Text color="white" fontWeight="bold" fontSize="base">
              {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
            </Text>
            <HStack spacing={3} fontSize="sm">
              <Icon as={FaEnvelope} color="gray.500" />
              <Text>ngawonggodesa@gmail.com</Text>
            </HStack>
            <HStack spacing={3} fontSize="sm">
              <Icon as={FaPhone} color="gray.500" />
              <Text>0812-1503-0896</Text>
            </HStack>
            <HStack spacing={4} mt={2}>
              <Icon as={FaGlobe} cursor="pointer" _hover={{ color: 'white' }} />
              <Icon as={FaRss} cursor="pointer" _hover={{ color: 'white' }} />
              <Icon as={FaShareAlt} cursor="pointer" _hover={{ color: 'white' }} />
            </HStack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mb={8} />

        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={4} fontSize="xs">
          <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
            <Text>© 2026 Pemerintah Desa Ngawonggo. Hak Cipta Dilindungi.</Text>
            <Text fontStyle="italic" color="gray.600">Made With SMK Muhammadiyah Bandongan 2026 TJKT A</Text>
          </VStack>
          <HStack spacing={6}>
            <FooterLink href="/privacy-policy">{language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}</FooterLink>
            <FooterLink href="/terms-conditions">{language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}</FooterLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
