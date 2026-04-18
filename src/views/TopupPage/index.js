import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Card,
  CardBody,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { SEO } from '../../components';

export default function TopupPage() {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [target, setTarget] = useState('');
  const [zone, setZone] = useState(''); // For games
  const [quantity, setQuantity] = useState(''); // For SM / Joki
  const [tabIndex, setTabIndex] = useState(0);

  const toast = useToast();

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/vipayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'profile' }),
      });
      const data = await res.json();
      if (data.result) setProfile(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async (type) => {
    setLoading(true);
    setServices([]);
    try {
      const res = await fetch('/api/vipayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: type, action: 'services' }),
      });
      const data = await res.json();
      if (data.result) setServices(data.data);
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal memuat layanan', status: 'error', isClosable: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchServices('prepaid');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (index) => {
    setTabIndex(index);
    setSelectedService('');
    setTarget('');
    setZone('');
    setQuantity('');
    const types = ['prepaid', 'social-media', 'game-feature'];
    fetchServices(types[index]);
  };

  const handleOrder = async () => {
    if (!selectedService || !target) {
      toast({ title: 'Mohon lengkapi data pesanan', status: 'warning', isClosable: true });
      return;
    }

    setLoading(true);
    const types = ['prepaid', 'social-media', 'game-feature'];
    const endpoint = types[tabIndex];

    const payload = {
      endpoint,
      action: 'order',
      service: selectedService,
    };

    if (endpoint === 'prepaid') {
      payload.data_no = target;
    } else if (endpoint === 'social-media') {
      payload.data = target;
      payload.quantity = quantity || 100;
    } else if (endpoint === 'game-feature') {
      payload.data_no = target;
      if (zone) payload.data_zone = zone;
    }

    try {
      const res = await fetch('/api/vipayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.result) {
        toast({ title: data.message, status: 'success', isClosable: true });
        fetchProfile(); // Refresh balance
      } else {
        toast({ title: data.message || 'Gagal', description: JSON.stringify(data), status: 'error', isClosable: true });
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Terjadi kesalahan sistem', status: 'error', isClosable: true });
    }
    setLoading(false);
  };

  const selectedServiceData = services.find(s => s.code === selectedService);

  return (
    <Box pt={{ base: 4, md: 8 }} pb={20}>
      <SEO
        title="Topup All Layanan"
        description="Layanan topup Pulsa, Paket Data, Social Media, dan Game."
      />
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading color="brand.500" mb={4}>Layanan Topup</Heading>
            <Text color="gray.600">Sistem terintegrasi VIPayment melayani berbagai kebutuhan digital Anda.</Text>
          </Box>

          {profile && (
             <Alert status="info" borderRadius="md">
               <AlertIcon />
               <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Sistem Aktif</Text>
               </HStack>
             </Alert>
          )}

          <Card layerStyle="glassCard">
            <CardBody>
              <Tabs isFitted variant="enclosed" colorScheme="brand" onChange={handleTabChange}>
                <TabList mb="1em">
                  <Tab fontWeight="bold">Prabayar</Tab>
                  <Tab fontWeight="bold">Sosial Media</Tab>
                  <Tab fontWeight="bold">Game / Joki</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <Text mb={4} color="gray.500">Pesan pulsa, paket data, dan tagihan lainnya.</Text>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Text mb={4} color="gray.500">Pesan followers, likes, dan layanan sosial media.</Text>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Text mb={4} color="gray.500">Pesan diamond, item game, dan jasa joki.</Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <VStack spacing={4} align="stretch" mt={4}>
                <FormControl isRequired>
                  <FormLabel>Pilih Layanan</FormLabel>
                  <Select
                    placeholder={loading ? 'Memuat layanan...' : 'Pilih layanan...'}
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    isDisabled={loading || services.length === 0}
                  >
                    {services.map((s, i) => (
                      <option key={i} value={s.code || s.id}>
                        {s.name || s.service} - Rp {s.price?.basic || s.price}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {selectedServiceData && (
                  <Box p={3} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                     <Text fontSize="sm" fontWeight="bold">{selectedServiceData.name || selectedServiceData.service}</Text>
                     <Text fontSize="sm" color="gray.600">Harga: Rp {selectedServiceData.price?.basic || selectedServiceData.price}</Text>
                     {selectedServiceData.note && <Text fontSize="xs" color="red.500" mt={1}>{selectedServiceData.note}</Text>}
                     {selectedServiceData.description && <Text fontSize="xs" color="gray.500" mt={1} dangerouslySetInnerHTML={{ __html: selectedServiceData.description }}></Text>}
                  </Box>
                )}

                <FormControl isRequired>
                  <FormLabel>{tabIndex === 0 ? 'Nomor Tujuan' : tabIndex === 1 ? 'Target (URL/Username)' : 'ID Pemain / Username'}</FormLabel>
                  <Input
                    placeholder="Masukkan data target..."
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                </FormControl>

                {tabIndex === 2 && (
                  <FormControl>
                    <FormLabel>Zone ID / Password (Joki)</FormLabel>
                    <Input
                      placeholder="Masukkan Zone ID atau Password jika Joki"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    />
                  </FormControl>
                )}

                {tabIndex === 1 && (
                  <FormControl isRequired>
                    <FormLabel>Jumlah Pesanan (Quantity)</FormLabel>
                    <Input
                      type="number"
                      placeholder="Contoh: 100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </FormControl>
                )}

                <Button
                  colorScheme="brand"
                  size="lg"
                  mt={4}
                  onClick={handleOrder}
                  isLoading={loading}
                  loadingText="Memproses..."
                >
                  Pesan Sekarang
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
