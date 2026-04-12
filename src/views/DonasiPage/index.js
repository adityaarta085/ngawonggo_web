import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Progress,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaHandHoldingHeart, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import axios from 'axios';
import SEO from '../../components/SEO';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

const DonasiPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ name: '', message: '', amount: 10000 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // pending, paid, expired
  const [pollingInterval, setPollingInterval] = useState(null);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      toast({
        title: 'Error memuat donasi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (donation) => {
    setSelectedDonation(donation);
    setFormData({ name: '', message: '', amount: 10000 });
    setQrisData(null);
    setPaymentStatus(null);
    if (pollingInterval) clearInterval(pollingInterval);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    if (pollingInterval) clearInterval(pollingInterval);
    setQrisData(null);
    setPaymentStatus(null);
    setSelectedDonation(null);
    fetchDonations(); // Refresh data just in case
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount < 1000) {
      toast({ title: 'Minimal donasi Rp 1.000', status: 'warning', duration: 2000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/qris?action=generate', {
        amount: formData.amount,
        donation_id: selectedDonation.id,
        donor_name: formData.name,
        donor_msg: formData.message
      });

      if (response.data.success) {
        setQrisData(response.data.qris);
        setPaymentStatus('pending');
        startPolling(response.data.qris.qris_id);
      } else {
        throw new Error(response.data.error || 'Failed to generate QRIS');
      }
    } catch (error) {
      toast({
        title: 'Gagal membuat QRIS',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPolling = (qrisId) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/qris?action=status&qris_id=${qrisId}`);
        const status = response.data.status;
        setPaymentStatus(status);

        if (status === 'paid') {
          clearInterval(interval);
          toast({
            title: 'Donasi Berhasil!',
            description: 'Terima kasih atas dukungan Anda.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else if (status === 'expired') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Polling error', error);
      }
    }, 5000); // Poll every 5 seconds
    setPollingInterval(interval);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
          .fa-spin {
            animation: spin 2s linear infinite;
          }
        `}
      </style>
      <Box pt={{ base: '80px', md: '100px' }} pb={10} minH="100vh">
        <SEO title="Donasi - Desa Ngawonggo" description="Dukung program dan pembangunan Desa Ngawonggo melalui donasi." />
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Box textAlign="center" mb={6}>
              <Heading as="h1" size="2xl" mb={4} color="brand.500">
                <Icon as={FaHandHoldingHeart} mr={3} />
                Open Donasi
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
                Setiap bantuan Anda sangat berarti untuk pengembangan website, bantuan kemanusiaan, dan kemajuan Desa Ngawonggo. Salurkan donasi Anda dengan mudah melalui QRIS.
              </Text>
            </Box>

            {loading ? (
              <Flex justify="center" p={10}>
                <Spinner size="xl" color="brand.500" />
              </Flex>
            ) : donations.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Saat ini belum ada kampanye donasi yang aktif.
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {donations.map((donation) => {
                  const progress = donation.target_amount > 0
                    ? Math.min((donation.current_amount / donation.target_amount) * 100, 100)
                    : 0;

                  return (
                    <Box
                      key={donation.id}
                      bg={bgColor}
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="md"
                      transition="all 0.3s"
                      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                    >
                      <Image
                        src={donation.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'}
                        alt={donation.title}
                        height="200px"
                        width="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/400x200?text=Donasi"
                      />
                      <Box p={5}>
                        <Heading size="md" mb={2} noOfLines={2}>
                          {donation.title}
                        </Heading>
                        <Text color={textColor} fontSize="sm" mb={4} noOfLines={3}>
                          {donation.description}
                        </Text>

                        <VStack spacing={2} align="stretch" mb={4}>
                          <HStack justify="space-between" fontSize="sm" fontWeight="bold">
                            <Text color="brand.500">{formatRupiah(donation.current_amount)}</Text>
                            {donation.target_amount > 0 && (
                              <Text color="gray.500">Target: {formatRupiah(donation.target_amount)}</Text>
                            )}
                          </HStack>
                          {donation.target_amount > 0 && (
                            <Progress value={progress} colorScheme="brand" size="sm" borderRadius="full" />
                          )}
                        </VStack>

                        <Button
                          w="100%"
                          colorScheme="brand"
                          onClick={() => handleOpenModal(donation)}
                          leftIcon={<FaHandHoldingHeart />}
                        >
                          Donasi Sekarang
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </SimpleGrid>
            )}
          </VStack>
        </Container>

        {/* Donation Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="md" isCentered closeOnOverlayClick={false}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{selectedDonation?.title}</ModalHeader>
            <ModalCloseButton isDisabled={paymentStatus === 'pending'} />
            <ModalBody pb={6}>
              {!qrisData ? (
                <form id="donation-form" onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Nominal Donasi (Rp)</FormLabel>
                      <NumberInput
                        min={1000}
                        step={1000}
                        value={formData.amount}
                        onChange={(val) => setFormData({ ...formData, amount: parseInt(val) || 0 })}
                      >
                        <NumberInputField placeholder="10000" />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Nama Lengkap (Opsional)</FormLabel>
                      <Input
                        placeholder="Hamba Allah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Pesan / Doa (Opsional)</FormLabel>
                      <Textarea
                        placeholder="Semoga bermanfaat..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </FormControl>
                  </VStack>
                </form>
              ) : (
                <VStack spacing={6} align="center">
                  {paymentStatus === 'paid' ? (
                    <VStack spacing={4} color="green.500">
                      <Icon as={FaCheckCircle} w={16} h={16} />
                      <Heading size="md">Pembayaran Berhasil!</Heading>
                      <Text textAlign="center" color={textColor}>
                        Terima kasih atas donasi Anda sebesar {formatRupiah(qrisData.amount)}.
                      </Text>
                    </VStack>
                  ) : paymentStatus === 'expired' ? (
                    <VStack spacing={4} color="red.500">
                      <Heading size="md">QRIS Kadaluarsa</Heading>
                      <Text textAlign="center">Silakan buat donasi baru jika ingin melanjutkan.</Text>
                    </VStack>
                  ) : (
                    <>
                      <Badge colorScheme="orange" p={2} borderRadius="md" w="100%" textAlign="center">
                        Menunggu Pembayaran
                      </Badge>
                      <Text fontWeight="bold" fontSize="xl">{formatRupiah(qrisData.amount)}</Text>
                      <Box border="2px dashed" borderColor="brand.500" p={2} borderRadius="md" bg="white">
                        <Image src={qrisData.qris_image_url} alt="QRIS Code" maxW="250px" />
                      </Box>
                      <HStack color="gray.500" fontSize="sm">
                        <Icon as={FaSpinner} className="fa-spin" />
                        <Text>Menunggu scan dari aplikasi E-Wallet/M-Banking Anda...</Text>
                      </HStack>
                    </>
                  )}
                </VStack>
              )}
            </ModalBody>

            <ModalFooter>
              {!qrisData ? (
                <Button
                  colorScheme="brand"
                  type="submit"
                  form="donation-form"
                  isLoading={isSubmitting}
                  w="100%"
                >
                  Lanjutkan ke Pembayaran
                </Button>
              ) : (
                <Button onClick={handleCloseModal} w="100%" colorScheme={paymentStatus === 'paid' ? 'green' : 'gray'}>
                  {paymentStatus === 'paid' ? 'Selesai' : 'Tutup'}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default DonasiPage;
