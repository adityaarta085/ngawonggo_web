import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Box, Container, Heading, Text, Image, VStack, HStack,
  Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Button, Divider, Link
} from '@chakra-ui/react';
import { FaCalendarAlt, FaChevronRight, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import Loading from '../../components/Loading';
import { SEO } from '../../components';

export default function NationalNewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reconstruct slug from params
  const fullSlug = decodeURIComponent(slug);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('national_news')
        .select('*')
        .eq('slug', fullSlug)
        .single();

      if (!error && data) {
        setNews(data);
      } else {
        console.error('Error fetching news:', error);
      }
      setLoading(false);
    };

    if (fullSlug) {
      fetchNews();
    }
  }, [fullSlug]);

  if (loading) return <Loading fullPage />;

  if (!news) {
    return (
      <Box pt={32} pb={20} textAlign="center" minH="80vh">
        <Heading size="lg" mb={4}>Berita tidak ditemukan</Heading>
        <Button onClick={() => navigate('/news/nasional')} colorScheme="blue">
          Kembali ke Berita Nasional
        </Button>
      </Box>
    );
  }

  const formattedDate = news.date || new Date(news.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <Box pt={24} pb={20} minH="100vh" bg="gray.50">
      <SEO
        title={news.title}
        description={news.content?.substring(0, 160).replace(/<[^>]*>/g, '') || news.title}
        image={news.image_full || news.image_thumbnail}
      />
      <Container maxW="container.md">
        <Breadcrumb mb={8} spacing="8px" separator={<FaChevronRight color="gray.300" fontSize="10px" />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" color="gray.500">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/news/nasional" color="gray.500">Nasional</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="blue.500" fontWeight="bold" noOfLines={1} maxW="200px">
              {news.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          colorScheme="blue"
          mb={6}
          onClick={() => navigate('/news/nasional')}
        >
          Kembali
        </Button>

        <VStack align="start" spacing={6}>
          <Heading size="2xl" color="gray.800" fontWeight="900" lineHeight="1.2">
            {news.title}
          </Heading>

          <HStack spacing={4} color="gray.500" fontSize="sm">
            <HStack>
              <Icon as={FaCalendarAlt} />
              <Text>{formattedDate}</Text>
            </HStack>
            <Text>•</Text>
            <Text fontWeight="bold" color="blue.500">Sumber: {news.source}</Text>
          </HStack>

          {(news.image_full || news.image_thumbnail) && (
            <Box w="full" borderRadius="2xl" overflow="hidden" boxShadow="md">
              <Image
                src={news.image_full || news.image_thumbnail}
                alt={news.title}
                w="full"
                maxH="500px"
                objectFit="cover"
              />
            </Box>
          )}

          <Box
            w="full"
            className="news-content"
            fontSize="lg"
            lineHeight="1.8"
            color="gray.700"
            dangerouslySetInnerHTML={{ __html: news.content }}
            sx={{
              '& p': { mb: 4 },
              '& img': { borderRadius: 'md', my: 4, w: 'full' },
              '& h2': { fontSize: '2xl', fontWeight: 'bold', mt: 8, mb: 4 },
              '& h3': { fontSize: 'xl', fontWeight: 'bold', mt: 6, mb: 3 },
              '& ul': { pl: 6, mb: 4 },
              '& li': { mb: 2 },
            }}
          />

          {news.link && (
            <>
              <Divider my={8} />
              <Link href={news.link} isExternal color="blue.500" fontWeight="bold">
                <HStack>
                  <Text>Baca selengkapnya di sumber asli</Text>
                  <Icon as={FaExternalLinkAlt} />
                </HStack>
              </Link>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
