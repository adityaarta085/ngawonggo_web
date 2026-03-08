import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Link,
  VStack,
  HStack,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ContactInfo = ({ icon, label, value, href }) => {
  return (
    <HStack align="start" spacing={5}>
      <Flex w={12} h={12} bg="brand.50" borderRadius="2xl" align="center" justify="center" flexShrink={0} boxShadow="inner">
        <Icon as={icon} color="brand.500" w={6} h={6} />
      </Flex>
      <VStack align="start" spacing={0}>
        <Text fontWeight="800" color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="widest" mb={1}>{label}</Text>
        {href ? (
          <Link href={href} isExternal color="gray.800" fontWeight="700" fontSize="md" _hover={{ color: 'brand.500' }}>
            {value}
          </Link>
        ) : (
          <Text color="gray.800" fontWeight="700" fontSize="md">{value}</Text>
        )}
      </VStack>
    </HStack>
  );
};

const KontakPage = () => {
  return (
    <Box pt={{ base: "20px", md: "40px" }} bg="gray.50" minH="100vh">
      {/* Hero Section */}
      <Box pt={12} pb={20} position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-10%"
          left="-5%"
          w="50%"
          h="120%"
          bgGradient="radial(circle, brand.50 0%, transparent 70%)"
          zIndex={0}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge colorScheme="brand" variant="subtle" px={4} py={1} borderRadius="full" mb={4} fontWeight="900">
                HUBUNGI KAMI
              </Badge>
              <Heading size="3xl" color="accent.green" mb={6} fontWeight="900">
                Layanan <Text as="span" color="brand.500">Responsif</Text> & Terbuka
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto" lineHeight="tall">
                Pemerintah Desa Ngawonggo berkomitmen untuk selalu hadir bagi masyarakat. Jangan ragu
                untuk menghubungi kami melalui kanal resmi di bawah ini.
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={32}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            p={{ base: 8, md: 12 }}
            layerStyle="glassCard"
          >
            <VStack align="start" spacing={10}>
              <Box>
                <Heading size="lg" color="gray.800" mb={4}>Informasi Kontak</Heading>
                <Text color="gray.500">Saluran komunikasi resmi Pemerintah Desa Ngawonggo.</Text>
              </Box>

              <VStack spacing={8} align="stretch" w="full">
                <ContactInfo
                  icon={FaMapMarkerAlt}
                  label="Alamat Kantor Desa"
                  value="Dusun Krajan 01/01 Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah 56153"
                />
                <ContactInfo
                  icon={FaPhone}
                  label="Telepon Kantor"
                  value="0812-1503-0896"
                  href="tel:081215030896"
                />
                <ContactInfo
                  icon={FaEnvelope}
                  label="Alamat Email"
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
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            display="flex"
            flexDirection="column"
            gap={8}
          >
            <Box p={{ base: 8, md: 12 }} layerStyle="glassCard" flex={1}>
              <Heading size="lg" color="gray.800" mb={8}>Media Sosial</Heading>
              <HStack spacing={6}>
                <Link href="https://instagram.com/ngawonggo" isExternal _hover={{ transform: 'scale(1.1)' }} transition="0.3s">
                  <Flex w={16} h={16} bg="pink.50" borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                    <Icon as={FaInstagram} color="pink.500" w={8} h={8} />
                  </Flex>
                </Link>
                <Link href="https://facebook.com/desangawonggo" isExternal _hover={{ transform: 'scale(1.1)' }} transition="0.3s">
                  <Flex w={16} h={16} bg="blue.50" borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                    <Icon as={FaFacebook} color="blue.600" w={8} h={8} />
                  </Flex>
                </Link>
              </HStack>
            </Box>

            <Box
                p={4}
                layerStyle="glassCard"
                h="400px"
                overflow="hidden"
                _hover={{ borderColor: 'brand.500' }}
            >
              <Box
                as="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.968025562562!2d110.104991021157!3d-7.468782779901082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a9a9004c3dad5%3A0x9bfc61f6dbe64b03!2sBalai%20Desa%20Ngawonggo!5e0!3m2!1sid!2sid!4v1771797061918!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '24px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default KontakPage;
