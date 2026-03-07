import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Badge, Button,
  Image,
  Link,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaMapMarkedAlt, FaChevronRight, FaCompass, FaExternalLinkAlt } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function JelajahiPage() {
  const [dusuns, setDusuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDusuns = async () => {
      const { data, error } = await supabase
        .from('dusuns')
        .select('*')
        .order('sort_order', { ascending: true });
      if (data && !error) setDusuns(data);
      setLoading(false);
    };
    fetchDusuns();
  }, []);

  return (
    <Box minH="100vh" bg="gray.50" pb={32}>
      {/* Hero Header */}
      <Box pt={12} pb={20} position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          w="120%"
          h="120%"
          bgGradient="radial(circle, brand.50 0%, transparent 70%)"
          zIndex={0}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge colorScheme="brand" variant="subtle" px={4} py={1} borderRadius="full" mb={4} fontWeight="900" letterSpacing="widest">
                WILAYAH DESA
              </Badge>
              <Heading size="3xl" color="accent.green" mb={6} fontWeight="900">
                Jelajahi <Text as="span" color="brand.500">Sepuluh Dusun</Text> Ngawonggo
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto" lineHeight="tall">
                Setiap dusun di Desa Ngawonggo memiliki karakteristik unik, kekayaan potensi lokal,
                dan semangat kemandirian yang membangun harmoni desa secara keseluruhan.
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <VStack spacing={20} align="stretch">

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {dusuns.map((dusun, idx) => (
              <MotionBox
                key={dusun.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
                as={RouterLink}
                to={`/dusun/${dusun.slug}`}
                layerStyle="glassCard"
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box h="220px" overflow="hidden" position="relative">
                  <Image
                    src={dusun.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'}
                    alt={dusun.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="0.5s"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  />
                  <Box
                    position="absolute"
                    top={4}
                    left={4}
                    bg="white"
                    color="brand.600"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="800"
                    boxShadow="lg"
                  >
                    DUSUN {idx + 1}
                  </Box>
                </Box>

                <VStack p={8} align="start" spacing={4} flex={1}>
                  <VStack align="start" spacing={1}>
                    <Heading size="md" color="gray.800" fontWeight="800">{dusun.name}</Heading>
                    <Text fontSize="sm" color="gray.500" fontWeight="600">{dusun.sub_name || 'Bagian dari Ngawonggo'}</Text>
                  </VStack>

                  <Text noOfLines={3} fontSize="sm" color="gray.600" lineHeight="relaxed">
                    {dusun.description || 'Mari mengenal lebih dekat tentang sejarah, potensi ekonomi, dan kehidupan sosial di dusun ini.'}
                  </Text>

                  <Divider />

                  <HStack w="full" justify="space-between" color="brand.500">
                    <HStack spacing={2}>
                        <Icon as={FaMapMarkedAlt} />
                        <Text fontSize="xs" fontWeight="800">LIHAT DETAIL</Text>
                    </HStack>
                    <Icon as={FaChevronRight} w={3} h={3} />
                  </HStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>

          {dusuns.length === 0 && !loading && (
            <Box textAlign="center" py={40} layerStyle="glassCard" border="2px dashed" borderColor="gray.100">
                <Icon as={FaCompass} w={12} h={12} color="gray.200" mb={4} />
                <Text fontSize="xl" color="gray.400" fontWeight="700">Data wilayah belum tersedia.</Text>
            </Box>
          )}

          {/* Interactive Map Prompt */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            p={{ base: 10, md: 16 }}
            borderRadius="4xl"
            bgGradient="linear(to-br, brand.500, accent.green)"
            color="white"
            boxShadow="2xl"
            textAlign="center"
          >
            <VStack spacing={8}>
                <Icon as={FaMapMarkedAlt} w={12} h={12} opacity={0.3} />
                <VStack spacing={4}>
                    <Heading size="2xl" fontWeight="900" letterSpacing="tight">
                        Visualisasi Wilayah Secara <br /> Digital & Interaktif
                    </Heading>
                    <Text fontSize="lg" opacity={0.9} maxW="2xl">
                        Kami mengintegrasikan Google Maps untuk memetakan setiap sudut dusun guna
                        memudahkan pendataan infrastruktur dan navigasi warga serta pengunjung.
                    </Text>
                </VStack>
                <Link
                    href="https://www.google.com/maps/search/Desa+Ngawonggo+Kaliangkrik"
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                >
                    <Button
                        size="xl"
                        h="70px"
                        px={12}
                        borderRadius="2xl"
                        bg="white"
                        color="brand.500"
                        leftIcon={<FaExternalLinkAlt />}
                        fontWeight="900"
                        _hover={{ transform: 'translateY(-3px)', boxShadow: '2xl' }}
                    >
                        Buka Peta Desa
                    </Button>
                </Link>
            </VStack>
          </MotionBox>

        </VStack>
      </Container>
    </Box>
  );
}
