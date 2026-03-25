import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Spinner, Center, Badge, Image, LinkBox, LinkOverlay, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SEO } from '../../components';
import animeApi from '../../services/anime/api';

const providersList = [
  { id: 'otakudesu', name: 'Otakudesu' },
  { id: 'samehadaku', name: 'Samehadaku' },
  { id: 'donghua', name: 'Donghua' },
  { id: 'kusonime', name: 'Kusonime' },
  { id: 'anoboy', name: 'Anoboy' },
  { id: 'oploverz', name: 'Oploverz' },
  { id: 'stream', name: 'Anime Indo' },
  { id: 'animekuindo', name: 'Animekuindo' },
  { id: 'nimegami', name: 'Nimegami' },
  { id: 'alqanime', name: 'Alqanime' },
  { id: 'donghub', name: 'Donghub' },
  { id: 'winbu', name: 'Winbu' },
  { id: 'animesail', name: 'AnimeSail' },
  { id: 'kuramanime', name: 'Kuramanime' },
  { id: 'dramabox', name: 'Dramabox' },
  { id: 'drachin', name: 'Drachin' },
  { id: 'nekopoi', name: 'Nekopoi' }
];

const ProviderTabPanel = ({ providerId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetcher = animeApi[providerId]?.home;
        if (!fetcher) {
            throw new Error('Provider belum diimplementasi');
        }
        const res = await fetcher();
        // Adjust extraction based on response structures
        let list = [];
        if (res?.data?.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (res.data.data.ongoing) list = res.data.data.ongoing;
            else if (res.data.data.recent) list = res.data.data.recent;
            else if (res.data.data.latest) list = res.data.data.latest;
            else if (res.data.data.data) list = res.data.data.data;
            else list = Object.values(res.data.data)[0] || [];
        } else if (res?.data) {
             if (Array.isArray(res.data)) list = res.data;
        }

        if (mounted) {
            setData(Array.isArray(list) ? list.slice(0, 15) : []);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Gagal memuat data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [providerId]);

  if (loading) return <Center h="20vh"><Spinner size="xl" color="brand.500" /></Center>;
  if (error) return <Center h="20vh"><Text color="red.500">{error}</Text></Center>;
  if (!data || data.length === 0) return <Center h="20vh"><Text color="gray.500">Data tidak ditemukan atau belum tersedia saat ini.</Text></Center>;

  return (
    <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6} mt={6}>
        {data.map((item, idx) => {
            const title = item.title || item.name || item.judul || 'Tanpa Judul';
            const slug = item.slug || item.id || item.animeId || item.bookId || encodeURIComponent(title);
            const image = item.thumb || item.poster || item.image || item.cover || 'https://via.placeholder.com/300x450?text=No+Image';

            return (
                <LinkBox key={idx} as="article" rounded="xl" overflow="hidden" boxShadow="md" _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
                <Box position="relative">
                    <Image src={image} alt={title} objectFit="cover" h="250px" w="100%" loading="lazy" fallbackSrc="https://via.placeholder.com/300x450?text=Loading..." />
                    {(item.episode || item.type || item.status) && (
                        <Badge position="absolute" top={2} right={2} colorScheme="blue">
                            {item.episode ? `Eps ${item.episode}` : (item.type || item.status)}
                        </Badge>
                    )}
                </Box>
                <Box p={4} bg="white">
                    <LinkOverlay as={RouterLink} to={`/anime/${providerId}/detail/${slug}`}>
                        <Text fontWeight="bold" noOfLines={2} fontSize="sm">{title}</Text>
                    </LinkOverlay>
                </Box>
                </LinkBox>
            );
        })}
    </SimpleGrid>
  );
};

const AnimePage = () => {
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);

  return (
    <Box pt={32} pb={20}>
      <SEO title="Portal Anime (NEW)" description="Nonton Anime Sub Indo Terlengkap dengan multi-server" />
      <Container maxW="container.xl">
        <VStack spacing={4} mb={10} textAlign="center">
          <Badge colorScheme="red" variant="solid" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
            NEW FEATURE
          </Badge>
          <Heading size="2xl" fontWeight="900">Portal Anime Ngawonggo</Heading>
          <Text color="gray.500">Akses anime terlengkap dari puluhan provider terbaik di Indonesia.</Text>
        </VStack>

        <Box display={{ base: 'block', md: 'none' }} mb={6}>
            <Text fontWeight="bold" mb={2}>Pilih Provider:</Text>
            <Select value={selectedProviderIndex} onChange={(e) => setSelectedProviderIndex(Number(e.target.value))} bg="white">
                {providersList.map((p, idx) => (
                    <option key={p.id} value={idx}>{p.name}</option>
                ))}
            </Select>
        </Box>

        <Tabs index={selectedProviderIndex} onChange={(index) => setSelectedProviderIndex(index)} variant="soft-rounded" colorScheme="brand" isLazy>
            <TabList overflowX="auto" overflowY="hidden" py={2} mb={4} display={{ base: 'none', md: 'flex' }} sx={{
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-track': { bg: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' }
            }}>
                {providersList.map((p) => (
                    <Tab key={p.id} flexShrink={0} mr={2}>{p.name}</Tab>
                ))}
            </TabList>

            <TabPanels>
                {providersList.map((p) => (
                    <TabPanel key={p.id} px={0}>
                        <Heading size="md" mb={2}>Rilisan Terbaru: {p.name}</Heading>
                        <ProviderTabPanel providerId={p.id} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default AnimePage;
