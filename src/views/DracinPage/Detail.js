import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Center, Image, Flex,
  Badge, Button, SimpleGrid, Icon, VStack, HStack, Divider
} from '@chakra-ui/react';
import { FaPlay, FaListUl, FaArrowLeft } from 'react-icons/fa';
import { FaLock } from "react-icons/fa";
import { SEO } from '../../components';
import { dracinApi } from './api';

const DracinDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      setLoading(true);
      try {
        const res = await dracinApi.getDetail(id);
        if (mounted) {
            setData(res); // API returns data directly at root
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat detail drama.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDetail();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <Center h="100vh"><div className="custom-loader"></div></Center>;
  if (error || !data) return <Center h="100vh"><Text color="red.500">{error || "Data tidak ditemukan"}</Text></Center>;

  const apiEpisodes = data.chapters || data.episodes;
  const episodes = apiEpisodes && apiEpisodes.length > 0 ? apiEpisodes : Array.from({ length: data.total_episodes || 0 }, (_, i) => ({ number: i + 1 }));
  const coverImage = (data.cover_urls && data.cover_urls.length > 0) ? data.cover_urls[0] : (data.cover || data.posterImg);

  return (
    <Box pt={24} pb={20}>
      <SEO title={`${data.title} - Dracin`} description={data.description || data.synopsis} />
      <Container maxW="container.xl">
        <Button as={RouterLink} to="/dracin" leftIcon={<FaArrowLeft />} variant="ghost" mb={6}>
            Kembali
        </Button>

        <Flex direction={{ base: 'column', md: 'row' }} gap={8} mb={10}>
            <Box flexShrink={0} w={{ base: '100%', md: '300px' }}>
                <Image
                    src={coverImage}
                    alt={data.title}
                    borderRadius="xl"
                    boxShadow="xl"
                    w="100%"
                    objectFit="cover"
                />
            </Box>
            <VStack align="start" spacing={4} flex={1}>
                <Heading size="2xl">{data.title}</Heading>
                <HStack wrap="wrap" gap={2}>
                    <Badge colorScheme="blue" px={2} py={1} borderRadius="md">{data.episode_label || `Episodes: ${data.totalEpisodes || episodes.length}`}</Badge>
                    {data.type && <Badge colorScheme="green" px={2} py={1} borderRadius="md">{data.type}</Badge>}
                </HStack>
                <Divider />
                <Box>
                    <Heading size="md" mb={2} display="flex" alignItems="center" gap={2}>
                        Sinopsis
                    </Heading>
                    <Text color="gray.600" _dark={{ color: "gray.300" }} lineHeight="tall" textAlign="justify">
                        {data.description || data.synopsis || "Tidak ada sinopsis."}
                    </Text>
                </Box>
                {episodes.length > 0 && (
                    <Button
                        as={RouterLink}
                        to={`/dracin/detail/${id}/${episodes[0].serialNumber || episodes[0].number || 1}/play`}
                        colorScheme="brand"
                        size="lg"
                        leftIcon={<FaPlay />}
                        mt={4}
                    >
                        Tonton Episode 1
                    </Button>
                )}
            </VStack>
        </Flex>

        {episodes.length > 0 && (
            <Box>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaListUl} /> Daftar Episode
                </Heading>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
                    {episodes.map((ep, idx) => (
                        <Button
                            key={idx}
                            as={RouterLink}
                            to={`/dracin/detail/${id}/${ep.serialNumber || ep.number || ep.episodeNumber}/play`}
                            variant="outline"
                            colorScheme="brand"
                            size="md"
                            justifyContent="center"
                            isDisabled={ep.isLocked || ep.locked}
                        >
                            Episode {ep.serialNumber || ep.number || ep.episodeNumber}
                            {(ep.isLocked || ep.locked) && <Icon as={FaLock} ml={2} />}
                        </Button>
                    ))}
                </SimpleGrid>
            </Box>
        )}
      </Container>
    </Box>
  );
};

export default DracinDetail;
