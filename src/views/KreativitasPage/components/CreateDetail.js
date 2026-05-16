import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, HStack, Text, Image, Button,
  Spinner, Heading, useToast, FormControl, FormLabel, Switch, Flex, Badge
} from '@chakra-ui/react';
import { FaArrowLeft, FaDownload, FaShare } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const CreateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [tier, setTier] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from('user_tiers').select('tier_name').eq('user_id', user.id).single().then(({ data }) => {
          if (data) setTier(data.tier_name);
        });
      }
    });
    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchImage = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setImage(data);
    } catch (error) {
      console.error("Error fetching image:", error);
      toast({ title: 'Gagal memuat', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (e) => {
    const isPublic = e.target.checked;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('ai_images')
        .update({ is_public: isPublic })
        .eq('id', id);

      if (error) throw error;
      setImage({ ...image, is_public: isPublic });
      toast({ title: 'Pengaturan disimpan', status: 'success' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Gagal update', status: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <Container py={20} centerContent><Spinner size="xl" /></Container>;
  if (!image) return <Container py={20} centerContent><Heading>Gambar tidak ditemukan</Heading></Container>;

  return (
    <Box pt={24} pb={32} bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
      <Container maxW="3xl">
        <HStack mb={6} justify="space-between">
            <Button leftIcon={<FaArrowLeft />} onClick={() => navigate('/kreativitas')}>Buat Lagi</Button>
            <Button colorScheme="purple" variant="outline" onClick={() => navigate('/kreativitas/publik')}>Ke Galeri</Button>
        </HStack>

        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" overflow="hidden" boxShadow="md">
          <Box bg="black" display="flex" justifyContent="center" maxH="600px">
            <Image src={image.image_url} alt={image.prompt} maxH="600px" objectFit="contain" />
          </Box>

          <Box p={6}>
            <Text fontWeight="bold" mb={2}>Prompt:</Text>
            <Text fontSize="md" color="gray.700" _dark={{ color: "gray.300" }} mb={6} fontStyle="italic">"{image.prompt}"</Text>

            <Flex justify="space-between" align="center" p={4} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="lg" mb={6}>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="public-switch" mb="0" fontSize="sm" color={tier === 'VIP' ? 'gray.700' : 'gray.400'}>
                        Tampilkan di Publik
                    </FormLabel>
                    <Switch
                        id="public-switch"
                        isChecked={tier === 'VIP' ? image.is_public : true}
                        onChange={handleVisibilityToggle}
                        isDisabled={tier !== 'VIP' || isUpdating || user?.id !== image.user_id}
                        colorScheme="purple"
                    />
                </FormControl>
                {tier !== 'VIP' && <Badge colorScheme="red" fontSize="xs">Hanya VIP (Bisa Privasi)</Badge>}
            </Flex>

            <HStack spacing={4}>
               <Button flex={1} leftIcon={<FaDownload />} variant="outline" onClick={() => alert("PC/Desktop: Klik kanan -> Simpan Gambar\nAndroid/iOS: Tekan Lama -> Download")}>
                   Simpan
               </Button>
               {image.is_public && (
                   <Button flex={1} leftIcon={<FaShare />} colorScheme="brand" onClick={() => {
                       navigator.clipboard.writeText(`${window.location.origin}/kreativitas/publik/${id}`);
                       toast({ title: 'Tersalin', status: 'info' });
                   }}>
                       Share Link
                   </Button>
               )}
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateDetail;
