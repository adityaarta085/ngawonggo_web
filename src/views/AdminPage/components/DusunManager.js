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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaMap, FaMosque } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const DusunManager = () => {
  const [items, setItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    population: '',
    area: '',
    houses: '',
    image_url: '',
    map_link: '',
    masjid_name: '',
    masjid_image: '',
    masjid_location_url: '',
  });
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('dusuns').select('*').order('id', { ascending: true });
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
    setFormData({
      name: '',
      slug: '',
      description: '',
      population: '',
      area: '',
      houses: '',
      image_url: '',
      map_link: '',
      masjid_name: '',
      masjid_image: '',
      masjid_location_url: '',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus dusun ini?')) {
      const { error } = await supabase.from('dusuns').delete().eq('id', id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { fetchItems(); toast({ title: 'Dihapus', status: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('dusuns').update(formData).eq('id', editingItem.id);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil diupdate', status: 'success' }); }
    } else {
      const { error } = await supabase.from('dusuns').insert([formData]);
      if (error) toast({ title: 'Error', status: 'error' });
      else { onClose(); fetchItems(); toast({ title: 'Berhasil ditambah', status: 'success' }); }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Wilayah Dusun</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Dusun</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Gambar</Th>
              <Th>Nama Dusun</Th>
              <Th>Populasi</Th>
              <Th>Masjid</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td><Image src={item.image_url} h="40px" w="60px" objectFit="cover" borderRadius="md" /></Td>
                <Td fontWeight="600">{item.name}</Td>
                <Td>{item.population}</Td>
                <Td fontSize="sm" color="gray.500">{item.masjid_name}</Td>
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
            <ModalHeader>{editingItem ? 'Edit' : 'Tambah'} Dusun</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs colorScheme="brand">
                <TabList>
                  <Tab><Icon as={FaMap} mr={2} /> Profil & Statistik</Tab>
                  <Tab><Icon as={FaMosque} mr={2} /> Informasi Masjid</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <SimpleGrid columns={2} spacing={4} w="full">
                        <FormControl isRequired><FormLabel>Nama Dusun</FormLabel><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></FormControl>
                        <FormControl isRequired><FormLabel>Slug (URL)</FormLabel><Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} /></FormControl>
                      </SimpleGrid>
                      <FormControl isRequired><FormLabel>Deskripsi Dusun</FormLabel><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></FormControl>
                      <SimpleGrid columns={3} spacing={4} w="full">
                        <FormControl><FormLabel>Populasi</FormLabel><Input value={formData.population} onChange={(e) => setFormData({...formData, population: e.target.value})} /></FormControl>
                        <FormControl><FormLabel>Luas Wilayah</FormLabel><Input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} /></FormControl>
                        <FormControl><FormLabel>Jumlah Rumah</FormLabel><Input value={formData.houses} onChange={(e) => setFormData({...formData, houses: e.target.value})} /></FormControl>
                      </SimpleGrid>
                      <FormControl isRequired><FormLabel>URL Gambar Utama</FormLabel><Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} /></FormControl>
                      <FormControl isRequired><FormLabel>Link Google Maps Embed (Dusun)</FormLabel><Input value={formData.map_link} onChange={(e) => setFormData({...formData, map_link: e.target.value})} /></FormControl>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired><FormLabel>Nama Masjid</FormLabel><Input value={formData.masjid_name} onChange={(e) => setFormData({...formData, masjid_name: e.target.value})} /></FormControl>
                      <FormControl isRequired><FormLabel>URL Gambar Masjid</FormLabel><Input value={formData.masjid_image} onChange={(e) => setFormData({...formData, masjid_image: e.target.value})} /></FormControl>
                      <FormControl isRequired><FormLabel>Link Google Maps Embed (Masjid)</FormLabel><Input value={formData.masjid_location_url} onChange={(e) => setFormData({...formData, masjid_location_url: e.target.value})} /></FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
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
