import React, { useEffect, useState } from 'react';
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
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaUsers, FaArrowLeft, FaInfoCircle, FaMosque } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { GoogleMap, Loading } from '../../components';

const StatRow = ({ icon, label, value }) => (
  <Flex justify="space-between" align="center">
    <HStack spacing={3}>
      <Icon as={icon} color="brand.500" />
      <Text fontSize="sm" color="gray.600">{label}</Text>
    </HStack>
    <Text fontWeight="bold" color="gray.800">{value}</Text>
  </Flex>
);

const DusunPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchDusun = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('dusuns')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setData(data);
      }
      setLoading(false);
    };
    fetchDusun();
  }, [slug]);

  if (loading) return <Loading fullPage />;
  if (!data) return (
    <Container maxW="container.xl" py={20} textAlign="center">
      <Heading mb={4}>Dusun Tidak Ditemukan</Heading>
      <Button leftIcon={<FaArrowLeft />} onClick={() => navigate('/')}>Kembali ke Beranda</Button>
    </Container>
  );

  return (
    <Box pb={20}>
      <Box h={{ base: "40vh", md: "60vh" }} position="relative" overflow="hidden">
        <Image src={data.image_url} w="full" h="full" objectFit="cover" filter="brightness(0.6)" />
        <Container maxW="container.xl" h="full" position="relative">
          <VStack position="absolute" bottom={12} left={0} align="start" spacing={4} px={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="solid"
              colorScheme="whiteAlpha"
              color="white"
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
              <Box layerStyle="glassCard" p={8} bg={cardBg}>
                <Heading size="lg" mb={4} color="gray.800">Profil Wilayah</Heading>
                <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
                  {data.description} Dusun {data.name} merupakan bagian dari kebanggaan Desa Ngawonggo yang terus berkembang.
                </Text>
              </Box>

              <Box layerStyle="glassCard" p={8} bg={cardBg}>
                <HStack mb={6} spacing={3}>
                    <Icon as={FaMosque} color="brand.500" w={6} h={6} />
                    <Heading size="lg" color="gray.800">Informasi Masjid</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box borderRadius="xl" overflow="hidden">
                        <Image src={data.masjid_image} alt={data.masjid_name} w="full" h="250px" objectFit="cover" />
                    </Box>
                    <VStack align="start" justify="center" spacing={4}>
                        <Heading size="md">{data.masjid_name}</Heading>
                        <Text color="gray.600">
                            Masjid ini merupakan pusat kegiatan ibadah dan sosial bagi warga Dusun {data.name}.
                            Seluruh dusun di Ngawonggo memiliki masjid sebagai sarana ibadah utama.
                        </Text>
                    </VStack>
                </SimpleGrid>
                <Box mt={6}>
                    <GoogleMap src={data.masjid_location_url} height="300px" />
                </Box>
              </Box>

              <Box layerStyle="glassCard" p={8} bg={cardBg}>
                <Heading size="lg" mb={6} color="gray.800">Peta Lokasi Dusun</Heading>
                <GoogleMap src={data.map_link} height="500px" />
              </Box>
            </VStack>
          </Box>

          <Box>
            <VStack spacing={6} position="sticky" top="100px">
              <Box layerStyle="glassCard" p={6} w="full" bg={cardBg}>
                <Heading size="md" mb={6} color="gray.800">Statistik Dusun</Heading>
                <VStack spacing={4} align="stretch">
                  <StatRow icon={FaUsers} label="Penduduk" value={data.population} />
                  <StatRow icon={FaMapMarkerAlt} label="Luas Wilayah" value={data.area} />
                  <StatRow icon={FaInfoCircle} label="Jumlah Rumah" value={data.houses} />
                </VStack>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default DusunPage;
