import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  Badge,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CommentSection from './CommentSection';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!news) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <Text fontSize="xl">Berita tidak ditemukan.</Text>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/news">Kembali ke Berita</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </VStack>
      </Center>
    );
  }

  return (
    <Box py={10}>
      <Container maxW="container.lg" layerStyle="glassCard" p={{ base: 6, md: 12 }}>
        <Breadcrumb mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/news">Berita</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Detail Berita</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack align="start" spacing={6}>
          <Badge colorScheme="brand" px={3} py={1} borderRadius="full" textTransform="capitalize">
            {news.category}
          </Badge>
          <Heading as="h1" size="2xl" lineHeight="tight">
            {news.title}
          </Heading>
          <Text color="gray.500" fontWeight="600">
            {news.date}
          </Text>

          {news.image && (
            <Image
              src={news.image}
              alt={news.title}
              borderRadius="2xl"
              w="100%"
              maxH="600px"
              objectFit="cover"
              boxShadow="lg"
            />
          )}

          <Box
            w="100%"
            fontSize="lg"
            lineHeight="tall"
            sx={{
              'p': { mb: 4 },
              'img': { borderRadius: 'xl', my: 4 },
              'ul, ol': { ml: 8, mb: 4 },
              'h1, h2, h3, h4': { mt: 6, mb: 4 }
            }}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          <Box w="100%">
            <CommentSection newsId={id} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NewsDetail;
