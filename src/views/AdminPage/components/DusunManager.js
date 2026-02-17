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

const DusunManager = () => {
  const [dusuns, setDusuns] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingDusun, setEditingDusun] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    population: '',
    area: '',
    houses: '',
    coordinates: '',
    map_link: '',
    image_url: '',
    color: 'brand.500',
  });
  const toast = useToast();

  const fetchDusuns = useCallback(async () => {
    const { data, error } = await supabase
      .from('dusuns')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching dusuns', description: error.message, status: 'error' });
    } else {
      setDusuns(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchDusuns();
  }, [fetchDusuns]);

  const handleEdit = (item) => {
    setEditingDusun(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingDusun(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      population: '',
      area: '',
      houses: '',
      coordinates: '',
      map_link: '',
      image_url: '',
      color: 'brand.500',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus dusun ini?')) {
      const { error } = await supabase.from('dusuns').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchDusuns();
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

    // Auto-generate slug if empty
    if (!formData.slug) {
        formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    if (editingDusun) {
      const { error } = await supabase
        .from('dusuns')
        .update(formData)
        .eq('id', editingDusun.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchDusuns();
      }
    } else {
      const { error } = await supabase.from('dusuns').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchDusuns();
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Wilayah Dusun</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Dusun
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Gambar</Th>
              <Th>Nama Dusun</Th>
              <Th>Penduduk</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dusuns.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Image src={item.image_url} fallbackSrc="https://via.placeholder.com/50" h="40px" w="60px" objectFit="cover" borderRadius="md" />
                </Td>
                <Td fontWeight="600">{item.name}</Td>
                <Td fontSize="sm">{item.population}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingDusun ? 'Edit Dusun' : 'Tambah Dusun'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <HStack width="full">
                  <FormControl isRequired>
                    <FormLabel>Nama Dusun</FormLabel>
                    <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Slug (Otomatis jika kosong)</FormLabel>
                    <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </FormControl>

                <HStack width="full">
                  <FormControl>
                    <FormLabel>Penduduk</FormLabel>
                    <Input value={formData.population} onChange={(e) => setFormData({...formData, population: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Luas Wilayah</FormLabel>
                    <Input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Jumlah Rumah</FormLabel>
                    <Input value={formData.houses} onChange={(e) => setFormData({...formData, houses: e.target.value})} />
                  </FormControl>
                </HStack>

                <HStack width="full">
                  <FormControl>
                    <FormLabel>Koordinat (lat,lng)</FormLabel>
                    <Input value={formData.coordinates} placeholder="-7.452,110.121" onChange={(e) => setFormData({...formData, coordinates: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Link Google Maps Embed (Opsional)</FormLabel>
                    <Input value={formData.map_link} onChange={(e) => setFormData({...formData, map_link: e.target.value})} />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Warna Tema</FormLabel>
                  <Select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}>
                    <option value="brand.500">Biru</option>
                    <option value="green.500">Hijau</option>
                    <option value="orange.500">Oranye</option>
                    <option value="red.500">Merah</option>
                    <option value="purple.500">Ungu</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gambar Utama</FormLabel>
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

export default DusunManager;
