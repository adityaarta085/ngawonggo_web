import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, GridItem, Image, Text, VStack, Progress, Button,
  Heading, useColorModeValue, Flex, Icon, Divider, Input, Textarea,
  FormControl, FormLabel, Checkbox, useToast, Skeleton, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaCheckCircle, FaUsers, FaArrowLeft, FaQrcode } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0);
};

const predefinedAmounts = [10000, 20000, 50000, 100000, 500000];

const DonasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donators, setDonators] = useState([]);
  const [amount, setAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', isAnonymous: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({ title: 'Campaign tidak ditemukan', status: 'error' });
        navigate('/donasi');
        return;
      }
      setCampaign(data);

      const { data: donatorsData } = await supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', id)
        .eq('status', 'success')
        .order('created_at', { ascending: false });

      if (donatorsData) setDonators(donatorsData);
      setLoading(false);
    };

    fetchCampaign();
  }, [id, navigate, toast]);

  const handleAmountSelect = (val) => {
    setAmount(val);
    setIsCustomAmount(false);
  };

  const handleCustomAmountChange = (e) => {
    setAmount(e.target.value);
    setIsCustomAmount(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10000) {
      toast({ title: 'Minimal donasi Rp 10.000', status: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create payment via API
      const res = await fetch(`/api/yogateway?action=createpayment&amount=${amount}`);
      const data = await res.json();

      if (data.status) {
        const trxData = data.data;

        // 2. Save to Supabase
        const { error } = await supabase
            .from('donations')
            .insert([{
                campaign_id: parseInt(id),
                name: formData.isAnonymous ? 'Hamba Allah' : formData.name,
                amount: trxData.amount,
                message: formData.message,
                is_anonymous: formData.isAnonymous,
                trx_id: trxData.trx_id,
                payment_url: trxData.payment_url,
                qr_image: trxData.qr_image,
                status: 'pending'
            }]);

        if (error) { console.error('Supabase Error:', error); throw error; }
        setPaymentData(trxData);
      } else {
          toast({ title: 'Gagal membuat pembayaran', description: data.msg, status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Terjadi kesalahan', status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = campaign ? Math.min((campaign.current_amount / campaign.target_amount) * 100, 100) || 0 : 0;

  return (
    <>
      {loading ? (
        <Box pt={{ base: '120px', md: '140px' }} pb={10} minH="100vh">
          <Container maxW="container.xl">
            <Skeleton height="400px" borderRadius="xl" />
          </Container>
        </Box>
      ) : !campaign ? null : (
        <>
          <SEO title={`${campaign.title} - Open Donasi Ngawonggo`} />
          <Box pt={{ base: '120px', md: '140px' }} pb={10} bg={mainBg} minH="100vh">
        <Container maxW="container.xl">
            <Button variant="ghost" leftIcon={<FaArrowLeft />} mb={4} onClick={() => navigate('/donasi')}>
                Kembali
            </Button>

          <Grid templateColumns={{ base: '1fr', lg: '7fr 5fr' }} gap={8}>
            {/* Left Col: Info */}
            <GridItem>
              <Box bg={bg} borderRadius="2xl" overflow="hidden" boxShadow="md">
                <Image src={campaign.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6'} w="100%" h={{ base: '250px', md: '400px' }} objectFit="cover" />
                <Box p={6}>
                  <Heading size="lg" mb={4}>{campaign.title}</Heading>
                  <Text whiteSpace="pre-wrap" color="gray.600">{campaign.description}</Text>

                  <Divider my={8} />

                  <Heading size="md" mb={4} display="flex" alignItems="center">
                      <FaUsers style={{ marginRight: '8px' }} /> Donatur Terbaru ({donators.length})
                  </Heading>
                  <VStack align="stretch" spacing={4}>
                      {donators.map((d) => (
                          <Box key={d.id} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                              <Flex justify="space-between" align="center" mb={2}>
                                  <Text fontWeight="bold">{d.name}</Text>
                                  <Text color="gray.500" fontSize="sm">{new Date(d.created_at).toLocaleDateString('id-ID')}</Text>
                              </Flex>
                              <Text color="brand.500" fontWeight="bold">{formatRupiah(d.amount)}</Text>
                              {d.message && <Text fontSize="sm" mt={2} fontStyle="italic">"{d.message}"</Text>}
                          </Box>
                      ))}
                      {donators.length === 0 && <Text color="gray.500">Belum ada donatur, jadilah yang pertama!</Text>}
                  </VStack>
                </Box>
              </Box>
            </GridItem>

            {/* Right Col: Donation Form */}
            <GridItem>
              <Box bg={bg} borderRadius="2xl" p={6} boxShadow="md" position="sticky" top="140px">
                {!paymentData ? (
                    <>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Donasi Terkumpul</Text>
                        <Heading size="xl" color="brand.500" mb={2}>{formatRupiah(campaign.current_amount)}</Heading>
                        <Text fontSize="sm" color="gray.500" mb={4}>dari target {formatRupiah(campaign.target_amount)}</Text>

                        <Progress value={progress} size="md" colorScheme="brand" borderRadius="full" mb={6} />

                        <form onSubmit={handleSubmit}>
                            <VStack align="stretch" spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Pilih Nominal Donasi</FormLabel>
                                    <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={3}>
                                        {predefinedAmounts.map(val => (
                                            <Button
                                                key={val}
                                                variant={amount === val && !isCustomAmount ? 'solid' : 'outline'}
                                                colorScheme="brand"
                                                size="sm"
                                                onClick={() => handleAmountSelect(val)}
                                            >
                                                Rp {val / 1000}k
                                            </Button>
                                        ))}
                                    </Grid>
                                    <Input
                                        type="number"
                                        placeholder="Atau masukkan nominal lainnya"
                                        value={isCustomAmount ? amount : ''}
                                        onChange={handleCustomAmountChange}
                                        min="10000"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Anda" />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pesan Dukungan (Opsional)</FormLabel>
                                    <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tulis doa atau dukungan Anda" />
                                </FormControl>

                                <Checkbox colorScheme="brand" isChecked={formData.isAnonymous} onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}>
                                    Sembunyikan nama saya (Hamba Allah)
                                </Checkbox>

                                <Button type="submit" colorScheme="brand" size="lg" w="full" mt={4} isLoading={isSubmitting} leftIcon={<FaHeart />}>
                                    Lanjut Pembayaran
                                </Button>
                            </VStack>
                        </form>
                    </>
                ) : (
                    <VStack align="center" spacing={6} textAlign="center" py={4}>
                        <Icon as={FaCheckCircle} w={16} h={16} color="green.500" />
                        <Heading size="md">Pembayaran Dibuat</Heading>
                        <Text color="gray.600">Silakan selesaikan pembayaran Anda sebelum waktu habis.</Text>

                        <Box bg="gray.50" p={4} borderRadius="lg" w="full">
                            <Text fontSize="sm" color="gray.500">Nominal</Text>
                            <Heading size="md" mb={2}>{formatRupiah(paymentData.amount)}</Heading>
                            <Text fontSize="sm" color="gray.500">ID Transaksi</Text>
                            <Text fontWeight="bold">{paymentData.trx_id}</Text>
                        </Box>

                        {paymentData.qr_image && (
                            <Box border="1px solid" borderColor="gray.200" p={4} borderRadius="lg" bg="white">
                                <Text fontSize="sm" fontWeight="bold" mb={2}><Icon as={FaQrcode} /> Scan QRIS</Text>
                                <Image src={paymentData.qr_image} alt="QRIS" boxSize="200px" objectFit="contain" />
                            </Box>
                        )}

                        {paymentData.payment_url && (
                             <Button as="a" href={paymentData.payment_url} target="_blank" colorScheme="brand" w="full" size="lg">
                                 Buka Link Pembayaran
                             </Button>
                        )}

                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription fontSize="sm">
                                Sistem akan otomatis memverifikasi donasi Anda setelah pembayaran berhasil.
                            </AlertDescription>
                        </Alert>
                    </VStack>
                )}
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
        </>
      )}
    </>
  );
};

export default DonasiDetail;
