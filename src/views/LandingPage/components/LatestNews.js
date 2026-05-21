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
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import CardNews from '../../../components/CardNews';
import { FaArrowRight, FaNewspaper } from 'react-icons/fa';
import Loading from '../../../components/Loading';
import { useThemePreference } from '../../../contexts/ThemePreferenceContext';

const LatestNews = () => {
  const { landingTheme } = useThemePreference();
  const vibrantBg = useColorModeValue('brand.50', 'gray.900');
  const minBg = useColorModeValue('white', 'gray.800');
  const blobOp1 = useColorModeValue(0.1, 0.05);
  const blobOp2 = useColorModeValue(0.15, 0.05);
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
    <Box py={24} bg={landingTheme === 'vibrant' ? vibrantBg : minBg} position="relative" overflow="hidden">
      {landingTheme === 'vibrant' && (
        <>
          {/* Dotted Pattern Overlay and Shapes */}
          <Box position="absolute" inset={0} bgImage="radial-gradient(#137fec 1px, transparent 1px)" bgSize="40px 40px" opacity={blobOp1} zIndex={0} />
          <Box position="absolute" top="-10%" left="-10%" w="400px" h="400px" bg="green.400" opacity={blobOp2} borderRadius="full" filter="blur(80px)" animation="spin 30s linear infinite" />
        </>
      )}

      <Container maxW="container.xl" position="relative" zIndex={1}>
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
            variant="solid"
            bgGradient="linear(to-r, brand.400, purple.500)"
            color="white"
            size="lg"
            rightIcon={<FaArrowRight />}
            fontWeight="800"
            borderRadius="full"
            boxShadow="0 4px 15px rgba(0,0,0,0.2)"
            _hover={{
                bgGradient: 'linear(to-r, brand.500, purple.600)',
                transform: 'translateY(-2px) scale(1.05)',
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
            }}
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
              <Box textAlign="center" py={20} bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="3xl" border="2px dashed" borderColor="gray.200">
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
