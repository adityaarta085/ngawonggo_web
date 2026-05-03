import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Input, Button,
  useColorModeValue, Icon, useToast
} from '@chakra-ui/react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import ComplaintSystem from './ComplaintSystem';

const ComplaintTrack = () => {
  const [trackId, setTrackId] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();
  const toast = useToast();

  const handleTrack = () => {
    if (!trackId.trim()) {
      toast({ title: 'Masukkan ID Pengaduan', status: 'warning' });
      return;
    }
    const val = trackId.trim().toUpperCase();
    if (val.length < 5) {
      toast({ title: 'Format ID tidak valid', status: 'error' });
      return;
    }
    setComplaintId(val);
    localStorage.setItem('complaint_id', val);
  };

  return (
    <Box bg={bgColor} minH="100vh" pt={28} pb={20}>
      <SEO title="Lacak Pengaduan | Desa Ngawonggo" />
      <Container maxW="container.md">
        <Button leftIcon={<FaArrowLeft />} variant="ghost" mb={6} onClick={() => navigate(-1)}>
          Kembali
        </Button>

        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={4}>
            <Heading size="xl" mb={4}>Lacak Pengaduan</Heading>
            <Text color="gray.500">Masukkan ID Pengaduan (misal: NGA-XXXXX) untuk melihat status laporan Anda.</Text>
          </Box>

          {!complaintId ? (
            <Box bg={cardBg} p={10} borderRadius="3xl" boxShadow="xl" textAlign="center">
              <Icon as={FaSearch} boxSize={12} color="brand.500" mb={6} />
              <VStack spacing={4} maxW="sm" mx="auto">
                <Input
                  size="lg"
                  placeholder="ID: NGA-XXXXX"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                  borderRadius="xl"
                  textAlign="center"
                  fontWeight="bold"
                  letterSpacing="widest"
                />
                <Button colorScheme="brand" size="lg" w="full" onClick={handleTrack} borderRadius="xl">
                  Cari Pengaduan
                </Button>
              </VStack>
            </Box>
          ) : (
            <Box>
              <HStack justify="space-between" mb={4}>
                <Button size="sm" onClick={() => {
                  setComplaintId('');
                  setTrackId('');
                  localStorage.removeItem('complaint_id');
                }}>Lacak ID Lain</Button>
              </HStack>
              <ComplaintSystem />
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ComplaintTrack;
