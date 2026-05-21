import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  useToast,
  Spinner,
  Center,
  Icon,
  useColorModeValue,
  AspectRatio,
  Image,
  FormControl,
} from '@chakra-ui/react';
import { FaLock, FaUnlock, FaArrowLeft, FaCrown } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

const MediaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchMediaData();
    checkUserVipStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMediaData = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_media')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({ title: 'Konten tidak ditemukan atau tidak aktif', status: 'error' });
        navigate('/credits');
        return;
      }
      setMedia(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserVipStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('user_tiers')
        .select('tier_name')
        .eq('user_id', session.user.id)
        .single();

      if (data && data.tier_name !== 'Free' && data.tier_name) {
        setIsVip(true);
        setHasAccess(true);
      }
    } catch (err) {
      console.error('Error checking VIP status', err);
    }
  };

  const handleVerifyCode = () => {
    setVerifying(true);
    if (!media.access_code) {
      toast({ title: 'Konten ini tidak memiliki kode akses (Khusus VIP)', status: 'error' });
      setVerifying(false);
      return;
    }

    if (accessCode.trim() === media.access_code) {
      setHasAccess(true);
      toast({ title: 'Akses Diberikan', status: 'success' });
    } else {
      toast({ title: 'Kode Akses Salah', status: 'error' });
    }
    setVerifying(false);
  };

  if (loading) {
    return (
      <Center minH="80vh" bg={bgColor}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!media) return null;

  return (
    <Box bg={bgColor} minH="100vh" pt={28} pb={20}>
      <SEO title={`${media.title} | Media Eksklusif Pengembang`} />
      <Container maxW="container.lg">
        <Button leftIcon={<FaArrowLeft />} variant="ghost" mb={6} onClick={() => navigate('/credits')}>
          Kembali ke Credits
        </Button>

        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>{media.title}</Heading>
            {media.description && (
              <Text fontSize="lg" color="gray.500">{media.description}</Text>
            )}
          </Box>

          {!hasAccess ? (
            <Box bg={cardBg} p={10} borderRadius="3xl" boxShadow="xl" textAlign="center" position="relative" overflow="hidden">
              <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient="linear(to-r, gold, yellow.400)" />
              <Icon as={FaLock} boxSize={16} color="gold" mb={6} />
              <Heading size="lg" mb={4}>Konten Eksklusif</Heading>
              <Text color="gray.500" mb={8} maxW="lg" mx="auto">
                Konten ini dikhususkan bagi pengguna VIP atau yang memiliki Kode Akses spesial dari pengembang.
              </Text>

              <VStack spacing={6} maxW="md" mx="auto">
                <Button
                  colorScheme="yellow"
                  size="lg"
                  w="full"
                  leftIcon={<FaCrown />}
                  onClick={() => navigate('/portal/gacha')}
                >
                  Dapatkan VIP Card (Gacha)
                </Button>

                <Text fontWeight="bold" color="gray.400">ATAU</Text>

                <FormControl>
                  <HStack>
                    <Input
                      placeholder="Masukkan Kode Akses"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      size="lg"
                    />
                    <Button
                      colorScheme="brand"
                      size="lg"
                      onClick={handleVerifyCode}
                      isLoading={verifying}
                    >
                      Buka
                    </Button>
                  </HStack>
                </FormControl>
              </VStack>
            </Box>
          ) : (
            <Box bg={cardBg} borderRadius="3xl" boxShadow="2xl" overflow="hidden">
              <HStack bg="brand.500" color="white" p={4} justify="center">
                <Icon as={FaUnlock} />
                <Text fontWeight="bold">Akses Terbuka {isVip ? '(VIP Member)' : '(Via Kode)'}</Text>
              </HStack>

              <Box p={{ base: 4, md: 8 }}>
                {media.media_type === 'video' && (
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={media.media_url}
                      title={media.title}
                      allowFullScreen
                      style={{ border: 0, borderRadius: '1rem' }}
                    />
                  </AspectRatio>
                )}

                {media.media_type === 'image' && (
                  <Image
                    src={media.media_url}
                    alt={media.title}
                    w="full"
                    borderRadius="xl"
                    boxShadow="lg"
                  />
                )}

                {media.media_type === 'text' && (
                  <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" whiteSpace="pre-wrap">
                    <Text fontSize="lg" lineHeight="tall">{media.content_text}</Text>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MediaDetail;
