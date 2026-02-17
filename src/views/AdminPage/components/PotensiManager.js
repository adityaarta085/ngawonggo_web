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
  Select,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaUpload } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { uploadDeline } from '../../../lib/uploader';

const PotensiManager = () => {
  const [potentials, setPotentials] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPotential, setEditingPotential] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pertanian',
    image_url: '',
  });
  const toast = useToast();

  const fetchPotentials = useCallback(async () => {
    const { data, error } = await supabase
      .from('potentials')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching potentials', description: error.message, status: 'error' });
    } else {
      setPotentials(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchPotentials();
  }, [fetchPotentials]);

  const handleEdit = (item) => {
    setEditingPotential(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingPotential(null);
    setFormData({
      title: '',
      description: '',
      category: 'Pertanian',
      image_url: '',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus potensi ini?')) {
      const { error } = await supabase.from('potentials').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchPotentials();
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadDeline(file, file.name.split('.').pop(), file.type);
      setFormData({ ...formData, image_url: url });
      toast({ title: 'Upload berhasil', status: 'success' });
    } catch (error) {
      toast({ title: 'Upload gagal', description: error.message, status: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPotential) {
      const { error } = await supabase
        .from('potentials')
        .update(formData)
        .eq('id', editingPotential.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchPotentials();
      }
    } else {
      const { error } = await supabase.from('potentials').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchPotentials();
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Potensi Desa</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Potensi
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Gambar</Th>
              <Th>Nama Potensi</Th>
              <Th>Kategori</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {potentials.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Image src={item.image_url} fallbackSrc="https://via.placeholder.com/50" h="40px" w="60px" objectFit="cover" borderRadius="md" />
                </Td>
                <Td fontWeight="600">{item.title}</Td>
                <Td>
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">{item.category}</Text>
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

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingPotential ? 'Edit Potensi' : 'Tambah Potensi'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama Potensi</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea h="150px" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </FormControl>

                <FormControl>
                  <FormLabel>Kategori</FormLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Wisata">Wisata</option>
                    <option value="Budaya">Budaya</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Lainnya">Lainnya</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gambar Potensi</FormLabel>
                  <HStack>
                    <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                    <Button
                      as="label"
                      htmlFor="image-upload"
                      leftIcon={<FaUpload />}
                      isLoading={isUploading}
                      cursor="pointer"
                    >
                      Upload
                      <input
                        id="image-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </HStack>
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

export default PotensiManager;
