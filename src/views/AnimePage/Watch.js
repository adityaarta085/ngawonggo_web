import React, { useState, useEffect, useCallback } from 'react';
import './AnimeStyles.css';
import { Box, Container, Heading, Text,  Center, Badge, Flex, VStack, HStack, Button, Icon, Select, SimpleGrid, Link } from '@chakra-ui/react';
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

  const fetchServerUrl = useCallback(async (serverId) => {
      try {
          const res = await animeApi.samehadaku.server(serverId);
          if (res.data && res.data.url) {
              setStreamUrl(res.data.url);
          }
      } catch (err) {
          console.error("Failed to fetch server url:", err);
          toast({
              title: "Error",
              description: "Gagal memuat URL server.",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
      }
  }, [toast]);

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


        let initialServerId = null;
        if (epData.server?.qualities) {
            let allServers = [];
            for (const quality of epData.server.qualities) {
                if (quality.serverList?.length > 0) {
                    allServers = allServers.concat(quality.serverList);
                }
            }

            if (allServers.length > 0) {
                const megaServer = allServers.find(s => s.title && s.title.toLowerCase() === 'mega');
                const ondesuServer = allServers.find(s => s.title && s.title.toLowerCase() === 'ondesu');
                const filedonServer = allServers.find(s => s.title && s.title.toLowerCase() === 'filedon');

                if (megaServer) {
                    initialServerId = megaServer.serverId;
                } else if (ondesuServer) {
                    initialServerId = ondesuServer.serverId;
                } else if (filedonServer) {
                    initialServerId = filedonServer.serverId;
                } else {
                    initialServerId = allServers[0].serverId;
                }
            }
        }

        if (initialServerId) {
            setSelectedServerId(initialServerId);
            fetchServerUrl(initialServerId);
        } else if (epData.stream_url) {
            setStreamUrl(epData.stream_url);
        }

      } catch (err) {
        console.error("Failed to fetch episode:", err);
        setError("Gagal memuat video anime. Server mungkin sedang sibuk atau error.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [provider, slug, userSession, fetchServerUrl]);



  const handleServerChange = async (e) => {
      const serverId = e.target.value;
      setSelectedServerId(serverId);
      if (serverId) {
          fetchServerUrl(serverId);
      }
  };

  if (!userSession) return <Center h="60vh" bg="gray.50" _dark={{ bg: "gray.900" }}><div className="custom-loader"></div></Center>;
  if (loading) return <Center h="60vh" bg="gray.50" _dark={{ bg: "gray.900" }}><div className="custom-loader"></div></Center>;
  if (error) return <Center h="60vh" bg="gray.50" _dark={{ bg: "gray.900" }}><Text color="red.500">{error}</Text></Center>;
  if (!episodeData) return <Center h="60vh" bg="gray.50" _dark={{ bg: "gray.900" }}><Text>Episode tidak ditemukan.</Text></Center>;

  const title = episodeData.title || "Tonton Anime";
  const serverQualities = episodeData.server?.qualities || [];
  const serverList = [];
  serverQualities.forEach(q => {
      q.serverList?.forEach(s => {
          serverList.push({ ...s, quality: q.title });
      });
  });
  const downloadUrlList = episodeData.downloadUrl?.qualities || [];
  const synopsisList = episodeData.synopsis?.paragraphs || [];

  return (
    <Box pt={24} pb={20} bg="gray.50" _dark={{ bg: "gray.900" }}>
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
                     <Select bg="white" color="black" _dark={{ bg: "gray.800", color: "white" }} value={selectedServerId} onChange={handleServerChange} placeholder="Pilih Server Video (Jika Error)">
                         {serverList.map((srv, idx) => (
                             <option key={idx} value={srv.serverId}>{srv.quality} - {srv.title}</option>
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
              <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100" gridColumn={{ lg: 'span 2' }}>
                <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaInfoCircle} color="brand.500" /> Informasi Episode
                </Heading>
                <VStack align="stretch" spacing={3}>
                    {synopsisList.length > 0 ? synopsisList.map((p, i) => (
                    <Text key={i} color="gray.700" lineHeight="tall">{p}</Text>
                    )) : <Text color="gray.500">Tidak ada deskripsi tersedia.</Text>}
                </VStack>
              </Box>

              <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100">
                  <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                      <Icon as={FaDownload} color="green.500" /> Link Download
                  </Heading>

                  {downloadUrlList.length > 0 ? (
                      <VStack align="stretch" spacing={4}>
                         {downloadUrlList.map((qual, idx) => (
                             <Box key={idx} bg="gray.50" _dark={{ bg: "gray.900" }} p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                                 <Text fontWeight="bold" color="brand.600" mb={2}>{qual.title} {qual.size ? `(${qual.size})` : ''}</Text>
                                 <HStack mt={1} flexWrap="wrap" gap={2}>
                                     {qual.urls?.map((urlItem, uidx) => (
                                         <Link key={uidx} href={urlItem.url} isExternal>
                                             <Badge colorScheme="blue" variant="solid" cursor="pointer" _hover={{ bg: 'blue.600' }} px={2} py={1}>
                                                 {urlItem.title}
                                             </Badge>
                                         </Link>
                                     ))}
                                 </HStack>
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
