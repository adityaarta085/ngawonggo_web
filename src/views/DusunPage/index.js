
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  Image,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaUsers, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import Map3D from './Map3D';

const DUSUN_DATA = {
  'sedayu': {
    name: 'Sedayu',
    desc: 'Dusun yang asri dengan pemandangan alam yang memukau.',
    stats: { population: '750', area: '1.5 km²', houses: '180' },
    coords: [110.121, -7.452],
    color: 'green.500',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1000'
  },
  'gemuh': {
    name: 'Gemuh',
    desc: 'Wilayah yang dikenal dengan keramahan warganya.',
    stats: { population: '820', area: '1.2 km²', houses: '205' },
    coords: [110.128, -7.459],
    color: 'blue.500',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000'
  },
  'krajan-ngawonggo': {
    name: 'Krajan Ngawonggo',
    desc: 'Pusat administrasi dan detak jantung perekonomian desa.',
    stats: { population: '1.240', area: '0.8 km²', houses: '310' },
    coords: [110.123, -7.456],
    color: 'orange.500',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000'
  }
};

const DusunPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Format slug to name for fallback
  const fallbackName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const data = DUSUN_DATA[slug] || {
    name: fallbackName,
    desc: `Wilayah Dusun ${fallbackName} yang merupakan bagian integral dari Desa Ngawonggo.`,
    stats: { population: '-', area: '-', houses: '-' },
    coords: [110.123, -7.456],
    color: 'brand.500',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000'
  };

  return (
    <Box pb={20}>
      <Box h={{ base: "40vh", md: "60vh" }} position="relative" overflow="hidden">
        <Image src={data.image} w="full" h="full" objectFit="cover" filter="brightness(0.6)" />
        <Container maxW="container.xl" h="full" position="relative">
          <VStack position="absolute" bottom={12} left={0} align="start" spacing={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.300' }}
              onClick={() => navigate('/')}
            >
              Kembali
            </Button>
            <Heading as="h1" size="4xl" color="white" fontWeight="800">
              Dusun {data.name}
            </Heading>
            <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
              Wilayah Administratif
            </Badge>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" mt={-10} position="relative">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          <Box gridColumn={{ lg: "span 2" }}>
            <VStack spacing={8} align="stretch">
              <Box layerStyle="glassCard" p={8}>
                <Heading size="lg" mb={4} color="gray.800">Profil Wilayah</Heading>
                <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
                  {data.desc} Dusun {data.name} terus berkontribusi pada kemajuan Desa Ngawonggo.
                </Text>
              </Box>

              <Box layerStyle="glassCard" p={8}>
                <Heading size="lg" mb={6} color="gray.800">Peta 3D Wilayah</Heading>
                <Box h="500px" borderRadius="xl" overflow="hidden" position="relative">
                  <Map3D center={data.coords} color={data.color} />
                </Box>
              </Box>
            </VStack>
          </Box>

          <Box>
            <VStack spacing={6} position="sticky" top="100px">
              <Box layerStyle="glassCard" p={6} w="full">
                <Heading size="md" mb={6} color="gray.800">Statistik</Heading>
                <VStack spacing={4} align="stretch">
                  <StatRow icon={FaUsers} label="Penduduk" value={data.stats.population} />
                  <StatRow icon={FaMapMarkerAlt} label="Luas" value={data.stats.area} />
                  <StatRow icon={FaInfoCircle} label="Rumah" value={data.stats.houses} />
                </VStack>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const StatRow = ({ icon, label, value }) => (
  <Flex justify="space-between" align="center">
    <HStack spacing={3}>
      <Icon as={icon} color="brand.500" />
      <Text fontSize="sm" color="gray.600">{label}</Text>
    </HStack>
    <Text fontWeight="bold" color="gray.800">{value}</Text>
  </Flex>
);

export default DusunPage;
