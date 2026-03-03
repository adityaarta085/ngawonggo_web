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
  Progress as ChakraProgress,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  FaPlay,
  FaPause,
  FaBookOpen,
  FaList,
  FaDownload,
  FaArrowUp,
  FaHistory,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

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
  const [user, setUser] = useState(null);
  const [lastRead, setLastRead] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const audioRef = useRef(null);
  const ayahRefs = useRef([]);
  const toast = useToast();
  const lastSavedProgress = useRef({ surah: null, ayah: null });

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(15, 23, 42, 0.8)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const activeAyahBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const translationColor = useColorModeValue('gray.600', 'gray.400');
  const tafsirBg = useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)');
  const bottomNavBg = useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(15, 23, 42, 0.98)');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  const fetchLastRead = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('user_quran_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data && !error) {
      setLastRead(data);
    }
  }, []);

  const saveProgressToDB = useCallback(async (surah, ayah) => {
    if (!user) return;
    try {
        await supabase
          .from('user_quran_progress')
          .upsert({
            user_id: user.id,
            surah_number: surah,
            ayah_number: ayah,
            updated_at: new Date()
          }, { onConflict: 'user_id' });
    } catch (e) {
        console.error("Failed to sync progress", e);
    }
  }, [user]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchLastRead(user.id);
      }
    });

    return () => {
        // Sync progress on unmount if needed
        if (lastSavedProgress.current.surah && lastSavedProgress.current.ayah) {
            saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
        }
    };
  }, [fetchLastRead, saveProgressToDB]);

  const saveProgress = (surah, ayah) => {
    if (!user) return;
    // Update local state immediately for UI responsiveness
    setLastRead({ surah_number: surah, ayah_number: ayah });
    // Keep track for later sync
    lastSavedProgress.current = { surah, ayah };
  };

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


  const fetchSurahDetail = async (number, initialAyah = -1) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${number}`);
      const data = await response.json();
      setSurahDetail(data.data);
      setSelectedSurah(number);
      setRangeStart(1);
      setRangeEnd(data.data.numberOfVerses);

      if (initialAyah !== -1) {
          setCurrentAyahIndex(initialAyah - 1);
      } else {
          setCurrentAyahIndex(-1);
      }

      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      if (initialAyah === -1) window.scrollTo(0, 0);
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
      // Sync on pause
      if (lastSavedProgress.current.surah) {
          saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
      }
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

    // Update local progress (non-blocking)
    saveProgress(selectedSurah, index + 1);
  };

  const handleAudioEnd = () => {
    if (playbackMode === 'single') {
      setIsPlaying(false);
      // Sync on stop
      if (lastSavedProgress.current.surah) {
          saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
      }
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
        // Sync on end of range/surah
        if (lastSavedProgress.current.surah) {
            saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
        }
      }
    }
  };

  const toggleTafsir = (index) => {
    setShowTafsir((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const downloadVerse = (index) => {
    const url = surahDetail.verses[index].audio.primary;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${surahDetail.name.transliteration.id}_Ayah_${index + 1}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFullSurah = async () => {
    if (!surahDetail) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    toast({
      title: 'Mempersiapkan Unduhan',
      description: 'Seluruh ayat sedang disiapkan untuk diunduh secara berurutan.',
      status: 'info',
      duration: 3000,
    });

    try {
        const total = surahDetail.verses.length;
        for (let i = 0; i < total; i++) {
            const url = surahDetail.verses[i].audio.primary;
            const fileName = `${surahDetail.name.transliteration.id}_Ayat_${i+1}.mp3`;

            // Simple approach: Trigger sequential downloads
            // Note: Modern browsers might block many simultaneous downloads, so we do it one by one
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);

            setDownloadProgress(Math.round(((i + 1) / total) * 100));
            // Small delay to prevent browser overload
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        toast({
          title: 'Unduhan Selesai',
          description: `Seluruh ${total} ayat telah berhasil diunduh.`,
          status: 'success',
          duration: 5000,
        });
    } catch (error) {
        console.error("Download failed", error);
        toast({
          title: 'Gagal mengunduh',
          description: 'Terjadi kesalahan saat mengunduh seluruh surah.',
          status: 'error',
          duration: 3000,
        });
    } finally {
        setIsDownloading(false);
    }
  };

  if (loading) return <Loading fullPage />;

  return (
    <Box pb={selectedSurah ? "140px" : 0} minH="100vh" bg={pageBg}>
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

            {/* Last Read Progress Card */}
            {user && lastRead && (
                <Box
                    p={5}
                    borderRadius="2xl"
                    bgGradient="linear(to-r, brand.500, brand.600)"
                    color="white"
                    boxShadow="xl"
                    cursor="pointer"
                    onClick={() => fetchSurahDetail(lastRead.surah_number, lastRead.ayah_number)}
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
                >
                    <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                            <HStack>
                                <Icon as={FaHistory} />
                                <Text fontSize="xs" fontWeight="bold">LANJUTKAN MEMBACA</Text>
                            </HStack>
                            <Heading size="md" mt={1}>Surah {surahs.find(s => s.number === lastRead.surah_number)?.name.transliteration.id}</Heading>
                            <Text fontSize="sm" opacity={0.9}>Ayat Terakhir: {lastRead.ayah_number}</Text>
                        </VStack>
                        <Icon as={FaBookOpen} fontSize="4xl" opacity={0.3} />
                    </HStack>
                </Box>
            )}

            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Cari surah (contoh: Al-Fatihah)"
                bg={glassBg}
                borderRadius="2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                border="none"
                _focus={{ boxShadow: '0 0 0 2px #137fec' }}
              />
            </InputGroup>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {surahs
                .filter((s) =>
                  s.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((surah) => (
                  <MotionBox
                    key={surah.number}
                    p={5}
                    bg={cardBg}
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor={borderColor}
                    cursor="pointer"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => fetchSurahDetail(surah.number)}
                  >
                    <HStack justify="space-between">
                      <HStack spacing={4}>
                        <Box
                          w="45px"
                          h="45px"
                          bg="brand.500"
                          color="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="xl"
                          fontSize="lg"
                          fontWeight="bold"
                          transform="rotate(45deg)"
                        >
                          <Text transform="rotate(-45deg)">{surah.number}</Text>
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Heading size="sm">{surah.name.transliteration.id}</Heading>
                          <Text fontSize="xs" color="gray.500">
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
                    </HStack>
                  </MotionBox>
                ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <Box>
            <Flex align="center" justify="space-between" mb={6}>
              <IconButton
                icon={<ChevronLeftIcon w={8} h={8} />}
                onClick={() => {
                    setSelectedSurah(null);
                    setSurahDetail(null);
                    // Sync on back
                    if (lastSavedProgress.current.surah) {
                        saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
                    }
                }}
                variant="ghost"
                borderRadius="full"
                aria-label="Kembali"
              />
              {surahDetail && (
                <VStack spacing={0}>
                  <Heading size="lg">{surahDetail.name.transliteration.id}</Heading>
                  <Text color="gray.500" fontSize="sm">
                    {surahDetail.name.translation.id} • {surahDetail.revelation.id}
                  </Text>
                </VStack>
              )}
              <Box w="40px" />
            </Flex>

            {detailLoading ? (
              <Loading />
            ) : (
              <VStack spacing={8} align="stretch" pb={10}>
                {surahDetail?.preBismillah && (
                  <Box textAlign="center" py={8}>
                    <Text fontSize="4xl" fontFamily="'Amiri', serif">
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
          boxShadow="0 -4px 30px rgba(0,0,0,0.2)"
          zIndex={100}
          borderTopRadius="3xl"
          p={{ base: 3, md: 4 }}
          layerStyle="glass"
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <Container maxW="container.lg">
            <VStack spacing={3} align="stretch">
              {isDownloading && (
                  <VStack spacing={1} align="stretch">
                      <Flex justify="space-between" align="center">
                          <Text fontSize="10px" fontWeight="bold" color="brand.500">MENGUNDUH SURAH...</Text>
                          <Text fontSize="10px" fontWeight="bold">{downloadProgress}%</Text>
                      </Flex>
                      <ChakraProgress value={downloadProgress} size="xs" colorScheme="brand" borderRadius="full" />
                  </VStack>
              )}

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
                                  if (lastSavedProgress.current.surah) {
                                      saveProgressToDB(lastSavedProgress.current.surah, lastSavedProgress.current.ayah);
                                  }
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
                      <MenuButton
                        as={Button}
                        size="sm"
                        leftIcon={<FaDownload />}
                        variant="outline"
                        colorScheme="brand"
                        rightIcon={<ChevronDownIcon />}
                        isLoading={isDownloading}
                      >
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
            </VStack>
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
