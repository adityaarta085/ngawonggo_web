
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  HStack,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import {
  FaHome,
  FaNewspaper,
  FaChartBar,
  FaImage,
  FaMap,
  FaExclamationTriangle,
  FaCog,
} from 'react-icons/fa';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const sidebarColor = useColorModeValue('white', 'gray.800');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  const menuItems = [
    { name: 'Dashboard', icon: FaHome },
    { name: 'Berita', icon: FaNewspaper },
    { name: 'Statistik', icon: FaChartBar },
    { name: 'Galeri', icon: FaImage },
    { name: 'Wisata', icon: FaMap },
    { name: 'Pengaduan', icon: FaExclamationTriangle },
    { name: 'Pengaturan', icon: FaCog },
  ];

  return (
    <Box minH="100vh" display="flex" bg={mainBg}>
      {/* Sidebar */}
      <Box
        w={{ base: 'full', md: '280px' }}
        bg={sidebarColor}
        borderRight="1px solid"
        borderColor="gray.100"
        display={{ base: 'none', md: 'block' }}
        p={6}
      >
        <VStack align="stretch" spacing={8}>
          <Heading size="md" color="brand.500" letterSpacing="tight">
            ADMIN PORTAL
          </Heading>

          <VStack align="stretch" spacing={2}>
            {menuItems.map((item) => (
              <HStack
                key={item.name}
                p={3}
                borderRadius="xl"
                cursor="pointer"
                bg={activeTab === item.name ? 'brand.50' : 'transparent'}
                color={activeTab === item.name ? 'brand.500' : 'gray.500'}
                _hover={{ bg: 'brand.50', color: 'brand.500' }}
                onClick={() => setActiveTab(item.name)}
                transition="all 0.2s"
              >
                <Icon as={item.icon} />
                <Text fontWeight="700" fontSize="sm">{item.name}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8}>
        <Flex justify="space-between" align="center" mb={10}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">{activeTab}</Heading>
            <Text color="gray.500" fontSize="sm">Selamat datang kembali di panel administrasi.</Text>
          </VStack>
          <HStack spacing={4}>
            <Avatar size="sm" name="Admin Desa" src="https://bit.ly/dan-abramov" />
            <VStack align="start" spacing={0} display={{ base: 'none', md: 'flex' }}>
              <Text fontWeight="bold" fontSize="xs">Admin Desa</Text>
              <Badge colorScheme="green" fontSize="10px">Super Admin</Badge>
            </VStack>
          </HStack>
        </Flex>

        {activeTab === 'Dashboard' && (
          <VStack spacing={8} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <StatCard label="Total Berita" number="24" help="4 terbit bulan ini" icon={FaNewspaper} color="blue.500" />
              <StatCard label="Pengaduan Baru" number="12" help="Perlu ditanggapi" icon={FaExclamationTriangle} color="red.500" />
              <StatCard label="Wisata" number="6" help="Destinasi aktif" icon={FaMap} color="green.500" />
              <StatCard label="Penduduk" number="6.052" help="Update 2024" icon={FaChartBar} color="orange.500" />
            </SimpleGrid>

            <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
              <Heading size="sm" mb={6}>Pengaduan Warga Terbaru</Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Pelapor</Th>
                    <Th>Kategori</Th>
                    <Th>Status</Th>
                    <Th>Tanggal</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontWeight="600">Budi Santoso</Td>
                    <Td>Infrastruktur</Td>
                    <Td><Badge colorScheme="yellow">Proses</Badge></Td>
                    <Td>21 Mei 2024</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="600">Siti Aminah</Td>
                    <Td>Pelayanan</Td>
                    <Td><Badge colorScheme="green">Selesai</Badge></Td>
                    <Td>20 Mei 2024</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="600">Andi Wijaya</Td>
                    <Td>Keamanan</Td>
                    <Td><Badge colorScheme="red">Baru</Badge></Td>
                    <Td>19 Mei 2024</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </VStack>
        )}

        {activeTab !== 'Dashboard' && (
          <Box bg="white" p={10} borderRadius="2xl" boxShadow="sm" textAlign="center">
            <Text color="gray.500">Fitur Manajemen {activeTab} sedang dalam pengembangan.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const StatCard = ({ label, number, help, icon, color }) => (
  <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" position="relative" overflow="hidden">
    <Icon as={icon} position="absolute" right={-2} bottom={-2} w={20} h={20} color={color} opacity={0.1} />
    <Stat>
      <StatLabel color="gray.500" fontWeight="700">{label}</StatLabel>
      <StatNumber fontSize="3xl" fontWeight="800">{number}</StatNumber>
      <StatHelpText>{help}</StatHelpText>
    </Stat>
  </Box>
);

export default AdminPage;
