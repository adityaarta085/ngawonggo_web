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
} from '@chakra-ui/react';

export default function PotensiPage() {
  const potentials = [
    {
      title: 'Kopi Arabika Ngawonggo',
      desc: 'Salah satu penghasil Kopi Arabika terbaik di lereng Sumbing dengan cita rasa unik tanah vulkanik.',
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Komoditas Hortikultura',
      desc: 'Produksi Cabe (Cabai) dan sayuran segar menjadi andalan ekonomi warga desa.',
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Wisata Religi & Budaya',
      desc: 'Keberadaan Pondok Pesantren besar dan tradisi Nyadran yang tetap lestari.',
      category: 'Wisata',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    },
  ];

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

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {potentials.map((item, index) => (
              <Box key={index} layerStyle="glassCard" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl' }}>
                <Image src={item.image} alt={item.title} h="240px" w="100%" objectFit="cover" />
                <Stack p={6} spacing={4}>
                  <Badge colorScheme="brand" alignSelf="start" variant="solid" borderRadius="full" px={3}>{item.category}</Badge>
                  <Heading size="md" color="gray.800">{item.title}</Heading>
                  <Text fontSize="md" color="gray.600">{item.desc}</Text>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>

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
