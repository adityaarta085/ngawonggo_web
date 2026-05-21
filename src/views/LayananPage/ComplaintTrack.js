import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Input, Button,
  useColorModeValue, Icon, useToast
} from '@chakra-ui/react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import ComplaintSystem from './ComplaintSystem';

const ComplaintTrack = () => {
  const [user, setUser] = useState(null);
  const [trackId, setTrackId] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();
  const toast = useToast();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  const handleTrack = async () => {
    if (!trackId.trim()) {
      toast({ title: 'Masukkan ID Pengaduan', status: 'warning' });
      return;
    }
    const val = trackId.trim().toUpperCase();
    if (val.length < 5) {
      toast({ title: 'Format ID tidak valid', status: 'error' });
      return;
    }

    // Verify if this complaint belongs to the user or matches their contact email
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('contact, user_id')
        .eq('id', val)
        .single();

      if (error || !data) {
        toast({ title: 'ID Pengaduan tidak ditemukan', status: 'error' });
        return;
      }

      if (data.user_id !== user.id && data.contact !== user.email) {
        toast({ title: 'Akses Ditolak', description: 'Pengaduan ini tidak terkait dengan akun atau email Anda.', status: 'error' });
        return;
      }

      setComplaintId(val);
      localStorage.setItem('complaint_id', val);
    } catch (err) {
      toast({ title: 'Terjadi kesalahan sistem', status: 'error' });
    }
  };

  if (!user) {
    return (
      <Box bg={bgColor} minH="100vh" pt={28} pb={20}>
        <Container maxW="container.md">
          <Button leftIcon={<FaArrowLeft />} variant="ghost" mb={6} onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Box p={{ base: 6, md: 10 }} bg="white" _dark={{ bg: "gray.800" }} borderRadius="3xl" boxShadow="xl" maxW="800px" mx="auto" textAlign="center">
              <Icon as={FaSearch} boxSize={16} color="brand.500" mb={6} />
              <Heading size="lg" color="brand.500" mb={4}>Login Diperlukan</Heading>
              <Text fontSize="md" color="gray.600" mb={8}>
                Untuk menjaga privasi dan keamanan data pengaduan, Anda wajib login sebelum dapat melakukan pelacakan.
              </Text>
              <Button onClick={() => navigate('/auth')} colorScheme="brand" size="lg" borderRadius="full" px={10}>
                Masuk Sekarang
              </Button>
          </Box>
        </Container>
      </Box>
    );
  }

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
