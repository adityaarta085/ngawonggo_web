import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Spinner, Center, Badge, Flex, VStack, HStack, Button, Icon, Select, SimpleGrid, Link } from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import animeApi from '../../services/anime/api';
import { useToast } from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components';
import { FaPlay, FaArrowLeft, FaServer, FaStepBackward, FaStepForward, FaExclamationCircle, FaInfoCircle, FaDownload } from 'react-icons/fa';


const AnimeWatch = () => {
  const { provider, slug } = useParams();
  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [selectedServerId, setSelectedServerId] = useState('');
  const [streamUrl, setStreamUrl] = useState('');

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
        if (provider !== 'samehadaku') throw new Error("Provider tidak didukung.");

        const data = await animeApi.samehadaku.episode(slug);

        let epData = data.data || data;
        setEpisodeData(epData);

        if (epData.stream_url) {
            setStreamUrl(epData.stream_url);
        } else if (epData.serverList && epData.serverList.length > 0) {
            setStreamUrl(epData.serverList[0].iframe || '');
        }

      } catch (err) {
        console.error("Failed to fetch episode:", err);
        setError("Gagal memuat video anime. Server mungkin sedang sibuk atau error.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [provider, slug, userSession]);

  const handleServerChange = async (e) => {
      const serverId = e.target.value;
      setSelectedServerId(serverId);
  };

  if (!userSession) return <Center h="60vh" bg="gray.50"><Spinner size="xl" /></Center>;
  if (loading) return <Center h="60vh" bg="gray.50"><Spinner size="xl" color="brand.500" /></Center>;
  if (error) return <Center h="60vh" bg="gray.50"><Text color="red.500">{error}</Text></Center>;
  if (!episodeData) return <Center h="60vh" bg="gray.50"><Text>Episode tidak ditemukan.</Text></Center>;

  const title = episodeData.title || "Tonton Anime";
  const serverList = episodeData.serverList || [];
  const downloadUrlList = episodeData.downloadUrl || null;
  const synopsisList = episodeData.synopsis?.paragraphs || [];

  return (
    <Box pt={32} pb={20} bg="gray.50">
      <SEO title={`${title} - Anime Ngawonggo`} description={`Nonton ${title} Sub Indo gratis dan eksklusif`} />
      <Container maxW="container.xl">
        <HStack mb={6} justify="space-between">
            <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate(-1)} _hover={{ bg: 'gray.200' }}>
                Kembali ke Detail
            </Button>
            {episodeData.releasedOn && <Badge colorScheme="gray">{episodeData.releasedOn}</Badge>}
        </HStack>

        <VStack align="stretch" spacing={6}>
          <Heading size="lg" fontWeight="900" display="flex" alignItems="center" gap={3}>
            <Icon as={FaPlay} color="brand.500" />
            {title}
          </Heading>

          <Box p={4} bg="gray.800" borderRadius="xl" boxShadow="2xl">
              <Box position="relative" w="100%" paddingTop="56.25%" bg="black" borderRadius="md" overflow="hidden">
                {streamUrl ? (
                  <Box as="iframe" position="absolute" top="0" left="0" w="100%" h="100%" src={streamUrl} allowFullScreen allow="encrypted-media" style={{ border: 0 }}></Box>
                ) : (
                  <Center position="absolute" top="0" left="0" w="100%" h="100%" flexDirection="column" color="white" gap={4} p={4} textAlign="center">
                      <Icon as={FaExclamationCircle} boxSize="40px" color="yellow.400" />
                      <Text fontSize="lg" fontWeight="bold">Link Streaming Tidak Tersedia</Text>
                      <Text color="gray.400">Penyedia video streaming saat ini tidak dapat diakses.</Text>
                  </Center>
                )}
              </Box>

              <Flex mt={4} justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                  <HStack w="full" maxW="400px">
                     <Icon as={FaServer} color="white" />
                     <Select bg="white" color="black" value={selectedServerId} onChange={handleServerChange} placeholder="Pilih Server Video (Jika Error)">
                         {serverList.map((srv, idx) => (
                             <option key={idx} value={srv.serverId}>{srv.title}</option>
                         ))}
                     </Select>
                  </HStack>
                  <HStack spacing={4}>
                      <Button as={RouterLink} to={episodeData.prevEpisode ? `/anime/samehadaku/episode/${episodeData.prevEpisode.episodeId}` : '#'} isDisabled={!episodeData.hasPrevEpisode} leftIcon={<FaStepBackward/>} colorScheme="blue" variant="solid">Prev Eps</Button>
                      <Button as={RouterLink} to={episodeData.nextEpisode ? `/anime/samehadaku/episode/${episodeData.nextEpisode.episodeId}` : '#'} isDisabled={!episodeData.hasNextEpisode} rightIcon={<FaStepForward/>} colorScheme="blue" variant="solid">Next Eps</Button>
                  </HStack>
              </Flex>
          </Box>

          <Flex gap={2} flexWrap="wrap">
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">Sub Indo</Badge>
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full">{provider.toUpperCase()}</Badge>
            {episodeData.genreList?.map((g, i) => (
                <Badge key={i} colorScheme="gray" variant="outline" px={3} py={1} borderRadius="full">{g.title}</Badge>
            ))}
          </Flex>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={4}>
              <Box bg="white" p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100" gridColumn={{ lg: 'span 2' }}>
                <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaInfoCircle} color="brand.500" /> Informasi Episode
                </Heading>
                <VStack align="stretch" spacing={3}>
                    {synopsisList.length > 0 ? synopsisList.map((p, i) => (
                    <Text key={i} color="gray.700" lineHeight="tall">{p}</Text>
                    )) : <Text color="gray.500">Tidak ada deskripsi tersedia.</Text>}
                </VStack>
              </Box>

              <Box bg="white" p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100">
                  <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                      <Icon as={FaDownload} color="green.500" /> Link Download
                  </Heading>

                  {downloadUrlList?.formats?.length > 0 ? (
                      <VStack align="stretch" spacing={4}>
                         {downloadUrlList.formats.map((fmt, idx) => (
                             <Box key={idx}>
                                 <Text fontWeight="bold" color="brand.600" mb={2}>Format: {fmt.title}</Text>
                                 <VStack align="stretch" spacing={2}>
                                     {fmt.qualities?.map((qual, qidx) => (
                                         <Box key={qidx} bg="gray.50" p={2} borderRadius="md" border="1px solid" borderColor="gray.200">
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">{qual.title}</Text>
                                            <HStack mt={1} flexWrap="wrap" gap={1}>
                                                {qual.urls?.map((urlItem, uidx) => (
                                                    <Link key={uidx} href={urlItem.url} isExternal>
                                                        <Badge colorScheme="blue" variant="subtle" cursor="pointer" _hover={{ bg: 'blue.100' }}>
                                                            {urlItem.title}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </HStack>
                                         </Box>
                                     ))}
                                 </VStack>
                             </Box>
                         ))}
                      </VStack>
                  ) : (
                      <Text color="gray.500">Link download belum tersedia.</Text>
                  )}
              </Box>
          </SimpleGrid>

        </VStack>
      </Container>
    </Box>
  );
};

export default AnimeWatch;
