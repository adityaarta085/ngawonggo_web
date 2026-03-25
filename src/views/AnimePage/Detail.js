import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Spinner, Center, Badge, Image, Flex, VStack, SimpleGrid, Button, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { SEO } from '../../components';
import { FaPlayCircle, FaInfoCircle, FaStar } from 'react-icons/fa';
import animeApi from '../../services/anime/api';

const AnimeDetail = () => {
  const { provider, slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        let res;
        switch (provider) {
          case 'otakudesu':
            res = await animeApi.otakudesu.detail(slug);
            setAnimeData(res.data.data);
            break;
          case 'samehadaku':
            res = await animeApi.samehadaku.detail(slug);
            setAnimeData(res.data.data);
            break;
          case 'donghua':
            res = await animeApi.donghua.detail(slug);
            setAnimeData(res.data.data);
            break;
          case 'kusonime':
            res = await animeApi.kusonime.detail(slug);
            setAnimeData(res.data.data);
            break;
          default:
            throw new Error("Provider tidak didukung.");
        }
      } catch (err) {
        console.error("Failed to fetch anime detail:", err);
        setError("Gagal memuat detail anime.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [provider, slug]);

  if (loading) return <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>;
  if (error) return <Center h="60vh"><Text color="red.500">{error}</Text></Center>;
  if (!animeData) return <Center h="60vh"><Text>Anime tidak ditemukan.</Text></Center>;

  // Data mapping since every provider has a slightly different structure
  // Usually animeData has title, synopsis, status, genre, episodes list, thumb/poster
  const title = animeData.title || animeData.name;
  const synopsis = animeData.synopsis || animeData.sinopsis || "Tidak ada sinopsis tersedia.";
  const image = animeData.thumb || animeData.poster || animeData.cover;
  const episodes = animeData.episode_list || animeData.episodes || [];
  const genres = animeData.genre || animeData.genres || [];

  return (
    <Box pt={32} pb={20}>
      <SEO title={`${title} - Anime Ngawonggo`} description={synopsis.slice(0, 150)} />
      <Container maxW="container.xl">
        <Button mb={6} variant="outline" onClick={() => navigate(-1)}>&larr; Kembali</Button>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flexShrink={0} w={{ base: '100%', md: '300px' }}>
            <Image src={image} alt={title} borderRadius="xl" boxShadow="xl" w="100%" objectFit="cover" />
            {animeData.score && (
                <Flex mt={4} align="center" justify="center" bg="yellow.100" color="yellow.800" py={2} borderRadius="md" fontWeight="bold">
                    <FaStar style={{ marginRight: '8px' }} /> Rating: {animeData.score}
                </Flex>
            )}
          </Box>

          <VStack align="start" spacing={4} flex={1}>
            <Heading size="xl" fontWeight="900">{title}</Heading>
            <Flex gap={2} flexWrap="wrap">
              <Badge colorScheme="purple">{animeData.status}</Badge>
              {animeData.type && <Badge colorScheme="blue">{animeData.type}</Badge>}
              <Badge colorScheme="green">{provider.toUpperCase()}</Badge>
            </Flex>

            <Flex gap={2} flexWrap="wrap">
                {Array.isArray(genres) ? genres.map((g, i) => (
                    <Badge key={i} colorScheme="gray">{g.name || g}</Badge>
                )) : <Badge colorScheme="gray">{genres}</Badge>}
            </Flex>

            <Box bg="gray.50" p={4} borderRadius="lg" w="100%" mt={4}>
              <Heading size="md" mb={2} display="flex" alignItems="center" gap={2}>
                <FaInfoCircle /> Sinopsis
              </Heading>
              <Text color="gray.700" lineHeight="tall">{synopsis}</Text>
            </Box>
          </VStack>
        </Flex>

        <Box mt={12}>
          <Heading size="lg" mb={6} borderBottom="2px solid" borderColor="brand.500" pb={2} display="inline-block">Daftar Episode</Heading>
          {episodes.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
              {episodes.map((ep, idx) => {
                const epSlug = ep.slug || ep.id || ep.endpoint;
                // Reverse mapping if API doesn't provide correct format for endpoint
                return (
                  <LinkBox key={idx} as="article" p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.100" _hover={{ bg: 'brand.50', borderColor: 'brand.300', transform: 'translateY(-2px)' }} transition="all 0.2s">
                    <Flex align="center" justify="space-between">
                      <Box>
                        <LinkOverlay as={RouterLink} to={`/anime/${provider}/episode/${encodeURIComponent(epSlug)}`}>
                            <Text fontWeight="bold" noOfLines={1}>{ep.title || ep.episode || `Episode ${episodes.length - idx}`}</Text>
                        </LinkOverlay>
                        <Text fontSize="xs" color="gray.500">{ep.date || ''}</Text>
                      </Box>
                      <FaPlayCircle color="var(--chakra-colors-brand-500)" size="24px" />
                    </Flex>
                  </LinkBox>
                )
              })}
            </SimpleGrid>
          ) : (
            <Text color="gray.500">Belum ada episode yang dirilis.</Text>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AnimeDetail;
