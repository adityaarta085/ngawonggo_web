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
import { FaEdit, FaTrash, FaPlus, FaMap, FaMosque, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ImageUploadInput from './ImageUploadInput';

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
    sort_order: 0,
  });
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('dusuns')
      .select('*')
      .order('sort_order', { ascending: true });

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
      sort_order: items.length > 0 ? Math.max(...items.map(i => i.sort_order || 0)) + 1 : 0,
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

  const moveItem = async (index, direction) => {
    const newItems = [...items];
    const item = newItems[index];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const targetItem = newItems[targetIndex];

    // Swap sort_order
    const tempOrder = item.sort_order;
    item.sort_order = targetItem.sort_order;
    targetItem.sort_order = tempOrder;

    const { error: err1 } = await supabase.from('dusuns').update({ sort_order: item.sort_order }).eq('id', item.id);
    const { error: err2 } = await supabase.from('dusuns').update({ sort_order: targetItem.sort_order }).eq('id', targetItem.id);

    if (err1 || err2) {
      toast({ title: 'Gagal mengatur urutan', status: 'error' });
    } else {
      fetchItems();
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Text fontSize="xl" fontWeight="bold">Manajemen Wilayah Dusun</Text>
          <Text fontSize="sm" color="gray.500">Atur profil, statistik, dan urutan tampilan sepuluh dusun.</Text>
        </VStack>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>Tambah Dusun</Button>
      </HStack>
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th w="50px">Urutan</Th>
              <Th>Gambar</Th>
              <Th>Nama Dusun</Th>
              <Th>Populasi</Th>
              <Th>Masjid</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr key={item.id}>
                <Td>
                  <VStack spacing={1}>
                    <IconButton
                      size="xs"
                      icon={<FaArrowUp />}
                      isDisabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                      aria-label="Move Up"
                    />
                    <IconButton
                      size="xs"
                      icon={<FaArrowDown />}
                      isDisabled={index === items.length - 1}
                      onClick={() => moveItem(index, 1)}
                      aria-label="Move Down"
                    />
                  </VStack>
                </Td>
                <Td><Image src={item.image_url} h="40px" w="60px" objectFit="cover" borderRadius="md" fallbackSrc="https://via.placeholder.com/60x40?text=No+Img" /></Td>
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
                      <FormControl isRequired>
                        <FormLabel>Gambar Utama Dusun</FormLabel>
                        <ImageUploadInput
                          value={formData.image_url}
                          onChange={(val) => setFormData({...formData, image_url: val})}
                          placeholder="URL Gambar Dusun"
                        />
                      </FormControl>
                      <FormControl isRequired><FormLabel>Link Google Maps Embed (Dusun)</FormLabel><Input value={formData.map_link} onChange={(e) => setFormData({...formData, map_link: e.target.value})} /></FormControl>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired><FormLabel>Nama Masjid</FormLabel><Input value={formData.masjid_name} onChange={(e) => setFormData({...formData, masjid_name: e.target.value})} /></FormControl>
                      <FormControl isRequired>
                        <FormLabel>Gambar Masjid</FormLabel>
                        <ImageUploadInput
                          value={formData.masjid_image}
                          onChange={(val) => setFormData({...formData, masjid_image: val})}
                          placeholder="URL Gambar Masjid"
                        />
                      </FormControl>
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
