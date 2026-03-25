import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Spinner, Center, Badge, Image, LinkBox, LinkOverlay, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SEO } from '../../components';
import animeApi from '../../services/anime/api';

const AnimePage = () => {
  const [otakuData, setOtakuData] = useState([]);
  const [samehadakuData, setSamehadakuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch from multiple providers (just a subset for the homepage)
        const [otakuRes, samehadakuRes] = await Promise.all([
          animeApi.otakudesu.home().catch(() => ({ data: { data: { ongoing: [] } } })),
          animeApi.samehadaku.home().catch(() => ({ data: { data: { recent: [] } } }))
        ]);

        setOtakuData(otakuRes?.data?.data?.ongoing || []);
        // Different APIs have different response structures. We will map to a standard structure if possible
        setSamehadakuData(samehadakuRes?.data?.data?.recent || []);
      } catch (err) {
        console.error("Failed to fetch anime data:", err);
        setError("Gagal memuat data anime.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box pt={32} pb={20}>
      <SEO title="Anime (NEW)" description="Nonton Anime Sub Indo Terlengkap dan Eksklusif" />
      <Container maxW="container.xl">
        <VStack spacing={4} mb={10} textAlign="center">
          <Badge colorScheme="red" variant="solid" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
            NEW FEATURE
          </Badge>
          <Heading size="2xl" fontWeight="900">Portal Anime Ngawonggo</Heading>
          <Text color="gray.500">Tonton anime favoritmu dengan subtitle bahasa Indonesia secara gratis.</Text>
        </VStack>

        {loading ? (
          <Center h="40vh">
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : error ? (
          <Center h="40vh">
            <Text color="red.500">{error}</Text>
          </Center>
        ) : (
          <>
            <Heading size="lg" mb={6}>Sedang Tayang (Otakudesu)</Heading>
            <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6} mb={12}>
              {otakuData.slice(0, 10).map((anime, idx) => (
                <LinkBox key={idx} as="article" rounded="xl" overflow="hidden" boxShadow="md" _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
                  <Box position="relative">
                    <Image src={anime.thumb || anime.poster} alt={anime.title} objectFit="cover" h="250px" w="100%" />
                    <Badge position="absolute" top={2} right={2} colorScheme="blue">Eps {anime.episode}</Badge>
                  </Box>
                  <Box p={4} bg="white">
                    <LinkOverlay as={RouterLink} to={`/anime/otakudesu/detail/${anime.slug}`}>
                      <Text fontWeight="bold" noOfLines={2} fontSize="sm">{anime.title}</Text>
                    </LinkOverlay>
                  </Box>
                </LinkBox>
              ))}
            </SimpleGrid>

            {samehadakuData && samehadakuData.length > 0 && (
                <>
                    <Heading size="lg" mb={6}>Terbaru (Samehadaku)</Heading>
                    <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={6}>
                    {samehadakuData.slice(0, 10).map((anime, idx) => (
                        <LinkBox key={idx} as="article" rounded="xl" overflow="hidden" boxShadow="md" _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
                        <Box position="relative">
                            <Image src={anime.thumb || anime.poster} alt={anime.title} objectFit="cover" h="250px" w="100%" />
                            <Badge position="absolute" top={2} right={2} colorScheme="green">{anime.type}</Badge>
                        </Box>
                        <Box p={4} bg="white">
                            <LinkOverlay as={RouterLink} to={`/anime/samehadaku/detail/${anime.animeId || anime.slug}`}>
                            <Text fontWeight="bold" noOfLines={2} fontSize="sm">{anime.title}</Text>
                            </LinkOverlay>
                        </Box>
                        </LinkBox>
                    ))}
                    </SimpleGrid>
                </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AnimePage;
