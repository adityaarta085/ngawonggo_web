import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  Icon,
  Badge,
  useColorModeValue,
  Center,
  Spinner,
  Button
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlayCircle, FaFileAlt, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

const MotionBox = motion(Box);

const DeveloperMediaPage = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.900', 'black');
  const cardBg = useColorModeValue('whiteAlpha.100', 'whiteAlpha.50');

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const { data } = await supabase
        .from('developer_media')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (data) setMedias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg={bgColor}>
        <Spinner size="xl" color="brand.400" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" pt={28} pb={20} color="white" position="relative" overflow="hidden">
      <SEO title="Media Eksklusif Pengembang | Gen Z Vibes" />

      {/* Background glowing orbs */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="40vw"
        h="40vw"
        bg="brand.500"
        filter="blur(150px)"
        opacity="0.3"
        borderRadius="full"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="40vw"
        h="40vw"
        bg="purple.500"
        filter="blur(150px)"
        opacity="0.3"
        borderRadius="full"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          color="whiteAlpha.800"
          _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          mb={8}
          onClick={() => navigate('/credits')}
        >
          Back to Credits
        </Button>

        <VStack spacing={6} textAlign="center" mb={16}>
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              colorScheme="purple"
              variant="subtle"
              px={4} py={1}
              borderRadius="full"
              mb={4}
              fontSize="sm"
              letterSpacing="widest"
              bg="purple.500"
              color="white"
            >
              VIP LOUNGE
            </Badge>
            <Heading
              size="3xl"
              fontWeight="900"
              bgGradient="linear(to-r, brand.400, purple.400, pink.400)"
              bgClip="text"
              lineHeight="tall"
            >
              Media Eksklusif
            </Heading>
            <Text fontSize="xl" color="whiteAlpha.700" maxW="2xl" mx="auto" mt={4}>
              Unlock the unseen. Behind the scenes, bloopers, & pure chaos.
            </Text>
          </MotionBox>
        </VStack>

        {medias.length === 0 ? (
           <Center py={20}>
             <Text color="whiteAlpha.500">Belum ada media yang diunggah.</Text>
           </Center>
        ) : (
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
              {medias.map((media) => (
                <MotionBox
                  key={media.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    borderWidth="1px"
                    borderColor="whiteAlpha.200"
                    borderRadius="3xl"
                    overflow="hidden"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
                    cursor="pointer"
                    onClick={() => navigate(`/credits/media/${media.id}`)}
                    position="relative"
                    group="true"
                    role="group"
                  >
                    <Box h="250px" bg="gray.800" position="relative" overflow="hidden">
                      {media.media_type === 'image' && media.media_url ? (
                        <Image
                          src={media.media_url}
                          w="full"
                          h="full"
                          objectFit="cover"
                          filter="brightness(0.6) contrast(1.2)"
                          transition="all 0.5s"
                          _groupHover={{ transform: 'scale(1.1)', filter: 'brightness(0.4) contrast(1.2) blur(4px)' }}
                        />
                      ) : (
                        <Center h="full" bgGradient="linear(to-br, gray.800, gray.900)">
                          <Icon as={media.media_type === 'video' ? FaPlayCircle : FaFileAlt} boxSize={20} color="whiteAlpha.200" />
                        </Center>
                      )}

                      {/* Lock overlay */}
                      <Center
                        position="absolute"
                        top={0} left={0} right={0} bottom={0}
                        bg="blackAlpha.400"
                        opacity={0.8}
                        transition="all 0.3s"
                        _groupHover={{ opacity: 1, bg: 'blackAlpha.600' }}
                      >
                        <VStack>
                            <Icon as={FaLock} boxSize={12} color="gold" filter="drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))" />
                            <Text color="gold" fontWeight="bold" mt={2} letterSpacing="widest" opacity={0} transform="translateY(10px)" transition="all 0.3s" _groupHover={{ opacity: 1, transform: 'translateY(0)' }}>
                              UNLOCK
                            </Text>
                        </VStack>
                      </Center>
                    </Box>

                    <VStack p={6} align="start" spacing={3}>
                      <Badge
                        colorScheme={media.media_type === 'video' ? 'pink' : 'cyan'}
                        variant="solid"
                        borderRadius="full"
                        px={3}
                      >
                        {media.media_type.toUpperCase()}
                      </Badge>
                      <Heading size="md" color="white" noOfLines={2} letterSpacing="tight">
                        {media.title}
                      </Heading>
                      <Text color="whiteAlpha.600" fontSize="sm" noOfLines={2}>
                        {media.description}
                      </Text>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        )}
      </Container>
    </Box>
  );
};

export default DeveloperMediaPage;
