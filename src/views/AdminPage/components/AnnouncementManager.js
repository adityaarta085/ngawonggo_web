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
  Switch,
  useToast,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    is_active: true,
  });
  const toast = useToast();

  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching', description: error.message, status: 'error' });
    } else {
      setAnnouncements(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      content: '',
      is_active: true,
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pengumuman ini?')) {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchAnnouncements();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase
        .from('announcements')
        .update(formData)
        .eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchAnnouncements();
      }
    } else {
      const { error } = await supabase.from('announcements').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchAnnouncements();
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Running Text</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Pengumuman
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Isi Pengumuman</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {announcements.map((item) => (
              <Tr key={item.id}>
                <Td maxW="400px" isTruncated>{item.content}</Td>
                <Td>
                  {item.is_active ? (
                    <Text color="green.500" fontWeight="bold">Aktif</Text>
                  ) : (
                    <Text color="red.500" fontWeight="bold">Non-aktif</Text>
                  )}
                </Td>
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
            <ModalHeader>{editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Isi Pengumuman</FormLabel>
                  <Input value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                </FormControl>
                <FormControl display="flex" align="center">
                  <FormLabel mb="0">Aktifkan?</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
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

export default AnnouncementManager;
