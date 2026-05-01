import React, { useState, useEffect } from 'react';
import {
  Box, Container, VStack, HStack, Heading, Text, Input, Button, SimpleGrid, Icon, Badge,
  useToast,  Flex, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Image, Center
} from '@chakra-ui/react';
import { FaCoins, FaSearch, FaCheckCircle, FaQrcode, FaHistory } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

import { SEO } from '../../components';

const TopupPage = () => {
  const [email, setEmail] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const toast = useToast();

  const packages = [
    { id: 1, coins: 50, price: 5000, bonus: 0 },
    { id: 2, coins: 110, price: 10000, bonus: 10 },
    { id: 3, coins: 250, price: 20000, bonus: 50 },
    { id: 4, coins: 550, price: 50000, bonus: 50 },
    { id: 5, coins: 1200, price: 100000, bonus: 200, tag: 'POPULER' },
  ];

  useEffect(() => {
    // Try auto-fill if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            setEmail(user.email);
            // Ignore exhaust-deps for standard one-time fetch
            handleCheckUser(user.email);
            fetchHistory(user.id);
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async (userId) => {
      const { data } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5);
      if (data) setHistory(data);
  };

  const handleCheckUser = async (searchEmail = email) => {
    if (!searchEmail) return;
    setIsChecking(true);
    try {
      const { data, error } = await supabase.rpc('check_user_by_email', { p_email: searchEmail });
      if (error) throw error;

      if (data.success) {
        setTargetUser(data);
        toast({ title: 'Pemain ditemukan!', status: 'success', duration: 2000 });
        fetchHistory(data.id);
      } else {
        setTargetUser(null);
        toast({ title: 'Email tidak ditemukan', description: data.message, status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Gagal mengecek user', status: 'error' });
    }
    setIsChecking(false);
  };

  const handleCheckout = async () => {
    if (!targetUser || !selectedPackage) return;

    setIsProcessing(true);
    try {
      const res = await fetch('https://api.qrispy.id/api/payment/qris/generate', {
        method: 'POST',
        headers: {
            "X-API-Token": "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb",
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            amount: parseInt(selectedPackage.price, 10),
            payment_reference: "INV-COIN-" + Date.now(),
        })
      });
      const data = await res.json();

      if (data.status === 'success' && data.data?.qr_url) {
        setQrisData({
            ...data.data,
            package: selectedPackage
        });
        setIsModalOpen(true);
      } else {
        throw new Error("Invalid QRIS response");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Gagal membuat tagihan',
        description: 'Layanan pembayaran sedang sibuk, coba lagi nanti.',
        status: 'error'
      });
    }
    setIsProcessing(false);
  };

  const checkPaymentStatus = async () => {
    if (!qrisData) return;
    try {
      const res = await fetch(`https://api.qrispy.id/api/payment/qris/${qrisData.qris_id}/status`, {
          headers: {
              "X-API-Token": "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb",
              "Content-Type": "application/json",
              Accept: "application/json"
          }
      });
      const data = await res.json();

      let currentStatus = (data.data?.payment_status || data.data?.status || 'pending').toLowerCase();
      if (currentStatus === 'paid') currentStatus = 'success';

      if (currentStatus === 'success') {
          // Grant coins
          const { error } = await supabase.rpc('process_topup_success', {
              p_user_id: targetUser.id,
              p_coins: qrisData.package.coins,
              p_trx_id: qrisData.qris_id
          });

          if (!error) {
              toast({ title: 'Pembayaran Berhasil!', description: `${qrisData.package.coins} Koin telah ditambahkan.`, status: 'success', duration: 5000 });
              setIsModalOpen(false);
              setQrisData(null);
              fetchHistory(targetUser.id);
          }
      } else {
          toast({ title: 'Belum terbayar', description: 'Silakan scan dan bayar melalui aplikasi E-Wallet/M-Banking Anda.', status: 'info' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 24, md: 32 }}>
      <SEO title="Kios Koin Desa" description="Topup Koin Desa Ngawonggo dengan aman dan cepat via QRIS." />
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">

          <Box textAlign="center" mb={4}>
            <Heading size="xl" color="brand.600" mb={2}>Kios Koin Desa</Heading>
            <Text color="gray.500">Topup Koin untuk membuka fitur Premium, VIP, dan Gacha.</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
              {/* Left Column - Input & History */}
              <VStack spacing={6} align="stretch" gridColumn={{ lg: 'span 1' }}>
                  {/* User Verification Box */}
                  <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                      <HStack mb={4}>
                          <Badge colorScheme="brand" borderRadius="full" w={6} h={6} display="flex" alignItems="center" justify="center">1</Badge>
                          <Heading size="md">ID Tujuan</Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                          <Input
                            placeholder="Masukkan Email Akun"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                            bg="gray.50"
                          />
                          <Button
                            leftIcon={<FaSearch />}
                            colorScheme="gray"
                            onClick={() => handleCheckUser()}
                            isLoading={isChecking}
                            isDisabled={!email}
                          >
                            Cek Akun
                          </Button>

                          {targetUser && (
                              <Box p={4} bg="green.50" borderRadius="xl" border="1px dashed" borderColor="green.200">
                                  <HStack spacing={4}>
                                      <Avatar size="sm" name={targetUser.name} bg="green.500" />
                                      <VStack align="start" spacing={0}>
                                          <Text fontWeight="bold" color="green.800">{targetUser.name}</Text>
                                          <Text fontSize="xs" color="green.600">ID: {targetUser.id.substring(0,8)}...</Text>
                                      </VStack>
                                      <Icon as={FaCheckCircle} color="green.500" ml="auto" boxSize={5} />
                                  </HStack>
                              </Box>
                          )}
                      </VStack>
                  </Box>

                  {/* History Box */}
                  {targetUser && (
                      <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <HStack mb={4}>
                              <Icon as={FaHistory} color="gray.500" />
                              <Heading size="sm">Riwayat Topup Terakhir</Heading>
                          </HStack>
                          <VStack align="stretch" spacing={3}>
                              {history.map((h, i) => (
                                  <Flex key={i} justify="space-between" align="center" p={2} bg="gray.50" borderRadius="lg">
                                      <VStack align="start" spacing={0}>
                                          <Text fontSize="xs" fontWeight="bold" color="green.600">+{h.quantity} Koin</Text>
                                          <Text fontSize="10px" color="gray.500">{new Date(h.created_at).toLocaleDateString()}</Text>
                                      </VStack>
                                      <Badge colorScheme="green" fontSize="8px">{h.status}</Badge>
                                  </Flex>
                              ))}
                              {history.length === 0 && <Text fontSize="xs" color="gray.500">Belum ada riwayat topup.</Text>}
                          </VStack>
                      </Box>
                  )}
              </VStack>

              {/* Right Column - Packages & Payment */}
              <VStack spacing={6} align="stretch" gridColumn={{ lg: 'span 2' }}>
                  <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" opacity={!targetUser ? 0.5 : 1} pointerEvents={!targetUser ? 'none' : 'auto'}>
                      <HStack mb={6}>
                          <Badge colorScheme="brand" borderRadius="full" w={6} h={6} display="flex" alignItems="center" justify="center">2</Badge>
                          <Heading size="md">Pilih Nominal Topup</Heading>
                      </HStack>
                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                          {packages.map(pkg => (
                              <Box
                                key={pkg.id}
                                p={4}
                                borderRadius="xl"
                                border="2px solid"
                                borderColor={selectedPackage?.id === pkg.id ? 'brand.500' : 'gray.200'}
                                bg={selectedPackage?.id === pkg.id ? 'brand.50' : 'white'}
                                cursor="pointer"
                                position="relative"
                                onClick={() => setSelectedPackage(pkg)}
                                transition="all 0.2s"
                                _hover={{ borderColor: 'brand.300', transform: 'translateY(-2px)' }}
                              >
                                  {pkg.tag && <Badge position="absolute" top="-2" right="-2" colorScheme="red" borderRadius="full" px={2}>{pkg.tag}</Badge>}
                                  <VStack spacing={1}>
                                      <Icon as={FaCoins} color="yellow.400" boxSize={6} mb={1} />
                                      <Text fontWeight="900" fontSize="lg">{pkg.coins}</Text>
                                      {pkg.bonus > 0 && <Text fontSize="xs" color="green.500" fontWeight="bold">+{pkg.bonus} Bonus</Text>}
                                      <Text fontSize="sm" color="gray.500" mt={2}>Rp {pkg.price.toLocaleString('id-ID')}</Text>
                                  </VStack>
                              </Box>
                          ))}
                      </SimpleGrid>
                  </Box>

                  <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" opacity={!selectedPackage ? 0.5 : 1} pointerEvents={!selectedPackage ? 'none' : 'auto'}>
                      <HStack mb={4}>
                          <Badge colorScheme="brand" borderRadius="full" w={6} h={6} display="flex" alignItems="center" justify="center">3</Badge>
                          <Heading size="md">Metode Pembayaran</Heading>
                      </HStack>
                      <Box p={4} borderRadius="xl" border="1px solid" borderColor="brand.200" bg="brand.50" mb={6}>
                          <HStack justify="space-between">
                              <HStack>
                                  <Icon as={FaQrcode} boxSize={6} color="brand.500" />
                                  <Text fontWeight="bold">QRIS (Semua Pembayaran)</Text>
                              </HStack>
                              <Icon as={FaCheckCircle} color="brand.500" />
                          </HStack>
                      </Box>

                      <Button
                        w="full"
                        size="lg"
                        colorScheme="brand"
                        onClick={handleCheckout}
                        isLoading={isProcessing}
                        loadingText="Membuat Tagihan..."
                      >
                        Beli Sekarang - Rp {selectedPackage?.price?.toLocaleString('id-ID')}
                      </Button>
                  </Box>
              </VStack>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* QRIS Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="sm" closeOnOverlayClick={false}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader textAlign="center">Selesaikan Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <VStack spacing={6}>
              <Text textAlign="center" color="gray.600">Scan QR Code di bawah menggunakan aplikasi E-Wallet atau M-Banking Anda.</Text>

              <Box p={4} bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.100">
                  {qrisData?.qr_url ? (
                      <Image src={qrisData.qr_url} alt="QRIS" boxSize="250px" />
                  ) : (
                      <Center boxSize="250px" bg="gray.50" borderRadius="lg">
                          <Text color="gray.400">QR Code Error</Text>
                      </Center>
                  )}
              </Box>

              <VStack w="full" spacing={2} bg="gray.50" p={4} borderRadius="xl">
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Total Bayar:</Text>
                      <Text fontWeight="bold" fontSize="lg" color="brand.600">Rp {qrisData?.package?.price?.toLocaleString('id-ID')}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                      <Text color="gray.500" fontSize="sm">Mendapatkan:</Text>
                      <HStack color="yellow.500">
                          <Icon as={FaCoins} />
                          <Text fontWeight="bold">{qrisData?.package?.coins}</Text>
                      </HStack>
                  </HStack>
              </VStack>

              <Button w="full" colorScheme="blue" size="lg" onClick={checkPaymentStatus}>
                  Saya Sudah Bayar
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TopupPage;
