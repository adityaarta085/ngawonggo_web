import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  SimpleGrid,
  Input,
  Button,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaFilePdf, FaSearch, FaCalendarAlt, FaLink } from 'react-icons/fa';
import { SEO } from '../../components';
import { supabase } from '../../lib/supabase';

export default function DokumenPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('public_documents')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat dokumen.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDate = dateFilter ? doc.published_at === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <Box pt={0} py={8} minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <SEO
        title="Dokumen & Analitik Data"
        description="Dokumen publikasi, analitik data, dan transparansi Pemerintahan Desa Ngawonggo."
      />
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header Section */}
          <Box layerStyle="glassCard" p={10} bgGradient="linear(to-br, accent.green, brand.600)" color="white">
            <Badge colorScheme="whiteAlpha" variant="solid" mb={4} borderRadius="full" px={4} py={1}>PUBLIKASI</Badge>
            <Heading mb={4} size="2xl">Dokumen & Analitik Data</Heading>
            <Text fontSize="lg" opacity={0.9} maxW="3xl">
              Akses dokumen publik, laporan, dan data analitik pemerintahan Desa Ngawonggo secara transparan.
            </Text>
          </Box>

          <Box>
            <HStack mb={8} spacing={4} flexWrap="wrap">
              <InputGroup maxW={{ base: '100%', md: '400px' }} layerStyle="glassCard">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Cari dokumen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white" _dark={{ bg: "gray.800" }}
                  border="none"
                />
              </InputGroup>

              <InputGroup maxW={{ base: '100%', md: '250px' }} layerStyle="glassCard">
                <InputLeftElement pointerEvents="none">
                  <FaCalendarAlt color="gray.300" />
                </InputLeftElement>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  bg="white" _dark={{ bg: "gray.800" }}
                  border="none"
                />
              </InputGroup>

              <Button
                 colorScheme="gray"
                 onClick={() => { setSearchTerm(''); setDateFilter(''); }}
                 variant="outline"
              >
                Reset Filter
              </Button>
            </HStack>

            {loading ? (
              <Text>Memuat dokumen...</Text>
            ) : filteredDocs.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredDocs.map((doc) => (
                  <Box key={doc.id} p={6} borderRadius="xl" bg="white" _dark={{ bg: "gray.800" }} border="1px solid" borderColor="gray.200" boxShadow="sm" position="relative" display="flex" flexDirection="column">
                    <HStack mb={3}>
                      <Icon as={FaFilePdf} color="red.500" boxSize={6} />
                      <Heading size="sm" isTruncated>{doc.title}</Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mb={4} noOfLines={3} flex={1}>
                      {doc.description}
                    </Text>
                    <HStack justify="space-between" align="center" mt="auto">
                      <Text fontSize="xs" color="gray.400" fontWeight="bold">
                        {new Date(doc.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        leftIcon={<FaLink />}
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        Lihat Dokumen
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={10} layerStyle="glassCard">
                <Text color="gray.500">Tidak ada dokumen yang ditemukan.</Text>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
