import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Image,
  Text,
  Badge,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus, FaUpload } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const IklanManager = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image',
    category: '',
    customCategory: '',
    action_url: '',
    placement_type: 'inline',
    has_audio: false,
    is_active: true,
  });

  const categories = ['UMKM', 'Kesehatan', 'Pendidikan', 'Teknologi', 'Pemerintahan', 'Lainnya'];
  const placements = [
    { value: 'inline', label: 'Inline (Dalam Konten)' },
    { value: 'popup_bottom', label: 'Popup Kanan Bawah' },
    { value: 'popup_top', label: 'Popup Kanan Atas' },
    { value: 'popup_center', label: 'Popup Tengah' },
  ];

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('custom_ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Gagal mengambil data', status: 'error' });
    } else {
      setAds(data || []);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('ads_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ads_media')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        media_url: data.publicUrl,
        media_type: file.type.startsWith('video/') ? 'video' : 'image'
      });
      toast({ title: 'Media berhasil diunggah', status: 'success' });
    } catch (error) {
      toast({ title: 'Gagal mengunggah media', description: error.message, status: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalCategory = formData.category === 'Lainnya' ? formData.customCategory : formData.category;

    if (!finalCategory) {
        toast({ title: 'Kategori harus diisi', status: 'warning' });
        setIsLoading(false);
        return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      media_url: formData.media_url,
      media_type: formData.media_type,
      category: finalCategory,
      action_url: formData.action_url,
      placement_type: formData.placement_type,
      has_audio: formData.has_audio,
      is_active: formData.is_active,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('custom_ads')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Iklan diperbarui', status: 'success' });
      } else {
        const { error } = await supabase
          .from('custom_ads')
          .insert([payload]);
        if (error) throw error;
        toast({ title: 'Iklan ditambahkan', status: 'success' });
      }
      onClose();
      fetchAds();
    } catch (error) {
      toast({ title: 'Terjadi kesalahan', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus iklan ini?')) {
      const { error } = await supabase.from('custom_ads').delete().eq('id', id);
      if (error) {
        toast({ title: 'Gagal menghapus', status: 'error' });
      } else {
        toast({ title: 'Iklan dihapus', status: 'success' });
        fetchAds();
      }
    }
  };

  const handleEdit = (ad) => {
    const isStandardCat = categories.includes(ad.category);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      media_url: ad.media_url,
      media_type: ad.media_type,
      category: isStandardCat ? ad.category : 'Lainnya',
      customCategory: isStandardCat ? '' : ad.category,
      action_url: ad.action_url || '',
      placement_type: ad.placement_type,
      has_audio: ad.has_audio || false,
      is_active: ad.is_active,
    });
    setEditingId(ad.id);
    onOpen();
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      media_url: '',
      media_type: 'image',
      category: categories[0],
      customCategory: '',
      action_url: '',
      placement_type: 'inline',
      has_audio: false,
      is_active: true,
    });
    setEditingId(null);
    onOpen();
  };

  const toggleActive = async (id, currentStatus) => {
      const { error } = await supabase.from('custom_ads').update({ is_active: !currentStatus }).eq('id', id);
      if(!error) fetchAds();
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" shadow="sm">
      <HStack justifyContent="space-between" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">Manajemen Iklan</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={openCreateModal}>
          Tambah Iklan
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Media</Th>
              <Th>Detail</Th>
              <Th>Penempatan</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ads.map((ad) => (
              <Tr key={ad.id}>
                <Td>
                  {ad.media_type === 'image' ? (
                    <Image src={ad.media_url} boxSize="80px" objectFit="cover" borderRadius="md" />
                  ) : (
                    <Box as="video" src={ad.media_url} boxSize="80px" objectFit="cover" borderRadius="md" muted />
                  )}
                </Td>
                <Td>
                  <Text fontWeight="bold">{ad.title}</Text>
                  <Badge colorScheme="purple">{ad.category}</Badge>
                </Td>
                <Td>
                  <Badge>{placements.find(p => p.value === ad.placement_type)?.label || ad.placement_type}</Badge>
                </Td>
                <Td>
                  <Switch isChecked={ad.is_active} onChange={() => toggleActive(ad.id, ad.is_active)} colorScheme="brand" />
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton icon={<FaEdit />} size="sm" colorScheme="blue" onClick={() => handleEdit(ad)} aria-label="Edit" />
                    <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(ad.id)} aria-label="Hapus" />
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
          <ModalHeader>{editingId ? 'Edit Iklan' : 'Tambah Iklan Baru'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul Iklan</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Contoh: Promo UMKM" />
                </FormControl>

                <FormControl>
                  <FormLabel>Deskripsi Singkat</FormLabel>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Keterangan tambahan..." />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Kategori</FormLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormControl>

                {formData.category === 'Lainnya' && (
                  <FormControl isRequired>
                    <FormLabel>Kategori Kustom</FormLabel>
                    <Input value={formData.customCategory} onChange={(e) => setFormData({...formData, customCategory: e.target.value})} placeholder="Ketik kategori..." />
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel>Media (Gambar/Video)</FormLabel>
                  <HStack>
                      <Input type="file" accept="image/*,video/*" onChange={handleFileUpload} display="none" id="ad-media-upload" />
                      <Button as="label" htmlFor="ad-media-upload" leftIcon={<FaUpload />} isLoading={isUploading}>Upload Media</Button>
                  </HStack>
                  {formData.media_url && (
                    <Box mt={2}>
                        {formData.media_type === 'image' ? (
                            <Image src={formData.media_url} maxH="150px" borderRadius="md" />
                        ) : (
                            <video src={formData.media_url} style={{ maxHeight: '150px' }} controls />
                        )}
                    </Box>
                  )}
                </FormControl>

                {formData.media_type === 'video' && (
                    <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Aktifkan Suara (Audio) Video?</FormLabel>
                        <Switch isChecked={formData.has_audio} onChange={(e) => setFormData({...formData, has_audio: e.target.checked})} colorScheme="brand" />
                    </FormControl>
                )}

                <FormControl>
                  <FormLabel>URL Tujuan (Tautan Info Selengkapnya)</FormLabel>
                  <Input value={formData.action_url} onChange={(e) => setFormData({...formData, action_url: e.target.value})} placeholder="https://..." />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Penempatan Iklan</FormLabel>
                  <Select value={formData.placement_type} onChange={(e) => setFormData({...formData, placement_type: e.target.value})}>
                    {placements.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Status Aktif</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} colorScheme="brand" />
                </FormControl>

              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit" isLoading={isLoading || isUploading}>Simpan</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IklanManager;
