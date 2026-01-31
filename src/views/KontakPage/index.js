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
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const ContactInfo = ({ icon, label, value, href }) => {
  return (
    <HStack align="start" spacing={4}>
      <Icon as={icon} color="ngawonggo.green" w={6} h={6} mt={1} />
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold">{label}</Text>
        {href ? (
          <Link href={href} isExternal color="blue.500">
            {value}
          </Link>
        ) : (
          <Text>{value}</Text>
        )}
      </VStack>
    </HStack>
  );
};

const KontakPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')} minH="80vh">
      <Container maxW="container.lg">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="ngawonggo.green">
              Hubungi Kami
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Silakan hubungi kami untuk informasi lebih lanjut, layanan administrasi, atau pertanyaan seputar Desa Ngawonggo.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} w="full">
            <Stack spacing={8} p={8} bg={bgColor} boxShadow="lg" rounded="xl">
              <Heading size="md">Informasi Kontak</Heading>
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
            </Stack>

            <Stack spacing={8} p={8} bg={bgColor} boxShadow="lg" rounded="xl">
              <Heading size="md">Media Sosial</Heading>
              <Stack spacing={4}>
                <HStack spacing={4}>
                  <Icon as={FaInstagram} color="pink.500" w={6} h={6} />
                  <Link href="https://instagram.com/ngawonggo" isExternal>@ngawonggo</Link>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaFacebook} color="blue.600" w={6} h={6} />
                  <Link href="https://facebook.com/desangawonggo" isExternal>Desa Ngawonggo</Link>
                </HStack>
              </Stack>

              <Heading size="md" mt={4}>Lokasi Desa</Heading>
              <Box
                as="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.800000000001!2d110.125!3d-7.485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e8f8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="250px"
                style={{ border: 0, borderRadius: '8px' }}
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
