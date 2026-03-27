import React, { useState, useEffect } from 'react';
import './AnimeStyles.css';
import { Box, Container, Heading, SimpleGrid, Text,  Center, Badge, Image, LinkBox, LinkOverlay, VStack, Icon, Input, InputGroup, InputLeftElement, InputRightElement, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFire, FaFilm, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import { SEO } from '../../components';
import animeApi from '../../services/anime/api';

const AnimeGrid = ({ items, showScore = false }) => {
    if (!items || items.length === 0) return <Text color="gray.500">Tidak ada data.</Text>;

    return (
        <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6} mb={10}>
        {items.map((item, idx) => {
            const title = item.title;
            const slug = item.animeId;
            const image = item.poster || 'https://via.placeholder.com/300x450?text=No+Image';

            return (
                <LinkBox key={idx} as="article" rounded="xl" overflow="hidden" boxShadow="md" _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
                <Box position="relative">
                    <Image src={image} alt={title} objectFit="cover" h="250px" w="100%" loading="lazy" fallbackSrc="https://via.placeholder.com/300x450?text=Loading..." />
                    {item.episodes && (
                        <Badge position="absolute" top={2} left={2} colorScheme="blue">
                            Eps {item.episodes}
                        </Badge>
                    )}
                    {showScore && item.score && (
                         <Badge position="absolute" top={2} right={2} colorScheme="yellow" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaStar} /> {item.score}
                        </Badge>
                    )}
                    {item.type && (
                         <Badge position="absolute" bottom={2} left={2} colorScheme="green">
                            {item.type}
                        </Badge>
                    )}
                </Box>
                <Box p={4} bg="white">
                    <LinkOverlay as={RouterLink} to={`/anime/samehadaku/detail/${slug}`}>
                        <Text fontWeight="bold" noOfLines={2} fontSize="sm">{title}</Text>
                    </LinkOverlay>
                    {item.releasedOn && <Text fontSize="xs" color="gray.500" mt={1}>{item.releasedOn}</Text>}
                </Box>
                </LinkBox>
            );
        })}
        </SimpleGrid>
    );
}

const AnimePage = () => {
  const [data, setData] = useState(null);
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
        const res = await animeApi.samehadaku.home();
        if (mounted) {
            if (res?.data?.data) {
                setData(res.data.data);
            } else if (res?.data) {
                setData(res.data);
            }
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat portal Anime. Pastikan koneksi internet stabil.");
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
          const res = await animeApi.samehadaku.search(searchQuery);
          if (res?.data?.data?.animeList) {
              setSearchResults(res.data.data.animeList);
          } else {
              setSearchResults([]);
          }
      } catch (err) {
          setError("Gagal mencari anime.");
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
      <SEO title="Portal Anime (Samehadaku)" description="Nonton Anime Sub Indo Terlengkap eksklusif dari Samehadaku" />
      <Container maxW="container.xl">
        <VStack spacing={4} mb={10} textAlign="center">
          <Badge colorScheme="red" variant="solid" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
            NEW FEATURE - POWERED BY SAMEHADAKU
          </Badge>
          <Heading size="2xl" fontWeight="900">Portal Anime Ngawonggo</Heading>
          <Text color="gray.500">Akses anime terlengkap sub Indo secara eksklusif.</Text>
        </VStack>

        <Box mb={10} maxW="600px" mx="auto">
            <form onSubmit={handleSearch}>
                <InputGroup size="lg" boxShadow="md" borderRadius="full">
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari judul anime (contoh: One Piece)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="white"
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
                <AnimeGrid items={searchResults} showScore={true} />
            </Box>
        )}

        {loading && !isSearching && <Center h="40vh"><div className="custom-loader"></div></Center>}

        {!isSearching && searchResults.length === 0 && data && !loading && !error && (
            <Box>
                {data.ongoing?.animeList && (
                    <Box mb={12}>
                        <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
                            <Icon as={FaFire} color="orange.500" /> Anime Ongoing (Sedang Tayang)
                        </Heading>
                        <AnimeGrid items={data.ongoing.animeList} />
                    </Box>
                )}

                {data.completed?.animeList && (
                    <Box mb={12}>
                        <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
                            <Icon as={FaFilm} color="blue.500" /> Anime Tamat (Completed)
                        </Heading>
                        <AnimeGrid items={data.completed.animeList} showScore={true} />
                    </Box>
                )}
            </Box>
        )}

      </Container>
    </Box>
  );
};

export default AnimePage;
