import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';

export default function TransparansiPage() {
  return (
    <Box p={10} fontFamily="heading">
      <Heading mb={5} color="ngawonggo.green">Transparansi Dana Desa</Heading>
      <Text mb={8}>
        Wujud keterbukaan informasi publik mengenai pengelolaan Anggaran Pendapatan dan Belanja Desa (APBDes).
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={10}>
        <Stat p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
          <StatLabel>Total Pendapatan 2024</StatLabel>
          <StatNumber>Rp 1.250.000.000</StatNumber>
          <StatHelpText>Estimasi APBDes</StatHelpText>
        </Stat>
        <Stat p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
          <StatLabel>Realisasi Belanja</StatLabel>
          <StatNumber>85%</StatNumber>
          <StatHelpText>Update per Juni 2024</StatHelpText>
        </Stat>
        <Stat p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
          <StatLabel>Indeks Stunting</StatLabel>
          <StatNumber>Turun 12%</StatNumber>
          <StatHelpText>Capaian Kesehatan Desa</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider mb={10} />

      <Box bg="blue.50" p={8} borderRadius="xl">
        <Heading size="md" mb={4}>Laporan Realisasi Anggaran</Heading>
        <Text fontSize="sm">
          Grafik dan rincian realisasi anggaran sedang dipersiapkan untuk publikasi sesuai standar keterbukaan informasi nasional.
        </Text>
      </Box>
    </Box>
  );
}
