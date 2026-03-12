import React, { useState, useEffect, useRef } from "react";
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

  const audioRef = useRef(null);
  const ayahRefs = useRef([]);
  const toast = useToast();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const activeAyahBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const bottomNavBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(15, 23, 42, 0.8)');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
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
  };

  const fetchSurahDetail = async (number) => {
    setDetailLoading(true);
    setSelectedSurah(number);
    window.scrollTo(0, 0);
    try {
      const res = await axios.get(`https://api.quran.gading.dev/surah/${number}`);
      const data = res.data.data;
      setSurahDetail(data);
      setRangeStart(1);
      setRangeEnd(data.numberOfVerses);
      setCurrentAyahIndex(-1);
      setIsPlaying(false);
      setShowTafsir({});

      // Try to load progress
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

  const scrollToAyah = (index) => {
    setTimeout(() => {
      ayahRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const toggleTafsir = (index) => {
    setShowTafsir(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredSurahs = surahs.filter(s =>
    s.name.transliteration.id.toLowerCase().includes(search.toLowerCase()) ||
    s.number.toString().includes(search)
  );

  return (
    <>
      <SEO
        title={surahDetail ? `Surah ${surahDetail.name.transliteration.id} - Al-Quran Digital` : "Al-Quran Digital Ngawonggo"}
        description={surahDetail ? `Baca Surah ${surahDetail.name.transliteration.id} lengkap dengan terjemahan dan audio murottal.` : "Baca Al-Quran Digital lengkap dengan terjemahan Bahasa Indonesia, audio per ayat, dan tafsir. Fasilitas keagamaan untuk warga Desa Ngawonggo."}
      />

      <Box pt={{ base: "100px", md: "140px" }} minH="100vh" bg={bg} pb={selectedSurah ? 40 : 20}>
        <Container maxW="container.xl">
          <AnimatePresence mode="wait">
            {!selectedSurah ? (
              <MotionBox
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VStack spacing={8} align="stretch">
                  <VStack spacing={4} textAlign="center" mb={6}>
                    <Flex align="center" gap={3}>
                      <Icon as={FaQuran} color="brand.500" w={8} h={8} />
                      <Badge colorScheme="brand" borderRadius="full" px={4} py={1} fontWeight="900" letterSpacing="widest">
                        KITAB SUCI DIGITAL
                      </Badge>
                    </Flex>
                    <Heading size="3xl" fontWeight="900" bgGradient="linear(to-r, brand.500, brand.800)" bgClip="text">
                      Al-Qur'anul Karim
                    </Heading>
                    <Text color="gray.500" fontSize="xl" fontWeight="500" maxW="2xl">
                      Baca dan tadabburi Al-Qur'an di mana saja dengan fitur murottal dan terjemahan bahasa Indonesia yang jelas.
                    </Text>
                  </VStack>

                  <InputGroup size="xl" maxW="2xl" mx="auto">
                    <InputLeftElement pointerEvents="none" h="full" px={6}>
                      <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Cari Surah (contoh: Al-Baqarah atau 2)..."
                      bg={cardBg}
                      borderRadius="2xl"
                      py={8}
                      pl={16}
                      fontSize="lg"
                      boxShadow="soft"
                      border="1px solid"
                      borderColor={borderColor}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #137fec' }}
                    />
                  </InputGroup>

                  {loading ? (
                    <Center py={20}>
                      <Loading />
                    </Center>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredSurahs.map((surah) => (
                        <MotionBox
                          key={surah.number}
                          whileHover={{ y: -8, scale: 1.02 }}
                          layerStyle="glassCard"
                          p={6}
                          cursor="pointer"
                          onClick={() => fetchSurahDetail(surah.number)}
                        >
                          <HStack spacing={6}>
                            <Flex
                              w={16}
                              h={16}
                              bg="brand.50"
                              color="brand.500"
                              borderRadius="2xl"
                              align="center"
                              justify="center"
                              fontWeight="900"
                              fontSize="2xl"
                              flexShrink={0}
                              boxShadow="inner"
                            >
                              {surah.number}
                            </Flex>
                            <VStack align="start" spacing={0} flex={1}>
                              <Heading size="md" fontWeight="800">{surah.name.transliteration.id}</Heading>
                              <Text fontSize="sm" color="gray.500" fontWeight="600">
                                {surah.revelation.id} • {surah.numberOfVerses} Ayat
                              </Text>
                            </VStack>
                            <Text
                              fontSize="3xl"
                              fontFamily="'Amiri', serif"
                              color="brand.600"
                              fontWeight="bold"
                            >
                              {surah.name.short}
                            </Text>
                          </HStack>
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
                transition={{ duration: 0.5 }}
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
                      {/* Header Surah */}
                      <MotionBox
                        p={{ base: 8, md: 12 }}
                        bgGradient="linear(to-br, brand.600, brand.800)"
                        borderRadius="4xl"
                        color="white"
                        textAlign="center"
                        boxShadow="2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <VStack spacing={6}>
                          <Text fontSize="lg" fontWeight="800" letterSpacing="0.2em" opacity={0.9}>
                            SURAH {surahDetail.name.transliteration.id.toUpperCase()}
                          </Text>
                          <Heading size="4xl" fontFamily="'Amiri', serif" fontWeight="normal">
                            {surahDetail.name.short}
                          </Heading>
                          <Divider borderColor="whiteAlpha.300" maxW="200px" />
                          <VStack spacing={1}>
                            <Text fontSize="xl" fontWeight="700">"{surahDetail.name.translation.id}"</Text>
                            <Text fontSize="md" fontWeight="500" opacity={0.8}>
                                {surahDetail.revelation.id} • {surahDetail.numberOfVerses} Ayat
                            </Text>
                          </VStack>
                        </VStack>
                      </MotionBox>

                      {/* Bismillah if not Al-Fatiha and At-Tawbah */}
                      {surahDetail.preBismillah && (
                          <Center py={10}>
                              <Text fontSize="4xl" fontFamily="'Amiri', serif" textAlign="center" color="gray.700">
                                  {surahDetail.preBismillah.text.arab}
                              </Text>
                          </Center>
                      )}

                      {/* List Ayat */}
                      <VStack spacing={4} align="stretch">
                        {surahDetail.verses.map((ayah, index) => (
                          <MotionBox
                            key={ayah.number.inQuran}
                            ref={el => ayahRefs.current[index] = el}
                            p={{ base: 6, md: 10 }}
                            bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor={currentAyahIndex === index ? 'brand.200' : borderColor}
                            transition="all 0.4s"
                            boxShadow={currentAyahIndex === index ? 'medium' : 'soft'}
                            position="relative"
                            overflow="hidden"
                          >
                            {currentAyahIndex === index && (
                                <Box
                                    position="absolute"
                                    left={0}
                                    top={0}
                                    bottom={0}
                                    w="4px"
                                    bg="brand.500"
                                />
                            )}

                            <VStack align="stretch" spacing={8}>
                              <Flex justify="space-between" align="center">
                                <Flex
                                    w={12} h={12} bg="brand.500" color="white"
                                    borderRadius="2xl" align="center" justify="center"
                                    fontWeight="900" fontSize="lg" boxShadow="lg"
                                >
                                  {ayah.number.inSurah}
                                </Flex>
                                <HStack spacing={3}>
                                  <IconButton
                                    size="lg"
                                    icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                                    onClick={() => playAudio(index, 'single')}
                                    variant={currentAyahIndex === index ? "solid" : "ghost"}
                                    colorScheme="brand"
                                    borderRadius="2xl"
                                    aria-label="Play Ayah"
                                  />
                                  <IconButton
                                    size="lg"
                                    icon={<FaList />}
                                    onClick={() => toggleTafsir(index)}
                                    variant="ghost"
                                    colorScheme="orange"
                                    borderRadius="2xl"
                                    aria-label="Tafsir"
                                  />
                                </HStack>
                              </Flex>

                              <Text
                                fontSize="3xl"
                                textAlign="right"
                                fontFamily="'Amiri', serif"
                                lineHeight="2.5"
                                dir="rtl"
                                color="gray.800"
                                fontWeight="normal"
                              >
                                {ayah.text.arab}
                              </Text>

                              <VStack align="start" spacing={4} borderLeft="2px solid" borderColor="brand.50" pl={6}>
                                <Text color="brand.600" fontSize="sm" fontWeight="800" letterSpacing="wide">
                                  {ayah.text.transliteration.en}
                                </Text>
                                <Text fontSize="lg" color={translationColor} fontWeight="600" lineHeight="1.8">
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
                                      <HStack mb={4} spacing={2}>
                                        <Badge colorScheme="orange" variant="solid" borderRadius="md">TAFSIR RINGKAS</Badge>
                                      </HStack>
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
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              position="fixed"
              bottom={{ base: 4, md: 8 }}
              left="50%"
              transform="translateX(-50%)"
              zIndex={100}
              w="full"
              maxW="container.lg"
              px={4}
            >
              <Box
                layerStyle="liquidGlass"
                borderRadius="3xl"
                p={{ base: 4, md: 6 }}
                boxShadow="0 20px 50px rgba(0,0,0,0.15)"
              >
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                  justify="space-between"
                  gap={{ base: 4, md: 8 }}
                >
                  <HStack spacing={6} w={{ base: 'full', md: 'auto' }} justify="space-between">
                    <HStack spacing={3} cursor="pointer" onClick={() => setIsAutoScroll(!isAutoScroll)}>
                        <Checkbox
                            isChecked={isAutoScroll}
                            onChange={(e) => setIsAutoScroll(e.target.checked)}
                            colorScheme="brand"
                            size="lg"
                        />
                        <Text fontSize="xs" fontWeight="900" color="gray.600" letterSpacing="tighter">AUTO SCROLL</Text>
                    </HStack>

                    <Divider orientation="vertical" h="40px" display={{ base: 'none', md: 'block' }} />

                    <VStack align="start" spacing={1}>
                        <Text fontSize="10px" fontWeight="900" color="gray.400" letterSpacing="widest">RENTANG AYAT</Text>
                        <HStack spacing={2}>
                            <Select
                                size="sm"
                                w="80px"
                                variant="filled"
                                borderRadius="xl"
                                value={rangeStart}
                                onChange={(e) => setRangeStart(parseInt(e.target.value))}
                                bg="whiteAlpha.500"
                            >
                                {surahDetail.verses.map(v => (
                                    <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                                ))}
                            </Select>
                            <Text fontSize="xs" fontWeight="bold">S/D</Text>
                            <Select
                                size="sm"
                                w="80px"
                                variant="filled"
                                borderRadius="xl"
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

                  <Flex flex={1} justify="center" align="center">
                    <HStack spacing={4} bg="brand.500" p={2} pr={8} pl={2} borderRadius="full" color="white" boxShadow="xl">
                        <IconButton
                            icon={isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? <FaPause /> : <FaPlay />}
                            bg="white"
                            color="brand.500"
                            _hover={{ bg: 'gray.100' }}
                            borderRadius="full"
                            size="lg"
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
                            <Text fontSize="xs" fontWeight="900" color="whiteAlpha.800" letterSpacing="wider">
                                {isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? 'SEDANG DIPUTAR' : 'PUTAR RENTANG'}
                            </Text>
                            <Heading size="xs" color="white">
                                Ayat {rangeStart} - {rangeEnd}
                            </Heading>
                        </VStack>
                    </HStack>
                  </Flex>

                  <HStack spacing={4} w={{ base: 'full', md: 'auto' }} justify="center">
                    <IconButton
                        icon={<FaArrowUp />}
                        size="md"
                        colorScheme="brand"
                        variant="ghost"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Ke Atas"
                        borderRadius="full"
                    />
                  </HStack>
                </Flex>
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
