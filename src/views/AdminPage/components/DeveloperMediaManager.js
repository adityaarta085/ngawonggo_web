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
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Textarea,
  Select,
  Switch,
  Badge,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ImageUploadInput from './ImageUploadInput';

const DeveloperMediaManager = () => {
  const [medias, setMedias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'image',
    media_url: '',
    content_text: '',
    access_code: '',
    is_active: true,
  });

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    const { data, error } = await supabase.from('developer_media').select('*').order('created_at', { ascending: false });
    if (!error && data) setMedias(data);
  };

  const handleOpen = (media = null) => {
    if (media) {
      setEditingId(media.id);
      setFormData({
        title: media.title || '',
        description: media.description || '',
        media_type: media.media_type || 'image',
        media_url: media.media_url || '',
        content_text: media.content_text || '',
        access_code: media.access_code || '',
        is_active: media.is_active,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        media_type: 'image',
        media_url: '',
        content_text: '',
        access_code: '',
        is_active: true,
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { ...formData };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('developer_media').update(payload).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('developer_media').insert([payload]);
      error = insertError;
    }

    if (error) {
      toast({ title: 'Gagal menyimpan media', status: 'error', duration: 3000 });
    } else {
      toast({ title: 'Media berhasil disimpan', status: 'success', duration: 3000 });
      fetchMedias();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus media ini?')) {
      await supabase.from('developer_media').delete().eq('id', id);
      fetchMedias();
    }
  };

  return (
    <Box bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="xl" boxShadow="sm">
      <HStack justify="space-between" mb={6}>
        <Box />
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpen()}>
          Tambah Media
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Judul</Th>
              <Th>Tipe</Th>
              <Th>Status</Th>
              <Th>Akses Kode</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {medias.map((item) => (
              <Tr key={item.id}>
                <Td>{item.title}</Td>
                <Td>
                  <Badge colorScheme={item.media_type === 'video' ? 'red' : item.media_type === 'text' ? 'gray' : 'blue'}>
                    {item.media_type.toUpperCase()}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={item.is_active ? 'green' : 'red'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </Td>
                <Td>{item.access_code || '-'}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton size="sm" icon={<FaEdit />} onClick={() => handleOpen(item)} aria-label="Edit" />
                    <IconButton size="sm" colorScheme="red" icon={<FaTrash />} onClick={() => handleDelete(item.id)} aria-label="Hapus" />
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
          <ModalHeader>{editingId ? 'Edit Media' : 'Tambah Media'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul Konten</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>Deskripsi Singkat</FormLabel>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tipe Media</FormLabel>
                  <Select value={formData.media_type} onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}>
                    <option value="image">Gambar (Image)</option>
                    <option value="video">Video (Embed)</option>
                    <option value="text">Teks Panjang</option>
                  </Select>
                </FormControl>

                {formData.media_type === 'image' && (
                  <FormControl>
                    <FormLabel>Upload Gambar</FormLabel>
                    <ImageUploadInput
                      value={formData.media_url}
                      onChange={(url) => setFormData({ ...formData, media_url: url })}
                      path="developer_media"
                    />
                  </FormControl>
                )}

                {formData.media_type === 'video' && (
                  <FormControl isRequired>
                    <FormLabel>Link Embed Video (Drive/Mega)</FormLabel>
                    <Input placeholder="https://mega.nz/embed/..." value={formData.media_url} onChange={(e) => setFormData({ ...formData, media_url: e.target.value })} />
                  </FormControl>
                )}

                {formData.media_type === 'text' && (
                  <FormControl isRequired>
                    <FormLabel>Konten Teks</FormLabel>
                    <Textarea rows={6} value={formData.content_text} onChange={(e) => setFormData({ ...formData, content_text: e.target.value })} />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Kode Akses (Bypass VIP)</FormLabel>
                  <Input placeholder="Kosongkan jika hanya untuk VIP" value={formData.access_code} onChange={(e) => setFormData({ ...formData, access_code: e.target.value })} />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Aktifkan Konten</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                </FormControl>

                <Button type="submit" colorScheme="brand" w="full" isLoading={isLoading}>
                  Simpan Media
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DeveloperMediaManager;
