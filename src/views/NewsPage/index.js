import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Text,
  Container,
  VStack,
  HStack,
} from '@chakra-ui/react';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import { supabase } from '../../lib/supabase';

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (!error && data) setAllNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const categories = ['pemerintahan', 'pendidikan', 'kesehatan', 'ekonomi', 'umum'];

  if (loading) return <Box p={10}><Text>Loading news...</Text></Box>;

  return (
    <Box minH="100vh"  py={12}>
      <Container maxW="container.xl">
        <Flex direction="column" gap={10}>
          <Box layerStyle="glassCard" p={8} bg="rgba(19, 127, 236, 0.8)" backdropFilter="blur(20px)" border="1px solid" borderColor="whiteAlpha.300" color="white">
            <VStack align="start" spacing={2}>
              <Heading size="2xl">Informasi Dan Berita Daerah</Heading>
              <Breadcrumb fontSize="sm" opacity={0.9}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>Berita</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </VStack>
          </Box>

          <Box overflowX="auto" pb={2}>
            <HStack spacing={4}>
              {categories.map(cat => (
                <Button
                  key={cat}
                  as="a"
                  href={`#${cat}`}
                  layerStyle="glass"
                  colorScheme="brand"
                  variant="outline"
                  textTransform="capitalize"
                  px={8}
                  borderRadius="full"
                  _hover={{ bg: 'brand.500', color: 'white' }}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </Box>

          {categories.map(category => {
            const filteredNews = allNews.filter(n => n.category?.toLowerCase() === category);
            if (filteredNews.length === 0) return null;

            return (
              <Box key={category} id={category} scrollMarginTop="100px">
                <HStack mb={6} spacing={4}>
                  <Heading size="lg" textTransform="capitalize" color="gray.800">
                    {category}
                  </Heading>
                  <Box flex={1} h="1px" bg="gray.200" />
                </HStack>
                <Flex gap={8} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
                  <Box flex={{ base: '1 1 100%', lg: '2' }}>
                    {filteredNews.slice(0, 1).map(e => (
                      <CardNews
                        key={e.id}
                        id={e.id}
                        title={e.title}
                        image={e.image}
                        date={e.date}
                        caption={e.content}
                      />
                    ))}
                  </Box>
                  <Flex
                    flex={{ base: '1 1 100%', lg: '1' }}
                    flexDirection="column"
                    gap={6}
                  >
                    {filteredNews.slice(1, 4).map(e => (
                      <SmallCardNews
                        key={e.id}
                        id={e.id}
                        title={e.title}
                        image={e.image}
                        date={e.date}
                      />
                    ))}
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
}
