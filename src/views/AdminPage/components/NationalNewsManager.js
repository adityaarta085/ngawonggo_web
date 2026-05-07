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
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaSync } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NationalNewsManager = () => {
  const [news, setNews] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image_thumbnail: '',
    image_full: '',
    date: '',
    content: '',
      ai_summary: '',
    slug: '',
    source: 'CNN',
    link: ''
  });
  const toast = useToast();

  const fetchNews = useCallback(async () => {
    const { data, error } = await supabase
      .from('national_news')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching national news', description: error.message, status: 'error' });
    } else {
      setNews(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/cron-national-news');
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Berhasil sync data', description: `${data.insertedCount} berita disinkronisasikan`, status: 'success' });
        fetchNews();
      } else {
        toast({ title: 'Gagal sync data', description: data.message, status: 'error' });
      }
    } catch (error) {
      toast({ title: 'Error sync', description: error.message, status: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      image_thumbnail: '',
      image_full: '',
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/[-:]/g, '').replace(' ', ''),
      content: '',
      ai_summary: '',
      slug: `/nasional/${Date.now()}`,
      source: 'Manual',
      link: ''
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus berita ini?')) {
      const { error } = await supabase.from('national_news').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error deleting', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil dihapus', status: 'success' });
        fetchNews();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNews) {
      const { error } = await supabase
        .from('national_news')
        .update(formData)
        .eq('id', editingNews.id);
      if (error) {
        toast({ title: 'Error updating', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil diupdate', status: 'success' });
        onClose();
        fetchNews();
      }
    } else {
      const { error } = await supabase.from('national_news').insert([formData]);
      if (error) {
        toast({ title: 'Error adding', description: error.message, status: 'error' });
      } else {
        toast({ title: 'Berhasil ditambah', status: 'success' });
        onClose();
        fetchNews();
      }
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Berita Nasional</Text>
        <HStack spacing={4}>
          <Button leftIcon={<FaSync />} colorScheme="blue" onClick={handleSync} isLoading={isSyncing}>
            Sync dari API
          </Button>
          <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
            Tambah Berita
          </Button>
        </HStack>
      </HStack>

      <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50" _dark={{ bg: "gray.900" }}>
            <Tr>
              <Th>Gambar</Th>
              <Th>Judul</Th>
              <Th>Sumber</Th>
              <Th>Waktu</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {news.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Image src={item.image_thumbnail} fallbackSrc="https://via.placeholder.com/50" h="40px" w="60px" objectFit="cover" borderRadius="md" />
                </Td>
                <Td fontWeight="600" maxW="300px" isTruncated>{item.title}</Td>
                <Td fontSize="sm">{item.source}</Td>
                <Td fontSize="sm">{item.date}</Td>
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
            <ModalHeader>{editingNews ? 'Edit Berita Nasional' : 'Tambah Berita Nasional'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormControl>
                <HStack width="full" align="start">
                  <FormControl>
                    <FormLabel>URL Gambar Thumbnail</FormLabel>
                    <Input value={formData.image_thumbnail} onChange={(e) => setFormData({...formData, image_thumbnail: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>URL Gambar Full</FormLabel>
                    <Input value={formData.image_full} onChange={(e) => setFormData({...formData, image_full: e.target.value})} />
                  </FormControl>
                </HStack>
                <HStack width="full">
                  <FormControl isRequired>
                    <FormLabel>Slug</FormLabel>
                    <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sumber</FormLabel>
                    <Input value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} />
                  </FormControl>
                </HStack>
                <HStack width="full">
                  <FormControl>
                    <FormLabel>Link Original</FormLabel>
                    <Input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal</FormLabel>
                    <Input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </FormControl>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Konten Berita</FormLabel>
                  <Box bg="white" color="black" _dark={{ bg: "gray.800", color: "white" }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val) => setFormData({...formData, content: val})}
                      modules={quillModules}
                      style={{ height: '300px', marginBottom: '50px' }}
                    />
                  </Box>
                </FormControl>
                <FormControl>
                  <FormLabel>AI Summary (Opsional)</FormLabel>
                  <Input value={formData.ai_summary || ''} onChange={(e) => setFormData({...formData, ai_summary: e.target.value})} placeholder="Ringkasan AI" />
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

export default NationalNewsManager;
