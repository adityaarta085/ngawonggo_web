import React, { useState, useEffect } from 'react';
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
  Skeleton,

} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaUsers, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const DusunPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDusun = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('dusuns')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching dusun:', error);
        // Fallback or 404
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchDusun();
  }, [slug]);

  if (loading) {
    return (
      <Box pb={20}>
        <Skeleton h={{ base: "40vh", md: "60vh" }} />
        <Container maxW="container.xl" mt={-10}>
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            <Box gridColumn={{ lg: "span 2" }}>
               <Skeleton h="200px" mb={8} />
               <Skeleton h="500px" />
            </Box>
            <Box>
               <Skeleton h="300px" />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  if (!data) {
    return (
      <Container py={20} textAlign="center">
        <Heading>Dusun Tidak Ditemukan</Heading>
        <Button mt={4} onClick={() => navigate('/')}>Kembali ke Beranda</Button>
      </Container>
    );
  }

  const getMapUrl = () => {
    if (data.map_link) return data.map_link;
    if (data.coordinates) {
      const [lat, lng] = data.coordinates.split(',');
      return `https://maps.google.com/maps?q=${lat.trim()},${lng.trim()}&t=k&z=17&output=embed`;
    }
    return "";
  };

  return (
    <Box pb={20}>
      <Box h={{ base: "40vh", md: "60vh" }} position="relative" overflow="hidden">
        <Image src={data.image_url} w="full" h="full" objectFit="cover" filter="brightness(0.6)" />
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
            <Heading as="h1" size={{ base: "2xl", md: "4xl" }} color="white" fontWeight="800">
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
                  {data.description}
                </Text>
              </Box>

              <Box layerStyle="glassCard" p={8}>
                <Heading size="lg" mb={6} color="gray.800">Peta Satelit Wilayah</Heading>
                <Box h="500px" borderRadius="xl" overflow="hidden" position="relative">
                   {getMapUrl() ? (
                     <iframe title="Peta Satelit Dusun"
                       width="100%"
                       height="100%"
                       style={{ border: 0 }}
                       src={getMapUrl()}
                       allowFullScreen
                       loading="lazy"
                     ></iframe>
                   ) : (
                     <Flex h="full" align="center" justify="center" bg="gray.100">
                        <Text color="gray.500">Peta tidak tersedia</Text>
                     </Flex>
                   )}
                </Box>
              </Box>
            </VStack>
          </Box>

          <Box>
            <VStack spacing={6} position="sticky" top="100px">
              <Box layerStyle="glassCard" p={6} w="full">
                <Heading size="md" mb={6} color="gray.800">Statistik</Heading>
                <VStack spacing={4} align="stretch">
                  <StatRow icon={FaUsers} label="Penduduk" value={data.population} />
                  <StatRow icon={FaMapMarkerAlt} label="Luas" value={data.area} />
                  <StatRow icon={FaInfoCircle} label="Rumah" value={data.houses} />
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
    <Text fontWeight="bold" color="gray.800">{value || '-'}</Text>
  </Flex>
);

export default DusunPage;
