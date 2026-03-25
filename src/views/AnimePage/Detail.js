import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Spinner, Center, Badge, Image, Flex, VStack, SimpleGrid, Button, LinkBox, LinkOverlay, Icon, Divider } from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { SEO } from '../../components';
import { FaPlayCircle, FaInfoCircle, FaStar, FaFolderOpen, FaClock, FaCalendarAlt, FaFilm } from 'react-icons/fa';
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
        if (provider !== 'samehadaku') {
          throw new Error("Provider tidak didukung (Hanya Samehadaku).");
        }

        const res = await animeApi.samehadaku.detail(slug);
        if (res.data?.status === 'success' && res.data?.data) {
          setAnimeData(res.data.data);
        } else {
          throw new Error("Data anime tidak valid.");
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

  const title = animeData.title || animeData.japanese || "Tanpa Judul";
  const synopsisList = animeData.synopsis?.paragraphs || [];
  const image = animeData.poster;
  const episodesList = animeData.episodeList || [];
  const batchList = animeData.batchList || [];
  const genres = animeData.genreList || [];

  return (
    <Box pt={32} pb={20}>
      <SEO title={`${title} - Anime Ngawonggo`} description={synopsisList.length > 0 ? synopsisList[0].slice(0, 150) : "Tonton anime sub indo terlengkap."} />
      <Container maxW="container.xl">
        <Button mb={6} variant="outline" onClick={() => navigate(-1)}>&larr; Kembali</Button>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flexShrink={0} w={{ base: '100%', md: '300px' }}>
            <Image src={image} alt={title} borderRadius="xl" boxShadow="xl" w="100%" objectFit="cover" />
            {animeData.score?.value && (
                <Flex mt={4} align="center" justify="center" bg="yellow.100" color="yellow.800" py={3} borderRadius="lg" fontWeight="bold" gap={2}>
                    <Icon as={FaStar} /> {animeData.score.value}
                    <Text fontSize="sm" fontWeight="normal" color="yellow.700">({animeData.score.users} users)</Text>
                </Flex>
            )}
          </Box>

          <VStack align="start" spacing={4} flex={1}>
            <Heading size="xl" fontWeight="900">{title}</Heading>
            {animeData.english && <Text color="gray.500" fontStyle="italic">{animeData.english}</Text>}

            <Flex gap={2} flexWrap="wrap">
              {animeData.status && <Badge colorScheme={animeData.status === 'Completed' ? 'green' : 'purple'}>{animeData.status}</Badge>}
              {animeData.type && <Badge colorScheme="blue">{animeData.type}</Badge>}
              {animeData.duration && <Badge colorScheme="orange" display="flex" alignItems="center" gap={1}><Icon as={FaClock}/> {animeData.duration}</Badge>}
              {animeData.aired && <Badge colorScheme="teal" display="flex" alignItems="center" gap={1}><Icon as={FaCalendarAlt}/> {animeData.aired}</Badge>}
            </Flex>

            <Flex gap={2} flexWrap="wrap">
                {genres.map((g, i) => (
                    <Badge key={i} colorScheme="gray" variant="subtle" px={2} py={1}>{g.title}</Badge>
                ))}
            </Flex>

            <Box bg="gray.50" p={5} borderRadius="xl" w="100%" mt={4}>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <Icon as={FaInfoCircle} color="brand.500" /> Sinopsis
              </Heading>
              <VStack align="stretch" spacing={3}>
                {synopsisList.length > 0 ? synopsisList.map((p, i) => (
                  <Text key={i} color="gray.700" lineHeight="tall">{p}</Text>
                )) : <Text color="gray.500">Sinopsis tidak tersedia.</Text>}
              </VStack>
            </Box>

            <SimpleGrid columns={2} spacing={4} mt={4} w="full" fontSize="sm">
                <Box><Text fontWeight="bold">Studios:</Text><Text color="gray.600">{animeData.studios || '-'}</Text></Box>
                <Box><Text fontWeight="bold">Producers:</Text><Text color="gray.600">{animeData.producers || '-'}</Text></Box>
                <Box><Text fontWeight="bold">Season:</Text><Text color="gray.600">{animeData.season || '-'}</Text></Box>
                <Box><Text fontWeight="bold">Source:</Text><Text color="gray.600">{animeData.source || '-'}</Text></Box>
            </SimpleGrid>
          </VStack>
        </Flex>

        <Divider my={10} />

        <Box>
          <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
            <Icon as={FaFilm} color="brand.500" /> Daftar Episode
          </Heading>

          {episodesList.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
              {episodesList.map((ep, idx) => (
                  <LinkBox key={idx} as="article" p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.100" _hover={{ bg: 'brand.50', borderColor: 'brand.300', transform: 'translateY(-2px)' }} transition="all 0.2s">
                    <Flex align="center" justify="space-between">
                      <Box>
                        <LinkOverlay as={RouterLink} to={`/anime/${provider}/episode/${encodeURIComponent(ep.episodeId)}`}>
                            <Text fontWeight="bold" noOfLines={1}>{ep.title}</Text>
                        </LinkOverlay>
                        <Text fontSize="xs" color="gray.500" mt={1}>{ep.releasedOn}</Text>
                      </Box>
                      <Icon as={FaPlayCircle} color="brand.500" boxSize={6} />
                    </Flex>
                  </LinkBox>
              ))}
            </SimpleGrid>
          ) : (
            <Text color="gray.500">Belum ada episode yang dirilis atau sedang mengambil data.</Text>
          )}
        </Box>

        {batchList.length > 0 && (
          <Box mt={10}>
            <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
              <Icon as={FaFolderOpen} color="green.500" /> Download Batch
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {batchList.map((batch, idx) => (
                  <LinkBox key={idx} as="article" p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200" _hover={{ bg: 'green.100' }}>
                      <LinkOverlay as={RouterLink} to={`/anime/${provider}/batch/${encodeURIComponent(batch.batchId)}`}>
                         <Text fontWeight="bold" color="green.800">{batch.title}</Text>
                      </LinkOverlay>
                  </LinkBox>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AnimeDetail;
