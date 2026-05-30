import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, HStack, Text, Image, Button, SimpleGrid,
  Spinner, Heading, Flex, Badge, useToast, Center, Icon
} from '@chakra-ui/react';
import { FaArrowLeft, FaMagic, FaLock } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { getById } from '../../../lib/dataFetcher';

const HistoriPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState(null);


  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {

        if (user) {
            getById('user_tiers', user.id).then(({ data }) => {
                if (data) {
                    setTier(data.tier_name);
                    if (data.tier_name === 'VIP') {
                        fetchUserHistory(user.id);
                    } else {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            });
        } else {
            navigate('/auth');
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchUserHistory = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ai_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error(error);
      toast({ title: 'Gagal memuat histori', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container py={20} centerContent><Spinner size="xl" color="purple.500" /></Container>;

  if (tier !== 'VIP') {
      return (
          <Box pt={24} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
              <Container maxW="container.md">
                  <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/kreativitas')} mb={8}>Kembali</Button>
                  <Center p={10} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" boxShadow="xl" flexDirection="column" textAlign="center">
                      <Icon as={FaLock} color="gray.400" boxSize={12} mb={4} />
                      <Heading size="lg" mb={2}>Fitur Eksklusif VIP</Heading>
                      <Text color="gray.500" mb={6}>Histori pembuatan gambar hanya tersedia untuk member VIP. Upgrade akun Anda sekarang untuk membuka fitur ini.</Text>
                      <Button colorScheme="purple" size="lg" onClick={() => navigate('/portal/toko')}>
                          Upgrade ke VIP
                      </Button>
                  </Center>
              </Container>
          </Box>
      );
  }

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
                <Heading size="md">Histori Saya (VIP)</Heading>
            </HStack>
            <Button leftIcon={<FaMagic />} colorScheme="purple" onClick={() => navigate('/kreativitas')}>
                Buat Lagi
            </Button>
        </HStack>

        {images.length === 0 ? (
          <Box textAlign="center" py={20} bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl">Anda belum pernah membuat gambar.</Box>
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
                onClick={() => navigate(`/kreativitas/create/${img.id}`)}
              >
                <Box h="300px" bg="black" position="relative" overflow="hidden">
                    <Image src={img.image_url} alt={img.prompt} objectFit="cover" w="full" h="full" fallback={<Box display="flex" w="full" h="full" alignItems="center" justifyContent="center"><div className="loader"></div></Box>} />
                    <Badge position="absolute" top={2} right={2} colorScheme={img.is_public ? "green" : "red"}>
                        {img.is_public ? "Publik" : "Privat"}
                    </Badge>
                </Box>

                <Box p={4}>
                  <Text fontSize="xs" color="gray.500" mb={2}>{new Date(img.created_at).toLocaleString()}</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} noOfLines={2} fontStyle="italic">
                    "{img.prompt}"
                  </Text>
                  <Flex justify="flex-end" pt={2}>
                      <Text fontSize="xs" color="purple.500" fontWeight="bold">Lihat Detail &rarr;</Text>
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

export default HistoriPage;
