
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
} from '@chakra-ui/react';
import { FaBroadcastTower, FaTv, FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

const MediaPage = () => {
  const { language } = useLanguage();
  const t = translations[language].media;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (playerRef.current) {
      playerRef.current.volume(volume / 100);
    }
  }, [volume]);

  useEffect(() => {
    // TVRI player init
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
          type: 'application/x-mpegURL'
        }]
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const toggleRadio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box pt={20} pb={32} bg="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Badge colorScheme="brand" px={4} py={1} borderRadius="full" mb={4}>
              LIVE STREAMING
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" mb={4}>
              {t.title}
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
              {t.subtitle}
            </Text>
          </Box>

          <Tabs variant="enclosed" colorScheme="brand">
            <TabList bg="white" p={2} borderRadius="xl" border="none" boxShadow="sm">
              <Tab fontWeight="700" borderRadius="lg">
                <Icon as={FaBroadcastTower} mr={2} /> Radio Gemilang
              </Tab>
              <Tab fontWeight="700" borderRadius="lg">
                <Icon as={FaTv} mr={2} /> TVRI Nasional
              </Tab>
            </TabList>

            <TabPanels mt={8}>
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  <Box bg="white" p={10} borderRadius="3xl" boxShadow="xl" textAlign="center">
                    <VStack spacing={8}>
                      <Box
                        w={40}
                        h={40}
                        bg="brand.50"
                        borderRadius="full"
                        display="flex"
                        align="center"
                        justify="center"
                        color="brand.500"
                        fontSize="5xl"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaBroadcastTower />
                      </Box>
                      <Box>
                        <Heading size="lg">Radio Gemilang</Heading>
                        <Text color="brand.500" fontWeight="800">98.6 FM</Text>
                      </Box>
                      <HStack spacing={6}>
                        <IconButton
                          size="lg"
                          icon={isPlaying ? <FaPause /> : <FaPlay />}
                          onClick={toggleRadio}
                          colorScheme="brand"
                          borderRadius="full"
                          w={20}
                          h={20}
                          fontSize="2xl"
                          aria-label="Toggle Play"
                        />
                      </HStack>
                      <Box w="100%" maxW="300px">
                        <HStack spacing={4}>
                          <Icon as={FaVolumeUp} color="gray.400" />
                          <Slider value={volume} onChange={setVolume} min={0} max={100} colorScheme="brand">
                            <SliderTrack><SliderFilledTrack /></SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                  <Box bg="accent.blue" p={10} borderRadius="3xl" color="white">
                    <Heading size="md" mb={6}>Tentang Radio Gemilang</Heading>
                    <Text opacity={0.8} lineHeight="tall">
                      Radio Gemilang 98.6 FM adalah stasiun radio pemerintah Kabupaten Magelang.
                      Menyajikan informasi terkini seputar Magelang, hiburan musik pilihan, dan program edukasi untuk masyarakat.
                      Kini hadir secara streaming untuk menjangkau warga Ngawonggo di mana pun berada.
                    </Text>
                    <VStack mt={8} align="start" spacing={4}>
                      <HStack><Badge colorScheme="green">LIVE</Badge><Text fontSize="sm">24 Jam Nonstop</Text></HStack>
                      <HStack><Badge colorScheme="blue">NEWS</Badge><Text fontSize="sm">Info Kabupaten Magelang</Text></HStack>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0}>
                <Box bg="black" borderRadius="3xl" overflow="hidden" boxShadow="2xl">
                  <div data-vjs-player>
                    <video ref={videoRef} className="video-js vjs-big-play-centered vjs-16-9" />
                  </div>
                </Box>
                <Box mt={8} p={8} bg="white" borderRadius="3xl">
                  <Heading size="md" mb={4}>TVRI Nasional</Heading>
                  <Text color="gray.600">
                    Saksikan siaran TVRI Nasional secara langsung. Menghadirkan berita nasional, program kebudayaan, dan edukasi untuk seluruh rakyat Indonesia.
                  </Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
      <audio ref={audioRef} src="https://streaming-radio.magelangkab.go.id/studio" preload="none" />
    </Box>
  );
};

export default MediaPage;
