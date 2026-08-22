import React, { useState, useEffect } from 'react';
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
  Button,
  Flex,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import {
  FaTv,
  FaUpload,
  FaExternalLinkAlt,
  FaPlay,
  FaUsers,
  FaClock,
  FaBroadcastTower,
} from 'react-icons/fa';
import CommunityFeed from './CommunityFeed';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import SEO from '../../components/SEO';
import { supabase } from '../../lib/supabase';
import { getYouTubeVideoId } from './LiveStreamView';

const MediaPage = () => {
  const { language } = useLanguage();
  const t = translations[language].media;

  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerCount, setViewerCount] = useState(1);

  const cardBg = useColorModeValue('white', 'gray.850');
  const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const tagBg = useColorModeValue('gray.100', 'gray.800');

  useEffect(() => {
    const fetchLive = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('display_livestreams')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        setLiveData(data);
      } catch (err) {
        console.error('Error loading livestream in media page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();

    const tvChannel = supabase.channel('ngawonggo_live_tv_main');
    tvChannel.on('presence', { event: 'sync' }, () => {
      const state = tvChannel.presenceState();
      setViewerCount(Math.max(1, Object.keys(state).length));
    });
    tvChannel.subscribe();

    return () => {
      supabase.removeChannel(tvChannel);
    };
  }, []);

  const ytId = getYouTubeVideoId(liveData?.url);

  return (
    <Box pt={0} pb={32} bg="gray.50" _dark={{ bg: 'gray.900' }} minH="100vh">
      <SEO
        title="Ngawonggo TV - Streaming & Media Komunitas Warga"
        description="Saluran televisi resmi dan pusat media digital, penyiaran informasi desa, edukasi, budaya, dan kreativitas warga Desa Ngawonggo."
        keywords="Ngawonggo TV, Live Streaming Desa Ngawonggo, Media Desa, Komunitas Ngawonggo"
      />
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <Box textAlign="center" pt={6}>
            <Badge colorScheme="red" px={4} py={1.5} borderRadius="full" mb={4} fontSize="sm" fontWeight="800">
              ● NGAWONGGO TV LIVE
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="900" mb={4} letterSpacing="tight">
              {t.title}
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }} fontSize="lg" maxW="2xl" mx="auto">
              Saksikan siaran televisi desa terintegrasi 24 jam nonstop yang menyajikan warta desa, kebudayaan, informasi keagamaan, dan ruang ekspresi masyarakat.
            </Text>
          </Box>

          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList
              p={2}
              mb={8}
              display="inline-flex"
              flexWrap="wrap"
              gap={3}
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={cardBorder}
              shadow="sm"
            >
              <Tab fontWeight="800" borderRadius="xl" _selected={{ bg: 'red.500', color: 'white' }}>
                <Icon as={FaTv} mr={2} /> Siaran Utama (Ngawonggo TV)
              </Tab>
              <Tab fontWeight="800" borderRadius="xl" _selected={{ bg: 'brand.500', color: 'white' }}>
                <Icon as={FaUpload} mr={2} /> Komunitas & Karya Warga
              </Tab>
            </TabList>

            <TabPanels>
              {/* TAB 1: NGAWONGGO TV SHOWCASE */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} align="start">
                  {/* Video Player Card (7 cols) */}
                  <Box
                    gridColumn={{ base: 'span 1', lg: 'span 7' }}
                    bg={cardBg}
                    p={4}
                    borderRadius="3xl"
                    border="1px solid"
                    borderColor={cardBorder}
                    shadow="xl"
                    overflow="hidden"
                  >
                    <Box
                      position="relative"
                      pb="56.25%"
                      bg="black"
                      borderRadius="2xl"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={liveData?.is_active ? 'red.500' : 'gray.700'}
                      boxShadow="2xl"
                    >
                      {loading ? (
                        <Flex position="absolute" top={0} left={0} w="full" h="full" justify="center" align="center" bg="#050811">
                          <Spinner size="xl" color="red.500" />
                        </Flex>
                      ) : liveData?.is_active && liveData?.url ? (
                        ytId ? (
                          <Box
                            as="iframe"
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                            title="Ngawonggo TV Preview"
                            position="absolute"
                            top={0}
                            left={0}
                            w="100%"
                            h="100%"
                            border="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={liveData.url}
                            autoPlay
                            playsInline
                            muted
                            controls
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        )
                      ) : (
                        <Flex
                          position="absolute"
                          top={0}
                          left={0}
                          w="full"
                          h="full"
                          direction="column"
                          justify="center"
                          align="center"
                          bg="#0b0f19"
                          color="white"
                          p={6}
                          textAlign="center"
                        >
                          <Icon as={FaTv} w={12} h={12} color="gray.600" mb={3} />
                          <Heading size="sm" mb={1}>SIARAN STANDBY</Heading>
                          <Text fontSize="xs" color="gray.400">Studio sedang mempersiapkan tayangan berikutnya.</Text>
                        </Flex>
                      )}

                      {/* Top Overlay Badge */}
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme={liveData?.is_active ? 'red' : 'gray'}
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="900"
                        letterSpacing="wider"
                        boxShadow="md"
                      >
                        {liveData?.is_active ? '● LIVE BROADCAST' : 'OFF AIR'}
                      </Badge>
                    </Box>

                    {/* Bottom Action Bar */}
                    <Flex justify="space-between" align="center" mt={4} px={2} wrap="wrap" gap={3}>
                      <HStack spacing={3}>
                        <HStack bg={tagBg} px={3.5} py={1.5} borderRadius="xl" fontSize="xs" fontWeight="bold">
                          <Icon as={FaUsers} color="red.400" />
                          <Text>{viewerCount} Pemirsa Menonton</Text>
                        </HStack>
                        <HStack bg={tagBg} px={3.5} py={1.5} borderRadius="xl" fontSize="xs" fontWeight="bold">
                          <Icon as={FaClock} color="yellow.400" />
                          <Text>24 Jam Nonstop</Text>
                        </HStack>
                      </HStack>

                      <Button
                        as="a"
                        href="/media/live"
                        target="_blank"
                        colorScheme="red"
                        size="md"
                        borderRadius="2xl"
                        leftIcon={<FaPlay />}
                        rightIcon={<FaExternalLinkAlt />}
                        fontWeight="800"
                        boxShadow="0 4px 20px rgba(239, 68, 68, 0.4)"
                        _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(239, 68, 68, 0.6)' }}
                      >
                        Buka Siaran Full Layar
                      </Button>
                    </Flex>
                  </Box>

                  {/* Channel & Program Description Card (5 cols) */}
                  <VStack
                    gridColumn={{ base: 'span 1', lg: 'span 5' }}
                    spacing={6}
                    align="stretch"
                  >
                    <Box
                      bg={cardBg}
                      p={8}
                      borderRadius="3xl"
                      border="1px solid"
                      borderColor={cardBorder}
                      shadow="lg"
                    >
                      <HStack spacing={3} mb={4}>
                        <Box p={3} bg="red.500" color="white" borderRadius="2xl">
                          <Icon as={FaBroadcastTower} w={6} h={6} />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Badge colorScheme="red" fontSize="2xs" px={2} borderRadius="md">
                            SALURAN UTAMA DESA
                          </Badge>
                          <Heading size="md" fontWeight="900">
                            Ngawonggo TV
                          </Heading>
                        </VStack>
                      </HStack>

                      <Heading size="sm" mb={2} color="gray.800" _dark={{ color: 'white' }}>
                        {liveData?.title || 'Pesona Wisata, Sejarah & Budaya Ngawonggo'}
                      </Heading>
                      <Text color="gray.600" _dark={{ color: 'gray.300' }} fontSize="sm" lineHeight="relaxed" mb={6}>
                        {liveData?.description ||
                          'Saluran penyiaran informasi resmi Desa Ngawonggo yang menyajikan warta pembangunan desa, tayangan kebudayaan Kaliangkrik, edukasi pertanian & peternakan, serta kajian keagamaan warga.'}
                      </Text>

                      {liveData?.running_text && (
                        <Box
                          p={4}
                          bg="red.50"
                          _dark={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                          borderRadius="2xl"
                          border="1px solid"
                          borderColor="red.200"
                          _darkBorderColor="red.800"
                          mb={6}
                        >
                          <Text fontSize="2xs" fontWeight="900" color="red.500" letterSpacing="wider" mb={1}>
                            WARTA BERJALAN SAAT INI:
                          </Text>
                          <Text fontSize="xs" fontWeight="bold" color="gray.800" _dark={{ color: 'white' }} noOfLines={2}>
                            {liveData.running_text}
                          </Text>
                        </Box>
                      )}

                      <Button
                        as="a"
                        href="/media/live"
                        target="_blank"
                        w="full"
                        size="lg"
                        colorScheme="red"
                        borderRadius="2xl"
                        leftIcon={<FaTv />}
                        rightIcon={<FaExternalLinkAlt />}
                        fontWeight="800"
                      >
                        Nonton Siaran di TV / Layar Lebar
                      </Button>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </TabPanel>

              {/* TAB 2: COMMUNITY FEED */}
              <TabPanel p={0}>
                <CommunityFeed />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default MediaPage;
