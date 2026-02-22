import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  Link,
  VStack,
  HStack,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const ContactInfo = ({ icon, label, value, href }) => {
  return (
    <HStack align="start" spacing={4}>
      <Flex w={10} h={10} bg="brand.50" borderRadius="xl" align="center" justify="center" flexShrink={0} shadow="inner">
        <Icon as={icon} color="brand.500" w={5} h={5} />
      </Flex>
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold" color="gray.700" fontSize="sm">{label}</Text>
        {href ? (
          <Link href={href} isExternal color="brand.600" fontWeight="600" _hover={{ color: 'blue.500' }}>
            {value}
          </Link>
        ) : (
          <Text color="gray.600">{value}</Text>
        )}
      </VStack>
    </HStack>
  );
};

const KontakPage = () => {
  return (
    <Box py={20} bg="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="brand" px={4} py={1} borderRadius="full" layerStyle="glass">HUBUNGI KAMI</Badge>
            <Heading as="h1" size="3xl" fontWeight="800" color="gray.800">
              Tetap Terhubung Dengan Kami
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl">
              Silakan hubungi kami untuk informasi lebih lanjut, layanan administrasi, atau pertanyaan seputar Desa Ngawonggo. Kami siap melayani Anda.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} w="full">
            <Stack spacing={10} p={10} layerStyle="glassCard">
              <Heading size="lg" color="gray.800">Informasi Kontak</Heading>
              <VStack spacing={8} align="stretch">
                <ContactInfo
                  icon={FaMapMarkerAlt}
                  label="Alamat"
                  value="Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah 56153"
                />
                <ContactInfo
                  icon={FaPhone}
                  label="Telepon"
                  value="0812-1503-0896"
                  href="tel:081215030896"
                />
                <ContactInfo
                  icon={FaEnvelope}
                  label="Email"
                  value="ngawonggodesa@gmail.com"
                  href="mailto:ngawonggodesa@gmail.com"
                />
                <ContactInfo
                  icon={FaWhatsapp}
                  label="WhatsApp Center"
                  value="+62 812-1503-0896"
                  href="https://wa.me/6281215030896"
                />
              </VStack>
            </Stack>

            <Stack spacing={10} p={10} layerStyle="glassCard">
              <Heading size="lg" color="gray.800">Media Sosial & Lokasi</Heading>
              <HStack spacing={6}>
                <Link href="https://instagram.com/ngawonggo" isExternal _hover={{ transform: 'scale(1.1)' }} transition="0.2s">
                  <Flex w={12} h={12} bg="pink.50" borderRadius="2xl" align="center" justify="center" shadow="sm">
                    <Icon as={FaInstagram} color="pink.500" w={6} h={6} />
                  </Flex>
                </Link>
                <Link href="https://facebook.com/desangawonggo" isExternal _hover={{ transform: 'scale(1.1)' }} transition="0.2s">
                  <Flex w={12} h={12} bg="blue.50" borderRadius="2xl" align="center" justify="center" shadow="sm">
                    <Icon as={FaFacebook} color="blue.600" w={6} h={6} />
                  </Flex>
                </Link>
              </HStack>

              <Box
                as="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.968025562562!2d110.104991021157!3d-7.468782779901082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a9a9004c3dad5%3A0x9bfc61f6dbe64b03!2sBalai%20Desa%20Ngawonggo!5e0!3m2!1sid!2sid!4v1771797061918!5m2!1sid!2sid%22"
                width="100%"
                height="300px"
                style={{ border: 0, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                allowFullScreen=""
                loading="lazy"
              />
            </Stack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default KontakPage;
