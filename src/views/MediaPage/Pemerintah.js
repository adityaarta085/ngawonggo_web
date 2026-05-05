import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from '@chakra-ui/react';
import { FaHeart, FaShare, FaDownload, FaEllipsisV, FaBuilding } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components';

const MediaPemerintah = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_pemerintah')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id, currentLikes) => {
      setMedia(media.map(m => m.id === id ? { ...m, likes: currentLikes + 1 } : m));
      await supabase.from('media_pemerintah').update({ likes: currentLikes + 1 }).eq('id', id);
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link disalin ke clipboard!');
  };

  return (
    <Box pt={0} pb={32} bg="gray.50" minH="100vh">
      <SEO title="Media Pemerintah" description="Publikasi media, galeri, dan video dari Pemerintah Desa Ngawonggo." />
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch" pt={12}>
          <Box textAlign="center">
            <Badge colorScheme="brand" px={4} py={1} borderRadius="full" mb={4}>
              PUBLIKASI RESMI
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" mb={4}>
              Media Pemerintah
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
              Galeri dan video resmi kegiatan Pemerintahan Desa Ngawonggo.
            </Text>
          </Box>

          {loading ? (
            <VStack py={10}><Spinner size="xl" color="brand.500" /></VStack>
          ) : media.length === 0 ? (
            <Box textAlign="center" py={10} bg="white" borderRadius="xl">Belum ada publikasi media pemerintah.</Box>
          ) : (
            <VStack spacing={8} align="stretch" maxW="3xl" mx="auto">
              {media.map((item) => (
                <Box key={item.id} bg="white" borderRadius="2xl" overflow="hidden" boxShadow="md">
                  <HStack p={4} justify="space-between">
                    <HStack>
                      <Box bg="brand.500" p={2} borderRadius="full" color="white">
                        <FaBuilding />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">Pemerintah Desa</Text>
                        <Text fontSize="xs" color="gray.500">{new Date(item.created_at).toLocaleString('id-ID')}</Text>
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
                        <IconButton icon={<FaHeart />} variant="ghost" colorScheme="red" rounded="full" onClick={() => handleLike(item.id, item.likes)} />
                        <Text fontSize="sm" fontWeight="bold">{item.likes}</Text>
                      </HStack>
                      <IconButton icon={<FaShare />} variant="ghost" rounded="full" onClick={() => handleShare(item.file_url)} />
                    </HStack>

                    <Text fontWeight="bold" mb={1}>{item.title}</Text>
                    {item.description && <Text fontSize="sm" color="gray.700" mb={3}>{item.description}</Text>}
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MediaPemerintah;
