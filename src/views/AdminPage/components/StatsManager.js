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
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const StatsManager = () => {
  const [stats, setStats] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({ label: '', value: '', icon: '', color: '' });
  const toast = useToast();

  const fetchStats = useCallback(async () => {
    const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
    if (error) toast({ title: 'Error', description: error.message, status: 'error' });
    else setStats(data);
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleEdit = (item) => {
    setEditingStat(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingStat(null);
    setFormData({ label: '', value: '', icon: 'FaUsers', color: 'blue.500' });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus statistik ini?')) {
      const { error } = await supabase.from('village_stats').delete().eq('id', id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { fetchStats(); toast({ title: 'Dihapus', status: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStat) {
      const { error } = await supabase.from('village_stats').update(formData).eq('id', editingStat.id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchStats(); toast({ title: 'Berhasil diupdate', status: 'success' }); }
    } else {
      const { error } = await supabase.from('village_stats').insert([formData]);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchStats(); toast({ title: 'Berhasil ditambah', status: 'success' }); }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Statistik Desa</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Statistik</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Label</Th>
              <Th>Nilai</Th>
              <Th>Icon</Th>
              <Th>Warna</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.map((item) => (
              <Tr key={item.id}>
                <Td fontWeight="600">{item.label}</Td>
                <Td>{item.value}</Td>
                <Td>{item.icon}</Td>
                <Td>{item.color}</Td>
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
            <ModalHeader>{editingStat ? 'Edit' : 'Tambah'} Statistik</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired><FormLabel>Label (Contoh: Total Penduduk)</FormLabel><Input value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>Nilai (Contoh: 6.052)</FormLabel><Input value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} /></FormControl>
                <FormControl><FormLabel>Icon (Fa Icon Name)</FormLabel><Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} /></FormControl>
                <FormControl><FormLabel>Warna (Chakra Color)</FormLabel><Input value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} /></FormControl>
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

export default StatsManager;
