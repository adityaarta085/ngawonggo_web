import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, SimpleGrid, Text, Center, Badge,
  Image, LinkBox, LinkOverlay, VStack, Icon, Input, InputGroup,
  InputLeftElement, InputRightElement, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFire, FaFilm, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';

const DracinGrid = ({ items }) => {
    if (!items || items.length === 0) return <Text color="gray.500">Tidak ada data.</Text>;

    return (
        <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6} mb={10}>
        {items.map((item, idx) => {
            const title = item.title;
            const slug = item.collection_id;
            const image = item.cover || 'https://via.placeholder.com/300x450?text=No+Image';

            return (
                <LinkBox key={idx} as="article" rounded="xl" overflow="hidden" boxShadow="md" _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
                <Box position="relative">
                    <Image src={image} alt={title} objectFit="cover" h="250px" w="100%" loading="lazy" fallbackSrc="https://via.placeholder.com/300x450?text=Loading..." />
                    {item.total_episodes && (
                        <Badge position="absolute" top={2} left={2} colorScheme="blue">
                            Eps {item.total_episodes}
                        </Badge>
                    )}
                </Box>
                <Box p={4} bg="white" _dark={{ bg: "gray.800" }}>
                    <LinkOverlay as={RouterLink} to={`/dracin/detail/${slug}`}>
                        <Text fontWeight="bold" noOfLines={2} fontSize="sm">{title}</Text>
                    </LinkOverlay>
                </Box>
                </LinkBox>
            );
        })}
        </SimpleGrid>
    );
}

const DracinPage = () => {
  const [dataTrending, setDataTrending] = useState(null);
  const [dataForYou, setDataForYou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadHome = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resTrend, resForYou] = await Promise.all([
            dracinApi.getTrending(),
            dracinApi.getForYou()
        ]);
        if (mounted) {
            setDataTrending(resTrend.collections || []);
            setDataForYou(resForYou.collections || []);
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat portal Dracin. Pastikan koneksi internet stabil.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadHome();
    return () => { mounted = false; };
  }, []);

  const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      setError(null);
      try {
          const res = await dracinApi.search(searchQuery);
          setSearchResults(res.results || []);
      } catch (err) {
          setError("Gagal mencari dracin.");
      } finally {
          setIsSearching(false);
      }
  };

  const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
  };

  return (
    <Box pt={24} pb={20}>
      <SEO title="Portal Drama China" description="Nonton Drama China (Dracin) Sub Indo Terlengkap eksklusif." />
      <Container maxW="container.xl">
        <VStack spacing={4} mb={10} textAlign="center">
          <Badge colorScheme="red" variant="solid" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
            NEW FEATURE - DRACIN
          </Badge>
          <Heading size="2xl" fontWeight="900">Portal Drama China</Heading>
          <Text color="gray.500">Akses Drama China terlengkap sub Indo secara eksklusif.</Text>
        </VStack>

        <Box mb={10} maxW="600px" mx="auto">
            <form onSubmit={handleSearch}>
                <InputGroup size="lg" boxShadow="md" borderRadius="full">
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari judul drama china..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="white" _dark={{ bg: "gray.800" }}
                        borderRadius="full"
                        pr="4.5rem"
                    />
                    {searchQuery && (
                        <InputRightElement w="4.5rem">
                            <IconButton
                                aria-label="Clear Search"
                                icon={<FaTimes />}
                                size="sm"
                                borderRadius="full"
                                variant="ghost"
                                onClick={clearSearch}
                            />
                        </InputRightElement>
                    )}
                </InputGroup>
            </form>
        </Box>

        {isSearching && <Center h="20vh"><div className="custom-loader"></div></Center>}
        {error && <Center h="20vh"><Text color="red.500">{error}</Text></Center>}

        {!isSearching && searchResults.length > 0 && (
            <Box mb={12}>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaSearch} color="blue.500" /> Hasil Pencarian: {searchQuery}
                </Heading>
                <DracinGrid items={searchResults} />
            </Box>
        )}

        {loading && !isSearching && <Center h="40vh"><div className="custom-loader"></div></Center>}

        {!isSearching && searchResults.length === 0 && !loading && !error && (
            <Tabs variant="soft-rounded" colorScheme="brand" mt={4}>
              <TabList justifyContent="center" mb={6} overflowX="auto" pb={2}>
                <Tab><Icon as={FaFire} mr={2} color="orange.500" />Trending</Tab>
                <Tab><Icon as={FaStar} mr={2} color="yellow.500" />For You</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                   <DracinGrid items={dataTrending} />
                </TabPanel>
                <TabPanel>
                   <DracinGrid items={dataForYou} />
                </TabPanel>
              </TabPanels>
            </Tabs>
        )}

      </Container>
    </Box>
  );
};

export default DracinPage;
