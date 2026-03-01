import { Loading } from "../../components";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Badge,
  IconButton,
  Divider,
  Button,
  useToast,
  Select,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  FaPlay,
  FaPause,
  FaBookOpen,
  FaList,
  FaDownload,
  FaArrowUp,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const QuranPage = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahDetail, setSurahDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState({});
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [playbackMode, setPlaybackMode] = useState('single');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);

  const audioRef = useRef(null);
  const ayahRefs = useRef([]);
  const toast = useToast();

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(15, 23, 42, 0.8)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const activeAyahBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');
  const bottomNavBg = useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(15, 23, 42, 0.98)');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  const fetchSurahs = useCallback(async () => {
    try {
      const response = await fetch('https://api.quran.gading.dev/surah');
      const data = await response.json();
      setSurahs(data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      toast({
        title: 'Gagal memuat data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  useEffect(() => {
    if (isAutoScroll && currentAyahIndex !== -1 && ayahRefs.current[currentAyahIndex]) {
      ayahRefs.current[currentAyahIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyahIndex, isAutoScroll]);


  const fetchSurahDetail = async (number) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${number}`);
      const data = await response.json();
      setSurahDetail(data.data);
      setSelectedSurah(number);
      setRangeStart(1);
      setRangeEnd(data.data.numberOfVerses);
      setCurrentAyahIndex(-1);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error fetching surah detail:', error);
      toast({
        title: 'Gagal memuat detail surah',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const playAudio = (index, mode = 'single') => {
    if (!surahDetail) return;

    if (currentAyahIndex === index && isPlaying && mode === playbackMode) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (currentAyahIndex === index && !isPlaying && mode === playbackMode) {
        audioRef.current.play().catch(e => console.error("Audio resume error:", e));
        setIsPlaying(true);
        return;
    }

    setPlaybackMode(mode);
    setCurrentAyahIndex(index);
    const audioUrl = surahDetail.verses[index].audio.primary;

    if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
    }

    audioRef.current.play().catch(e => console.error("Audio play error:", e));
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    if (playbackMode === 'single') {
      setIsPlaying(false);
    } else {
      const nextIndex = currentAyahIndex + 1;
      const endLimit = playbackMode === 'range' ? rangeEnd - 1 : surahDetail.verses.length - 1;

      if (nextIndex <= endLimit) {
        if (playbackMode === "range" || playbackMode === "full") {
            setRangeStart(nextIndex + 1);
        }
        playAudio(nextIndex, playbackMode);
      } else {
        setIsPlaying(false);
        setCurrentAyahIndex(-1);
      }
    }
  };

  const toggleTafsir = (index) => {
    setShowTafsir((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery)
  );

  const downloadVerse = (index) => {
    if (!surahDetail) return;
    const url = surahDetail.verses[index].audio.primary;
    window.open(url, '_blank');
  };

  const downloadFullSurah = () => {
    if (!surahDetail) return;
    toast({
      title: 'Fitur unduh paket sedang dikembangkan',
      description: 'Silakan unduh ayat per ayat untuk saat ini.',
      status: 'info',
      duration: 3000,
    });
  };

  if (loading) return <Loading fullPage />;

  return (
    <Box pb={selectedSurah ? "120px" : 0} minH="100vh" bg={pageBg}>
      <Container maxW="container.xl" pt={4}>
        {!selectedSurah ? (
          <VStack spacing={6} align="stretch">
            <Box textAlign="center" mb={2}>
              <Badge colorScheme="brand" mb={2} px={3} py={1} borderRadius="full">
                Fitur Religi
              </Badge>
              <Heading size="xl" mb={1}>Al-Qur'an Digital</Heading>
              <Text color="gray.500" fontSize="sm">
                Membaca dan mendengarkan Al-Qur'an secara digital untuk warga Ngawonggo.
              </Text>
            </Box>

            <Box maxW="600px" mx="auto" w="full">
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Cari Surah atau Nomor..."
                  bg={glassBg}
                  borderRadius="full"
                  border="1px solid"
                  borderColor={borderColor}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  _focus={{ boxShadow: '0 0 0 2px #137fec' }}
                />
              </InputGroup>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {filteredSurahs.map((surah) => (
                <MotionBox
                  key={surah.number}
                  whileHover={{ y: -3, boxShadow: 'md' }}
                  bg={cardBg}
                  p={4}
                  borderRadius="xl"
                  boxShadow="sm"
                  cursor="pointer"
                  onClick={() => fetchSurahDetail(surah.number)}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <HStack spacing={3}>
                    <Flex
                      w="36px"
                      h="36px"
                      bg="brand.50"
                      color="brand.500"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {surah.number}
                    </Flex>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="bold" fontSize="md">{surah.name.transliteration.id}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                      </Text>
                    </VStack>
                    <Text fontSize="lg" fontFamily="'Amiri', serif" color="brand.500">
                      {surah.name.short}
                    </Text>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <Box>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              size="sm"
              mb={4}
              onClick={() => {
                  setSelectedSurah(null);
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
              }}
            >
              Kembali
            </Button>

            {detailLoading ? <Loading /> : (
              <VStack spacing={4} align="stretch">
                <Box
                  bg="brand.500"
                  color="white"
                  p={5}
                  borderRadius="xl"
                  textAlign="center"
                  position="relative"
                  overflow="hidden"
                >
                  <Icon
                    as={FaBookOpen}
                    position="absolute"
                    right="-10px"
                    top="-10px"
                    w="120px"
                    h="120px"
                    opacity={0.15}
                  />
                  <Heading size="md">{surahDetail?.name.transliteration.id}</Heading>
                  <Text fontSize="xs" opacity={0.9}>
                    {surahDetail?.name.translation.id} • {surahDetail?.revelation.id} • {surahDetail?.numberOfVerses} Ayat
                  </Text>
                </Box>

                {surahDetail?.preBismillah && (
                  <Box textAlign="center" py={4}>
                    <Text fontSize="2xl" fontFamily="'Amiri', serif">
                      {surahDetail.preBismillah.text.arab}
                    </Text>
                  </Box>
                )}

                <VStack spacing={3} align="stretch">
                  {surahDetail?.verses.map((ayah, index) => (
                    <Box
                      key={ayah.number.inSurah}
                      ref={(el) => (ayahRefs.current[index] = el)}
                      p={4}
                      bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={currentAyahIndex === index ? 'brand.500' : borderColor}
                      transition="all 0.2s"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Badge colorScheme="brand" variant="subtle" borderRadius="full" px={2}>
                            {ayah.number.inSurah}
                          </Badge>
                          <HStack spacing={1}>
                            <IconButton
                              size="xs"
                              icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                              onClick={() => playAudio(index, 'single')}
                              variant="ghost"
                              colorScheme="brand"
                              borderRadius="full"
                              aria-label="Play Ayah"
                            />
                            <IconButton
                              size="xs"
                              icon={<FaList />}
                              onClick={() => toggleTafsir(index)}
                              variant="ghost"
                              colorScheme="orange"
                              borderRadius="full"
                              aria-label="Tafsir"
                            />
                            <IconButton
                              size="xs"
                              icon={<FaDownload />}
                              onClick={() => downloadVerse(index)}
                              variant="ghost"
                              colorScheme="green"
                              borderRadius="full"
                              aria-label="Download Ayah"
                            />
                          </HStack>
                        </HStack>

                        <Text
                          fontSize="2xl"
                          textAlign="right"
                          fontFamily="'Amiri', serif"
                          lineHeight="1.8"
                          dir="rtl"
                        >
                          {ayah.text.arab}
                        </Text>

                        <VStack align="start" spacing={0}>
                          <Text color="brand.500" fontSize="xs" fontWeight="bold">
                            {ayah.text.transliteration.en}
                          </Text>
                          <Text fontSize="sm" color={translationColor}>
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
                              <Box mt={2} p={3} bg={tafsirBg} borderRadius="lg" fontSize="xs">
                                <Text fontWeight="bold" color="orange.700" mb={1}>Tafsir Ringkas:</Text>
                                <Text>{ayah.tafsir.id.short}</Text>
                              </Box>
                            </MotionBox>
                          )}
                        </AnimatePresence>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            )}
          </Box>
        )}
      </Container>

      {/* Improved Bottom Navigation */}
      {selectedSurah && !detailLoading && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg={bottomNavBg}
          boxShadow="0 -4px 20px rgba(0,0,0,0.15)"
          zIndex={100}
          borderTopRadius="3xl"
          p={{ base: 3, md: 4 }}
          layerStyle="glass"
        >
          <Container maxW="container.lg">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="space-between"
              gap={{ base: 2, md: 6 }}
            >
              <HStack spacing={4} w={{ base: 'full', md: 'auto' }} justify="center">
                <VStack spacing={0} cursor="pointer" onClick={() => setIsAutoScroll(!isAutoScroll)}>
                    <Checkbox
                        isChecked={isAutoScroll}
                        onChange={(e) => setIsAutoScroll(e.target.checked)}
                        colorScheme="brand"
                        size="sm"
                    />
                    <Text fontSize="9px" fontWeight="bold" mt={1}>AUTO SCROLL</Text>
                </VStack>

                <Divider orientation="vertical" h="30px" />

                <VStack align="start" spacing={0}>
                    <Text fontSize="9px" fontWeight="bold" color="gray.500">RENTANG AYAT</Text>
                    <HStack spacing={1}>
                        <Select
                            size="xs"
                            w="60px"
                            variant="filled"
                            value={rangeStart}
                            onChange={(e) => setRangeStart(parseInt(e.target.value))}
                        >
                            {surahDetail?.verses.map(v => (
                                <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                            ))}
                        </Select>
                        <Text fontSize="xs">-</Text>
                        <Select
                            size="xs"
                            w="60px"
                            variant="filled"
                            value={rangeEnd}
                            onChange={(e) => setRangeEnd(parseInt(e.target.value))}
                        >
                            {surahDetail?.verses.map(v => (
                                <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                            ))}
                        </Select>
                    </HStack>
                </VStack>
              </HStack>

              <Flex flex={1} justify="center" align="center">
                <HStack spacing={4}>
                    <IconButton
                        icon={isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? <FaPause /> : <FaPlay />}
                        colorScheme="brand"
                        borderRadius="full"
                        size="lg"
                        onClick={() => {
                            const targetMode = (rangeStart === 1 && rangeEnd === surahDetail.numberOfVerses) ? 'full' : 'range';

                            if (isPlaying && (playbackMode === 'range' || playbackMode === 'full')) {
                                audioRef.current.pause();
                                setIsPlaying(false);
                            } else {
                                if (currentAyahIndex >= rangeStart - 1 && currentAyahIndex < rangeEnd && playbackMode === targetMode) {
                                    audioRef.current.play();
                                    setIsPlaying(true);
                                } else {
                                    playAudio(rangeStart - 1, targetMode);
                                }
                            }
                        }}
                    />
                    <VStack align="start" spacing={0}>
                        <Text fontSize="xs" fontWeight="bold" lineHeight="1">
                            {isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? 'MEMUTAR RENTANG' : 'PUTAR RENTANG'}
                        </Text>
                        <Text fontSize="10px" color="gray.500">
                            Ayat {rangeStart} - {rangeEnd}
                        </Text>
                    </VStack>
                </HStack>
              </Flex>

              <HStack spacing={3} w={{ base: 'full', md: 'auto' }} justify="center">
                <Menu>
                    <MenuButton as={Button} size="sm" leftIcon={<FaDownload />} variant="outline" colorScheme="brand" rightIcon={<ChevronDownIcon />}>
                        Unduh
                    </MenuButton>
                    <MenuList fontSize="sm">
                        <MenuItem onClick={() => downloadVerse(currentAyahIndex === -1 ? rangeStart - 1 : currentAyahIndex)}>Unduh Ayat Ini</MenuItem>
                        <MenuItem onClick={downloadFullSurah}>Unduh Seluruh Surah</MenuItem>
                    </MenuList>
                </Menu>
                <IconButton
                    icon={<FaArrowUp />}
                    size="sm"
                    variant="ghost"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Ke Atas"
                />
              </HStack>
            </Flex>
          </Container>
        </Box>
      )}

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default QuranPage;
