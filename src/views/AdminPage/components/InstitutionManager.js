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
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const InstitutionManager = () => {
  const [items, setItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', category: 'lembaga' });
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: false });
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
    setFormData({ title: '', image: '', category: 'lembaga' });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus lembaga ini?')) {
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
        <Text fontSize="xl" fontWeight="bold">Manajemen Lembaga Desa</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Lembaga</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Logo/Gambar</Th>
              <Th>Nama</Th>
              <Th>Kategori</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td><Image src={item.image} h="40px" w="60px" objectFit="contain" borderRadius="md" bg="gray.50" /></Td>
                <Td fontWeight="600">{item.title}</Td>
                <Td><Badge colorScheme="blue">{item.category}</Badge></Td>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingItem ? 'Edit' : 'Tambah'} Lembaga</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired><FormLabel>Nama Lembaga</FormLabel><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>URL Logo/Gambar</FormLabel><Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} /></FormControl>
                <FormControl><FormLabel>Kategori</FormLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="lembaga">Lembaga Desa</option>
                    <option value="umkm">UMKM</option>
                    <option value="organisasi">Organisasi</option>
                  </Select>
                </FormControl>
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
