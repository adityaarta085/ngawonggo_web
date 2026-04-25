import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Badge, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Textarea,
  Image, Switch, useToast, Stat, StatLabel, StatNumber, StatGroup
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaEye } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const DonasiManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDonationsOpen, onOpen: onDonationsOpen, onClose: onDonationsClose } = useDisclosure();
  const { isOpen: isWalletOpen, onOpen: onWalletOpen, onClose: onWalletClose } = useDisclosure();

  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    image: '',
    end_date: '',
    is_active: true
  });

  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    bank_code: '',
    account_number: '',
    account_name: ''
  });

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('donation_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching campaigns', status: 'error' });
    } else {
      setCampaigns(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        target_amount: parseInt(formData.target_amount) || 0,
        image: formData.image,
        end_date: formData.end_date || null,
        is_active: formData.is_active
      };

      if (selectedCampaign) {
        const { error } = await supabase
          .from('donation_campaigns')
          .update(dataToSave)
          .eq('id', selectedCampaign.id);
        if (error) throw error;
        toast({ title: 'Campaign updated', status: 'success' });
      } else {
        const { error } = await supabase
          .from('donation_campaigns')
          .insert([dataToSave]);
        if (error) throw error;
        toast({ title: 'Campaign created', status: 'success' });
      }
      onClose();
      fetchCampaigns();
    } catch (error) {
      toast({ title: error.message, status: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const { error } = await supabase
        .from('donation_campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        toast({ title: 'Error deleting', status: 'error' });
      } else {
        toast({ title: 'Campaign deleted', status: 'success' });
        fetchCampaigns();
      }
    }
  };

  const openEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      target_amount: campaign.target_amount,
      image: campaign.image || '',
      end_date: campaign.end_date ? campaign.end_date.split('T')[0] : '',
      is_active: campaign.is_active
    });
    onOpen();
  };

  const openCreate = () => {
    setSelectedCampaign(null);
    setFormData({
      title: '',
      description: '',
      target_amount: '',
      image: '',
      end_date: '',
      is_active: true
    });
    onOpen();
  };

  const viewDonations = async (campaign) => {
    setSelectedCampaign(campaign);
    const { data } = await supabase
      .from('donations')
      .select('*')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false });

    if (data) setDonations(data);
    onDonationsOpen();
  };

  const fetchWalletProfile = async () => {
    try {
      const res = await fetch('https://api.qrispy.id/api/payment/balance', {
        headers: {
            "X-API-Token": "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb",
            "Content-Type": "application/json",
            Accept: "application/json"
        }
      });
      const data = await res.json();
      if (data.status === 'success' || data.status === true) {
        setWalletInfo(data.data);
        onWalletOpen();
      } else {
        toast({ title: 'Gagal memuat profil', description: data.msg, status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Terjadi kesalahan', status: 'error' });
    }
  };

  const handleWithdraw = async () => {
      try {
        // Qrispy API might not have request_withdrawal in the current docs, we'll return an error or keep it if it's there
        toast({ title: 'Fitur penarikan belum tersedia di gateway baru', status: 'info' });

        const res = await fetch('/api/qrispy?action=request_withdrawal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(withdrawData)
        });
        const data = await res.json();
        if(data.status) {
            toast({ title: 'Penarikan berhasil diajukan', status: 'success' });
            setWithdrawData({ amount: '', bank_code: '', account_number: '', account_name: '' });
            fetchWalletProfile(); // Refresh balance
        } else {
            toast({ title: 'Gagal', description: data.msg, status: 'error' });
        }
      } catch (err) {
          toast({ title: 'Terjadi kesalahan jaringan', status: 'error' });
      }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Manajemen Donasi</Text>
        <HStack>
            <Button leftIcon={<FaMoneyBillWave />} colorScheme="green" onClick={fetchWalletProfile}>
                Saldo & Penarikan
            </Button>
            <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={openCreate}>
                Tambah Campaign
            </Button>
        </HStack>
      </HStack>

      <Box overflowX="auto" bg="white" shadow="sm" rounded="lg" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gambar</Th>
              <Th>Judul</Th>
              <Th>Terkumpul / Target</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.map(c => (
              <Tr key={c.id}>
                <Td><Image src={c.image || 'https://via.placeholder.com/50'} boxSize="50px" objectFit="cover" borderRadius="md" /></Td>
                <Td>{c.title}</Td>
                <Td>
                    <Text fontWeight="bold" color="green.500">{formatRupiah(c.current_amount)}</Text>
                    <Text fontSize="xs" color="gray.500">dari {formatRupiah(c.target_amount)}</Text>
                </Td>
                <Td>
                    <Badge colorScheme={c.is_active ? 'green' : 'red'}>{c.is_active ? 'Aktif' : 'Tutup'}</Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton size="sm" icon={<FaEye />} colorScheme="blue" onClick={() => viewDonations(c)} />
                    <IconButton size="sm" icon={<FaEdit />} onClick={() => openEdit(c)} />
                    <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => handleDelete(c.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal Campaign */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCampaign ? 'Edit Campaign' : 'Tambah Campaign'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Judul Campaign</FormLabel>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Target Dana (Rp)</FormLabel>
                <Input type="number" value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>URL Gambar</FormLabel>
                <Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Tanggal Berakhir (Opsional)</FormLabel>
                <Input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Status Aktif</FormLabel>
                <Switch isChecked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} colorScheme="brand" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button colorScheme="brand" onClick={handleSave}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Daftar Donasi */}
      <Modal isOpen={isDonationsOpen} onClose={onDonationsClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Daftar Donatur: {selectedCampaign?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
             <Box overflowX="auto">
                <Table variant="striped" size="sm">
                <Thead>
                    <Tr>
                    <Th>Tanggal</Th>
                    <Th>Nama</Th>
                    <Th>Nominal</Th>
                    <Th>Status</Th>
                    <Th>Pesan</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {donations.map(d => (
                    <Tr key={d.id}>
                        <Td>{new Date(d.created_at).toLocaleDateString('id-ID')}</Td>
                        <Td>{d.is_anonymous ? 'Hamba Allah' : d.name}</Td>
                        <Td>{formatRupiah(d.amount)}</Td>
                        <Td>
                            <Badge colorScheme={d.status === 'success' ? 'green' : d.status === 'pending' ? 'yellow' : 'red'}>
                                {d.status.toUpperCase()}
                            </Badge>
                        </Td>
                        <Td>{d.message || '-'}</Td>
                    </Tr>
                    ))}
                    {donations.length === 0 && (
                        <Tr><Td colSpan={5} textAlign="center">Belum ada donasi.</Td></Tr>
                    )}
                </Tbody>
                </Table>
             </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Wallet & Withdrawal */}
      <Modal isOpen={isWalletOpen} onClose={onWalletClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Saldo & Penarikan Dana</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {walletInfo && (
                <StatGroup mb={6} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                    <Stat>
                        <StatLabel>Nama Akun</StatLabel>
                        <Text fontWeight="bold">{walletInfo.name}</Text>
                    </Stat>
                    <Stat>
                        <StatLabel>Saldo Tersedia</StatLabel>
                        <StatNumber color="green.500">{formatRupiah(walletInfo.balance)}</StatNumber>
                    </Stat>
                </StatGroup>
            )}

            <Text fontWeight="bold" mb={4}>Ajukan Penarikan Dana</Text>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nominal Penarikan (Rp)</FormLabel>
                <Input type="number" value={withdrawData.amount} onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})} placeholder="Min. 50000" />
              </FormControl>
              <HStack w="full">
                  <FormControl isRequired>
                    <FormLabel>Kode Bank (Mis. BCA, BRI)</FormLabel>
                    <Input value={withdrawData.bank_code} onChange={(e) => setWithdrawData({...withdrawData, bank_code: e.target.value.toUpperCase()})} placeholder="BCA" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>No. Rekening</FormLabel>
                    <Input value={withdrawData.account_number} onChange={(e) => setWithdrawData({...withdrawData, account_number: e.target.value})} />
                  </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Atas Nama Rekening</FormLabel>
                <Input value={withdrawData.account_name} onChange={(e) => setWithdrawData({...withdrawData, account_name: e.target.value.toUpperCase()})} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onWalletClose}>Tutup</Button>
            <Button colorScheme="brand" onClick={handleWithdraw} isDisabled={!withdrawData.amount || !withdrawData.bank_code || !withdrawData.account_number}>Tarik Dana</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default DonasiManager;
