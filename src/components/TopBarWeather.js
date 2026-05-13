import React, { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Divider,
  Button
} from '@chakra-ui/react';
import { FaCloud, FaSun, FaCloudSun, FaCloudShowersHeavy, FaTint, FaWind, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const TopBarWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const translateWeather = (desc) => {
    if (!desc) return 'Data Tidak Tersedia';
    const mapping = {
      'Clear Skies': 'Cerah',
      'Partly Cloudy': 'Cerah Berawan',
      'Mostly Cloudy': 'Berawan Tebal',
      'Cloudy': 'Berawan',
      'Light Rain': 'Hujan Ringan',
      'Rain': 'Hujan',
      'Heavy Rain': 'Hujan Lebat',
      'Thunderstorm': 'Hujan Petir',
    };
    return mapping[desc] || desc;
  };

  const getWeatherIcon = (desc) => {
    if (!desc) return FaSun;
    const d = desc.toLowerCase();
    if (d.includes('clear')) return FaSun;
    if (d.includes('cloudy')) return FaCloudSun;
    if (d.includes('rain')) return FaCloudShowersHeavy;
    return FaCloud;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const CACHE_KEY = 'bmkg_data_cache';
        const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setWeather(parsed.weather);
            setLoading(false);
            return;
          }
        }

        const weatherRes = await axios.get('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.08.13.2002');

        if (weatherRes.data && weatherRes.data.data && weatherRes.data.data[0]) {
          const current = weatherRes.data.data[0].cuaca[0][0];
          const newWeather = {
            temp: current.t,
            hu: current.hu,
            ws: current.ws,
            desc: current.weather_desc,
            descText: current.weather_desc_en
          };
          setWeather(newWeather);

          localStorage.setItem(CACHE_KEY, JSON.stringify({
            weather: newWeather,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error('Error fetching BMKG data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !weather) {
    return (
       <HStack>
        <Button
          as="a"
          href="https://whatsapp.com/channel/0029Vb7s9VIId7nFgebdx73V"
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="whatsapp"
          size="xs"
          borderRadius="full"
          leftIcon={<FaWhatsapp />}
          display={{ base: "none", sm: "inline-flex" }}
        >
          Saluran Info
        </Button>
       </HStack>
    );
  }

  const translatedDesc = translateWeather(weather.descText);

  return (
    <>
      <HStack>
        <Button
          as="a"
          href="https://whatsapp.com/channel/0029Vb7s9VIId7nFgebdx73V"
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="whatsapp"
          size="xs"
          borderRadius="full"
          leftIcon={<FaWhatsapp />}
          display={{ base: "none", sm: "inline-flex" }}
        >
          Saluran Info
        </Button>
        <Flex
          align="center"
          cursor="pointer"
          onClick={onOpen}
          bg="whiteAlpha.600"
          px={3}
          py={1}
          borderRadius="full"
          _hover={{ bg: "whiteAlpha.800" }}
          transition="all 0.2s"
          border="1px solid"
          borderColor="whiteAlpha.400"
          boxShadow="sm"
        >
          <Icon as={getWeatherIcon(weather.desc)} color="brand.500" mr={2} />
          <Text fontWeight="bold" fontSize="sm" color="gray.800" _dark={{ color: "white" }} mr={1}>
            {weather.temp}°C
          </Text>
          <Text fontSize="xs" color="gray.600" display={{ base: "none", md: "block" }}>
            - {translatedDesc}
          </Text>
        </Flex>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" overflow="hidden">
          <ModalHeader bg="brand.500" color="white" textAlign="center">
            Cuaca Ngawonggo Saat Ini
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6} bg="gray.50" _dark={{ bg: "gray.900" }}>
            <VStack spacing={6}>
              <Flex align="center" justify="center" w="full">
                <Icon as={getWeatherIcon(weather.desc)} w={16} h={16} color="brand.500" mr={4} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="4xl" fontWeight="900" color="brand.600">
                    {weather.temp}°C
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    {translatedDesc}
                  </Text>
                </VStack>
              </Flex>

              <Divider borderColor="gray.300" />

              <HStack spacing={8} w="full" justify="center">
                <HStack spacing={3}>
                  <Flex w={10} h={10} bg="blue.100" color="blue.600" borderRadius="xl" align="center" justify="center">
                    <Icon as={FaTint} w={5} h={5} />
                  </Flex>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">Kelembapan</Text>
                    <Text fontSize="md" fontWeight="bold">{weather.hu}%</Text>
                  </VStack>
                </HStack>
                <HStack spacing={3}>
                  <Flex w={10} h={10} bg="green.100" color="green.600" borderRadius="xl" align="center" justify="center">
                    <Icon as={FaWind} w={5} h={5} />
                  </Flex>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">Kec. Angin</Text>
                    <Text fontSize="md" fontWeight="bold">{weather.ws} km/j</Text>
                  </VStack>
                </HStack>
              </HStack>

              <Text textAlign="center" fontSize="xs" color="gray.400" fontWeight="bold" mt={4}>
                Sumber Data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopBarWeather;
