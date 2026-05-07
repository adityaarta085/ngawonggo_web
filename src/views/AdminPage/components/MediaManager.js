import React, { useState, useEffect, useRef } from 'react';
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
  useToast,
  HStack,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FaTrash, FaEyeSlash, FaEye, FaUpload, FaLink } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MediaManager = () => {
  const [pemerintahMedia, setPemerintahMedia] = useState([]);
  const [communityMedia, setCommunityMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchPemerintahMedia();
    fetchCommunityMedia();
  }, []);

  const fetchPemerintahMedia = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_pemerintah').select('*').order('created_at', { ascending: false });
    if (data) setPemerintahMedia(data);
    setLoading(false);
  };

  const fetchCommunityMedia = async () => {
    setLoading(true);
    const { data } = await supabase.from('community_media').select('*').order('created_at', { ascending: false });
    if (data) setCommunityMedia(data);
    setLoading(false);
  };

  const submitUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast({ title: 'Gagal', description: 'File dan Judul wajib diisi', status: 'error' });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const key = "AIzaBj7z2z3xBjsk";

      const response = await fetch(`https://c.termai.cc/api/upload?key=${key}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const resData = await response.json();
      if (!resData.status) throw new Error('Failed to get file path');

      const fileUrl = resData.path;
      const isVideo = uploadFile.type.startsWith('video/');

      const { error } = await supabase.from('media_pemerintah').insert([{
        title: uploadTitle,
        description: uploadDesc,
        file_url: fileUrl,
        file_type: isVideo ? 'video' : 'image',
      }]);

      if (error) throw error;

      toast({ title: 'Berhasil', description: 'Media pemerintah berhasil diunggah.', status: 'success' });
      onClose();
      setUploadFile(null);
      setUploadTitle('');
      setUploadDesc('');
      fetchPemerintahMedia();
    } catch (error) {
      toast({ title: 'Gagal Upload', description: error.message, status: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakedown = async (id, currentStatus) => {
    const { error } = await supabase.from('community_media').update({ is_takedown: !currentStatus }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } else {
      toast({ title: 'Berhasil', description: `Status takedown ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`, status: 'success' });
      fetchCommunityMedia();
    }
  };

  const handleDeletePemerintah = async (id) => {
    if (window.confirm('Yakin ingin menghapus media ini?')) {
      await supabase.from('media_pemerintah').delete().eq('id', id);
      fetchPemerintahMedia();
    }
  };

  const handleDeleteCommunity = async (id) => {
      if (window.confirm('Yakin ingin menghapus media komunitas ini secara permanen?')) {
        await supabase.from('community_media').delete().eq('id', id);
        fetchCommunityMedia();
      }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={6}>Manajemen Media & Komunitas</Text>

      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Media Pemerintah</Tab>
          <Tab>Moderasi Komunitas</Tab>
        </TabList>

        <TabPanels>
          {/* MEDIA PEMERINTAH */}
          <TabPanel px={0}>
             <HStack justify="flex-end" mb={4}>
                <Button leftIcon={<FaUpload />} colorScheme="brand" onClick={onOpen}>Upload Media Resmi</Button>
             </HStack>
             <Box overflowX="auto" bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm">
              <Table variant="simple">
                <Thead bg="gray.50" _dark={{ bg: "gray.900" }}>
                  <Tr>
                    <Th>Thumbnail</Th>
                    <Th>Judul</Th>
                    <Th>Tipe</Th>
                    <Th>Likes</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? <Tr><Td colSpan={5} textAlign="center">Memuat...</Td></Tr> : pemerintahMedia.map((m) => (
                    <Tr key={m.id}>
                      <Td>
                        {m.file_type === 'image' ? (
                            <Image src={m.file_url} boxSize="50px" objectFit="cover" borderRadius="md" />
                        ) : (
                            <Badge colorScheme="purple">Video</Badge>
                        )}
                      </Td>
                      <Td>{m.title}</Td>
                      <Td>{m.file_type}</Td>
                      <Td>{m.likes}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton as="a" href={m.file_url} target="_blank" icon={<FaLink />} size="sm" />
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDeletePemerintah(m.id)} />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* KOMUNITAS */}
          <TabPanel px={0}>
             <Box overflowX="auto" bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm">
              <Table variant="simple">
                <Thead bg="gray.50" _dark={{ bg: "gray.900" }}>
                  <Tr>
                    <Th>Media</Th>
                    <Th>Judul</Th>
                    <Th>Status</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? <Tr><Td colSpan={4} textAlign="center">Memuat...</Td></Tr> : communityMedia.map((m) => (
                    <Tr key={m.id} bg={m.is_takedown ? 'red.50' : 'white'}>
                      <Td>
                         <IconButton as="a" href={m.file_url} target="_blank" icon={<FaLink />} size="sm" mr={2} />
                         {m.file_type}
                      </Td>
                      <Td>{m.title}</Td>
                      <Td>
                          {m.is_takedown ? <Badge colorScheme="red">Takedown</Badge> : <Badge colorScheme="green">Publik</Badge>}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={m.is_takedown ? <FaEye /> : <FaEyeSlash />}
                            size="sm"
                            colorScheme={m.is_takedown ? 'green' : 'orange'}
                            onClick={() => handleTakedown(m.id, m.is_takedown)}
                            aria-label="Toggle Takedown"
                            title={m.is_takedown ? 'Batalkan Takedown' : 'Takedown Video/Gambar'}
                          />
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDeleteCommunity(m.id)} title="Hapus Permanen" />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Media Pemerintah</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>File Media</FormLabel>
                <Input type="file" accept="video/*,image/*" p={1} onChange={(e) => setUploadFile(e.target.files[0])} ref={fileInputRef} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Judul</FormLabel>
                <Input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isUploading}>Batal</Button>
            <Button colorScheme="brand" onClick={submitUpload} isLoading={isUploading}>Upload</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default MediaManager;
