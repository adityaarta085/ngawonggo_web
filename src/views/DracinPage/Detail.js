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
            setData(res.data);
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
                    src={data.cover || data.posterImg}
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
                    <Badge colorScheme="blue" px={2} py={1} borderRadius="md">Episodes: {data.totalEpisodes || data.episodes?.length}</Badge>
                    {data.isCompleted === "1" && <Badge colorScheme="green" px={2} py={1} borderRadius="md">Completed</Badge>}
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
                {data.episodes && data.episodes.length > 0 && (
                    <Button
                        as={RouterLink}
                        to={`/dracin/detail/${id}/${data.episodes[0].number || 1}/play`}
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

        {data.episodes && data.episodes.length > 0 && (
            <Box>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaListUl} /> Daftar Episode
                </Heading>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
                    {data.episodes.map((ep, idx) => (
                        <Button
                            key={idx}
                            as={RouterLink}
                            to={`/dracin/detail/${id}/${ep.number || ep.episodeNumber}/play`}
                            variant="outline"
                            colorScheme="brand"
                            size="md"
                            justifyContent="center"
                            isDisabled={ep.locked}
                        >
                            Episode {ep.number || ep.episodeNumber}
                            {ep.locked && <Icon as={FaLock} ml={2} />}
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
