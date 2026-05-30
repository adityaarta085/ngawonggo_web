import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaNewspaper, FaChevronRight } from 'react-icons/fa';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import { getList } from '../../lib/dataFetcher';
import { motion } from 'framer-motion';
import { SEO } from '../../components';

const MotionBox = motion(Box);

export default function NationalNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, ok } = await getList('national_news', { orderBy: 'created_at', order: 'desc', limit: 1000 });
      if (ok && data) {
        // Map data to match CardNews expected props
        const mappedData = data.map(item => ({
          ...item,
          image: item.image_thumbnail || item.image_full,
          category: item.source || 'Nasional',
        }));
        setNews(mappedData);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <Loading fullPage />;

  return (
    <Box pt={0} minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} pb={20}>
      <SEO
        title="Berita Nasional"
        description="Pantau berita dan informasi terbaru tingkat nasional dari sumber terpercaya."
      />
      {/* Hero Header */}
      <Box pt={12} pb={20} position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="50%"
          h="120%"
          bgGradient="radial(circle, brand.50 0%, transparent 70%)"
          zIndex={0}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} align="start">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge colorScheme="blue" variant="subtle" px={4} py={1} borderRadius="full" mb={4} fontWeight="900">
                WARTA NASIONAL
              </Badge>
              <Heading size="3xl" color="accent.green" mb={4} fontWeight="900">
                Kabar <Text as="span" color="blue.500">Nasional</Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl" lineHeight="tall">
                Sajian informasi terkini mengenai perkembangan berita tingkat nasional dan internasional.
              </Text>

              <Breadcrumb mt={8} spacing="8px" separator={<FaChevronRight color="gray.300" fontSize="10px" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" color="gray.400" fontWeight="600">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/news" color="gray.400" fontWeight="600">Berita Desa</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink color="blue.500" fontWeight="800">Nasional</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <Flex direction="column" gap={16}>
          {news.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <HStack mb={8} spacing={6}>
                <Flex align="center" gap={3}>
                  <Icon as={FaNewspaper} color="blue.500" w={6} h={6} />
                  <Heading size="lg" color="gray.800" _dark={{ color: "white" }} fontWeight="900" letterSpacing="tight">
                      Berita Terbaru
                  </Heading>
                </Flex>
                <Box flex={1} h="2px" bgGradient="linear(to-r, blue.100, transparent)" borderRadius="full" />
                <Badge colorScheme="blue" variant="outline" borderRadius="md" px={3}>{news.length} BERITA</Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10}>
                <Box gridColumn={{ lg: 'span 2' }}>
                  {news.slice(0, 1).map(e => (
                    <CardNews
                      key={e.id}
                      news={{...e, id: 'nasional/' + encodeURIComponent(e.slug)}}
                    />
                  ))}
                </Box>
                <VStack spacing={6} align="stretch">
                  {news.slice(1, 4).map(e => (
                    <SmallCardNews
                      key={e.id}
                      news={{...e, id: 'nasional/' + encodeURIComponent(e.slug)}}
                    />
                  ))}
                </VStack>
              </SimpleGrid>

              {news.length > 4 && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mt={10}>
                  {news.slice(4).map(e => (
                    <SmallCardNews
                      key={e.id}
                      news={{...e, id: 'nasional/' + encodeURIComponent(e.slug)}}
                    />
                  ))}
                </SimpleGrid>
              )}
            </MotionBox>
          )}

          {news.length === 0 && (
            <Box textAlign="center" py={40} layerStyle="glassCard" border="2px dashed" borderColor="gray.100">
              <VStack spacing={4}>
                <Icon as={FaNewspaper} w={12} h={12} color="gray.200" />
                <Text fontSize="xl" color="gray.400" fontWeight="700">Belum ada berita nasional saat ini.</Text>
                <Button as="a" href="/news" colorScheme="blue" variant="ghost">Kembali ke Berita Desa</Button>
              </VStack>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
