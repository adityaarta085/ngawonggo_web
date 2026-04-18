import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
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
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Text,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaHandHoldingHeart } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

const DonationManager = () => {
  const [donations, setDonations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: 0,
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchDonations();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      toast({ title: 'Error loading donations', description: error.message, status: 'error' });
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.from('donation_transactions').select('*, donations(title)').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast({ title: 'Error loading transactions', description: error.message, status: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('donations').update(formData).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Donation updated successfully', status: 'success' });
      } else {
        const { error } = await supabase.from('donations').insert([formData]);
        if (error) throw error;
        toast({ title: 'Donation created successfully', status: 'success' });
      }
      onClose();
      fetchDonations();
    } catch (error) {
      toast({ title: 'Error saving donation', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation campaign?')) return;
    try {
      const { error } = await supabase.from('donations').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Donation deleted', status: 'success' });
      fetchDonations();
    } catch (error) {
      toast({ title: 'Error deleting donation', description: error.message, status: 'error' });
    }
  };

  const openEditModal = (donation) => {
    setEditingId(donation.id);
    setFormData({
      title: donation.title,
      description: donation.description,
      target_amount: donation.target_amount || 0,
      image_url: donation.image_url || '',
      is_active: donation.is_active,
    });
    onOpen();
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      target_amount: 0,
      image_url: '',
      is_active: true,
    });
    onOpen();
  };

  return (
    <Box bg="white" p={6} borderRadius="xl" shadow="md">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" display="flex" alignItems="center" gap={2}>
          <Icon as={FaHandHoldingHeart} color="brand.500" />
          Manajemen Donasi
        </Heading>
      </Flex>

      <Tabs colorScheme="brand">
        <TabList>
          <Tab>Kampanye Donasi</Tab>
          <Tab>Riwayat Transaksi</Tab>
        </TabList>

        <TabPanels>
          {/* Campaigns Tab */}
          <TabPanel px={0}>
            <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={openCreateModal} mb={4}>
              Buat Kampanye
            </Button>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Info</Th>
                    <Th>Terkumpul / Target</Th>
                    <Th>Status</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {donations.map((d) => (
                    <Tr key={d.id}>
                      <Td>
                        <Flex align="center" gap={3}>
                          {d.image_url && <Image src={d.image_url} w="50px" h="50px" objectFit="cover" borderRadius="md" />}
                          <Box>
                            <Text fontWeight="bold">{d.title}</Text>
                            <Text fontSize="sm" color="gray.500" noOfLines={1} maxW="200px">{d.description}</Text>
                          </Box>
                        </Flex>
                      </Td>
                      <Td>
                        <Text fontWeight="bold" color="brand.500">{formatRupiah(d.current_amount)}</Text>
                        {d.target_amount > 0 && <Text fontSize="xs" color="gray.500">Target: {formatRupiah(d.target_amount)}</Text>}
                      </Td>
                      <Td>
                        <Badge colorScheme={d.is_active ? 'green' : 'red'}>
                          {d.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <IconButton size="sm" icon={<FaEdit />} colorScheme="blue" onClick={() => openEditModal(d)} />
                          <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => handleDelete(d.id)} />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel px={0}>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Tanggal</Th>
                    <Th>Kampanye</Th>
                    <Th>Donatur</Th>
                    <Th>Pesan</Th>
                    <Th>Nominal</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((t) => (
                    <Tr key={t.id}>
                      <Td>{new Date(t.created_at).toLocaleString('id-ID')}</Td>
                      <Td>{t.donations?.title || 'Unknown'}</Td>
                      <Td>{t.donor_name}</Td>
                      <Td><Text fontSize="xs" noOfLines={2} maxW="150px">{t.donor_msg}</Text></Td>
                      <Td fontWeight="bold">{formatRupiah(t.amount)}</Td>
                      <Td>
                        <Badge colorScheme={t.status === 'paid' ? 'green' : t.status === 'pending' ? 'orange' : 'red'}>
                          {t.status.toUpperCase()}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingId ? 'Edit Kampanye' : 'Buat Kampanye Baru'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" gap={4}>
                <FormControl isRequired>
                  <FormLabel>Judul Donasi</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>Target Nominal (Opsional, isi 0 jika tanpa target)</FormLabel>
                  <Input type="number" value={formData.target_amount} onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>URL Gambar (Opsional)</FormLabel>
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Status Aktif</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit" isLoading={isLoading}>Simpan</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DonationManager;
