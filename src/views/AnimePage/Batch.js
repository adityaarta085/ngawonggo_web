import React, { useState, useEffect } from 'react';
import './AnimeStyles.css';
import { Box, Container, Heading, Text,  Center, Badge, Flex, VStack, Button, Icon, useColorModeValue, SimpleGrid, Link, HStack } from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { SEO } from '../../components';
import { FaArrowLeft, FaFolderOpen, FaInfoCircle, FaDownload } from 'react-icons/fa';
import animeApi from '../../services/anime/api';

const AnimeBatch = () => {
  const { provider, batchId } = useParams();
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        if (provider !== 'samehadaku') throw new Error("Provider tidak didukung.");

        const res = await animeApi.samehadaku.batchDetail(batchId);

        if (res.data?.status === 'success' && res.data?.data) {
          setBatchData(res.data.data);
        } else {
           throw new Error("Data tidak valid");
        }
      } catch (err) {
        console.error("Failed to fetch batch:", err);
        setError("Gagal memuat batch anime. Server mungkin sedang sibuk atau error.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [provider, batchId]);


  if (loading) return <Center h="60vh" bg={bg}><div className="custom-loader"></div></Center>;
  if (error) return <Center h="60vh" bg={bg}><Text color="red.500">{error}</Text></Center>;
  if (!batchData) return <Center h="60vh" bg={bg}><Text>Batch tidak ditemukan.</Text></Center>;

  const title = batchData.title || "Download Batch Anime";
  const downloadUrlList = batchData.downloadUrl || null;
  const synopsisList = batchData.synopsis?.paragraphs || [];

  return (
    <Box pt={24} pb={20} bg={bg}>
      <SEO title={`${title} - Anime Ngawonggo`} description={`Download Batch ${title} Sub Indo gratis dan eksklusif`} />
      <Container maxW="container.xl">
        <HStack mb={6} justify="space-between">
            <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate(-1)} _hover={{ bg: 'gray.200' }}>
                Kembali
            </Button>
            {batchData.releasedOn && <Badge colorScheme="gray">{batchData.releasedOn}</Badge>}
        </HStack>

        <VStack align="stretch" spacing={6}>
          <Heading size="lg" fontWeight="900" display="flex" alignItems="center" gap={3}>
            <Icon as={FaFolderOpen} color="green.500" />
            {title}
          </Heading>

          <Flex gap={2} flexWrap="wrap">
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">Batch Download</Badge>
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full">{provider.toUpperCase()}</Badge>
            {batchData.genreList?.map((g, i) => (
                <Badge key={i} colorScheme="gray" variant="outline" px={3} py={1} borderRadius="full">{g.title}</Badge>
            ))}
          </Flex>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={4}>
              <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100" gridColumn={{ lg: 'span 2' }}>
                <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaInfoCircle} color="green.500" /> Informasi Batch
                </Heading>
                <VStack align="stretch" spacing={3}>
                    {synopsisList.length > 0 ? synopsisList.map((p, i) => (
                    <Text key={i} color="gray.700" lineHeight="tall">{p}</Text>
                    )) : <Text color="gray.500">Tidak ada deskripsi tersedia.</Text>}
                </VStack>

                {batchData.synopsis?.connections?.length > 0 && (
                    <Box mt={4} p={4} bg="green.50" borderRadius="md">
                        <Text fontWeight="bold" color="green.700" mb={2}>Terkait:</Text>
                        <VStack align="start" spacing={2}>
                            {batchData.synopsis.connections.map((conn, i) => (
                                <Link as={RouterLink} to={`/anime/samehadaku/detail/${conn.animeId}`} key={i} color="green.600" _hover={{ textDecoration: 'underline' }}>
                                    {conn.title}
                                </Link>
                            ))}
                        </VStack>
                    </Box>
                )}
              </Box>

              <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.100">
                  <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                      <Icon as={FaDownload} color="blue.500" /> Link Download Batch
                  </Heading>

                  {downloadUrlList?.formats?.length > 0 ? (
                      <VStack align="stretch" spacing={4}>
                         {downloadUrlList.formats.map((fmt, idx) => (
                             <Box key={idx}>
                                 <Text fontWeight="bold" color="brand.600" mb={2}>Format: {fmt.title}</Text>
                                 <VStack align="stretch" spacing={2}>
                                     {fmt.qualities?.map((qual, qidx) => (
                                         <Box key={qidx} bg="gray.50" _dark={{ bg: "gray.900" }} p={2} borderRadius="md" border="1px solid" borderColor="gray.200">
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

export default AnimeBatch;
