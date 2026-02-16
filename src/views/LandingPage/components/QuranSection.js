import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  IconButton,
  Spinner,
  Flex,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaBookOpen, FaList } from 'react-icons/fa';

const MotionBox = motion(Box);

const QuranSection = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [surahDetail, setSurahDetail] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState({});
  const audioRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(15, 23, 42, 0.8)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const modalBg = useColorModeValue('gray.50', 'gray.900');
  const activeAyahBg = useColorModeValue('blue.50', 'blue.900');
  const translationColor = useColorModeValue('gray.700', 'gray.300');
  const tafsirBg = useColorModeValue('orange.50', 'gray.700');
  const accentColor = '#137fec';

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.quran.gading.dev/surah');
      const json = await response.json();
      if (json.code === 200) {
        setSurahs(json.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      setLoading(false);
    }
  };

  const fetchSurahDetail = async (number) => {
    setCurrentAyahIndex(-1);
    setIsPlaying(false);
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${number}`);
      const json = await response.json();
      if (json.code === 200) {
        setSurahDetail(json.data);
        onOpen();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat detail surah',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery)
  );

  const playAudio = (index) => {
    if (index === currentAyahIndex && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = surahDetail.verses[index].audio.primary;
        audioRef.current.play();
      }
    }
  };

  const handleAudioEnd = () => {
    if (currentAyahIndex < surahDetail.verses.length - 1) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      audioRef.current.src = surahDetail.verses[nextIndex].audio.primary;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      if (surahDetail.number < 114) {
          toast({
              title: 'Surah Selesai',
              description: 'Memutar surah berikutnya...',
              status: 'info',
              duration: 2000,
          });
          fetchSurahDetail(surahDetail.number + 1);
      }
    }
  };

  const toggleTafsir = (index) => {
    setShowTafsir(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box py={20} position="relative" overflow="hidden">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Badge colorScheme="brand" mb={4} px={3} py={1} borderRadius="full">
              Fitur Religi
            </Badge>
            <Heading size="2xl" mb={4}>Al-Qur'an Digital</Heading>
            <Text fontSize="xl" color="gray.500" maxW="2xl" mx="auto">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap untuk masyarakat Desa Ngawonggo.
            </Text>
          </Box>

          <Box maxW="600px" mx="auto" w="full">
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Cari Surah (contoh: Al-Fatihah atau 18)..."
                bg={glassBg}
                borderRadius="full"
                border="none"
                boxShadow="xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _focus={{ boxShadow: '0 0 0 2px #137fec' }}
              />
            </InputGroup>
          </Box>

          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <AnimatePresence>
                {filteredSurahs.map((surah) => (
                  <MotionBox
                    key={surah.number}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -5 }}
                    bg={cardBg}
                    p={6}
                    borderRadius="2xl"
                    boxShadow="lg"
                    cursor="pointer"
                    onClick={() => fetchSurahDetail(surah.number)}
                    position="relative"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <HStack spacing={4}>
                      <Flex
                        w="50px"
                        h="50px"
                        bg="brand.50"
                        color="brand.500"
                        borderRadius="xl"
                        align="center"
                        justify="center"
                        fontWeight="bold"
                        fontSize="lg"
                        transform="rotate(45deg)"
                      >
                        <Text transform="rotate(-45deg)">{surah.number}</Text>
                      </Flex>
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {surah.name.transliteration.id}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                        </Text>
                      </VStack>
                      <Text
                        fontSize="2xl"
                        fontFamily="'Amiri', serif"
                        fontWeight="bold"
                        color="brand.500"
                      >
                        {surah.name.short}
                      </Text>
                    </HStack>
                  </MotionBox>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Surah Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={modalBg}>
          <ModalHeader p={0}>
            <Box
              bg={accentColor}
              color="white"
              p={8}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box position="absolute" top="-10%" right="-5%" opacity={0.1}>
                <Icon as={FaBookOpen} w="200px" h="200px" />
              </Box>
              <VStack spacing={2}>
                <Heading size="lg">{surahDetail?.name.transliteration.id}</Heading>
                <Text fontSize="md" opacity={0.9}>
                  {surahDetail?.name.translation.id} • {surahDetail?.revelation.id} • {surahDetail?.numberOfVerses} Ayat
                </Text>
                <Flex gap={4} mt={4}>
                    <Button
                        leftIcon={isPlaying ? <FaPause /> : <FaPlay />}
                        colorScheme="whiteAlpha"
                        variant="solid"
                        borderRadius="full"
                        onClick={() => playAudio(currentAyahIndex === -1 ? 0 : currentAyahIndex)}
                    >
                        {isPlaying ? 'Pause Audio' : 'Putar Audio'}
                    </Button>
                </Flex>
              </VStack>
            </Box>
          </ModalHeader>
          <ModalCloseButton color="white" size="lg" top={4} />
          <ModalBody p={{ base: 4, md: 8 }}>
            <Container maxW="container.lg">
              <VStack spacing={8} align="stretch">
                {surahDetail?.preBismillah && (
                  <Box textAlign="center" py={8}>
                    <Text fontSize="3xl" fontFamily="'Amiri', serif" mb={4}>
                      {surahDetail.preBismillah.text.arab}
                    </Text>
                  </Box>
                )}

                {surahDetail?.verses.map((ayah, index) => (
                  <MotionBox
                    key={ayah.number.inSurah}
                    p={6}
                    bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                    borderRadius="2xl"
                    boxShadow="sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    border="1px solid"
                    borderColor={currentAyahIndex === index ? 'brand.500' : 'transparent'}
                  >
                    <VStack align="stretch" spacing={6}>
                      <HStack justify="space-between">
                        <Badge colorScheme="brand" variant="subtle" borderRadius="md" px={2}>
                          {surahDetail.number}:{ayah.number.inSurah}
                        </Badge>
                        <HStack spacing={2}>
                          <IconButton
                            size="sm"
                            icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                            onClick={() => playAudio(index)}
                            variant="ghost"
                            colorScheme="brand"
                            aria-label="Play"
                          />
                          <IconButton
                            size="sm"
                            icon={<FaList />}
                            onClick={() => toggleTafsir(index)}
                            variant="ghost"
                            colorScheme="orange"
                            aria-label="Tafsir"
                          />
                        </HStack>
                      </HStack>

                      <Text
                        fontSize={{ base: '2xl', md: '3xl' }}
                        textAlign="right"
                        fontFamily="'Amiri', serif"
                        lineHeight="2.5"
                        dir="rtl"
                      >
                        {ayah.text.arab}
                      </Text>

                      <VStack align="start" spacing={2}>
                        <Text fontWeight="medium" color="brand.500" fontSize="sm">
                          {ayah.text.transliteration.en}
                        </Text>
                        <Text color={translationColor}>
                          {ayah.translation.id}
                        </Text>
                      </VStack>

                      <AnimatePresence>
                        {showTafsir[index] && (
                          <MotionBox
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            overflow="hidden"
                          >
                            <Box mt={4} p={4} bg={tafsirBg} borderRadius="xl">
                              <Heading size="xs" mb={2} color="orange.600">Tafsir Ringkas:</Heading>
                              <Text fontSize="sm" fontStyle="italic">
                                {ayah.tafsir.id.short}
                              </Text>
                              <Divider my={3} />
                              <Heading size="xs" mb={2} color="orange.600">Tafsir Lengkap:</Heading>
                              <Text fontSize="sm" whiteSpace="pre-wrap">
                                {ayah.tafsir.id.long}
                              </Text>
                            </Box>
                          </MotionBox>
                        )}
                      </AnimatePresence>
                    </VStack>
                  </MotionBox>
                ))}
              </VStack>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default QuranSection;
