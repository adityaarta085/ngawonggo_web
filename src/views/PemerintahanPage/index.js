import {
  Box,
  Heading,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Divider,
  Container,
  VStack,
  Icon,
  Badge,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import { FaUserTie, FaUsers, FaBullseye } from 'react-icons/fa';

export default function PemerintahanPage() {
  const staff = [
    { role: 'Kepala Desa', name: 'Khoirur Faidah' },
    { role: 'Sekertariat Desa', name: 'Bambang Dwi Hendriyono' },
    { role: 'Kaur Pemerintahan', name: 'Yasin Sulthoni' },
    { role: 'Ketua BPD', name: 'Perlu Konfirmasi Desa' },
    { role: 'Ketua P3A', name: 'Rohmatul Faizin' },
  ];

  return (
    <Box py={8} minH="100vh" bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          {/* Header Section */}
          <Box layerStyle="glassCard" p={10} bgGradient="linear(to-br, accent.green, brand.600)" color="white">
            <Badge colorScheme="whiteAlpha" variant="solid" mb={4} borderRadius="full" px={4} py={1}>STRUKTUR ORGANISASI</Badge>
            <Heading mb={4} size="2xl">Pemerintahan Desa</Heading>
            <Text fontSize="lg" opacity={0.9} maxW="3xl">
              Struktur Organisasi Pemerintah Desa Ngawonggo periode saat ini dirancang untuk memberikan pelayanan terbaik bagi seluruh masyarakat dengan prinsip transparansi dan profesionalisme.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            {/* Staff Table */}
            <VStack align="stretch" spacing={6}>
              <HStack spacing={4} align="center">
                <Icon as={FaUsers} w={6} h={6} color="brand.500" />
                <Heading size="lg">Perangkat Desa</Heading>
              </HStack>

              <TableContainer layerStyle="glassCard" p={2}>
                <Table variant="simple">
                  <Tbody>
                    {staff.map((s, idx) => (
                      <Tr key={idx} _hover={{ bg: 'brand.50' }} transition="0.2s">
                        <Td fontWeight="800" color="gray.700">
                          <HStack>
                            <Icon as={FaUserTie} color="brand.400" />
                            <Text>{s.role}</Text>
                          </HStack>
                        </Td>
                        <Td color="gray.600">{s.name}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>

            {/* Vision Section */}
            <VStack align="stretch" spacing={6}>
              <HStack spacing={4} align="center">
                <Icon as={FaBullseye} w={6} h={6} color="brand.500" />
                <Heading size="lg">Visi Pelayanan</Heading>
              </HStack>

              <Box layerStyle="glassCard" p={8} h="full" display="flex" flexDirection="column" justifyContent="center">
                <Text fontSize="xl" color="gray.700" fontWeight="700" fontStyle="italic" lineHeight="relaxed" textAlign="center">
                  "Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa."
                </Text>
                <Divider my={6} />
                <Text color="gray.600" textAlign="center">
                  Komitmen kami adalah menjadikan Desa Ngawonggo sebagai desa yang mandiri, inovatif, dan melayani dengan sepenuh hati.
                </Text>
              </Box>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
