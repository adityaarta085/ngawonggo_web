import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Image,
  Badge,
  Flex,
  Link,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function RadioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = value => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  return (
    <Box minH="100vh" py={10}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, teal.400, blue.500)"
              bgClip="text"
            >
              Radio Gemilang
            </Heading>
            <Badge colorScheme="teal" fontSize="lg" px={4} py={2} borderRadius="full">
              98.6 FM
            </Badge>
          </Box>

          {/* Radio Player Card */}
          <Box
            bg={bgColor}
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            {/* Radio Info Section */}
            <Box
              bgGradient="linear(to-br, teal.400, blue.500)"
              p={8}
              textAlign="center"
              color="white"
            >
              <VStack spacing={4}>
                <Box
                  bg="white"
                  borderRadius="full"
                  p={6}
                  boxShadow="xl"
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="4xl" fontWeight="bold" color="teal.500">
                    📻
                  </Text>
                </Box>
                <Heading size="lg">Radio Gemilang 98.6 FM</Heading>
                <Text fontSize="md" opacity={0.9}>
                  Streaming Langsung dari Magelang
                </Text>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                  {isPlaying ? '🔴 LIVE' : '⚪ OFFLINE'}
                </Badge>
              </VStack>
            </Box>

            {/* Player Controls */}
            <Box p={8}>
              <VStack spacing={6}>
                {/* Play/Pause Button */}
                <HStack spacing={4} justify="center">
                  <IconButton
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={togglePlay}
                    colorScheme="teal"
                    size="lg"
                    borderRadius="full"
                    w="80px"
                    h="80px"
                    fontSize="2xl"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    boxShadow="lg"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.2s"
                  />
                </HStack>

                {/* Volume Control */}
                <Box w="100%" maxW="400px">
                  <HStack spacing={4}>
                    <IconButton
                      icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                      onClick={toggleMute}
                      variant="ghost"
                      colorScheme="teal"
                      aria-label="Toggle Mute"
                    />
                    <Slider
                      value={volume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={100}
                      colorScheme="teal"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb boxSize={6} />
                    </Slider>
                    <Text fontSize="sm" color={textColor} minW="45px">
                      {volume}%
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </Box>

          {/* Information Section */}
          <Box
            bg={bgColor}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="start">
              <Heading size="md" color="teal.500">
                Tentang Radio Gemilang 98.6 FM
              </Heading>
              <Text color={textColor} lineHeight="tall">
                Radio Gemilang 98.6 FM adalah stasiun radio yang melayani
                masyarakat Kabupaten Magelang dengan berbagai program menarik dan
                informasi terkini.
              </Text>
              <Flex gap={2} flexWrap="wrap">
                <Badge colorScheme="blue">Berita</Badge>
                <Badge colorScheme="green">Musik</Badge>
                <Badge colorScheme="purple">Hiburan</Badge>
                <Badge colorScheme="orange">Informasi</Badge>
              </Flex>
              <Box>
                <Text fontWeight="bold" mb={2} color={textColor}>
                  Website Resmi:
                </Text>
                <Link
                  href="https://gemilangfm.id/"
                  isExternal
                  color="teal.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  https://gemilangfm.id/
                </Link>
              </Box>
            </VStack>
          </Box>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src="https://streaming-radio.magelangkab.go.id/studio"
            preload="none"
          />
        </VStack>
      </Container>
    </Box>
  );
}
