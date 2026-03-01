import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
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
  Select,
  useToast,
  HStack,
  Image,
  Text,
  VStack,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ImageUploadInput from './ImageUploadInput';

const InstitutionManager = () => {
  const [items, setItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: 'pemerintah',
    website_url: '',
    location_url: '',
    address: '',
  });
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: true });
    if (error) toast({ title: 'Error', description: error.message, status: 'error' });
    else setItems(data);
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
        title: item.title || '',
        image: item.image || '',
        category: item.category || 'pemerintah',
        website_url: item.website_url || '',
        location_url: item.location_url || '',
        address: item.address || '',
    });
    onOpen();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ title: '', image: '', category: 'pemerintah', website_url: '', location_url: '', address: '' });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus instansi ini?')) {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { fetchItems(); toast({ title: 'Dihapus', status: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('institutions').update(formData).eq('id', editingItem.id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil diupdate', status: 'success' }); }
    } else {
      const { error } = await supabase.from('institutions').insert([formData]);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil ditambah', status: 'success' }); }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Instansi Terkait & Layanan</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Instansi</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Logo</Th>
              <Th>Nama</Th>
              <Th>Kategori</Th>
              <Th>Tautan/Peta</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td><Image src={item.image} h="40px" w="40px" objectFit="contain" fallbackSrc="https://via.placeholder.com/40" /></Td>
                <Td fontWeight="600">{item.title}</Td>
                <Td><Badge colorScheme={item.category === 'pemerintah' ? 'blue' : 'green'}>{item.category}</Badge></Td>
                <Td fontSize="xs" color="gray.500" maxW="200px" isTruncated>{item.website_url || item.location_url}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton size="sm" icon={<FaEdit />} onClick={() => handleEdit(item)} />
                    <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => handleDelete(item.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingItem ? 'Edit' : 'Tambah'} Instansi</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired><FormLabel>Nama Instansi</FormLabel><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>Kategori</FormLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="pemerintah">Pemerintah Kabupaten (Link Website)</option>
                    <option value="layanan">Layanan Publik (Peta)</option>
                    <option value="keamanan">Keamanan (Peta)</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Logo/Ikon Instansi</FormLabel>
                  <ImageUploadInput
                    value={formData.image}
                    onChange={(val) => setFormData({...formData, image: val})}
                    placeholder="URL Logo Instansi"
                  />
                </FormControl>

                <SimpleGrid columns={1} spacing={4} w="full">
                    <FormControl><FormLabel>Tautan Website (Khusus Pemerintah)</FormLabel><Input value={formData.website_url} onChange={(e) => setFormData({...formData, website_url: e.target.value})} placeholder="https://..." /></FormControl>
                    <FormControl><FormLabel>Link Google Maps Embed (Khusus Layanan/Keamanan)</FormLabel><Input value={formData.location_url} onChange={(e) => setFormData({...formData, location_url: e.target.value})} placeholder="https://www.google.com/maps/embed?..." /></FormControl>
                </SimpleGrid>

                <FormControl><FormLabel>Alamat Lengkap</FormLabel><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit">Simpan</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InstitutionManager;
