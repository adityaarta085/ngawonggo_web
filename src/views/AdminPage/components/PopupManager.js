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
  Switch,
  useToast,
  HStack,
  Text,
  Divider,
  VStack,
  Image,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const PopupManager = () => {
  const [popups, setPopups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    is_active: true,
    button_label: '',
    button_link: '',
  });
  const toast = useToast();

  const fetchPopups = useCallback(async () => {
    const { data, error } = await supabase
      .from('popups')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching', description: error.message, status: 'error' });
    } else {
      setPopups(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      type: 'text',
      is_active: true,
      button_label: '',
      button_link: '',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus popup ini?')) {
      const { error } = await supabase.from('popups').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchPopups();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase
        .from('popups')
        .update(formData)
        .eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchPopups();
      }
    } else {
      const { error } = await supabase.from('popups').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchPopups();
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Popup Notifikasi</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Popup
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Judul</Th>
              <Th>Tipe</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {popups.map((item) => (
              <Tr key={item.id}>
                <Td fontWeight="bold">{item.title}</Td>
                <Td>{item.type === 'image' ? 'Gambar' : 'Teks'}</Td>
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
            <ModalHeader>{editingItem ? 'Edit Popup' : 'Tambah Popup'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tipe</FormLabel>
                  <Select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="text">Teks</option>
                    <option value="image">Gambar (URL)</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{formData.type === 'image' ? 'URL Gambar' : 'Isi Teks'}</FormLabel>
                  <Input value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                  {formData.type === 'image' && formData.content && (
                    <Image src={formData.content} mt={2} h="100px" objectFit="contain" />
                  )}
                </FormControl>
                <Divider />
                <Text fontWeight="bold" fontSize="sm">Aksi Tombol (Opsional)</Text>
                <FormControl>
                  <FormLabel>Label Tombol</FormLabel>
                  <Input placeholder="Misal: Kunjungi Website" value={formData.button_label} onChange={(e) => setFormData({...formData, button_label: e.target.value})} />
                </FormControl>
                <FormControl>
                  <FormLabel>Link Tombol</FormLabel>
                  <Input placeholder="https://..." value={formData.button_link} onChange={(e) => setFormData({...formData, button_link: e.target.value})} />
                </FormControl>
                <Divider />
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

export default PopupManager;
