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
  Textarea,
  useToast,
  HStack,
  Text,
  VStack,
  Select,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const LayananManager = () => {
  const [services, setServices] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'InfoIcon',
    link: '#',
  });
  const toast = useToast();

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('public_services')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching services', description: error.message, status: 'error' });
    } else {
      setServices(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleEdit = (item) => {
    setEditingService(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon_name: 'InfoIcon',
      link: '#',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus layanan ini?')) {
      const { error } = await supabase.from('public_services').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchServices();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingService) {
      const { error } = await supabase
        .from('public_services')
        .update(formData)
        .eq('id', editingService.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchServices();
      }
    } else {
      const { error } = await supabase.from('public_services').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchServices();
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Layanan Publik</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Layanan
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Icon</Th>
              <Th>Nama Layanan</Th>
              <Th>Link</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {services.map((item) => (
              <Tr key={item.id}>
                <Td fontSize="sm" fontWeight="bold">{item.icon_name}</Td>
                <Td fontWeight="600">{item.title}</Td>
                <Td fontSize="sm" color="blue.500">{item.link}</Td>
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
            <ModalHeader>{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama Layanan</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Deskripsi Singkat</FormLabel>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </FormControl>

                <HStack width="full">
                  <FormControl>
                    <FormLabel>Nama Icon</FormLabel>
                    <Select value={formData.icon_name} onChange={(e) => setFormData({...formData, icon_name: e.target.value})}>
                      <option value="InfoIcon">Info Icon</option>
                      <option value="EditIcon">Edit Icon</option>
                      <option value="EmailIcon">Email Icon</option>
                      <option value="StarIcon">Star Icon</option>
                      <option value="PhoneIcon">Phone Icon</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Link Layanan</FormLabel>
                    <Input value={formData.link} placeholder="#" onChange={(e) => setFormData({...formData, link: e.target.value})} />
                  </FormControl>
                </HStack>
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

export default LayananManager;
