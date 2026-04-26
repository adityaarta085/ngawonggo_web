import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Image,
  Switch,
  Select,
  HStack,
  Text,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { uploadToSupabase } from '../../../lib/uploader';

const DoodleManager = () => {
  const [doodles, setDoodles] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    is_active: false,
    start_date: '',
    end_date: '',
    animation_type: 'float',
    easter_egg_action: 'confetti',
    background_effect: 'aurora'
  });

  const fetchDoodles = async () => {
    try {
      const { data, error } = await supabase.from('doodles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDoodles(data || []);
    } catch (error) {
      toast({ title: 'Error fetching doodles', description: error.message, status: 'error' });
    }
  };

  useEffect(() => {
    fetchDoodles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadToSupabase(file);
      setFormData({ ...formData, image_url: url });
      toast({ title: 'Image uploaded', status: 'success' });
    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // If we are setting this one as active, we should probably set others to inactive?
      // Google Doodles are usually date based, but let's just allow multiple active if dates don't overlap,
      // or we can just fetch the first active one that matches the date.

      const payload = {
        title: formData.title,
        image_url: formData.image_url,
        is_active: formData.is_active,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        animation_type: formData.animation_type,
        easter_egg_action: formData.easter_egg_action,
        background_effect: formData.background_effect
      };

      if (editingId) {
        const { error } = await supabase.from('doodles').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Doodle updated', status: 'success' });
      } else {
        const { error } = await supabase.from('doodles').insert([payload]);
        if (error) throw error;
        toast({ title: 'Doodle created', status: 'success' });
      }

      onClose();
      fetchDoodles();
    } catch (error) {
      toast({ title: 'Error saving doodle', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const { error } = await supabase.from('doodles').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Doodle deleted', status: 'success' });
      fetchDoodles();
    } catch (error) {
      toast({ title: 'Delete failed', status: 'error' });
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
      try {
          const { error } = await supabase.from('doodles').update({ is_active: !currentStatus }).eq('id', id);
          if (error) throw error;
          fetchDoodles();
      } catch (error) {
          toast({ title: 'Update failed', status: 'error' });
      }
  };

  const openModal = (doodle = null) => {
    if (doodle) {
      setEditingId(doodle.id);
      setFormData({
        title: doodle.title,
        image_url: doodle.image_url,
        is_active: doodle.is_active,
        start_date: doodle.start_date || '',
        end_date: doodle.end_date || '',
        animation_type: doodle.animation_type || 'float',
        easter_egg_action: doodle.easter_egg_action || 'confetti',
        background_effect: doodle.background_effect || 'aurora'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        image_url: '',
        is_active: false,
        start_date: '',
        end_date: '',
        animation_type: 'float',
        easter_egg_action: 'confetti',
        background_effect: 'aurora'
      });
    }
    onOpen();
  };

  return (
    <Box bg="white" p={6} borderRadius="xl" shadow="sm">
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Google Doodles (Ngawonggo Doodles)</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => openModal()}>
          Tambah Doodle
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gambar</Th>
              <Th>Judul Event</Th>
              <Th>Animasi & Efek</Th>
              <Th>Tanggal Aktif</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {doodles.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <Image src={d.image_url} h="50px" objectFit="contain" fallbackSrc="https://via.placeholder.com/150" />
                </Td>
                <Td fontWeight="bold">{d.title}</Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Badge colorScheme="blue">Anim: {d.animation_type}</Badge>
                    <Badge colorScheme="purple">Easter: {d.easter_egg_action}</Badge>
                    <Badge colorScheme="green">BG: {d.background_effect}</Badge>
                  </VStack>
                </Td>
                <Td>
                    {d.start_date ? `${d.start_date} s/d ${d.end_date}` : 'Tanpa Batas Waktu'}
                </Td>
                <Td>
                  <Switch isChecked={d.is_active} onChange={() => handleToggleActive(d.id, d.is_active)} colorScheme="green" />
                </Td>
                <Td>
                  <HStack>
                    <IconButton icon={<FaEdit />} size="sm" colorScheme="blue" onClick={() => openModal(d)} />
                    <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(d.id)} />
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
          <ModalHeader>{editingId ? 'Edit Doodle' : 'Tambah Doodle'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Judul Event (Tooltip)</FormLabel>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Cth: HUT RI ke-80" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Gambar Doodle (PNG transparan disarankan)</FormLabel>
                {formData.image_url && <Image src={formData.image_url} h="100px" mb={2} objectFit="contain" />}
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </FormControl>

              <HStack w="full" spacing={4}>
                  <FormControl>
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <Input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
                  </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Tipe Animasi Gambar</FormLabel>
                <Select value={formData.animation_type} onChange={(e) => setFormData({...formData, animation_type: e.target.value})}>
                  <option value="none">Tidak Ada</option>
                  <option value="float">Melayang (Float)</option>
                  <option value="pulse">Berdetak (Pulse)</option>
                  <option value="spin">Berputar (Spin)</option>
                  <option value="bounce">Melompat (Bounce)</option>
                  <option value="swing">Berayun (Swing)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Efek Latar Belakang (Hero Background)</FormLabel>
                <Select value={formData.background_effect} onChange={(e) => setFormData({...formData, background_effect: e.target.value})}>
                  <option value="none">Normal (Tidak Ada)</option>
                  <option value="aurora">Default Ngawonggo (Aurora)</option>
                  <option value="snow">Turun Salju (Snow)</option>
                  <option value="fireworks">Kembang Api (Fireworks)</option>
                  <option value="stars">Bintang Jatuh (Stars)</option>
                  <option value="confetti_bg">Hujan Confetti</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Easter Egg (Saat logo di-klik)</FormLabel>
                <Select value={formData.easter_egg_action} onChange={(e) => setFormData({...formData, easter_egg_action: e.target.value})}>
                  <option value="none">Tidak Ada</option>
                  <option value="confetti">Ledakan Confetti</option>
                  <option value="sound_yay">Suara Sorakan (Yay!)</option>
                  <option value="spin_fast">Berputar Cepat</option>
                  <option value="explode">Efek Pecah</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center" mt={4}>
                <FormLabel mb="0">Aktifkan Doodle Ini?</FormLabel>
                <Switch isChecked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} colorScheme="brand" />
              </FormControl>

            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DoodleManager;
