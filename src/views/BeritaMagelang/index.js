import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Button,
  HStack,
  useColorModeValue,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import BeritaCard from './components/BeritaCard';

export default function BeritaMagelangPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Move hooks to top
  const headerBg = useColorModeValue('brand.500', 'blue.700');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  const fetchNews = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/berita-magelang?page=${page}`);
      setNews(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Gagal memuat berita. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(pagination.page);
  }, [fetchNews, pagination.page]);

  return (
    <Box minH="100vh" bg={pageBg} pb={20}>
      {/* Header Section */}
      <Box
        bgGradient={`linear(to-br, ${headerBg}, blue.600)`}
        color="white"
        py={16}
        px={8}
        mb={10}
        layerStyle="glassCard"
        borderRadius="0 0 40px 40px"
      >
        <Container maxW="container.xl">
          <VStack align="start" spacing={4}>
            <Breadcrumb fontSize="sm" opacity={0.8}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Berita Magelang</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading size="2xl" fontWeight="extrabold">
              Berita Magelang
            </Heading>
            <Text fontSize="lg" maxW="2xl" opacity={0.9}>
              Kumpulan informasi terbaru hasil kurasi otomatis dari portal resmi Berita Magelang.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        {loading ? (
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text fontWeight="medium" color="gray.500">Memperbarui informasi...</Text>
            </VStack>
          </Center>
        ) : error ? (
          <Center py={20}>
            <VStack spacing={4} color="red.500">
              <Icon as={FiAlertCircle} w={12} h={12} />
              <Text fontWeight="bold">{error}</Text>
              <Button onClick={() => fetchNews(pagination.page)} colorScheme="red" variant="outline">
                Coba Lagi
              </Button>
            </VStack>
          </Center>
        ) : news.length === 0 ? (
          <Center py={20}>
            <VStack spacing={4}>
              <Text fontWeight="medium" color="gray.500">Belum ada berita yang tersedia.</Text>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={12}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {news.map((item) => (
                <BeritaCard key={item.id} news={item} />
              ))}
            </SimpleGrid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiChevronLeft />}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  variant="ghost"
                  colorScheme="brand"
                >
                  Sebelumnya
                </Button>
                <HStack spacing={2}>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      size="sm"
                      variant={pagination.page === i + 1 ? 'solid' : 'ghost'}
                      colorScheme="brand"
                      onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </HStack>
                <Button
                  rightIcon={<FiChevronRight />}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  variant="ghost"
                  colorScheme="brand"
                >
                  Selanjutnya
                </Button>
              </HStack>
            )}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
