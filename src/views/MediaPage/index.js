
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
  Flex,
} from '@chakra-ui/react';
import { FaBroadcastTower, FaTv, FaPlay, FaPause, FaVolumeUp, FaUpload } from 'react-icons/fa';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import ReactPlayer from 'react-player';
import CommunityFeed from './CommunityFeed';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { supabase } from '../../lib/supabase';

const MediaPage = () => {
  const { language } = useLanguage();
  const t = translations[language].media;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [displayStatus, setDisplayStatus] = useState('offline');
  const [displayMode, setDisplayMode] = useState('normal');
  const [liveStreamUrl, setLiveStreamUrl] = useState(null);

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
    const fetchDisplayInfo = async () => {
      try {

        const { data: stream } = await supabase
          .from('display_livestreams')
          .select('url')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (stream) {
          setLiveStreamUrl(stream.url);
        } else {
          setLiveStreamUrl(null);
        }

        const { data: display } = await supabase
          .from('displays')
          .select('id, status')
          .eq('code', 'DEMO-TV')
          .maybeSingle();
        if (display) {
          setDisplayStatus(display.status);
          const { data: state } = await supabase
            .from('display_states')
            .select('mode')
            .eq('display_id', display.id)
            .maybeSingle();
          if (state) {
            setDisplayMode(state.mode);
          }
        }
      } catch (err) {
        console.error('Error fetching display status:', err);
      }
    };

    fetchDisplayInfo();

    const displayChannel = supabase
      .channel('displays_realtime_media')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'displays', filter: 'code=eq.DEMO-TV' }, (payload) => {
        setDisplayStatus(payload.new.status);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'display_states' }, () => {
        fetchDisplayInfo();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'display_livestreams' }, () => {
        fetchDisplayInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(displayChannel);
    };
  }, []);

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
    <Box  pt={0} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
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

          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList layerStyle="glassCard" p={2} mb={8} display="inline-flex" flexWrap="wrap" gap={2}>
              <Tab fontWeight="700" borderRadius="2xl" _selected={{ bg: 'brand.500', color: 'white' }}>
                <Icon as={FaBroadcastTower} mr={2} /> Radio Gemilang
              </Tab>
              <Tab fontWeight="700" borderRadius="2xl" _selected={{ bg: 'brand.500', color: 'white' }}>
                <Icon as={FaTv} mr={2} /> TVRI Nasional
              </Tab>
              <Tab fontWeight="700" borderRadius="2xl" _selected={{ bg: 'brand.500', color: 'white' }}>
                <Icon as={FaUpload} mr={2} /> Komunitas
              </Tab>
              <Tab fontWeight="700" borderRadius="2xl" _selected={{ bg: 'brand.500', color: 'white' }}>
                <Icon as={FaTv} mr={2} /> Ngawonggo TV (Uji Coba)
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  <Box layerStyle="glassCard" p={10} textAlign="center">
                    <VStack spacing={8}>
                      <Flex
                        w={40}
                        h={40}
                        bg="brand.50"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        color="brand.500"
                        fontSize="5xl"
                        shadow="inner"
                      >
                        <FaBroadcastTower />
                      </Flex>
                      <Box>
                        <Heading size="lg" color="gray.800" _dark={{ color: "white" }}>Radio Gemilang</Heading>
                        <Text color="brand.500" fontWeight="800">98.6 FM</Text>
                      </Box>
                      <HStack spacing={6}>
                        <IconButton
                          size="lg"
                          icon={isPlaying ? <FaPause /> : <FaPlay />}
                          onClick={toggleRadio}
                          colorScheme="brand"
                          borderRadius="full"
                          w={24}
                          h={24}
                          fontSize="3xl"
                          boxShadow="xl"
                          _hover={{ transform: 'scale(1.1)' }}
                          aria-label="Toggle Play"
                        />
                      </HStack>
                      <Box w="100%" maxW="300px">
                        <HStack spacing={4}>
                          <Icon as={FaVolumeUp} color="gray.400" />
                          <Slider value={volume} onChange={setVolume} min={0} max={100} colorScheme="brand">
                            <SliderTrack h={2} borderRadius="full"><SliderFilledTrack /></SliderTrack>
                            <SliderThumb boxSize={6} />
                          </Slider>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                  <Box bgGradient="linear(to-br, blue.600, brand.600)" p={10} borderRadius="3xl" color="white" boxShadow="xl">
                    <Heading size="md" mb={6}>Tentang Radio Gemilang</Heading>
                    <Text opacity={0.9} lineHeight="relaxed" fontSize="lg">
                      Radio Gemilang 98.6 FM adalah stasiun radio pemerintah Kabupaten Magelang.
                      Menyajikan informasi terkini seputar Magelang, hiburan musik pilihan, dan program edukasi untuk masyarakat.
                      Kini hadir secara streaming untuk menjangkau warga Ngawonggo di mana pun berada.
                    </Text>
                    <VStack mt={10} align="start" spacing={4}>
                      <HStack layerStyle="glass" p={2} px={4} borderRadius="xl"><Badge colorScheme="green">LIVE</Badge><Text fontSize="sm" fontWeight="bold">24 Jam Nonstop</Text></HStack>
                      <HStack layerStyle="glass" p={2} px={4} borderRadius="xl"><Badge colorScheme="blue">NEWS</Badge><Text fontSize="sm" fontWeight="bold">Info Kabupaten Magelang</Text></HStack>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0}>
                <Box layerStyle="glassCard" bg="black" borderRadius="3xl" overflow="hidden" boxShadow="2xl">
                  <div data-vjs-player>
                    <video ref={videoRef} className="video-js vjs-big-play-centered vjs-16-9" />
                  </div>
                </Box>
                <Box mt={10} p={10} layerStyle="glassCard">
                  <Heading size="lg" mb={4} color="gray.800" _dark={{ color: "white" }}>TVRI Nasional</Heading>
                  <Text color="gray.600" fontSize="lg" lineHeight="relaxed">
                    Saksikan siaran TVRI Nasional secara langsung. Menghadirkan berita nasional, program kebudayaan, dan edukasi untuk seluruh rakyat Indonesia. Media pemersatu bangsa kini hadir dalam genggaman Anda.
                  </Text>
                </Box>
              </TabPanel>
              <TabPanel p={0}>
                <CommunityFeed />
              </TabPanel>
              <TabPanel p={0}>
                <VStack spacing={6} align="stretch">
                  <Box layerStyle="glassCard" p={6} borderRadius="3xl" bg="white" _dark={{ bg: "gray.800" }}>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800" _dark={{ color: "white" }}>
                          Ngawonggo TV (Uji Coba)
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Sistem penyiaran televisi Ngawonggo TV realtime. Disinkronkan langsung dari dashboard kontrol TV.
                        </Text>
                      </VStack>
                      <HStack spacing={3}>
                        <Badge colorScheme={displayStatus === 'online' ? 'green' : 'red'} px={3} py={1} borderRadius="full">
                          {displayStatus === 'online' ? '● ONLINE' : '○ OFFLINE'}
                        </Badge>
                        <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                          Mode: {displayMode.toUpperCase()}
                        </Badge>
                        <IconButton
                          as="a"
                          href="/live/display/DEMO-TV"
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<Icon as={FaTv} />}
                          colorScheme="brand"
                          aria-label="Buka Layar Penuh"
                          title="Buka Layar Penuh"
                          borderRadius="xl"
                        />
                      </HStack>
                    </Flex>
                  </Box>

                  {/* TV Mockup Frame */}
                  <Box
                    position="relative"
                    w="full"
                    pb="56.25%" /* 16:9 Aspect Ratio */
                    bg="black"
                    borderRadius="2xl"
                    boxShadow="2xl"
                    border="12px solid"
                    borderColor="gray.800"
                    overflow="hidden"
                  >
                    {liveStreamUrl ? (
                      <ReactPlayer
                        url={liveStreamUrl}
                        width="100%"
                        height="100%"
                        playing={true}
                        controls={true}
                        muted={false}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    ) : (
                      <Flex position="absolute" top={0} left={0} w="100%" h="100%" align="center" justify="center" direction="column">
                        <Icon as={FaTv} w={16} h={16} color="gray.600" mb={4} />
                        <Heading size="md" color="gray.500">Siaran Sedang Offline</Heading>
                        <Text color="gray.600">Menunggu admin memulai siaran langsung</Text>
                      </Flex>
                    )}
                  </Box>

                  <Box p={6} layerStyle="glassCard" borderRadius="2xl" bg="white" _dark={{ bg: "gray.800" }}>
                    <Heading size="sm" mb={2} color="gray.800" _dark={{ color: "white" }}>
                      Panduan Uji Coba:
                    </Heading>
                    <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="sm" lineHeight="relaxed">
                      1. TV Display di atas menayangkan siaran langsung Ngawonggo TV.<br />
                      2. Anda dapat mengubah konten, mengatur siaran langsung, atau mempublikasikan running text baru melalui dashboard admin di rute <Box as="span" fontWeight="bold" color="brand.500">/admin/live</Box>.<br />
                      3. Klik tombol TV di kanan atas preview untuk membuka mode layar penuh.
                    </Text>
                  </Box>
                </VStack>
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
