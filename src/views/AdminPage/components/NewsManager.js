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
  Select,
  useToast,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploadInput from './ImageUploadInput';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    video_url: '',
    date: '',
    content: '',
    category: 'pemerintahan',
  });
  const toast = useToast();

  const fetchNews = useCallback(async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching news', description: error.message, status: 'error' });
    } else {
      setNews(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData(item);
    onOpen();
  };

  const handleAddNew = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      image: '',
      video_url: '',
      date: new Date().toLocaleDateString('id-ID'),
      content: '',
      category: 'pemerintahan',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus berita ini?')) {
      const { error } = await supabase.from('news').delete().eq('id', id);
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
        .from('news')
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
      const { error } = await supabase.from('news').insert([formData]);
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
        <Text fontSize="xl" fontWeight="bold">Manajemen Berita</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={handleAddNew}>
          Tambah Berita
        </Button>
      </HStack>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Gambar</Th>
              <Th>Judul</Th>
              <Th>Tanggal</Th>
              <Th>Kategori</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {news.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Image src={item.image} fallbackSrc="https://via.placeholder.com/50" h="40px" w="60px" objectFit="cover" borderRadius="md" />
                </Td>
                <Td fontWeight="600" maxW="300px" isTruncated>{item.title}</Td>
                <Td fontSize="sm">{item.date}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingNews ? 'Edit Berita' : 'Tambah Berita'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul</FormLabel>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormControl>
                <HStack width="full" align="start">
                  <FormControl >
                    <FormLabel>Gambar Berita</FormLabel>
                    <ImageUploadInput
                      value={formData.image}
                      onChange={(val) => setFormData({...formData, image: val})}
                      placeholder="URL Gambar Berita"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>URL Video (Opsional)</FormLabel>
                    <Input value={formData.video_url} placeholder="https://youtube.com/..." onChange={(e) => setFormData({...formData, video_url: e.target.value})} />
                  </FormControl>
                </HStack>
                <HStack width="full">
                  <FormControl isRequired>
                    <FormLabel>Tanggal</FormLabel>
                    <Input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Kategori</FormLabel>
                    <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="pemerintahan">Pemerintahan</option>
                      <option value="pendidikan">Pendidikan</option>
                      <option value="kesehatan">Kesehatan</option>
                      <option value="umum">Umum</option>
                      <option value="ekonomi">Ekonomi</option>
                    </Select>
                  </FormControl>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Konten Berita</FormLabel>
                  <Box bg="white" color="black">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val) => setFormData({...formData, content: val})}
                      modules={quillModules}
                      style={{ height: '300px', marginBottom: '50px' }}
                    />
                  </Box>
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

export default NewsManager;
