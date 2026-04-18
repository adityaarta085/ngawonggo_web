import React, { useState, useEffect } from 'react';
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
  Skeleton,
} from '@chakra-ui/react';
import { FaUserTie, FaUsers, FaBullseye } from 'react-icons/fa';
import { SEO } from '../../components';
import { supabase } from '../../lib/supabase';

export default function PemerintahanPage({ previewData }) {
  const [data, setData] = useState({
    staff: [
      { role: 'Kepala Desa', name: 'Khoirur Faidah' },
      { role: 'Sekertariat Desa', name: 'Bambang Dwi Hendriyono' },
      { role: 'Kaur Pemerintahan', name: 'Yasin Sulthoni' },
      { role: 'Ketua BPD', name: 'Perlu Konfirmasi Desa' },
      { role: 'Ketua P3A', name: 'Rohmatul Faizin' },
    ],
    vision: "Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa.",
    mission: "Komitmen kami adalah menjadikan Desa Ngawonggo sebagai desa yang mandiri, inovatif, dan melayani dengan sepenuh hati."
  });
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data: settingsData, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['pemerintahan_staff', 'pemerintahan_vision', 'pemerintahan_mission']);

        if (error) throw error;

        if (settingsData && settingsData.length > 0) {
          const newData = {
            staff: [
              { role: 'Kepala Desa', name: 'Khoirur Faidah' },
              { role: 'Sekertariat Desa', name: 'Bambang Dwi Hendriyono' },
              { role: 'Kaur Pemerintahan', name: 'Yasin Sulthoni' },
              { role: 'Ketua BPD', name: 'Perlu Konfirmasi Desa' },
              { role: 'Ketua P3A', name: 'Rohmatul Faizin' },
            ],
            vision: "Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa.",
            mission: "Komitmen kami adalah menjadikan Desa Ngawonggo sebagai desa yang mandiri, inovatif, dan melayani dengan sepenuh hati."
          };

          settingsData.forEach(item => {
            if (item.key === 'pemerintahan_staff' && item.value) {
              try { newData.staff = JSON.parse(item.value); } catch(e) {}
            }
            if (item.key === 'pemerintahan_vision' && item.value) {
              newData.vision = item.value;
            }
            if (item.key === 'pemerintahan_mission' && item.value) {
              newData.mission = item.value;
            }
          });
          setData(newData);
        }
      } catch (error) {
        console.error('Error fetching pemerintahan data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [previewData]);

  return (
    <Box pt={0} py={previewData ? 0 : 8} minH={previewData ? "auto" : "100vh"} bg="gray.50">
      {!previewData && (
        <SEO
          title="Pemerintahan"
          description="Informasi Struktur Organisasi dan Tata Kelola Pemerintah Desa Ngawonggo. Daftar perangkat desa dan visi misi pelayanan publik."
        />
      )}
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
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Tr key={i}>
                          <Td><Skeleton height="20px" width="120px" /></Td>
                          <Td><Skeleton height="20px" width="180px" /></Td>
                        </Tr>
                      ))
                    ) : (
                      data.staff.map((s, idx) => (
                        <Tr key={idx} _hover={{ bg: 'brand.50' }} transition="0.2s">
                          <Td fontWeight="800" color="gray.700">
                            <HStack>
                              <Icon as={FaUserTie} color="brand.400" />
                              <Text>{s.role}</Text>
                            </HStack>
                          </Td>
                          <Td color="gray.600">{s.name}</Td>
                        </Tr>
                      ))
                    )}
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
                {loading ? (
                  <VStack spacing={4}>
                    <Skeleton height="20px" width="100%" />
                    <Skeleton height="20px" width="80%" />
                    <Divider my={6} />
                    <Skeleton height="20px" width="90%" />
                    <Skeleton height="20px" width="70%" />
                  </VStack>
                ) : (
                  <>
                    <Text fontSize="xl" color="gray.700" fontWeight="700" fontStyle="italic" lineHeight="relaxed" textAlign="center">
                      "{data.vision}"
                    </Text>
                    <Divider my={6} />
                    <Text color="gray.600" textAlign="center" whiteSpace="pre-wrap">
                      {data.mission}
                    </Text>
                  </>
                )}
              </Box>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
