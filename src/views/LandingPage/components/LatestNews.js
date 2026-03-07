import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import CardNews from '../../../components/CardNews';
import { FaArrowRight, FaNewspaper } from 'react-icons/fa';
import Loading from '../../../components/Loading';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data && !error) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <Box py={24} bg="white">
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'flex-end' }}
          mb={16}
          gap={6}
        >
          <VStack align="start" spacing={4} maxW="2xl">
            <Flex align="center" gap={3}>
                <Icon as={FaNewspaper} color="brand.500" w={6} h={6} />
                <Text color="brand.500" fontWeight="800" letterSpacing="widest" fontSize="xs" textTransform="uppercase">
                    WARTA DESA
                </Text>
            </Flex>
            <Heading as="h2" size="2xl" fontWeight="900" color="gray.900">
              Kabar Terkini Ngawonggo
            </Heading>
            <Text fontSize="xl" color="gray.500" fontWeight="500">
              Ikuti perkembangan terbaru mengenai kegiatan, pembangunan, dan pengumuman resmi dari Pemerintah Desa Ngawonggo.
            </Text>
          </VStack>
          <Button
            as={RouterLink}
            to="/news"
            variant="ghost"
            colorScheme="brand"
            size="lg"
            rightIcon={<FaArrowRight />}
            fontWeight="800"
            _hover={{ bg: 'brand.50', transform: 'translateX(5px)' }}
          >
            Lihat Semua Berita
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py={20}>
            <Loading />
          </Flex>
        ) : (
          <>
            {news.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {news.map((item) => (
                  <CardNews key={item.id} news={item} />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={20} bg="gray.50" borderRadius="3xl" border="2px dashed" borderColor="gray.200">
                <Text color="gray.400" fontSize="lg" fontWeight="600">Belum ada berita yang diterbitkan.</Text>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default LatestNews;
