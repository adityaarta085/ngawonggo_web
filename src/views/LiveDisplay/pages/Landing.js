import React from 'react';
import { Box, Button, Container, Heading, Text, VStack, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaTv, FaBroadcastTower, FaClock, FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, text }) => {
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      rounded="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      align="start"
      spacing={4}
      _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
      transition="all 0.3s ease"
    >
      <Box p={3} bg="brand.500" rounded="lg" color="white">
        <Icon as={icon} w={6} h={6} />
      </Box>
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </VStack>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={12} py={20} textAlign="center">
          <Box>
            <Heading
              as="h1"
              size="3xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
              mb={6}
            >
              Ngawonggo Live Display
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')} maxW="3xl" mx="auto">
              Sistem Manajemen Konten TV Masjid Modern. Tampilkan jadwal sholat, pengumuman,
              live streaming, dan informasi penting secara realtime.
            </Text>
          </Box>

          <Button
            size="lg"
            colorScheme="brand"
            px={8}
            h={14}
            fontSize="lg"
            onClick={() => navigate('/dashboardlive')}
            rightIcon={<FaTv />}
          >
            Masuk ke Dashboard
          </Button>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full" pt={10}>
            <FeatureCard
              icon={FaClock}
              title="Jadwal Realtime"
              text="Tampilkan jadwal sholat akurat dengan countdown otomatis untuk adzan dan iqomah."
            />
            <FeatureCard
              icon={FaBroadcastTower}
              title="Live Streaming"
              text="Integrasi YouTube Live dan WebRTC Camera untuk siaran langsung kegiatan masjid."
            />
            <FeatureCard
              icon={FaTv}
              title="Smart Slideshow"
              text="Rotasi pengumuman, poster kajian, dan laporan keuangan secara otomatis."
            />
            <FeatureCard
              icon={FaQrcode}
              title="Donasi Digital"
              text="Tampilkan QRIS dinamis untuk mempermudah jamaah dalam berinfaq."
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Landing;
