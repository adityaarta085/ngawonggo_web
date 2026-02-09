import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  HStack,
  Button,
  Icon,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const NewsCard = ({ id, title, date, category, image }) => {
  const textColor = useColorModeValue('gray.900', 'white');
  const dateColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box as={RouterLink} to={`/news/${id}`} role="group" display="block">
      <VStack align="start" spacing={4}>
        <Box
          overflow="hidden"
          borderRadius="xl"
          w="100%"
          aspectRatio={16/9}
          position="relative"
          bg="gray.100"
        >
          <Image
            src={image}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.5s ease"
            _groupHover={{ transform: 'scale(1.05)' }}
          />
          <Badge
            position="absolute"
            top={3}
            left={3}
            bg="brand.500"
            color="white"
            fontSize="2xs"
            fontWeight="bold"
            px={2}
            py={1}
            borderRadius="md"
          >
            {category?.toUpperCase() || 'BERITA'}
          </Badge>
        </Box>
        <Box>
          <Text fontSize="xs" color={dateColor} fontWeight="600" mb={1}>
            {date}
          </Text>
          <Heading
            size="sm"
            color={textColor}
            lineHeight="snug"
            noOfLines={2}
            _groupHover={{ color: 'brand.500' }}
            transition="color 0.3s ease"
          >
            {title}
          </Heading>
        </Box>
      </VStack>
    </Box>
  );
};

const LatestNews = () => {
  const { language } = useLanguage();
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);
      if (!error && data) setNewsItems(data);
    };
    fetchNews();
  }, []);

  return (
    <Box py={24} bg={useColorModeValue('white', 'background-dark')}>
      <Container maxW="container.xl">
        <HStack justify="space-between" mb={12} align="flex-end">
          <Box>
            <Heading as="h2" size="xl" fontWeight="900" mb={2}>
              {language === 'id' ? 'Berita Terkini' : 'Latest News'}
            </Heading>
            <Text color="gray.500">
              {language === 'id'
                ? 'Update progres pembangunan dan informasi terbaru Desa Ngawonggo.'
                : 'Update on development progress and latest information of Ngawonggo Village.'}
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/news"
            variant="link"
            color="brand.500"
            rightIcon={<Icon as={FaArrowRight} boxSize={3} />}
            fontSize="sm"
            fontWeight="bold"
            _hover={{ textDecoration: 'none', transform: 'translateX(5px)' }}
            transition="all 0.3s ease"
          >
            {language === 'id' ? 'Lihat Semua' : 'View All'}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {newsItems.map((news) => (
            <NewsCard key={news.id} id={news.id} {...news} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LatestNews;
