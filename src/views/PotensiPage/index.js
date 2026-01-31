import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Divider,
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
    <Box p={10} fontFamily="heading">
      <Heading mb={5} color="ngawonggo.green">Potensi & Ekonomi Desa</Heading>
      <Text mb={8}>
        Ngawonggo memiliki kekayaan alam dan budaya yang melimpah, menjadi penggerak utama ekonomi masyarakat.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={10}>
        {potentials.map((item, index) => (
          <Box key={index} borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
            <Image src={item.image} alt={item.title} h="200px" w="100%" objectFit="cover" />
            <Stack p={4}>
              <Badge colorScheme="green" alignSelf="start">{item.category}</Badge>
              <Heading size="md">{item.title}</Heading>
              <Text fontSize="sm">{item.desc}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <Divider mb={10} />

      <Box bg="green.50" p={8} borderRadius="xl">
        <Heading size="lg" mb={4}>UMKM Desa</Heading>
        <Text>
          Pemerintah Desa terus mendukung pelaku UMKM lokal, khususnya pengolah kopi dan kerajinan tangan, untuk menembus pasar digital melalui program pemberdayaan ekonomi kreatif.
        </Text>
      </Box>
    </Box>
  );
}
