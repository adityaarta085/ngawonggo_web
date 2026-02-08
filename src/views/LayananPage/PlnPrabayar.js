import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  SimpleGrid,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaArrowLeft, FaBolt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PlnPrabayar = () => {
  const navigate = useNavigate();
  const [selectedNominal, setSelectedNominal] = useState(50000);

  const nominals = [20000, 50000, 100000, 200000, 500000, 1000000];
  const adminFee = 2500;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box bg="gray.50" minH="100vh" pb={10}>
      {/* Header */}
      <Box bg="brand.500" color="white" pt={10} pb={8} px={4} borderRadius="0 0 30px 30px" boxShadow="lg">
        <HStack spacing={4} mb={4} maxW="500px" mx="auto">
          <IconButton
            icon={<FaArrowLeft />}
            variant="ghost"
            color="white"
            onClick={() => navigate('/layanan')}
            aria-label="Back"
            _hover={{ bg: 'whiteAlpha.300' }}
          />
          <Heading size="md" fontWeight="bold">PLN Prabayar</Heading>
        </HStack>
      </Box>

      <VStack spacing={6} mt={-6} px={4} align="stretch" maxW="500px" mx="auto">
        {/* Customer Card */}
        <Card variant="elevated" borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor="gray.100">
          <CardBody>
            <HStack spacing={4}>
              <Box bg="blue.50" p={3} borderRadius="full">
                <Icon as={FaBolt} color="brand.500" w={6} h={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text color="gray.500" fontSize="xs" fontWeight="bold">ID Pelanggan</Text>
                <Text fontWeight="bold" fontSize="lg">1401 2345 6789</Text>
              </VStack>
            </HStack>
            <Divider my={4} />
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text color="gray.500" fontSize="xs" fontWeight="bold">Nama Pelanggan</Text>
                <Text fontWeight="bold">SUYATNO</Text>
              </Box>
              <Box>
                <Text color="gray.500" fontSize="xs" fontWeight="bold">Tarif/Daya</Text>
                <Text fontWeight="bold">R1 / 900 VA</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Nominal Selection */}
        <Box>
          <Text fontWeight="bold" mb={3} px={1} fontSize="lg">Pilih Nominal</Text>
          <SimpleGrid columns={3} spacing={3}>
            {nominals.map((val) => (
              <Button
                key={val}
                height="70px"
                variant="outline"
                bg={selectedNominal === val ? 'blue.50' : 'white'}
                borderColor={selectedNominal === val ? 'brand.500' : 'gray.200'}
                borderWidth={selectedNominal === val ? '2px' : '1px'}
                onClick={() => setSelectedNominal(val)}
                _hover={{ bg: 'blue.50', borderColor: 'brand.300' }}
                display="flex"
                flexDirection="column"
                borderRadius="xl"
                transition="all 0.2s"
              >
                <Text fontSize="md" fontWeight="bold" color={selectedNominal === val ? 'brand.500' : 'gray.800'}>
                  {val >= 1000000 ? '1 Juta' : `${val / 1000}rb`}
                </Text>
              </Button>
            ))}
          </SimpleGrid>
        </Box>

        {/* Detail Pembayaran */}
        <Box>
          <Text fontWeight="bold" mb={3} px={1} fontSize="lg">Detail Pembayaran</Text>
          <Card variant="outline" borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.200" boxShadow="sm">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Flex justify="space-between">
                  <Text color="gray.600">Nominal</Text>
                  <Text fontWeight="semibold">{formatCurrency(selectedNominal)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Biaya Admin</Text>
                  <Text fontWeight="semibold">{formatCurrency(adminFee)}</Text>
                </Flex>
                <Divider />
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">Total Bayar</Text>
                  <Text fontWeight="bold" color="brand.500" fontSize="xl">
                    {formatCurrency(selectedNominal + adminFee)}
                  </Text>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        <Button
          colorScheme="brand"
          size="lg"
          h="60px"
          borderRadius="2xl"
          fontSize="lg"
          boxShadow="0 8px 20px rgba(0, 86, 179, 0.25)"
          leftIcon={<FaCheckCircle />}
          _active={{ transform: 'scale(0.98)' }}
        >
          Bayar Sekarang
        </Button>
      </VStack>
    </Box>
  );
};

export default PlnPrabayar;
