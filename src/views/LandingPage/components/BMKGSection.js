import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
  Badge,
  Spinner,
  Divider,
  Grid,
} from '@chakra-ui/react';
import { FaTint, FaWind, FaCloud, FaSun, FaCloudRain, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { RiPulseLine, RiMapPin2Line, RiTimeLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BMKGSection = () => {
  const [weather, setWeather] = useState(null);
  const [earthquake, setEarthquake] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'rgba(15, 23, 42, 0.8)');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const eqCardBg = useColorModeValue('white', 'rgba(25, 20, 20, 0.8)');
  const eqBorderColor = useColorModeValue('red.100', 'red.900');
  const alertBg = useColorModeValue('red.50', 'rgba(150, 0, 0, 0.1)');

  useEffect(() => {
    fetchBMKGData();
  }, []);

  const fetchBMKGData = async () => {
    setLoading(true);
    try {
      // Fetch Earthquake (JSON usually has CORS enabled)
      const eqRes = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
      const eqJson = await eqRes.json();
      setEarthquake(eqJson.Infogempa.gempa);

      // Fetch Weather (Using allorigins proxy to bypass CORS for XML)
      const weatherUrl = 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaTengah.xml';
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(weatherUrl)}`;

      const wRes = await fetch(proxyUrl);
      const wData = await wRes.json();
      const wText = wData.contents;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(wText, "text/xml");

      const areas = xmlDoc.getElementsByTagName("area");
      let targetArea = null;

      // Try to find Magelang or Mungkid (Kab. Magelang capital)
      for (let i = 0; i < areas.length; i++) {
          const name = areas[i].getAttribute("description");
          if (name === "Magelang" || name === "Mungkid" || name.includes("Magelang")) {
              targetArea = areas[i];
              break;
          }
      }

      if (targetArea) {
          const params = targetArea.getElementsByTagName("parameter");

          const getLatestVal = (id) => {
              for(let j=0; j<params.length; j++) {
                  if(params[j].getAttribute("id") === id) {
                      // Get values and find one that matches current time or just the first one if not sure
                      const values = params[j].getElementsByTagName("value");
                      // BMKG usually provides 3-hourly or 6-hourly data.
                      // For now, let's take the first one or try to guess the most relevant
                      return values[0]?.textContent;
                  }
              }
              return null;
          };

          setWeather({
              temp: getLatestVal("t"),
              hu: getLatestVal("hu"),
              ws: getLatestVal("ws"),
              desc: getLatestVal("weather"),
          });
      }
    } catch (error) {
      console.error('Error fetching BMKG data:', error);
    }
    setLoading(false);
  };

  const getWeatherIcon = (code) => {
    const c = parseInt(code);
    if (c === 0) return FaSun;
    if (c >= 1 && c <= 4) return FaCloud;
    if (c >= 5 && c <= 10 || c === 45) return FaCloud; // 45 is Fog/Kabut
    if (c >= 60 && c <= 80) return FaCloudRain;
    if (c >= 95) return FaBolt;
    return FaCloud;
  };

  const getWeatherDesc = (code) => {
      const map = {
          "0": "Cerah",
          "1": "Cerah Berawan",
          "2": "Cerah Berawan",
          "3": "Berawan",
          "4": "Berawan Tebal",
          "5": "Udara Kabur",
          "10": "Asap",
          "45": "Kabut",
          "60": "Hujan Ringan",
          "61": "Hujan Sedang",
          "63": "Hujan Lebat",
          "80": "Hujan Lokal",
          "95": "Hujan Petir",
          "97": "Hujan Petir"
      };
      return map[code] || "Berawan";
  };

  return (
    <Box py={20} bg={sectionBg}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Badge colorScheme="orange" mb={4} px={3} py={1} borderRadius="full">
              Informasi Terkini
            </Badge>
            <Heading size="2xl" mb={4}>Pantauan Cuaca & Bencana</Heading>
            <Text fontSize="xl" color="gray.500" maxW="2xl" mx="auto">
              Data real-time langsung dari BMKG untuk keselamatan dan kenyamanan warga Ngawonggo.
            </Text>
          </Box>

          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="orange.500" thickness="4px" />
            </Flex>
          ) : (
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                bg={cardBg}
                p={8}
                borderRadius="3xl"
                boxShadow="2xl"
                border="1px solid"
                borderColor={borderColor}
                layerStyle="glass"
              >
                <HStack justify="space-between" mb={8}>
                  <VStack align="start" spacing={0}>
                    <Heading size="md">Cuaca Magelang</Heading>
                    <Text fontSize="sm" color="gray.500">Kec. Kaliangkrik & Sekitarnya</Text>
                  </VStack>
                  <Icon as={getWeatherIcon(weather?.desc)} w={12} h={12} color="orange.400" />
                </HStack>

                <Flex align="center" mb={8}>
                  <Text fontSize="6xl" fontWeight="bold" mr={4}>
                    {weather?.temp || '--'}°
                  </Text>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="semibold">
                        {getWeatherDesc(weather?.desc)}
                    </Text>
                    <Text color="gray.500">Update BMKG Terkini</Text>
                  </VStack>
                </Flex>

                <Divider mb={8} />

                <SimpleGrid columns={2} spacing={8}>
                  <HStack>
                    <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="lg" align="center" justify="center">
                      <Icon as={FaTint} />
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Kelembapan</Text>
                      <Text fontWeight="bold">{weather?.hu || '--'}%</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Flex w={10} h={10} bg="green.50" color="green.500" borderRadius="lg" align="center" justify="center">
                      <Icon as={FaWind} />
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Kec. Angin</Text>
                      <Text fontWeight="bold">{weather?.ws || '--'} km/jam</Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                bg={eqCardBg}
                p={8}
                borderRadius="3xl"
                boxShadow="2xl"
                border="1px solid"
                borderColor={eqBorderColor}
                position="relative"
                overflow="hidden"
              >
                <Box
                    position="absolute"
                    top="-20px"
                    right="-20px"
                    opacity={0.05}
                    transform="rotate(-15deg)"
                >
                    <Icon as={RiPulseLine} w="200px" h="200px" color="red.500" />
                </Box>

                <HStack justify="space-between" mb={8}>
                  <VStack align="start" spacing={0}>
                    <Heading size="md" color="red.500">Info Gempabumi</Heading>
                    <Text fontSize="sm" color="gray.500">Gempabumi Terkini (M > 5.0)</Text>
                  </VStack>
                  <Icon as={FaExclamationTriangle} w={8} h={8} color="red.500" />
                </HStack>

                <VStack align="stretch" spacing={6}>
                  <Flex align="center" gap={6}>
                    <Box textAlign="center">
                        <Text fontSize="4xl" fontWeight="black" color="red.500">{earthquake?.Magnitude || '--'}</Text>
                        <Text fontSize="xs" fontWeight="bold">MAGNITUDO</Text>
                    </Box>
                    <Divider orientation="vertical" h="50px" />
                    <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                            <Icon as={RiMapPin2Line} color="gray.400" />
                            <Text fontSize="sm" fontWeight="bold">{earthquake?.Wilayah || 'Tidak ada data'}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Icon as={RiTimeLine} color="gray.400" />
                            <Text fontSize="xs" color="gray.500">{earthquake?.Tanggal} | {earthquake?.Jam}</Text>
                        </HStack>
                    </VStack>
                  </Flex>

                  <Box p={4} bg={alertBg} borderRadius="xl" borderLeft="4px solid" borderColor="red.500">
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">
                        Potensi: {earthquake?.Potensi || 'N/A'}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                        Kedalaman: {earthquake?.Kedalaman} | Koordinat: {earthquake?.Coordinates}
                    </Text>
                  </Box>
                </VStack>
              </MotionBox>
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BMKGSection;
