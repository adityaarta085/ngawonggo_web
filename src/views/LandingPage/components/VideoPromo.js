import { Flex, Box, Container, Heading, Text, VStack, Icon } from '@chakra-ui/react';
import { FaPlayCircle } from 'react-icons/fa';

const VideoPromo = () => {
  return (
    <Box py={24} position="relative" overflow="hidden" bg="gray.50" _dark={{ bg: "gray.900" }}>
      {/* Decorative Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.03}
        _dark={{ opacity: 0.05 }}
        backgroundImage="radial-gradient(circle at 2px 2px, black 1px, transparent 0)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />

      {/* Decorative Blob */}
      <Box position="absolute" top="-150px" left="-150px" w="400px" h="400px" bg="brand.500" opacity={0.05} borderRadius="full" filter="blur(80px)" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={12} align="center">
          <Box textAlign="center" maxW="2xl">
            <Flex align="center" justify="center" gap={3} mb={4}>
              <Icon as={FaPlayCircle} color="brand.500" w={6} h={6} />
              <Text color="brand.500" fontWeight="800" letterSpacing="widest" fontSize="xs" textTransform="uppercase">
                PROFIL DESA
              </Text>
            </Flex>
            <Heading as="h2" size="2xl" fontWeight="900" color="gray.900" _dark={{ color: "white" }} mb={6}>
              Kenal Lebih Dekat
            </Heading>
            <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
              Saksikan sekilas keindahan alam, potensi budaya, dan pesona kearifan lokal yang ada di Desa Ngawonggo.
            </Text>
          </Box>

          <Box
            w="full"
            maxW="1000px"
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            bg="black"
            border="4px solid"
            borderColor="white"
            _dark={{ borderColor: "gray.800" }}
          >
            <Box
              as="iframe"
              src="https://www.youtube.com/embed/Wc7lxuRx0LI"
              width="100%"
              sx={{
                aspectRatio: '16/9',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default VideoPromo;
