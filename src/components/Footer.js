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
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Footer = ({ ml }) => {
  return (
    <Box bg="neo.midnight" className="bg-dot-grid" color="white" ml={ml} transition="margin 0.3s" borderTop="4px solid #FFE156" position="relative">
      <Container maxW="container.xl" py={20} position="relative" zIndex={1}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12}>
          <VStack align="start" spacing={8}>
            <HStack spacing={4}>
                <Box bg="neo.yellow" p={2} border="2px solid black" display="inline-block" transform="rotate(-2deg)">
                    <Image src="/logo_desa.png" h="50px" alt="Logo Desa Ngawonggo" />
                </Box>
                <VStack align="start" spacing={0}>
                    <Text fontFamily="heading" color="white" fontWeight="900" fontSize="lg" letterSpacing="tight">DESA NGAWONGGO</Text>
                    <Text fontFamily="accent" fontSize="xs" fontWeight="700" color="neo.yellow" letterSpacing="widest">KABUPATEN MAGELANG</Text>
                </VStack>
            </HStack>
            <Text fontFamily="body" fontSize="sm" lineHeight="tall" fontWeight="500" color="gray.300">
              Mewujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan berbasis digital untuk kesejahteraan masyarakat Ngawonggo.
            </Text>
            <Stack direction="row" spacing={4}>
              <Link href="#" isExternal aria-label="Facebook">
                <MotionBox
                  whileHover={{ scale: 1.1, rotate: -5, bg: '#FFE156', color: 'black' }}
                  p={2}
                  border="2px solid #FFE156"
                  color="#FFE156"
                  transition="all 0.2s"
                >
                  <Icon as={FaFacebook} w={5} h={5} />
                </MotionBox>
              </Link>
              <Link href="#" isExternal aria-label="Instagram">
                <MotionBox
                  whileHover={{ scale: 1.1, rotate: 5, bg: '#FFE156', color: 'black' }}
                  p={2}
                  border="2px solid #FFE156"
                  color="#FFE156"
                  transition="all 0.2s"
                >
                  <Icon as={FaInstagram} w={5} h={5} />
                </MotionBox>
              </Link>
              <Link href="#" isExternal aria-label="TikTok">
                <MotionBox
                  whileHover={{ scale: 1.1, rotate: -5, bg: '#FFE156', color: 'black' }}
                  p={2}
                  border="2px solid #FFE156"
                  color="#FFE156"
                  transition="all 0.2s"
                >
                  <Icon as={SiTiktok} w={5} h={5} />
                </MotionBox>
              </Link>
              <Link href="#" isExternal aria-label="Youtube">
                <MotionBox
                  whileHover={{ scale: 1.1, rotate: 5, bg: '#FFE156', color: 'black' }}
                  p={2}
                  border="2px solid #FFE156"
                  color="#FFE156"
                  transition="all 0.2s"
                >
                  <Icon as={FaYoutube} w={5} h={5} />
                </MotionBox>
              </Link>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Box display="inline-block" bg="neo.yellow" color="black" px={3} py={1} border="2px solid black">
              <Text fontFamily="accent" fontWeight="900" fontSize="sm" letterSpacing="widest">TAUTAN CEPAT</Text>
            </Box>
            <Stack spacing={4} fontSize="sm" fontWeight="bold" fontFamily="heading">
              <Link as={RouterLink} to="/profil" _hover={{ color: 'neo.yellow', paddingLeft: 2 }} transition="all 0.2s">> Profil Desa</Link>
              <Link as={RouterLink} to="/pemerintahan" _hover={{ color: 'neo.yellow', paddingLeft: 2 }} transition="all 0.2s">> Pemerintahan</Link>
              <Link as={RouterLink} to="/layanan" _hover={{ color: 'neo.yellow', paddingLeft: 2 }} transition="all 0.2s">> Layanan Publik</Link>
              <Link as={RouterLink} to="/jelajahi" _hover={{ color: 'neo.yellow', paddingLeft: 2 }} transition="all 0.2s">> Jelajahi Wilayah</Link>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Box display="inline-block" bg="neo.yellow" color="black" px={3} py={1} border="2px solid black">
              <Text fontFamily="accent" fontWeight="900" fontSize="sm" letterSpacing="widest">KONTAK KAMI</Text>
            </Box>
            <Stack spacing={5} fontSize="sm" fontWeight="bold" color="gray.300">
              <Flex align="start" gap={4}>
                <Icon as={FaMapMarkerAlt} mt={1} color="neo.yellow" />
                <Text>Dusun Krajan 01/01 Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah 56153</Text>
              </Flex>
              <Flex align="center" gap={4}>
                <Icon as={FaPhone} color="neo.yellow" />
                <Text>0812-1503-0896</Text>
              </Flex>
              <Flex align="center" gap={4}>
                <Icon as={FaEnvelope} color="neo.yellow" />
                <Text>desangawonggoku@gmail.com</Text>
              </Flex>
            </Stack>
          </VStack>

          <VStack align="start" spacing={6}>
            <Box display="inline-block" bg="neo.yellow" color="black" px={3} py={1} border="2px solid black">
              <Text fontFamily="accent" fontWeight="900" fontSize="sm" letterSpacing="widest">LOKASI KANTOR</Text>
            </Box>
            <Box w="full" h="180px" border="3px solid #FFE156" boxShadow="4px 4px 0px #000" position="relative" zIndex={2}>
               <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.968025562562!2d110.104991021157!3d-7.468782779901082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a9a9004c3dad5%3A0x9bfc61f6dbe64b03!2sBalai%20Desa%20Ngawonggo!5e0!3m2!1sid!2sid!4v1771797061918!5m2!1sid!2sid"
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

        <Divider mt={20} mb={10} borderColor="rgba(255, 225, 86, 0.3)" borderBottomWidth="2px" borderStyle="dashed" />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={6}
        >
          <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
             <Link as={RouterLink} to="/credits" fontSize="xs" fontStyle="italic" color="gray.500" _hover={{ color: 'neo.yellow', textDecoration: 'underline' }}>
               Made With SMK Muhammadiyah Bandongan 2026 TJKT A
             </Link>
             <Text fontFamily="accent" fontSize="xs" fontWeight="900" letterSpacing="wider" color="neo.yellow">
                © 2026 GOVERNMENT DESA NGAWONGGO. ALL RIGHTS RESERVED.
             </Text>
          </VStack>

          <Stack direction="row" spacing={8} fontSize="xs" fontWeight="900" color="gray.500" fontFamily="accent">
            <Link as={RouterLink} to="/privacy-policy" _hover={{ color: 'neo.yellow', textDecoration: 'underline' }}>PRIVACY POLICY</Link>
            <Link as={RouterLink} to="/terms-conditions" _hover={{ color: 'neo.yellow', textDecoration: 'underline' }}>TERMS & CONDITIONS</Link>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
