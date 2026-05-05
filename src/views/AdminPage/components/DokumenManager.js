import React, { useState, useEffect } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaLink } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const DokumenManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentDoc, setCurrentDoc] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', file_url: '', published_at: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('public_documents')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doc = null) => {
    if (doc) {
      setCurrentDoc(doc);
      setFormData({
        title: doc.title,
        description: doc.description || '',
        file_url: doc.file_url,
        published_at: doc.published_at,
      });
    } else {
      setCurrentDoc(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({ title: '', description: '', file_url: '', published_at: today });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentDoc) {
        const { error } = await supabase
          .from('public_documents')
          .update(formData)
          .eq('id', currentDoc.id);
        if (error) throw error;
        toast({ title: 'Berhasil', description: 'Dokumen diperbarui', status: 'success' });
      } else {
        const { error } = await supabase
          .from('public_documents')
          .insert([formData]);
        if (error) throw error;
        toast({ title: 'Berhasil', description: 'Dokumen ditambahkan', status: 'success' });
      }
      onClose();
      fetchDocuments();
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus dokumen ini?')) {
      try {
        const { error } = await supabase.from('public_documents').delete().eq('id', id);
        if (error) throw error;
        toast({ title: 'Berhasil', description: 'Dokumen dihapus', status: 'success' });
        fetchDocuments();
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      }
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Manajemen Dokumen & Analitik</Text>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Tambah Dokumen
        </Button>
      </HStack>

      <Box overflowX="auto" bg="white" borderRadius="xl" boxShadow="sm">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Tanggal Publikasi</Th>
              <Th>Judul</Th>
              <Th>URL</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan={4} textAlign="center">Memuat...</Td></Tr>
            ) : documents.map((doc) => (
              <Tr key={doc.id}>
                <Td>{new Date(doc.published_at).toLocaleDateString('id-ID')}</Td>
                <Td fontWeight="bold">{doc.title}</Td>
                <Td>
                  <IconButton
                    as="a"
                    href={doc.file_url}
                    target="_blank"
                    icon={<FaLink />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                  />
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton icon={<FaEdit />} size="sm" colorScheme="blue" onClick={() => handleOpenModal(doc)} />
                    <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(doc.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>{currentDoc ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel>Judul Dokumen</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Laporan APBDes 2026..."
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Deskripsi</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Penjelasan singkat mengenai dokumen..."
                rows={3}
              />
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>URL File (PDF/Docs)</FormLabel>
              <Input
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://example.com/file.pdf"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>Bisa menggunakan link Google Drive, Catbox, dll.</Text>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tanggal Publikasi</FormLabel>
              <Input
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button colorScheme="brand" type="submit" isLoading={isSubmitting}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DokumenManager;
