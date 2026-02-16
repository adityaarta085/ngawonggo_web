import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Button,
  Image,
  useColorModeValue,
  Center,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FiArrowLeft, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BeritaMagelangDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move hooks to top
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const cardBg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/berita-magelang?slug=${slug}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Error fetching detail:', err);
        setError('Gagal memuat detail artikel.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (error || !article) {
    return (
      <Center minH="100vh">
        <VStack spacing={4} color="red.500">
          <Icon as={FiAlertCircle} w={12} h={12} />
          <Text fontWeight="bold">{error || 'Artikel tidak ditemukan'}</Text>
          <Button onClick={() => navigate('/berita-magelang')} colorScheme="brand">
            Kembali ke Daftar
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} pb={20}>
      <Container maxW="container.lg" pt={10}>
        <VStack align="start" spacing={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            colorScheme="brand"
            onClick={() => navigate('/berita-magelang')}
          >
            Kembali
          </Button>

          <Breadcrumb fontSize="sm" opacity={0.7}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/berita-magelang">Berita Magelang</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink noOfLines={1}>{article.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box w="full" layerStyle="glassCard" bg={cardBg} p={{ base: 6, md: 10 }} borderRadius="2xl" shadow="xl">
            <VStack align="start" spacing={6}>
              <Heading size="xl" color="gray.800" _dark={{ color: 'white' }}>
                {article.title}
              </Heading>

              <Box display="flex" alignItems="center" color="gray.500" fontSize="sm">
                <Icon as={FiCalendar} mr={2} />
                <Text>{article.date}</Text>
                <Divider orientation="vertical" h="15px" mx={4} />
                <Text>Sumber: Berita Magelang</Text>
              </Box>

              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  w="full"
                  maxH="500px"
                  objectFit="cover"
                  borderRadius="xl"
                  fallbackSrc="https://via.placeholder.com/800x450?text=Berita+Magelang"
                />
              )}

              <Box
                w="full"
                className="article-content"
                color={textColor}
                fontSize="lg"
                lineHeight="tall"
                dangerouslySetInnerHTML={{ __html: article.content }}
                sx={{
                  'p': { mb: 4 },
                  'img': { maxW: '100%', h: 'auto', borderRadius: 'lg', my: 6 },
                  'iframe': { maxW: '100%', borderRadius: 'lg', my: 6 },
                  'h1, h2, h3': { my: 4, fontWeight: 'bold' },
                  'ul, ol': { ml: 6, mb: 4 }
                }}
              />
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
