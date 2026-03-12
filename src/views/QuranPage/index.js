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
} from '@chakra-ui/react';
import { FaSearch, FaQuran, FaPlay, FaPause, FaArrowUp, FaList } from 'react-icons/fa';
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
  const bottomNavBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(15, 23, 42, 0.9)');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const res = await axios.get('https://api.quran.gading.dev/surah');
      setSurahs(res.data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
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
      setSurahDetail(res.data.data);
      setRangeStart(1);
      setRangeEnd(res.data.data.numberOfVerses);
      setCurrentAyahIndex(-1);
      setIsPlaying(false);
      setShowTafsir({});

      // Try to load progress
      if (user) {
        const { data } = await supabase
          .from('user_quran_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && data.surah_number === number) {
           toast({
               title: "Lanjutkan membaca?",
               description: `Terakhir dibaca: Ayat ${data.ayah_number}`,
               status: "info",
               duration: 5000,
               isClosable: true,
               position: "top",
               action: (
                   <Button size="sm" onClick={() => scrollToAyah(data.ayah_number - 1)}>
                       Lanjut
                   </Button>
               )
           });
        }
      }
    } catch (error) {
      console.error('Error fetching surah detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const saveProgress = async (ayahNumber) => {
    if (!user || !selectedSurah) return;
    await supabase.from('user_quran_progress').upsert({
      user_id: user.id,
      surah_number: selectedSurah,
      ayah_number: ayahNumber,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  };

  const playAudio = (index, mode = 'single') => {
    if (!surahDetail) return;
    setPlaybackMode(mode);
    setCurrentAyahIndex(index);
    const audioUrl = surahDetail.verses[index].audio.primary;
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    if (isAutoScroll) scrollToAyah(index);
    saveProgress(index + 1);
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
    <>      <SEO title={selectedSurah ? `Al-Quran: ${selectedSurah.name.transliteration.id}` : "Al-Quran Digital"} description="Baca Al-Quran Digital lengkap dengan terjemahan Bahasa Indonesia, audio per ayat, dan tafsir. Fasilitas keagamaan untuk warga Desa Ngawonggo." />
    <Box  pt={{ base: "100px", md: "140px" }} minH="100vh" bg={bg} pb={selectedSurah ? 32 : 10}>
      <Container maxW="container.xl" pt={2}>
        <VStack spacing={8} align="stretch">
          {!selectedSurah ? (
            <>
              <VStack spacing={4} textAlign="center" mb={6}>
                <Flex align="center" gap={3}>
                    <Icon as={FaQuran} color="brand.500" w={8} h={8} />
                    <Badge colorScheme="brand" borderRadius="full" px={4} py={1} fontWeight="900" letterSpacing="widest">
                        KITAB SUCI DIGITAL
                    </Badge>
                </Flex>
                <Heading size="3xl" fontWeight="900">Al-Qur'anul Karim</Heading>
                <Text color="gray.500" fontSize="xl" fontWeight="500">Baca dan tadabburi Al-Qur'an di mana saja dengan fitur murottal dan terjemahan bahasa Indonesia.</Text>
              </VStack>

              <InputGroup size="xl" maxW="2xl" mx="auto">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Cari Surah (contoh: Al-Baqarah atau 2)..."
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="soft"
                  border="1px solid"
                  borderColor="gray.100"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #137fec' }}
                />
              </InputGroup>

              {loading ? (
                <Flex justify="center" py={20}>
                  <Loading />
                </Flex>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                  {filteredSurahs.map((surah) => (
                    <MotionBox
                      key={surah.number}
                      whileHover={{ y: -8 }}
                      bg="white"
                      p={8}
                      borderRadius="3xl"
                      boxShadow="soft"
                      cursor="pointer"
                      onClick={() => fetchSurahDetail(surah.number)}
                      border="1px solid"
                      borderColor="gray.50"
                      transition="all 0.3s"
                      _hover={{ borderColor: 'brand.200', boxShadow: 'strong' }}
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
                        >
                          {surah.number}
                        </Flex>
                        <VStack align="start" spacing={1} flex={1}>
                          <Heading size="md" fontWeight="800">{surah.name.transliteration.id}</Heading>
                          <Text fontSize="sm" color="gray.500" fontWeight="600">
                            {surah.revelation.id} • {surah.numberOfVerses} Ayat
                          </Text>
                        </VStack>
                        <Text
                          fontSize="2xl"
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
            </>
          ) : (
            <Box>
              <Button
                leftIcon={<FaArrowUp style={{ transform: 'rotate(-90deg)' }} />}
                variant="ghost"
                mb={8}
                onClick={() => setSelectedSurah(null)}
                fontWeight="800"
              >
                Kembali ke Daftar Surah
              </Button>

              {detailLoading ? (
                <Flex justify="center" py={20}>
                  <Loading />
                </Flex>
              ) : (
                <VStack spacing={10} align="stretch">
                  <Box
                    p={10}
                    bgGradient="linear(to-br, brand.600, brand.800)"
                    borderRadius="3xl"
                    color="white"
                    textAlign="center"
                    boxShadow="xl"
                  >
                    <VStack spacing={4}>
                      <Text fontSize="xl" fontWeight="700" letterSpacing="widest">SURAH {surahDetail.name.transliteration.en}</Text>
                      <Heading size="4xl" fontFamily="'Amiri', serif">{surahDetail.name.short}</Heading>
                      <Text fontSize="lg" fontWeight="500">{surahDetail.name.translation.id} • {surahDetail.revelation.id} • {surahDetail.numberOfVerses} Ayat</Text>
                    </VStack>
                  </Box>

                  <VStack spacing={6} align="stretch">
                    {surahDetail.verses.map((ayah, index) => (
                      <Box
                        key={ayah.number.inQuran}
                        ref={el => ayahRefs.current[index] = el}
                        p={8}
                        bg={currentAyahIndex === index ? activeAyahBg : cardBg}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor={currentAyahIndex === index ? 'brand.200' : borderColor}
                        transition="all 0.3s"
                        boxShadow={currentAyahIndex === index ? 'strong' : 'soft'}
                      >
                        <VStack align="stretch" spacing={6}>
                          <Flex justify="space-between" align="center">
                            <Flex
                                w={10} h={10} bg="brand.500" color="white"
                                borderRadius="full" align="center" justify="center"
                                fontWeight="900" fontSize="sm"
                            >
                              {ayah.number.inSurah}
                            </Flex>
                            <HStack spacing={2}>
                              <IconButton
                                size="md"
                                icon={currentAyahIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
                                onClick={() => playAudio(index, 'single')}
                                variant="ghost"
                                colorScheme="brand"
                                borderRadius="full"
                                aria-label="Play Ayah"
                              />
                              <IconButton
                                size="md"
                                icon={<FaList />}
                                onClick={() => toggleTafsir(index)}
                                variant="ghost"
                                colorScheme="orange"
                                borderRadius="full"
                                aria-label="Tafsir"
                              />
                            </HStack>
                          </Flex>

                          <Text
                            fontSize="2xl"
                            textAlign="right"
                            fontFamily="'Amiri', serif"
                            lineHeight="1.8"
                            dir="rtl"
                            color="gray.800"
                            fontWeight="bold"
                          >
                            {ayah.text.arab}
                          </Text>

                          <VStack align="start" spacing={2}>
                            <Text color="brand.600" fontSize="sm" fontWeight="800">
                              {ayah.text.transliteration.en}
                            </Text>
                            <Text fontSize="md" color={translationColor} fontWeight="500" lineHeight="tall">
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
                                <Box mt={4} p={6} bg={tafsirBg} borderRadius="2xl" border="1px solid" borderColor="orange.100">
                                  <Text fontWeight="900" color="orange.700" mb={3} textTransform="uppercase" fontSize="xs" letterSpacing="widest">
                                    Tafsir Ringkas:
                                  </Text>
                                  <Text fontSize="md" color="gray.700" lineHeight="tall" fontWeight="500">
                                    {ayah.tafsir.id.short}
                                  </Text>
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
        </VStack>
      </Container>

      {/* Control Bar */}
      {selectedSurah && !detailLoading && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg={bottomNavBg}
          boxShadow="0 -10px 40px rgba(0,0,0,0.1)"
          zIndex={100}
          borderTopRadius="4xl"
          p={{ base: 4, md: 6 }}
          backdropFilter="blur(20px)"
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Container maxW="container.lg">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="space-between"
              gap={{ base: 4, md: 8 }}
            >
              <HStack spacing={6} w={{ base: 'full', md: 'auto' }} justify="center">
                <VStack spacing={1} cursor="pointer" onClick={() => setIsAutoScroll(!isAutoScroll)}>
                    <Checkbox
                        isChecked={isAutoScroll}
                        onChange={(e) => setIsAutoScroll(e.target.checked)}
                        colorScheme="brand"
                        size="md"
                    />
                    <Text fontSize="9px" fontWeight="900" color="gray.500">AUTO SCROLL</Text>
                </VStack>

                <Divider orientation="vertical" h="40px" />

                <VStack align="start" spacing={1}>
                    <Text fontSize="9px" fontWeight="900" color="gray.400" letterSpacing="widest">RENTANG AYAT</Text>
                    <HStack spacing={2}>
                        <Select
                            size="sm"
                            w="70px"
                            variant="filled"
                            borderRadius="lg"
                            value={rangeStart}
                            onChange={(e) => setRangeStart(parseInt(e.target.value))}
                        >
                            {surahDetail?.verses.map(v => (
                                <option key={v.number.inSurah} value={v.number.inSurah}>{v.number.inSurah}</option>
                            ))}
                        </Select>
                        <Text fontSize="xs" fontWeight="bold">S/D</Text>
                        <Select
                            size="sm"
                            w="70px"
                            variant="filled"
                            borderRadius="lg"
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
                <HStack spacing={6} bg="brand.50" p={2} pr={6} borderRadius="full" border="1px solid" borderColor="brand.100">
                    <IconButton
                        icon={isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? <FaPause /> : <FaPlay />}
                        colorScheme="brand"
                        borderRadius="full"
                        size="lg"
                        boxShadow="lg"
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
                        <Text fontSize="xs" fontWeight="900" color="brand.700">
                            {isPlaying && (playbackMode === 'range' || playbackMode === 'full') ? 'SEDANG DIPUTAR' : 'PUTAR RENTANG'}
                        </Text>
                        <Text fontSize="10px" color="brand.500" fontWeight="700">
                            Ayat {rangeStart} - {rangeEnd}
                        </Text>
                    </VStack>
                </HStack>
              </Flex>

              <HStack spacing={4} w={{ base: 'full', md: 'auto' }} justify="center">
                <IconButton
                    icon={<FaArrowUp />}
                    size="md"
                    variant="ghost"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Ke Atas"
                    borderRadius="full"
                />
              </HStack>
            </Flex>
          </Container>
        </Box>
      )}

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
