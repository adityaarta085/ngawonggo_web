import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  VStack,

  Button,
  Icon,
  Flex,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

const NewsCard = ({ id, title, date, category, image, delay }) => {
  return (
    <Link as={RouterLink} to={`/news/${id}`} _hover={{ textDecoration: 'none' }} display="block" group="true">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Box
          aspectRatio={16/9}
          borderRadius="xl"
          overflow="hidden"
          bg="gray.200"
          position="relative"
        >
          <Image
            src={image}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.5s"
            _groupHover={{ transform: 'scale(1.05)' }}
          />
          <Badge
            position="absolute"
            top={2}
            left={2}
            bg="brand.500"
            color="white"
            fontSize="10px"
            fontWeight="bold"
            px={2}
            py={1}
            borderRadius="md"
          >
            {category.toUpperCase()}
          </Badge>
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            {date}
          </Text>
          <Heading
            size="sm"
            fontWeight="bold"
            lineHeight="snug"
            _groupHover={{ color: 'brand.500' }}
            transition="color 0.3s"
          >
            {title}
          </Heading>
        </VStack>
      </MotionBox>
    </Link>
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
    <Box py={24} bg="ikn.light" _dark={{ bg: 'ikn.dark' }}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="flex-end" mb={10}>
          <Box>
            <Heading as="h2" size="xl" fontWeight="900" lineHeight="tight">
              {language === 'id' ? 'Berita Terkini' : 'Latest News'}
            </Heading>
            <Text color="gray.500" mt={2}>
              {language === 'id' ? 'Update progres pembangunan dan informasi terbaru.' : 'Construction progress updates and latest information.'}
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/news"
            variant="link"
            color="brand.500"
            fontWeight="bold"
            fontSize="sm"
            rightIcon={<Icon as={FaArrowRight} boxSize={3} />}
            _hover={{ textDecoration: 'underline' }}
          >
            {language === 'id' ? 'Lihat Semua' : 'View All'}
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {newsItems.length > 0 ? newsItems.map((news, index) => (
            <NewsCard key={news.id} id={news.id} {...news} delay={index * 0.1} />
          )) : (
            [1, 2, 3, 4].map((i) => (
              <Box key={i} h="200px" bg="gray.100" borderRadius="xl" animate="pulse" />
            ))
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LatestNews;
