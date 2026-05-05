import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Input,
  useToast,
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
  Textarea,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaDownload, FaUpload, FaEllipsisV, FaRegThumbsDown, FaThumbsDown } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const CommunityFeed = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const toast = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('community_media')
        .select('*, community_media_comments(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    onOpen();
  };

  const submitUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast({ title: 'Gagal', description: 'File dan Judul wajib diisi', status: 'error' });
      return;
    }

    setIsUploading(true);
    try {
      // Catbox API
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', uploadFile);

      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload to Catbox failed');
      const fileUrl = await response.text();

      const isVideo = uploadFile.type.startsWith('video/');

      const { error } = await supabase.from('community_media').insert([{
        title: uploadTitle,
        description: uploadDesc,
        file_url: fileUrl,
        file_type: isVideo ? 'video' : 'image',
        is_anonymous: true,
      }]);

      if (error) throw error;

      toast({ title: 'Berhasil', description: 'Media berhasil diunggah secara anonim.', status: 'success' });
      onClose();
      setUploadFile(null);
      setUploadTitle('');
      setUploadDesc('');
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast({ title: 'Gagal Upload', description: error.message, status: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = async (id, currentLikes, action = 'like') => {
      // Simplified local state update for demo. Real app needs user tracking to prevent spam.
      const increment = action === 'like' ? 1 : -1;
      setMedia(media.map(m => m.id === id ? { ...m, likes: currentLikes + increment } : m));
      await supabase.from('community_media').update({ likes: currentLikes + increment }).eq('id', id);
  };

  const handleUnlike = async (id, currentUnlikes) => {
      setMedia(media.map(m => m.id === id ? { ...m, unlikes: currentUnlikes + 1 } : m));
      await supabase.from('community_media').update({ unlikes: currentUnlikes + 1 }).eq('id', id);
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Tersalin', description: 'Link telah disalin ke clipboard', status: 'info', duration: 2000 });
  };

  return (
    <Box>
      <HStack justify="space-between" mb={8} bg="white" p={4} borderRadius="xl" boxShadow="sm">
        <Text fontWeight="bold">Feed Komunitas</Text>
        <Button leftIcon={<FaUpload />} colorScheme="brand" onClick={handleUploadClick}>
          Upload Media
        </Button>
      </HStack>

      {loading ? (
        <VStack py={10}><Spinner size="xl" color="brand.500" /></VStack>
      ) : media.length === 0 ? (
        <Box textAlign="center" py={10} bg="white" borderRadius="xl">Belum ada media di komunitas.</Box>
      ) : (
        <VStack spacing={8} align="stretch" maxW="3xl" mx="auto">
          {media.map((item) => (
            <Box key={item.id} bg="white" borderRadius="2xl" overflow="hidden" boxShadow="md">
              <HStack p={4} justify="space-between">
                <HStack>
                  <Avatar size="sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">{item.is_anonymous ? 'Anonim' : 'Admin/User'}</Text>
                    <Text fontSize="xs" color="gray.500">{new Date(item.created_at).toLocaleString()}</Text>
                  </VStack>
                </HStack>
                <Menu>
                  <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="ghost" size="sm" />
                  <MenuList>
                    <MenuItem icon={<FaShare />} onClick={() => handleShare(item.file_url)}>Salin Link</MenuItem>
                    <MenuItem icon={<FaDownload />} as="a" href={item.file_url} target="_blank" download>Download</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              <Box bg="black" display="flex" justifyContent="center" maxH="500px">
                {item.file_type === 'video' ? (
                  <video src={item.file_url} controls style={{ maxHeight: '500px', maxWidth: '100%' }} />
                ) : (
                  <Image src={item.file_url} alt={item.title} maxH="500px" objectFit="contain" />
                )}
              </Box>

              <Box p={4}>
                <HStack spacing={4} mb={3}>
                  <HStack spacing={1}>
                    <IconButton icon={<FaHeart />} variant="ghost" colorScheme="red" rounded="full" onClick={() => handleLike(item.id, item.likes, 'like')} />
                    <Text fontSize="sm" fontWeight="bold">{item.likes}</Text>
                  </HStack>
                  <HStack spacing={1}>
                     <IconButton icon={<FaThumbsDown />} variant="ghost" rounded="full" onClick={() => handleUnlike(item.id, item.unlikes)} />
                     <Text fontSize="sm">{item.unlikes}</Text>
                  </HStack>
                  <IconButton icon={<FaComment />} variant="ghost" rounded="full" />
                  <IconButton icon={<FaShare />} variant="ghost" rounded="full" onClick={() => handleShare(item.file_url)} />
                </HStack>

                <Text fontWeight="bold" mb={1}>{item.title}</Text>
                {item.description && <Text fontSize="sm" color="gray.700" mb={3}>{item.description}</Text>}
              </Box>
            </Box>
          ))}
        </VStack>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Upload Media Komunitas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box p={4} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                <Text fontSize="sm" fontWeight="bold" color="red.700">Syarat Penggunaan & Aturan Komunitas</Text>
                <Text fontSize="xs" color="red.600" mt={1}>
                  1. Dilarang mengunggah konten ilegal, SARA, atau pornografi.<br/>
                  2. Admin berhak melakukan takedown pada konten yang melanggar.<br/>
                  3. <Text as="span" opacity={0.5} fontSize="10px">Konten kemungkinan bisa hilang secara berkala (data loss possible).</Text><br/>
                  4. Semua unggahan bersifat anonim.
                </Text>
              </Box>

              <FormControl isRequired>
                <FormLabel>Pilih File (Video / Gambar)</FormLabel>
                <Input type="file" accept="video/*,image/*" p={1} onChange={(e) => setUploadFile(e.target.files[0])} ref={fileInputRef} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Judul</FormLabel>
                <Input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="Beri judul menarik..." />
              </FormControl>

              <FormControl>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} placeholder="Ceritakan tentang media ini..." />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isUploading}>Batal</Button>
            <Button colorScheme="brand" onClick={submitUpload} isLoading={isUploading} loadingText="Mengunggah...">
              Setuju & Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommunityFeed;
