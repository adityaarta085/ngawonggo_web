import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
  Flex,
  Badge,
  useColorModeValue,
  IconButton,
  Button,
  Divider,
  Select,
  Checkbox,
  useToast,
  Center,
  Switch,
} from '@chakra-ui/react';
import { FaSearch, FaQuran, FaPlay, FaPause, FaArrowUp, FaList, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loading, SEO } from '../../components';
import { supabase } from '../../lib/supabase';

const MotionBox = motion(Box);

const QuranPage = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahDetail, setSurahDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [playbackMode, setPlaybackMode] = useState('single'); // single, range, full
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showTafsir, setShowTafsir] = useState({});
  const [user, setUser] = useState(null);

  const [visibleLimit, setVisibleLimit] = useState(20);

  const audioRef = useRef(null);
  const ayahRefs = useRef([]);
  const toast = useToast();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const activeAyahBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');

  const fetchSurahs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://api.quran.gading.dev/surah');
      setSurahs(res.data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      toast({
        title: "Gagal memuat daftar surah",
        description: "Pastikan koneksi internet Anda stabil.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    fetchSurahs();
  }, [fetchSurahs]);

  const scrollToAyah = useCallback((index) => {
    if (index >= visibleLimit) {
        setVisibleLimit(index + 10);
    }
    setTimeout(() => {
      ayahRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }, [visibleLimit]);

  const fetchSurahDetail = async (number) => {
    setDetailLoading(true);
    setSelectedSurah(number);
    window.scrollTo(0, 0);
    setVisibleLimit(20);
    try {
      const res = await axios.get(`https://api.quran.gading.dev/surah/${number}`);
      const data = res.data.data;
      setSurahDetail(data);
      setRangeStart(1);
      setRangeEnd(data.numberOfVerses);
      setCurrentAyahIndex(-1);
      setIsPlaying(false);
      setShowTafsir({});

      if (user) {
        const { data: progressData } = await supabase
          .from('user_quran_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('surah_number', number)
          .single();

        if (progressData) {
           toast({
               title: "Lanjutkan membaca?",
               description: `Terakhir dibaca: Ayat ${progressData.ayah_number}`,
               status: "info",
               duration: 5000,
               isClosable: true,
               position: "top",
               action: (
                   <Button size="sm" onClick={() => scrollToAyah(progressData.ayah_number - 1)}>
                       Lanjut
                   </Button>
               )
           });
        }
      }
    } catch (error) {
      console.error('Error fetching surah detail:', error);
      toast({
        title: "Gagal memuat surah",
        description: "Terjadi kesalahan saat mengambil data ayat.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSelectedSurah(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const saveProgress = async (ayahNumber) => {
    if (!user || !selectedSurah) return;
    try {
        await supabase.from('user_quran_progress').upsert({
          user_id: user.id,
          surah_number: selectedSurah,
          ayah_number: ayahNumber,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    } catch (error) {
        console.error('Error saving progress:', error);
    }
  };

  const playAudio = (index, mode = 'single') => {
    if (!surahDetail) return;
    setPlaybackMode(mode);
    setCurrentAyahIndex(index);
    const audioUrl = surahDetail.verses[index].audio.primary;
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
        setIsPlaying(true);
        if (isAutoScroll) scrollToAyah(index);
        saveProgress(index + 1);
    }
  };

  const handleAudioEnd = () => {
    if (playbackMode === 'single') {
      setIsPlaying(false);
    } else if (playbackMode === 'range' || playbackMode === 'full') {
      const nextIndex = currentAyahIndex + 1;
      const limit = playbackMode === 'range' ? rangeEnd - 1 : surahDetail.numberOfVerses - 1;

      if (nextIndex <= limit) {
        playAudio(nextIndex, playbackMode);
      } else {
        setIsPlaying(false);
        setPlaybackMode('single');
      }
    }
  };

  const toggleTafsir = (index) => {
    setShowTafsir(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredSurahs = useMemo(() =>
    surahs.filter(s =>
      s.name.transliteration.id.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString().includes(search)
    ), [surahs, search]);

  const visibleVerses = useMemo(() => {
    if (!surahDetail) return [];
    return surahDetail.verses.slice(0, visibleLimit);
  }, [surahDetail, visibleLimit]);

  return (
    <>
      <SEO
        title={surahDetail ? `Surah ${surahDetail.name.transliteration.id} - Al-Quran Digital` : "Al-Quran Digital Ngawonggo"}
        description={surahDetail ? `Baca Al-Quran Surah ${surahDetail.name.transliteration.id} (${surahDetail.name.translation.id}) lengkap dengan audio murottal dan tafsir ringkas.` : "Al-Quran Digital interaktif dengan murottal per ayat, terjemahan Bahasa Indonesia, dan tafsir ringkas."}
      />
      <Box minH="100vh" bg={bg} pb={32}>
        <Container maxW="container.xl" pt={{ base: 4, md: 8 }}>
          <AnimatePresence mode="wait">
            {!selectedSurah ? (
              <MotionBox
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VStack spacing={8} align="stretch">
                  <Box
                    p={{ base: 6, md: 10 }}
                    bgGradient="linear(to-br, brand.500, brand.700)"
                    borderRadius="3xl"
                    color="white"
                    boxShadow="xl"
                    position="relative"
                    overflow="hidden"
                  >
                    <Icon as={FaQuran} position="absolute" right="-20px" bottom="-20px" boxSize="200px" opacity={0.1} />
                    <VStack align="start" spacing={4} position="relative" zIndex={1}>
                      <Badge bg="whiteAlpha.300" color="white" px={3} py={1} borderRadius="full">FITUR DIGITAL</Badge>
                      <Heading size="xl">Al-Quran Digital</Heading>
                      <Text fontSize="md" opacity={0.9} maxW="md">
                        Baca Al-Quran kapan saja dan di mana saja. Dilengkapi dengan murottal per ayat, terjemahan, dan tafsir ringkas.
                      </Text>
                      <InputGroup maxW="md" size="lg">
                        <InputLeftElement pointerEvents="none">
                          <FaSearch color="white" opacity={0.5} />
                        </InputLeftElement>
                        <Input
                          placeholder="Cari Surah atau Nomor..."
                          bg="whiteAlpha.200"
                          border="none"
                          _focus={{ bg: 'whiteAlpha.300', boxShadow: 'none' }}
                          _placeholder={{ color: 'whiteAlpha.600' }}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          borderRadius="2xl"
                        />
                      </InputGroup>
                    </VStack>
                  </Box>

                  {loading ? (
                    <Center py={20}>
                      <Loading />
                    </Center>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredSurahs.map((surah) => (
                        <MotionBox
                          key={surah.number}
                          p={6}
                          bg={cardBg}
                          borderRadius="2xl"
                          border="1px solid"
                          borderColor={borderColor}
                          cursor="pointer"
                          onClick={() => fetchSurahDetail(surah.number)}
                          whileHover={{ y: -5, boxShadow: 'xl', borderColor: 'brand.300' }}
                          transition={{ duration: 0.2 }}
                        >
                          <Flex align="center" justify="space-between">
                            <HStack spacing={4}>
                              <Center
                                w={12} h={12} bg="brand.50" color="brand.500"
                                borderRadius="xl" fontWeight="900" fontSize="lg"
                              >
                                {surah.number}
                              </Center>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="800" fontSize="lg">{surah.name.transliteration.id}</Text>
                                <Text fontSize="xs" color="gray.500" fontWeight="600">
                                  {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                                </Text>
                              </VStack>
                            </HStack>
                            <Text
                              fontSize="2xl"
                              fontFamily="'Amiri', serif"
                              color="brand.600"
                            >
                              {surah.name.short}
                            </Text>
                          </Flex>
                        </MotionBox>
                      ))}
                    </SimpleGrid>
                  )}
                </VStack>
              </MotionBox>
            ) : (
              <MotionBox
                key="detail"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <VStack spacing={8} align="stretch">
                  <HStack justify="space-between">
                    <Button
                      leftIcon={<FaArrowLeft />}
                      variant="ghost"
                      onClick={() => setSelectedSurah(null)}
                      fontWeight="800"
                      _hover={{ bg: 'brand.50', color: 'brand.600' }}
                    >
                      Daftar Surah
                    </Button>
                    {surahDetail && (
                        <Badge colorScheme="brand" p={2} borderRadius="lg" variant="subtle">
                            Juz {surahDetail.verses[0]?.meta.juz}
                        </Badge>
                    )}
                  </HStack>

                  {detailLoading || !surahDetail ? (
                    <Center py={20}>
                      <Loading />
                    </Center>
                  ) : (
                    <VStack spacing={8} align="stretch">
                      <MotionBox
                        p={{ base: 8, md: 12 }}
                        bgGradient="linear(to-br, brand.600, brand.800)"
                        borderRadius="4xl"
                        color="white"
                        textAlign="center"
                        boxShadow="2xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <VStack spacing={6}>
                          <Text fontSize="sm" fontWeight="800" letterSpacing="0.2em" opacity={0.9}>
                            SURAH {surahDetail.name.transliteration.id.toUpperCase()}
                          </Text>
                          <Heading size="3xl" fontFamily="'Amiri', serif" fontWeight="normal">
                            {surahDetail.name.short}
                          </Heading>
                          <Divider borderColor="whiteAlpha.300" maxW="200px" />
                          <VStack spacing={1}>
                            <Text fontSize="lg" fontWeight="700">"{surahDetail.name.translation.id}"</Text>
                            <Text fontSize="sm" fontWeight="500" opacity={0.8}>
                                {surahDetail.revelation.id} • {surahDetail.numberOfVerses} Ayat
                            </Text>
                          </VStack>
                        </VStack>
                      </MotionBox>

                      {surahDetail.preBismillah && (
                          <Center py={6}>
                              <Text fontSize="3xl" fontFamily="'Amiri', serif" textAlign="center" color="gray.700">
                                  {surahDetail.preBismillah.text.arab}
                              </Text>
                          </Center>
                      )}

                      <VStack spacing={4} align="stretch">
                        {visibleVerses.map((ayah, index) => (
                          <MotionBox
                            key={ayah.number.inQuran}
                            ref={el => ayahRefs.current[index] = el}
                            p={{ base: 6, md: 8 }}
                            bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor={currentAyahIndex === index ? 'brand.200' : borderColor}
                            transition="all 0.3s"
                            position="relative"
                            layout
                          >
                            {currentAyahIndex === index && (
                                <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg="brand.500" />
                            )}

                            <VStack align="stretch" spacing={6}>
                              <Flex justify="space-between" align="center">
                                <Flex
                                    w={10} h={10} bg="brand.500" color="white"
                                    borderRadius="xl" align="center" justify="center"
                                    fontWeight="900" fontSize="md"
                                >
                                  {ayah.number.inSurah}
                                </Flex>
                                <HStack spacing={2}>
                                  <IconButton
                                    size="md"
                                    icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                                    onClick={() => playAudio(index, 'single')}
                                    variant={currentAyahIndex === index ? "solid" : "ghost"}
                                    colorScheme="brand"
                                    borderRadius="xl"
                                    aria-label="Play Ayah"
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
                              </Flex>

                              <Text
                                fontSize="2xl"
                                textAlign="right"
                                fontFamily="'Amiri', serif"
                                lineHeight="2.2"
                                dir="rtl"
                                color="gray.800"
                              >
                                {ayah.text.arab}
                              </Text>

                              <VStack align="start" spacing={3} borderLeft="2px solid" borderColor="brand.50" pl={4}>
                                <Text color="brand.600" fontSize="xs" fontWeight="800" letterSpacing="wide">
                                  {ayah.text.transliteration.en}
                                </Text>
                                <Text fontSize="md" color={translationColor} fontWeight="600" lineHeight="1.6">
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
                                    <Box mt={2} p={6} bg={tafsirBg} borderRadius="2xl" border="1px solid" borderColor="orange.100">
                                      <Badge colorScheme="orange" variant="solid" borderRadius="md" mb={2}>TAFSIR</Badge>
                                      <Text fontSize="sm" color="gray.700" lineHeight="1.6" fontWeight="500">
                                        {ayah.tafsir.id.short}
                                      </Text>
                                    </Box>
                                  </MotionBox>
                                )}
                              </AnimatePresence>
                            </VStack>
                          </MotionBox>
                        ))}

                        {surahDetail.verses.length > visibleLimit && (
                            <Button
                                variant="ghost"
                                colorScheme="brand"
                                onClick={() => setVisibleLimit(prev => prev + 20)}
                                py={8}
                                borderRadius="2xl"
                                border="1px dashed"
                                borderColor="brand.200"
                            >
                                Tampilkan Lebih Banyak Ayat...
                            </Button>
                        )}
                      </VStack>
                    </VStack>
                  )}
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Container>

        {/* Floating Player Controls */}
        <AnimatePresence>
          {selectedSurah && !detailLoading && surahDetail && (
            <MotionBox
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              position="fixed"
              bottom={{ base: 4, md: 8 }}
              left="0"
              right="0"
              mx="auto"
              zIndex={100}
              w="full"
              maxW="container.md"
              px={4}
            >
              <Box
                layerStyle="liquidGlass"
                borderRadius={{ base: "2xl", md: "3xl" }}
                p={{ base: 3, md: 5 }}
                boxShadow="0 25px 50px -12px rgba(0,0,0,0.25)"
                border="1px solid"
                borderColor="whiteAlpha.300"
              >
                <VStack spacing={3}>
                    <Flex w="full" justify="space-between" align="center" display={{ base: 'flex', md: 'none' }}>
                         <HStack spacing={2}>
                            <Badge colorScheme="brand" variant="solid" borderRadius="full">AUDIO</Badge>
                            <Text fontSize="xs" fontWeight="800" color="gray.600">Surah {surahDetail.name.transliteration.id}</Text>
                         </HStack>
                         <IconButton
                            icon={<FaArrowUp />}
                            size="xs"
                            variant="ghost"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                         />
                    </Flex>

                    <Flex
                      direction={{ base: 'column', md: 'row' }}
                      align="center"
                      justify="space-between"
                      w="full"
                      gap={{ base: 3, md: 6 }}
                    >
                      <HStack spacing={{ base: 4, md: 6 }} w={{ base: 'full', md: 'auto' }} justify="space-between">
                        <HStack spacing={3} onClick={() => setIsAutoScroll(!isAutoScroll)} cursor="pointer">
                            <Switch
                                isChecked={isAutoScroll}
                                colorScheme="brand"
                                size="sm"
                                pointerEvents="none"
                            />
                            <Text fontSize="9px" fontWeight="900" color="gray.500">AUTO SCROLL</Text>
                        </HStack>

                        <Divider orientation="vertical" h="30px" display={{ base: 'none', md: 'block' }} />

                        <VStack align="start" spacing={0} flex={{ base: 1, md: 'none' }}>
                            <Text fontSize="8px" fontWeight="900" color="gray.400" letterSpacing="widest">RENTANG AYAT</Text>
                            <HStack spacing={1} w="full">
                                <Select
                                    size="xs"
                                    w="60px"
                                    variant="filled"
                                    borderRadius="lg"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(parseInt(e.target.value))}
                                    bg="whiteAlpha.500"
                                >
                                    {surahDetail.verses.map(v => (
                                        <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                                    ))}
                                </Select>
                                <Text fontSize="xs" fontWeight="bold">-</Text>
                                <Select
                                    size="xs"
                                    w="60px"
                                    variant="filled"
                                    borderRadius="lg"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(parseInt(e.target.value))}
                                    bg="whiteAlpha.500"
                                >
                                    {surahDetail.verses.map(v => (
                                        <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                                    ))}
                                </Select>
                            </HStack>
                        </VStack>
                      </HStack>

                      <Flex flex={1} justify="center" align="center" w="full">
                        <HStack spacing={3} bg="brand.500" p={1.5} pr={6} pl={1.5} borderRadius="full" color="white" boxShadow="lg" w={{ base: 'full', md: 'auto' }} justify="center">
                            <IconButton
                                icon={isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? <FaPause /> : <FaPlay />}
                                bg="white"
                                color="brand.500"
                                _hover={{ bg: 'gray.100' }}
                                borderRadius="full"
                                size="md"
                                onClick={() => {
                                    const targetMode = (rangeStart === 1 && rangeEnd === surahDetail.numberOfVerses) ? 'full' : 'range';

                                    if (isPlaying && (playbackMode === 'range' || playbackMode === 'full')) {
                                        audioRef.current?.pause();
                                        setIsPlaying(false);
                                    } else {
                                        if (currentAyahIndex >= rangeStart - 1 && currentAyahIndex < rangeEnd && playbackMode === targetMode) {
                                            audioRef.current?.play();
                                            setIsPlaying(true);
                                        } else {
                                            playAudio(rangeStart - 1, targetMode);
                                        }
                                    }
                                }}
                            />
                            <VStack align="start" spacing={0}>
                                <Text fontSize="8px" fontWeight="900" color="whiteAlpha.800" letterSpacing="wider">
                                    {isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? 'DIPUTAR' : 'PUTAR'}
                                </Text>
                                <Heading size="xs" color="white" fontSize="10px">
                                    Ayat {rangeStart} - {rangeEnd}
                                </Heading>
                            </VStack>
                        </HStack>
                      </Flex>

                      <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <IconButton
                            icon={<FaArrowUp />}
                            size="sm"
                            colorScheme="brand"
                            variant="ghost"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            aria-label="Ke Atas"
                            borderRadius="full"
                        />
                      </HStack>
                    </Flex>
                </VStack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        <audio
          ref={audioRef}
          onEnded={handleAudioEnd}
          style={{ display: 'none' }}
        />
      </Box>
    </>
  );
};

export default QuranPage;
