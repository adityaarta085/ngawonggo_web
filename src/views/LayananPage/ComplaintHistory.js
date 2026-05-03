import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Badge, Button,
  Table, Thead, Tbody, Tr, Th, Td, Center, Spinner, Icon, useToast,
  useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { FaHistory, FaLock, FaCrown, FaEye } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { Link as RouterLink } from 'react-router-dom';
import SEO from '../../components/SEO';
import ComplaintSystem from './ComplaintSystem';

const ComplaintHistory = () => {
  const [user, setUser] = useState(null);
  const [isVip, setIsVip] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data: tierData } = await supabase
        .from('user_tiers')
        .select('tier_name')
        .eq('user_id', session.user.id)
        .single();

      if (tierData && tierData.tier_name !== 'Free' && tierData.tier_name) {
        setIsVip(true);
        const { data: compData } = await supabase
          .from('complaints')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (compData) setComplaints(compData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem('complaint_id', id);
    setSelectedComplaintId(id);
    onOpen();
  };

  const handleModalClose = () => {
    localStorage.removeItem('complaint_id');
    setSelectedComplaintId(null);
    onClose();
  };


  if (loading) {
    return (
      <Center minH="80vh" bg={bgColor}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" pt={28} pb={20}>
      <SEO title="Riwayat Pengaduan | Layanan VIP" />
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={8}>
            <Heading size="2xl" mb={4}>Riwayat Pengaduan</Heading>
            <Text color="gray.500">Pantau status semua pengaduan dan aspirasi Anda di sini.</Text>
          </Box>

          {!user ? (
            <Box bg={cardBg} p={10} borderRadius="3xl" textAlign="center" boxShadow="xl">
              <Icon as={FaLock} boxSize={16} color="brand.500" mb={4} />
              <Heading size="md" mb={4}>Login Diperlukan</Heading>
              <Text mb={6}>Silakan masuk untuk melihat riwayat pengaduan Anda.</Text>
              <Button as={RouterLink} to="/auth" colorScheme="brand" size="lg">Masuk</Button>
            </Box>
          ) : !isVip ? (
            <Box bg={cardBg} p={10} borderRadius="3xl" textAlign="center" boxShadow="xl" position="relative" overflow="hidden">
              <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient="linear(to-r, gold, yellow.400)" />
              <Icon as={FaLock} boxSize={16} color="gold" mb={4} />
              <Heading size="lg" mb={4}>Fitur Eksklusif VIP</Heading>
              <Text color="gray.500" mb={8} maxW="md" mx="auto">
                Riwayat pengaduan otomatis hanya tersedia untuk pengguna VIP. Jika Anda pengguna Free, silakan cek email Anda untuk melacak ID secara manual.
              </Text>
              <Button as={RouterLink} to="/portal/gacha" colorScheme="yellow" size="lg" leftIcon={<FaCrown />}>
                Dapatkan VIP
              </Button>
            </Box>
          ) : (
            <Box bg={cardBg} borderRadius="3xl" p={6} boxShadow="xl" overflowX="auto">
              {complaints.length === 0 ? (
                <Center p={10}>
                  <Text color="gray.500">Anda belum pernah membuat pengaduan.</Text>
                </Center>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID PENGADUAN</Th>
                      <Th>KATEGORI</Th>
                      <Th>TANGGAL</Th>
                      <Th>STATUS</Th>
                      <Th>AKSI</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {complaints.map(c => (
                      <Tr key={c.id}>
                        <Td fontWeight="bold" color="brand.500">{c.id}</Td>
                        <Td>{c.category}</Td>
                        <Td>{new Date(c.created_at).toLocaleDateString('id-ID')}</Td>
                        <Td>
                          <Badge colorScheme={c.status === 'resolved' ? 'green' : 'orange'}>
                            {c.status === 'resolved' ? 'Selesai' : 'Diproses'}
                          </Badge>
                        </Td>
                        <Td>
                          <Button size="sm" leftIcon={<FaEye />} onClick={() => handleViewDetails(c.id)}>
                            Lihat Detail
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          )}
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="3xl" overflow="hidden">
          <ModalHeader>Detail Pengaduan</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} p={0}>
             {selectedComplaintId && <ComplaintSystem />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ComplaintHistory;
