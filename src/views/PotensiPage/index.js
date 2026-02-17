import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Container,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';

export default function PotensiPage() {
  const [potentials, setPotentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPotentials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('potentials')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching potentials:', error);
      } else {
        setPotentials(data);
      }
      setLoading(false);
    };

    fetchPotentials();
  }, []);

  return (
    <Box py={12} minH="100vh" bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box layerStyle="glassCard" p={10} bgGradient="linear(to-br, brand.600, blue.600)" color="white">
            <Heading mb={4} size="2xl">Potensi & Ekonomi Desa</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Ngawonggo memiliki kekayaan alam dan budaya yang melimpah, menjadi penggerak utama ekonomi masyarakat menuju kemandirian.
            </Text>
          </Box>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} h="400px" borderRadius="2xl" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {potentials.map((item, index) => (
                <Box key={index} layerStyle="glassCard" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl' }}>
                  <Image src={item.image_url} alt={item.title} h="240px" w="100%" objectFit="cover" fallbackSrc="https://via.placeholder.com/800x600?text=Potensi+Desa" />
                  <Stack p={6} spacing={4}>
                    <Badge colorScheme="brand" alignSelf="start" variant="solid" borderRadius="full" px={3}>{item.category}</Badge>
                    <Heading size="md" color="gray.800">{item.title}</Heading>
                    <Text fontSize="md" color="gray.600">{item.description}</Text>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          )}

          <Box layerStyle="glassCard" p={8} borderLeft="4px solid" borderColor="brand.500">
            <Heading size="lg" mb={4} color="gray.800">UMKM Desa</Heading>
            <Text color="gray.600" fontSize="lg">
              Pemerintah Desa terus mendukung pelaku UMKM lokal, khususnya pengolah kopi dan kerajinan tangan, untuk menembus pasar digital melalui program pemberdayaan ekonomi kreatif. Kami percaya produk lokal adalah masa depan Ngawonggo.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
