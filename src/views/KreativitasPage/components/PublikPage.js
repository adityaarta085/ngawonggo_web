import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, VStack, HStack, Text, Image, Button, SimpleGrid,
  Spinner, Heading, Avatar, Icon, Flex
} from '@chakra-ui/react';
import { FaHeart, FaComment, FaArrowLeft, FaMagic } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const PublikPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicImages();
  }, []);

  const fetchPublicImages = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_images')
        .select('*, ai_image_comments(count)')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pt={24} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">

        <style dangerouslySetInnerHTML={{__html: `
        .loader {
          display: inline-grid;
          width: 80px;
          aspect-ratio: 1;
          overflow: hidden;
          background:
           conic-gradient(from 146deg at 50% 1%,#0000, #91492A 2deg 65deg,#0000 68deg)
           -5% 100%/20% 27% repeat-x;
        }
        .loader:before {
          content:"";
          margin: 12.5%;
          clip-path: polygon(100% 50%,78.19% 60.26%,88.3% 82.14%,65% 75.98%,58.68% 99.24%,44.79% 79.54%,25% 93.3%,27.02% 69.28%,3.02% 67.1%,20% 50%,3.02% 32.9%,27.02% 30.72%,25% 6.7%,44.79% 20.46%,58.68% 0.76%,65% 24.02%,88.3% 17.86%,78.19% 39.74%);
          background: #CF6F46;
          animation: l7 3s linear infinite;
          translate: -135% 0;
        }
        @keyframes l7 {to{rotate: 400deg;translate: 135% 0}}
        `}} />

        <Container maxW="container.xl">
        <HStack mb={8} justify="space-between" bg="white" _dark={{ bg: "gray.800" }} p={4} borderRadius="xl" boxShadow="sm">
            <HStack>
                <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/kreativitas')} />
                <Heading size="md">Galeri Publik AI</Heading>
            </HStack>
            <Button leftIcon={<FaMagic />} colorScheme="purple" onClick={() => navigate('/kreativitas')}>
                Buat Gambar
            </Button>
        </HStack>

        {loading ? (
          <VStack py={20}><Spinner size="xl" color="purple.500" /></VStack>
        ) : images.length === 0 ? (
          <Box textAlign="center" py={20} bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl">Belum ada gambar publik.</Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {images.map((img) => (
              <Box
                key={img.id}
                bg="white" _dark={{ bg: "gray.800" }}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="md"
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                onClick={() => navigate(`/kreativitas/publik/${img.id}`)}
              >
                <Box h="300px" bg="black" position="relative" overflow="hidden">
                    <Image src={img.image_url} alt={img.prompt} objectFit="cover" w="full" h="full" fallback={<Box display="flex" w="full" h="full" alignItems="center" justifyContent="center"><div className="loader"></div></Box>} />
                </Box>

                <Box p={4}>
                  <HStack mb={3} justify="space-between">
                    <HStack>
                      <Avatar size="xs" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${img.user_id}`} />
                      <Text fontWeight="bold" fontSize="xs">{img.user_name || 'User'}</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">{new Date(img.created_at).toLocaleDateString()}</Text>
                  </HStack>

                  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} noOfLines={2} fontStyle="italic" mb={4}>
                    "{img.prompt}"
                  </Text>

                  <Flex justify="space-between" align="center" pt={3} borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }}>
                     <HStack spacing={4}>
                        <HStack spacing={1} color="gray.500">
                            <Icon as={FaHeart} />
                            <Text fontSize="xs">{img.likes}</Text>
                        </HStack>
                        <HStack spacing={1} color="gray.500">
                            <Icon as={FaComment} />
                            <Text fontSize="xs">{img.ai_image_comments?.[0]?.count || 0}</Text>
                        </HStack>
                     </HStack>
                  </Flex>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default PublikPage;
