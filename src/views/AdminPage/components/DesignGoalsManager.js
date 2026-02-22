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
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const DesignGoalsManager = () => {
  const [goals, setGoals] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '', order_index: 0 });
  const toast = useToast();

  const fetchGoals = useCallback(async () => {
    const { data, error } = await supabase.from('design_goals').select('*').order('order_index', { ascending: true });
    if (error) toast({ title: 'Error', description: error.message, status: 'error' });
    else setGoals(data);
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData(goal);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingGoal(null);
    setFormData({ title: '', description: '', image_url: '', order_index: goals.length + 1 });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus tujuan desain ini?')) {
      const { error } = await supabase.from('design_goals').delete().eq('id', id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { fetchGoals(); toast({ title: 'Dihapus', status: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingGoal) {
      const { error } = await supabase.from('design_goals').update(formData).eq('id', editingGoal.id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchGoals(); toast({ title: 'Berhasil diupdate', status: 'success' }); }
    } else {
      const { error } = await supabase.from('design_goals').insert([formData]);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchGoals(); toast({ title: 'Berhasil ditambah', status: 'success' }); }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen 10 Tujuan Desain</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Tujuan</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th w="50px">No</Th>
              <Th>Gambar</Th>
              <Th>Judul</Th>
              <Th>Deskripsi</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {goals.map((goal, index) => (
              <Tr key={goal.id}>
                <Td fontWeight="bold">{goal.order_index}</Td>
                <Td><Image src={goal.image_url} h="50px" w="80px" objectFit="cover" borderRadius="md" /></Td>
                <Td fontWeight="600">{goal.title}</Td>
                <Td maxW="300px"><Text noOfLines={2}>{goal.description}</Text></Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton size="sm" icon={<FaEdit />} onClick={() => handleEdit(goal)} />
                    <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => handleDelete(goal.id)} />
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
            <ModalHeader>{editingGoal ? 'Edit' : 'Tambah'} Tujuan Desain</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired><FormLabel>Judul</FormLabel><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>Deskripsi</FormLabel><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></FormControl>
                <FormControl isRequired><FormLabel>URL Gambar Preview</FormLabel><Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} /></FormControl>
                <FormControl><FormLabel>Urutan (Index)</FormLabel><Input type="number" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} /></FormControl>
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

export default DesignGoalsManager;
