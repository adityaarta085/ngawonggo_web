import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  Link,
  VStack,
  HStack,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { FaPlay } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

const NewsCard = ({ id, title, date, category, image, video_url, delay }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      layerStyle="glassCard"

      overflow="hidden"



      _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
    >
      <Box position="relative">
        <Image src={image} alt={title} h="240px" w="100%" objectFit="cover" />
        {video_url && (
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="whiteAlpha.800"
            borderRadius="full"
            p={4}
          >
            <Icon as={FaPlay} color="brand.500" />
          </Flex>
        )}
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme="brand"
          px={3}
          py={1}
          borderRadius="full"
        >
          {category}
        </Badge>
      </Box>
      <VStack p={6} align="start" spacing={3}>
        <Text fontSize="sm" color="gray.500" fontWeight="600">
          {date}
        </Text>
        <Heading size="md" lineHeight="tall" noOfLines={2}>
          {title}
        </Heading>
        <Link
          as={RouterLink}
          to={`/news/${id}`}
          color="brand.500"
          fontWeight="700"
          fontSize="sm"
          _hover={{ textDecoration: 'none', color: 'brand.600' }}
        >
          Selengkapnya →
        </Link>
      </VStack>
    </MotionBox>
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
        .limit(3);
      if (!error && data) setNewsItems(data);
    };
    fetchNews();
  }, []);

  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <HStack justify="space-between" mb={12} align="flex-end">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="brand.500"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2}
            >
              {language === 'id' ? 'Kabar Terbaru' : 'Latest Updates'}
            </Text>
            <Heading as="h2" size="xl" fontWeight="800">
              {language === 'id' ? 'Berita Desa Ngawonggo' : 'Ngawonggo Village News'}
            </Heading>
          </Box>
          <Button
            as={RouterLink}
            to="/news"
            variant="ghost"
            colorScheme="brand"
            rightIcon={<span>→</span>}
          >
            {language === 'id' ? 'Lihat Semua' : 'View All'}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {newsItems.map((news, index) => (
            <NewsCard key={news.id} id={news.id} {...news} delay={index * 0.1} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LatestNews;
