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
  Flex,
  Badge,
  Divider,
  useToast,
  Center,
} from '@chakra-ui/react';
import { FaSearch, FaPlay, FaPause, FaBookOpen, FaList, FaQuran } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../../components/Loading';

const MotionBox = motion(Box);

const QuranSection = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [surahDetail, setSurahDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
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
  const activeAyahBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.quran.gading.dev/surah');
      const json = await response.json();
      if (json.code === 200) {
        setSurahs(json.data);
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurahDetail = async (number) => {
    setDetailLoading(true);
    setCurrentAyahIndex(-1);
    setIsPlaying(false);
    setShowTafsir({});
    onOpen();
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${number}`);
      const json = await response.json();
      if (json.code === 200) {
        setSurahDetail(json.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat detail surah',
        status: 'error',
        duration: 3000,
      });
      onClose();
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery)
  );

  const playAudio = (index) => {
    if (!surahDetail) return;
    if (index === currentAyahIndex && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = surahDetail.verses[index].audio.primary;
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      }
    }
  };

  const handleAudioEnd = () => {
    if (currentAyahIndex < surahDetail.verses.length - 1) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      audioRef.current.src = surahDetail.verses[nextIndex].audio.primary;
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
    }
  };

  const toggleTafsir = (index) => {
    setShowTafsir(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box py={24} position="relative" overflow="hidden">
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="brand" px={4} py={1} borderRadius="full" textTransform="uppercase" fontWeight="900" letterSpacing="widest">
              Fasilitas Religi
            </Badge>
            <Heading size="3xl" fontWeight="900" bgGradient="linear(to-r, brand.500, brand.800)" bgClip="text">
                Al-Qur'an Digital
            </Heading>
            <Text fontSize="xl" color="gray.500" maxW="2xl" mx="auto" fontWeight="500">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara modern dan nyaman.
            </Text>
          </VStack>

          <Box maxW="600px" mx="auto" w="full">
            <InputGroup size="xl">
              <InputLeftElement pointerEvents="none" h="full" px={6}>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Cari Surah (contoh: Al-Fatihah atau 18)..."
                bg={glassBg}
                borderRadius="2xl"
                py={8}
                pl={16}
                border="1px solid"
                borderColor={borderColor}
                boxShadow="soft"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #137fec' }}
              />
            </InputGroup>
          </Box>

          {loading ? (
            <Center py={20}>
              <Loading />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              <AnimatePresence>
                {filteredSurahs.map((surah) => (
                  <MotionBox
                    key={surah.number}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    layerStyle="glassCard"
                    p={6}
                    cursor="pointer"
                    onClick={() => fetchSurahDetail(surah.number)}
                  >
                    <HStack spacing={6}>
                      <Flex
                        w={14}
                        h={14}
                        bg="brand.50"
                        color="brand.500"
                        borderRadius="2xl"
                        align="center"
                        justify="center"
                        fontWeight="900"
                        fontSize="xl"
                        flexShrink={0}
                        boxShadow="inner"
                      >
                        {surah.number}
                      </Flex>
                      <VStack align="start" spacing={0} flex={1}>
                        <Heading size="md" fontWeight="800">
                          {surah.name.transliteration.id}
                        </Heading>
                        <Text fontSize="sm" color="gray.500" fontWeight="600">
                          {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                        </Text>
                      </VStack>
                      <Text
                        fontSize="3xl"
                        fontFamily="'Amiri', serif"
                        fontWeight="bold"
                        color="brand.600"
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
        <ModalOverlay backdropFilter="blur(20px)" />
        <ModalContent bg={modalBg}>
          <ModalHeader p={0}>
            <Box
              bgGradient="linear(to-br, brand.600, brand.800)"
              color="white"
              p={{ base: 10, md: 16 }}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box position="absolute" top="-10%" right="-5%" opacity={0.1}>
                <Icon as={FaQuran} w="300px" h="300px" />
              </Box>
              <VStack spacing={4}>
                <Badge colorScheme="whiteAlpha" px={4} py={1} borderRadius="full" variant="outline">
                    {surahDetail?.revelation.id.toUpperCase()}
                </Badge>
                <Heading size="4xl" fontFamily="'Amiri', serif" fontWeight="normal">
                    {surahDetail?.name.short || "..."}
                </Heading>
                <Heading size="lg" fontWeight="800">
                    {surahDetail?.name.transliteration.id}
                </Heading>
                <Text fontSize="lg" opacity={0.9} fontWeight="500">
                  {surahDetail?.name.translation.id} • {surahDetail?.numberOfVerses} Ayat
                </Text>

                {surahDetail && (
                    <Button
                        leftIcon={isPlaying ? <FaPause /> : <FaPlay />}
                        bg="white"
                        color="brand.600"
                        size="lg"
                        px={10}
                        borderRadius="full"
                        onClick={() => playAudio(currentAyahIndex === -1 ? 0 : currentAyahIndex)}
                        boxShadow="xl"
                        _hover={{ transform: 'scale(1.05)', bg: 'gray.100' }}
                    >
                        {isPlaying ? 'Jeda Audio' : 'Putar Murottal'}
                    </Button>
                )}
              </VStack>
            </Box>
          </ModalHeader>
          <ModalCloseButton color="white" size="lg" top={6} right={6} zIndex={10} />
          <ModalBody p={{ base: 4, md: 12 }}>
            <Container maxW="container.lg">
              {detailLoading ? (
                  <Center py={20}>
                      <Loading />
                  </Center>
              ) : (
                <VStack spacing={6} align="stretch">
                    {surahDetail?.preBismillah && (
                      <Box textAlign="center" py={12}>
                        <Text fontSize="4xl" fontFamily="'Amiri', serif" color="gray.800">
                          {surahDetail.preBismillah.text.arab}
                        </Text>
                      </Box>
                    )}

                    {surahDetail?.verses.map((ayah, index) => (
                      <MotionBox
                        key={ayah.number.inSurah}
                        p={{ base: 6, md: 10 }}
                        bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                        borderRadius="3xl"
                        boxShadow={currentAyahIndex === index ? 'medium' : 'soft'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        border="1px solid"
                        borderColor={currentAyahIndex === index ? 'brand.200' : borderColor}
                        position="relative"
                        overflow="hidden"
                      >
                        {currentAyahIndex === index && (
                            <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg="brand.500" />
                        )}

                        <VStack align="stretch" spacing={8}>
                          <HStack justify="space-between">
                            <Flex
                                w={10} h={10} bg="brand.500" color="white"
                                borderRadius="xl" align="center" justify="center"
                                fontWeight="900" fontSize="sm" boxShadow="lg"
                            >
                              {ayah.number.inSurah}
                            </Flex>
                            <HStack spacing={3}>
                              <IconButton
                                size="md"
                                icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                                onClick={() => playAudio(index)}
                                variant={currentAyahIndex === index ? "solid" : "ghost"}
                                colorScheme="brand"
                                borderRadius="xl"
                                aria-label="Play"
                              />
                              <IconButton
                                size="md"
                                icon={<FaList />}
                                onClick={() => toggleTafsir(index)}
                                variant="ghost"
                                colorScheme="orange"
                                borderRadius="xl"
                                aria-label="Tafsir"
                              />
                            </HStack>
                          </HStack>

                          <Text
                            fontSize="3xl"
                            textAlign="right"
                            fontFamily="'Amiri', serif"
                            lineHeight="2.5"
                            dir="rtl"
                            color="gray.800"
                          >
                            {ayah.text.arab}
                          </Text>

                          <VStack align="start" spacing={4} borderLeft="2px solid" borderColor="brand.50" pl={6}>
                            <Text fontWeight="800" color="brand.600" fontSize="sm" letterSpacing="wide">
                              {ayah.text.transliteration.en}
                            </Text>
                            <Text color={translationColor} fontSize="lg" fontWeight="600" lineHeight="1.8">
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
                                <Box mt={4} p={8} bg={tafsirBg} borderRadius="2xl" border="1px solid" borderColor="orange.100">
                                  <Badge colorScheme="orange" variant="solid" mb={4} borderRadius="md">TAFSIR RINGKAS</Badge>
                                  <Text fontSize="md" color="gray.700" lineHeight="1.8" fontWeight="500">
                                    {ayah.tafsir.id.short}
                                  </Text>
                                </Box>
                              </MotionBox>
                            )}
                          </AnimatePresence>
                        </VStack>
                      </MotionBox>
                    ))}
                </VStack>
              )}
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
