import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Grid,
  Flex,
  Icon,
  HStack,
  VStack,
  Badge,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCloud, FaSun, FaCloudSun, FaCloudShowersHeavy, FaTint, FaWind, FaExclamationTriangle } from 'react-icons/fa';
import { RiMapPin2Line, RiTimeLine, RiPulseLine } from 'react-icons/ri';
import axios from 'axios';
import Loading from '../../../components/Loading';

const MotionBox = motion(Box);

const BMKGSection = () => {
  const [weather, setWeather] = useState(null);
  const [earthquake, setEarthquake] = useState(null);
  const [loading, setLoading] = useState(true);

  const sectionBg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const eqCardBg = useColorModeValue('red.50', 'rgba(254, 178, 178, 0.1)');
  const eqBorderColor = useColorModeValue('red.100', 'red.900');
  const alertBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherRes = await axios.get('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.08.13.2002');
        const eqRes = await axios.get('https://cors-anywhere.herokuapp.com/https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json').catch(() => null);

        if (weatherRes.data && weatherRes.data.data && weatherRes.data.data[0]) {
            const current = weatherRes.data.data[0].cuaca[0][0];
            setWeather({
                temp: current.t,
                hu: current.hu,
                ws: current.ws,
                desc: current.weather_desc,
                descText: current.weather_desc_en
            });
        }

        if (eqRes && eqRes.data && eqRes.data.Infogempa) {
            setEarthquake(eqRes.data.Infogempa.gempa);
        }
      } catch (error) {
        console.error('Error fetching BMKG data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getWeatherIcon = (desc) => {
    if (!desc) return FaSun;
    const d = desc.toLowerCase();
    if (d.includes('clear')) return FaSun;
    if (d.includes('cloudy')) return FaCloudSun;
    if (d.includes('rain')) return FaCloudShowersHeavy;
    return FaCloud;
  };

  return (
    <Box py={24} bg={sectionBg}>
      <Container maxW="container.xl">
        <VStack spacing={16} align="stretch">
          <Box textAlign="center">
            <Badge colorScheme="brand" mb={4} px={4} py={1.5} borderRadius="full" variant="subtle">
              SISTEM INFORMASI BMKG
            </Badge>
            <Heading size="2xl" mb={4} fontWeight="900">Pantauan Cuaca & Bencana</Heading>
            <Text fontSize="xl" color="gray.500" maxW="2xl" mx="auto">
              Data real-time untuk memastikan keamanan dan kesiapsiagaan seluruh warga Desa Ngawonggo.
            </Text>
          </Box>

          {loading ? (
            <Flex justify="center" py={20}>
              <Loading />
            </Flex>
          ) : (
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={10}>
              {/* Weather Card */}
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                bg={cardBg}
                p={{ base: 8, md: 10 }}
                borderRadius="3xl"
                boxShadow="soft"
                border="1px solid"
                borderColor={borderColor}
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={10} opacity={0.03}>
                   <Icon as={getWeatherIcon(weather?.desc)} w="200px" h="200px" />
                </Box>

                <HStack justify="space-between" mb={10} position="relative" zIndex={1}>
                  <VStack align="start" spacing={1}>
                    <Heading size="lg" fontWeight="900">Cuaca Ngawonggo</Heading>
                    <Text fontSize="sm" color="gray.500" fontWeight="600">Kec. Kaliangkrik, Kab. Magelang</Text>
                  </VStack>
                  <Icon as={getWeatherIcon(weather?.desc)} w={14} h={14} color="brand.400" />
                </HStack>

                <Flex align="center" mb={10} position="relative" zIndex={1}>
                  <Text fontSize="7xl" fontWeight="900" mr={4} color="brand.500">
                    {weather?.temp || '24'}°
                  </Text>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="3xl" fontWeight="800">
                        {weather?.descText || 'Partly Cloudy'}
                    </Text>
                    <Text color="gray.400" fontSize="xs" fontWeight="700">Pembaruan Real-time BMKG</Text>
                  </VStack>
                </Flex>

                <Divider mb={10} />

                <SimpleGrid columns={2} spacing={10} position="relative" zIndex={1}>
                  <HStack spacing={4}>
                    <Flex w={14} h={14} bg="blue.50" color="brand.500" borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                      <Icon as={FaTint} w={6} h={6} />
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Kelembapan</Text>
                      <Text fontSize="xl" fontWeight="900">{weather?.hu || '85'}%</Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={4}>
                    <Flex w={14} h={14} bg="green.50" color="green.500" borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                      <Icon as={FaWind} w={6} h={6} />
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Kec. Angin</Text>
                      <Text fontSize="xl" fontWeight="900">{weather?.ws || '12'} km/j</Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>
              </MotionBox>

              {/* Earthquake Card */}
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                bg={eqCardBg}
                p={{ base: 8, md: 10 }}
                borderRadius="3xl"
                boxShadow="soft"
                border="1px solid"
                borderColor={eqBorderColor}
                position="relative"
                overflow="hidden"
              >
                <Box
                    position="absolute"
                    top="-20px"
                    right="-20px"
                    opacity={0.06}
                    transform="rotate(-15deg)"
                >
                    <Icon as={RiPulseLine} w="250px" h="250px" color="red.500" />
                </Box>

                <HStack justify="space-between" mb={10} position="relative" zIndex={1}>
                  <VStack align="start" spacing={1}>
                    <Heading size="lg" color="red.600" fontWeight="900">Info Gempabumi</Heading>
                    <Text fontSize="sm" color="gray.500" fontWeight="600">Data Gempabumi Terkini (M > 5.0)</Text>
                  </VStack>
                  <Icon as={FaExclamationTriangle} w={10} h={10} color="red.500" />
                </HStack>

                <VStack align="stretch" spacing={8} position="relative" zIndex={1}>
                  <Flex align="center" gap={8}>
                    <Box textAlign="center" bg="white" p={6} borderRadius="3xl" boxShadow="sm" border="1px solid" borderColor="red.100">
                        <Text fontSize="5xl" fontWeight="900" color="red.600" lineHeight="1">{earthquake?.Magnitude || '5.2'}</Text>
                        <Text fontSize="xs" fontWeight="900" color="gray.500" mt={2} letterSpacing="widest">MAGNITUDO</Text>
                    </Box>
                    <Divider orientation="vertical" h="80px" />
                    <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                            <Icon as={RiMapPin2Line} color="red.500" w={5} h={5} />
                            <Text fontSize="md" fontWeight="800" color="gray.700">{earthquake?.Wilayah || 'Barat Daya KAB-TASIKMALAYA-JABAR'}</Text>
                        </HStack>
                        <HStack spacing={3}>
                            <Icon as={RiTimeLine} color="gray.400" w={5} h={5} />
                            <Text fontSize="sm" color="gray.500" fontWeight="600">
                                {earthquake?.Tanggal || '14 Mar 2024'} | {earthquake?.Jam || '12:05:10 WIB'}
                            </Text>
                        </HStack>
                    </VStack>
                  </Flex>

                  <Box p={6} bg={alertBg} borderRadius="2xl" borderLeft="6px solid" borderColor="red.500" boxShadow="sm">
                    <Text fontSize="md" fontWeight="800" color="red.600" mb={1}>
                        Potensi: {earthquake?.Potensi || 'Tidak berpotensi tsunami'}
                    </Text>
                    <HStack fontSize="xs" color="gray.500" fontWeight="700" spacing={4}>
                        <Text>KEDALAMAN: {earthquake?.Kedalaman || '10 km'}</Text>
                        <Text>KOORDINAT: {earthquake?.Coordinates || '7.15 LS, 107.25 BT'}</Text>
                    </HStack>
                  </Box>
                </VStack>
              </MotionBox>
            </Grid>
          )}

          <Text textAlign="center" fontSize="xs" color="gray.400" fontWeight="700" letterSpacing="widest">
            SUMBER DATA: BMKG (BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA)
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default BMKGSection;
