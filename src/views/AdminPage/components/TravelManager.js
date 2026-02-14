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
  useToast,
  HStack,
  Image,
  Text,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const TravelManager = () => {
  const [items, setItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', location: '', description: '' });
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('travel_places').select('*').order('id', { ascending: false });
    if (error) toast({ title: 'Error', description: error.message, status: 'error' });
    else setItems(data);
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ title: '', image: '', location: '', description: '' });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus destinasi ini?')) {
      const { error } = await supabase.from('travel_places').delete().eq('id', id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { fetchItems(); toast({ title: 'Dihapus', status: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('travel_places').update(formData).eq('id', editingItem.id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil diupdate', status: 'success' }); }
    } else {
      const { error } = await supabase.from('travel_places').insert([formData]);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil ditambah', status: 'success' }); }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Wisata</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Wisata</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Gambar</Th>
              <Th>Nama</Th>
              <Th>Lokasi</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td><Image src={item.image} h="40px" w="60px" objectFit="cover" borderRadius="md" /></Td>
                <Td fontWeight="600">{item.title}</Td>
                <Td fontSize="xs" isTruncated maxW="200px">{item.location}</Td>
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
            <ModalHeader>{editingItem ? 'Edit' : 'Tambah'} Wisata</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired><FormLabel>Nama Destinasi</FormLabel><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>URL Gambar</FormLabel><Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>URL Lokasi (Google Maps)</FormLabel><Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></FormControl>
                <FormControl><FormLabel>Deskripsi Singkat</FormLabel><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></FormControl>
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

export default TravelManager;
