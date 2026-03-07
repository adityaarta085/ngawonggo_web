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
import { FaNewspaper, FaLayerGroup, FaChevronRight } from 'react-icons/fa';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (!error && data) setAllNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const categories = ['pemerintahan', 'pendidikan', 'kesehatan', 'ekonomi', 'umum'];

  if (loading) return <Loading fullPage />;

  return (
    <Box minH="100vh" bg="gray.50" pb={20}>
      {/* Hero Header */}
      <Box pt={32} pb={20} position="relative" overflow="hidden">
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
              <Badge colorScheme="brand" variant="subtle" px={4} py={1} borderRadius="full" mb={4} fontWeight="900">
                WARTA & INFORMASI
              </Badge>
              <Heading size="3xl" color="accent.green" mb={4} fontWeight="900">
                Kabar Terkini <Text as="span" color="brand.500">Ngawonggo</Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl" lineHeight="tall">
                Sajian informasi terkini mengenai kebijakan, kegiatan masyarakat, dan perkembangan
                terbaru dari seluruh penjuru Desa Ngawonggo.
              </Text>

              <Breadcrumb mt={8} spacing="8px" separator={<FaChevronRight color="gray.300" fontSize="10px" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" color="gray.400" fontWeight="600">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink color="brand.500" fontWeight="800">Berita</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <Flex direction="column" gap={16}>
          {/* Category Filter */}
          <Box overflowX="auto" pb={4} css={{
            '&::-webkit-scrollbar': { display: 'none' },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}>
            <HStack spacing={4}>
              <Icon as={FaLayerGroup} color="brand.400" mr={2} />
              {['Semua Berita', ...categories].map(cat => (
                <Button
                  key={cat}
                  as="a"
                  href={cat === 'Semua Berita' ? '#' : `#${cat}`}
                  layerStyle="glass"
                  colorScheme="brand"
                  variant="outline"
                  textTransform="capitalize"
                  px={8}
                  h="45px"
                  fontSize="sm"
                  fontWeight="800"
                  borderRadius="full"
                  _hover={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500', transform: 'translateY(-2px)' }}
                  transition="0.3s"
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </Box>

          {/* News Feed by Category */}
          {categories.map((category, idx) => {
            const filteredNews = allNews.filter(n => n.category?.toLowerCase() === category);
            if (filteredNews.length === 0) return null;

            return (
              <MotionBox
                key={category}
                id={category}
                scrollMarginTop="150px"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
              >
                <HStack mb={8} spacing={6}>
                  <Flex align="center" gap={3}>
                    <Icon as={FaNewspaper} color="brand.500" w={6} h={6} />
                    <Heading size="lg" textTransform="capitalize" color="gray.800" fontWeight="900" letterSpacing="tight">
                        {category}
                    </Heading>
                  </Flex>
                  <Box flex={1} h="2px" bgGradient="linear(to-r, brand.100, transparent)" borderRadius="full" />
                  <Badge colorScheme="brand" variant="outline" borderRadius="md" px={3}>{filteredNews.length} BERITA</Badge>
                </HStack>

                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10}>
                  <Box gridColumn={{ lg: 'span 2' }}>
                    {filteredNews.slice(0, 1).map(e => (
                      <CardNews
                        key={e.id}
                        news={e}
                      />
                    ))}
                  </Box>
                  <VStack spacing={6} align="stretch">
                    {filteredNews.slice(1, 4).map(e => (
                      <SmallCardNews
                        key={e.id}
                        news={e}
                      />
                    ))}
                  </VStack>
                </SimpleGrid>
              </MotionBox>
            );
          })}

          {allNews.length === 0 && (
              <Box textAlign="center" py={40} layerStyle="glassCard" border="2px dashed" borderColor="gray.100">
                  <VStack spacing={4}>
                      <Icon as={FaNewspaper} w={12} h={12} color="gray.200" />
                      <Text fontSize="xl" color="gray.400" fontWeight="700">Belum ada berita yang tersedia saat ini.</Text>
                      <Button as="a" href="/" colorScheme="brand" variant="ghost">Kembali ke Beranda</Button>
                  </VStack>
              </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
