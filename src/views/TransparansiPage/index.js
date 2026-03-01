import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Container,
  VStack,
  Badge,
} from '@chakra-ui/react';

export default function TransparansiPage() {
  return (
    <Box py={12} minH="100vh" bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box layerStyle="glassCard" p={10} bgGradient="linear(to-br, brand.500, blue.600)" color="white">
            <Badge colorScheme="whiteAlpha" variant="solid" mb={4} borderRadius="full" px={4} py={1}>KETERBUKAAN INFORMASI</Badge>
            <Heading mb={4} size="2xl">Transparansi Dana Desa</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Wujud keterbukaan informasi publik mengenai pengelolaan Anggaran Pendapatan dan Belanja Desa (APBDes) untuk mewujudkan pemerintahan yang bersih dan akuntabel.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Stat layerStyle="glassCard" p={8} transition="0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}>
              <StatLabel color="gray.500" fontWeight="bold">Total Pendapatan 2024</StatLabel>
              <StatNumber fontSize="3xl" color="brand.600" my={2}>Rp 1.250.000.000</StatNumber>
              <StatHelpText fontWeight="600">Estimasi APBDes</StatHelpText>
            </Stat>
            <Stat layerStyle="glassCard" p={8} transition="0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}>
              <StatLabel color="gray.500" fontWeight="bold">Realisasi Belanja</StatLabel>
              <StatNumber fontSize="3xl" color="blue.600" my={2}>85%</StatNumber>
              <StatHelpText fontWeight="600">Update per Juni 2024</StatHelpText>
            </Stat>
            <Stat layerStyle="glassCard" p={8} transition="0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}>
              <StatLabel color="gray.500" fontWeight="bold">Indeks Stunting</StatLabel>
              <StatNumber fontSize="3xl" color="green.600" my={2}>Turun 12%</StatNumber>
              <StatHelpText fontWeight="600">Capaian Kesehatan Desa</StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box layerStyle="glassCard" p={10} borderLeft="4px solid" borderColor="brand.500">
            <Heading size="lg" mb={4} color="gray.800">Laporan Realisasi Anggaran</Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
              Grafik dan rincian realisasi anggaran secara mendetail sedang dipersiapkan oleh tim keuangan desa untuk publikasi digital sesuai dengan standar keterbukaan informasi nasional (UU KIP). Kami berkomitmen untuk menyajikan data yang akurat dan mudah dipahami oleh seluruh warga.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
