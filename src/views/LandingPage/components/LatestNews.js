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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import CardNews from '../../../components/CardNews';
import { FaArrowRight } from 'react-icons/fa';
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
    <Box py={24} bg="white" position="relative" borderTop="4px solid black">
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'flex-end' }}
          mb={16}
          gap={6}
        >
          <VStack align="start" spacing={6} maxW="2xl">
            <Box display="inline-block" bg="neo.yellow" border="2px solid black" px={4} py={1} boxShadow="brutalSoft">
                <Text fontFamily="accent" color="black" fontWeight="bold" letterSpacing="widest" fontSize="sm" textTransform="uppercase">
                    WARTA DESA
                </Text>
            </Box>

            <Box position="relative">
                <Heading fontFamily="heading" as="h2" size="2xl" fontWeight="900" color="black" position="relative" zIndex={2}>
                  Kabar Terkini Ngawonggo
                </Heading>
                <Box position="absolute" bottom="5px" left="0" w="80%" h="20px" bg="neo.teal" zIndex={1} opacity={0.5} transform="rotate(-1deg)" />
            </Box>

            <Text fontSize="xl" color="black" fontWeight="500">
              Ikuti perkembangan terbaru mengenai kegiatan, pembangunan, dan pengumuman resmi dari Pemerintah Desa Ngawonggo.
            </Text>
          </VStack>

          <Button
            as={RouterLink}
            to="/news"
            size="lg"
            bg="white"
            rightIcon={<FaArrowRight />}
          >
            LIHAT SEMUA BERITA
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
                {news.map((item, index) => (
                  <Box key={item.id} position="relative"
                       transform={index % 2 === 0 ? "translateY(0)" : "translateY(20px)"}
                       transition="transform 0.3s">
                    <CardNews news={item} isBrutalist={true} index={index} />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={20} bg="neo.warmWhite" border="3px dashed black">
                <Text color="black" fontSize="lg" fontWeight="bold" fontFamily="accent">Belum ada berita yang diterbitkan.</Text>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default LatestNews;
