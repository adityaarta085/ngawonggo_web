import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Spinner, Center, Badge, Flex, VStack, Button, Icon, useToast, useColorModeValue } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO } from '../../components';
import { FaPlay, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import animeApi from '../../services/anime/api';
import { supabase } from '../../lib/supabase';

const AnimeWatch = () => {
  const { provider, slug } = useParams();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      if (!session) {
        toast({
          title: "Akses Ditolak",
          description: "Anda harus login untuk menonton anime.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    if (!userSession) return;

    const fetchEpisode = async () => {
      try {
        setLoading(true);
        let res;
        if (!animeApi[provider] || !animeApi[provider].episode) {
            throw new Error("Provider tidak didukung.");
          }
          res = await animeApi[provider].episode(slug);
          const extracted = res.data?.data?.data || res.data?.data || res.data;
          setEpisodeData(extracted);

        // Save to local storage as watched
        try {
            const watched = JSON.parse(localStorage.getItem('watched_anime') || '[]');
            if (!watched.includes(slug)) {
                watched.push(slug);
                localStorage.setItem('watched_anime', JSON.stringify(watched));
            }
        } catch(e) { console.error(e) }

      } catch (err) {
        console.error("Failed to fetch episode:", err);
        setError("Gagal memuat video anime. Server mungkin sedang sibuk atau error.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [provider, slug, userSession]);

  if (!userSession) return <Center h="60vh"><Spinner size="xl" /></Center>;
  if (loading) return <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>;
  if (error) return <Center h="60vh"><Text color="red.500">{error}</Text></Center>;
  if (!episodeData) return <Center h="60vh"><Text>Episode tidak ditemukan.</Text></Center>;

  // Data mapping
  const title = episodeData.title || "Tonton Anime";
  // Attempt to find the stream URL. It varies heavily based on provider.
  // otakudesu usually has stream_url or mirrors
  const streamUrl = episodeData.stream_url || episodeData.video || (episodeData.mirrors && episodeData.mirrors.length > 0 ? episodeData.mirrors[0].url : null);
  const embedUrl = episodeData?.embed_url || streamUrl;

  return (
    <Box pt={32} pb={20} bg={bg}>
      <SEO title={`${title} - Anime Ngawonggo`} description={`Nonton ${title} Sub Indo`} />
      <Container maxW="container.xl">
        <Button leftIcon={<FaArrowLeft />} mb={6} variant="ghost" onClick={() => navigate(-1)} _hover={{ bg: 'gray.200' }}>Kembali ke Detail</Button>
        <VStack align="stretch" spacing={6}>
          <Heading size="lg" fontWeight="900" display="flex" alignItems="center" gap={3}>
            <Icon as={FaPlay} color="brand.500" />
            {title}
          </Heading>

          <Box position="relative" w="100%" paddingTop="56.25%" bg="black" borderRadius="xl" overflow="hidden" boxShadow="2xl">
            {embedUrl ? (
              <Box as="iframe" position="absolute" top="0" left="0" w="100%" h="100%" src={embedUrl} allowFullScreen allow="encrypted-media" style={{ border: 0 }}></Box>
            ) : (
              <Center position="absolute" top="0" left="0" w="100%" h="100%" flexDirection="column" color="white" gap={4}>
                  <Icon as={FaExclamationCircle} boxSize="40px" color="yellow.400" />
                  <Text fontSize="lg" fontWeight="bold">Link Streaming Tidak Tersedia</Text>
                  <Text color="gray.400">Silakan gunakan link download jika tersedia.</Text>
              </Center>
            )}
          </Box>

          <Flex gap={2} flexWrap="wrap">
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">Sub Indo</Badge>
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full">{provider.toUpperCase()}</Badge>
          </Flex>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100">
             <Heading size="md" mb={4}>Informasi Episode</Heading>
             <Text color="gray.600" lineHeight="tall">{episodeData.description || 'Tidak ada deskripsi tersedia.'}</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AnimeWatch;
