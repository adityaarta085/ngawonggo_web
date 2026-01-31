
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const MotionBox = motion(Box);

const NewsCard = ({ title, date, category, image, delay }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
    >
      <Box position="relative">
        <Image src={image} alt={title} h="240px" w="100%" objectFit="cover" />
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
        <Link color="brand.500" fontWeight="700" fontSize="sm" _hover={{ textDecoration: 'none', color: 'brand.600' }}>
          Selengkapnya →
        </Link>
      </VStack>
    </MotionBox>
  );
};

const LatestNews = () => {
  const { language } = useLanguage();

  const newsItems = [
    {
      title: 'Panen Raya, Petani Desa Ngawonggo Sukses Tingkatkan Hasil Sayuran Organik',
      date: '20 Mei 2024',
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Gelar Kesenian Tradisional, Ngawonggo Lestarikan Budaya Topeng Ireng dan Jatilan',
      date: '15 Juni 2024',
      category: 'Budaya',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Kerja Bakti Warga Membersihkan Jalur Sumber Mata Air Lereng Sumbing',
      date: '10 Mei 2024',
      category: 'Lingkungan',
      image: 'https://images.unsplash.com/photo-1591189863430-ab87e120f312?auto=format&fit=crop&w=800&q=80',
    },
  ];

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
          <Button variant="ghost" colorScheme="brand" rightIcon={<span>→</span>}>
            {language === 'id' ? 'Lihat Semua' : 'View All'}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {newsItems.map((news, index) => (
            <NewsCard key={index} {...news} delay={index * 0.1} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LatestNews;
