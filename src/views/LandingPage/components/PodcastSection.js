import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  VStack,
  HStack,
  Button,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Tooltip,
  Link
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaHeadphones,
  FaYoutube,
  FaVolumeUp,
  FaVolumeMute,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaDownload,
  FaForward,
  FaBackward
} from 'react-icons/fa';
import { RiRadioLine } from 'react-icons/ri';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const podcastEpisodes = [
  {
    id: 1,
    title: "Portal Canggih Desa Ngawonggo Karya Siswa SMK",
    episodeNumber: "Episode 01",
    durationEst: "Audio Podcast",
    tag: "Tech & Arsitektur",
    colorScheme: "amber",
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    glowColor: "rgba(255, 107, 107, 0.4)",
    audioUrl: "https://cpamusheoowbmllxffrt.supabase.co/storage/v1/object/public/upload/Portal_Canggih_Desa_Ngawonggo_Karya_Siswa_SMK.m4a",
    description: "Eksplorasi mendalam bagaimana portal desa digital Ngawonggo dirancang dengan arsitektur modern, sistem pengaduan realtime, hingga integrasi database mandiri oleh siswa SMK.",
  },
  {
    id: 2,
    title: "Anak SMK Selamatkan Identitas Digital Desa Ngawonggo",
    episodeNumber: "Episode 02",
    durationEst: "Audio Podcast",
    tag: "Inspirasi & Story",
    colorScheme: "blue",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    glowColor: "rgba(79, 172, 254, 0.4)",
    audioUrl: "https://cpamusheoowbmllxffrt.supabase.co/storage/v1/object/public/upload/Anak%20SMK%20selamatkan%20identitas%20digital%20Desa%20Ngawonggo.mp3",
    description: "Kisah di balik layar perjuangan 7 talenta muda 10 TJKT A dalam mendobrak batas, mengatasi tantangan koding, dan menghidupkan identitas digital Desa Ngawonggo.",
  }
];

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === Infinity) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const EqualizerBars = ({ isPlaying }) => {
  return (
    <HStack spacing="3px" align="flex-end" h="20px" px={2}>
      {[0.4, 0.8, 0.3, 0.9, 0.6, 1, 0.5, 0.7].map((height, i) => (
        <MotionBox
          key={i}
          w="3px"
          bg="white"
          borderRadius="full"
          animate={
            isPlaying
              ? {
                  height: ['4px', `${Math.max(6, height * 20)}px`, '4px'],
                }
              : { height: '4px' }
          }
          transition={
            isPlaying
              ? {
                  repeat: Infinity,
                  duration: 0.6 + i * 0.1,
                  ease: "easeInOut",
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </HStack>
  );
};

const PodcastSection = () => {
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'video' | 'both'
  const [selectedEpisode, setSelectedEpisode] = useState(podcastEpisodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // All useColorModeValue hooks at top level
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const subHeadingColor = useColorModeValue('gray.500', 'gray.400');
  const switcherBg = useColorModeValue('gray.200', 'gray.800');
  const sliderTrackBg = useColorModeValue('gray.200', 'gray.700');
  const activeEpisodeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const creditsBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedEpisode]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleSelectEpisode = (ep) => {
    if (selectedEpisode.id === ep.id) {
      togglePlay();
      return;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setSelectedEpisode(ep);
    setCurrentTime(0);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const handleSeek = (val) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSkip = (seconds) => {
    if (audioRef.current) {
      const nextTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <Box bg={sectionBg} py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        src={selectedEpisode.audioUrl}
        preload="metadata"
      />

      {/* Ambient background glow */}
      <Box
        position="absolute"
        top="-5%"
        left="10%"
        w="400px"
        h="400px"
        bg="brand.400"
        filter="blur(180px)"
        opacity="0.12"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-5%"
        right="10%"
        w="400px"
        h="400px"
        bg="amber.400"
        filter="blur(180px)"
        opacity="0.1"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Section Header */}
        <VStack spacing={4} textAlign="center" mb={12}>
          <HStack spacing={2}>
            <Badge
              colorScheme="purple"
              variant="solid"
              px={4}
              py={1.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="900"
              letterSpacing="wider"
              display="flex"
              alignItems="center"
              gap={1.5}
            >
              <Icon as={RiRadioLine} boxSize={4} />
              EKSLUSIF PODCAST & VIDEO
            </Badge>
          </HStack>

          <Heading
            as="h2"
            size={{ base: "xl", md: "2xl" }}
            fontWeight="900"
            letterSpacing="tight"
            bgGradient="linear(to-r, brand.600, #d97706, purple.600)"
            bgClip="text"
          >
            Suara Inovasi Desa Ngawonggo
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color={textColor} maxW="2xl" mx="auto" lineHeight="tall">
            Dengarkan perbincangan mendalam dan tonton dokumenter seputar bagaimana siswa <strong>SMK Muhammadiyah Bandongan (10 TJKT A 2026)</strong> membangun ekosistem digital Desa Ngawonggo.
          </Text>

          {/* Mode Switcher Tabs */}
          <HStack
            bg={switcherBg}
            p={1.5}
            borderRadius="full"
            spacing={2}
            mt={2}
            shadow="inner"
          >
            <Button
              size="sm"
              borderRadius="full"
              variant={activeTab === 'audio' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'audio' ? 'brand' : 'gray'}
              leftIcon={<FaHeadphones />}
              onClick={() => setActiveTab('audio')}
              px={5}
              fontWeight="bold"
            >
              Audio Podcast (2 Eps)
            </Button>
            <Button
              size="sm"
              borderRadius="full"
              variant={activeTab === 'video' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'video' ? 'red' : 'gray'}
              leftIcon={<FaYoutube />}
              onClick={() => setActiveTab('video')}
              px={5}
              fontWeight="bold"
            >
              Video YouTube
            </Button>
            <Button
              size="sm"
              borderRadius="full"
              variant={activeTab === 'both' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'both' ? 'purple' : 'gray'}
              onClick={() => setActiveTab('both')}
              px={5}
              fontWeight="bold"
              display={{ base: 'none', md: 'inline-flex' }}
            >
              Tampilkan Semua
            </Button>
          </HStack>
        </VStack>

        <AnimatePresence mode="wait">
          {/* 1. AUDIO PODCAST SECTION */}
          {(activeTab === 'audio' || activeTab === 'both') && (
            <MotionBox
              key="audio-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              mb={activeTab === 'both' ? 16 : 0}
            >
              <Box
                bg={cardBg}
                borderRadius="3xl"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="2xl"
                overflow="hidden"
                p={{ base: 6, md: 8 }}
                position="relative"
              >
                <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: 8, lg: 10 }} alignItems="center">
                  {/* Left: Player Disc / Graphic */}
                  <Box gridColumn={{ base: "span 1", lg: "span 5" }}>
                    <Box
                      p={8}
                      borderRadius="2xl"
                      bgGradient={selectedEpisode.gradient}
                      color="white"
                      position="relative"
                      overflow="hidden"
                      boxShadow={`0 20px 40px ${selectedEpisode.glowColor}`}
                      textAlign="center"
                    >
                      {/* Background wave pattern */}
                      <Box
                        position="absolute"
                        inset={0}
                        bg="whiteAlpha.100"
                        backdropFilter="blur(10px)"
                      />

                      <VStack position="relative" zIndex={1} spacing={4} py={4}>
                        <Badge
                          bg="whiteAlpha.300"
                          color="white"
                          backdropFilter="blur(5px)"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {selectedEpisode.episodeNumber} • {selectedEpisode.tag}
                        </Badge>

                        <MotionBox
                          w="110px"
                          h="110px"
                          borderRadius="full"
                          bg="whiteAlpha.200"
                          border="3px solid"
                          borderColor="whiteAlpha.600"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                          transition={
                            isPlaying
                              ? { repeat: Infinity, duration: 10, ease: "linear" }
                              : { duration: 0.5 }
                          }
                          boxShadow="xl"
                        >
                          <Icon as={FaHeadphones} boxSize={12} color="white" />
                        </MotionBox>

                        <VStack spacing={1}>
                          <Text fontSize="lg" fontWeight="900" lineHeight="short" px={2}>
                            {selectedEpisode.title}
                          </Text>
                          <Text fontSize="xs" opacity={0.85}>
                            SMK Muhammadiyah Bandongan (10 TJKT A)
                          </Text>
                        </VStack>

                        <EqualizerBars isPlaying={isPlaying} />
                      </VStack>
                    </Box>
                  </Box>

                  {/* Right: Controls & Episode Selector */}
                  <VStack gridColumn={{ base: "span 1", lg: "span 7" }} align="stretch" spacing={6}>
                    {/* Active Episode Header */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Badge colorScheme={selectedEpisode.colorScheme} px={3} py={1} borderRadius="full">
                          SEDANG DIPUTAR
                        </Badge>
                        <Text fontSize="xs" fontWeight="bold" color={subHeadingColor}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                      </HStack>
                      <Heading size="md" fontWeight="900" mb={2}>
                        {selectedEpisode.title}
                      </Heading>
                      <Text fontSize="sm" color={subHeadingColor} lineHeight="tall">
                        {selectedEpisode.description}
                      </Text>
                    </Box>

                    {/* Progress Slider */}
                    <Box>
                      <Slider
                        aria-label="podcast-seek"
                        value={currentTime}
                        min={0}
                        max={duration || 100}
                        onChange={handleSeek}
                        focusThumbOnChange={false}
                        colorScheme="brand"
                      >
                        <SliderTrack h="6px" borderRadius="full" bg={sliderTrackBg}>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={4} bg="brand.500" borderColor="white" borderWidth={2} />
                      </Slider>
                    </Box>

                    {/* Player Controls Bar */}
                    <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
                      {/* Left: Secondary controls */}
                      <HStack spacing={2}>
                        <Tooltip label={isMuted ? "Unmute" : "Mute"}>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            onClick={toggleMute}
                            aria-label="Toggle mute"
                          />
                        </Tooltip>
                        <Tooltip label="Kecepatan Putar">
                          <Button
                            size="xs"
                            variant="outline"
                            borderRadius="full"
                            onClick={cyclePlaybackRate}
                            fontWeight="bold"
                          >
                            {playbackRate}x
                          </Button>
                        </Tooltip>
                      </HStack>

                      {/* Center: Main Play Controls */}
                      <HStack spacing={4}>
                        <Tooltip label="Mundur 10 Detik">
                          <IconButton
                            size="md"
                            variant="ghost"
                            borderRadius="full"
                            icon={<FaBackward />}
                            onClick={() => handleSkip(-10)}
                            aria-label="Skip backward 10s"
                          />
                        </Tooltip>

                        <IconButton
                          size="lg"
                          colorScheme="brand"
                          borderRadius="full"
                          boxShadow="0 8px 25px rgba(19, 127, 236, 0.4)"
                          icon={isPlaying ? <FaPause /> : <FaPlay />}
                          onClick={togglePlay}
                          aria-label={isPlaying ? "Pause" : "Play"}
                          w="60px"
                          h="60px"
                          _hover={{ transform: 'scale(1.06)' }}
                          _active={{ transform: 'scale(0.96)' }}
                        />

                        <Tooltip label="Maju 10 Detik">
                          <IconButton
                            size="md"
                            variant="ghost"
                            borderRadius="full"
                            icon={<FaForward />}
                            onClick={() => handleSkip(10)}
                            aria-label="Skip forward 10s"
                          />
                        </Tooltip>
                      </HStack>

                      {/* Right: Download / External Link */}
                      <HStack spacing={2}>
                        <Tooltip label="Unduh Audio M4A / MP3">
                          <IconButton
                            as="a"
                            href={selectedEpisode.audioUrl}
                            target="_blank"
                            download
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            icon={<FaDownload />}
                            aria-label="Download podcast audio"
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>

                    {/* Playlist List (Episode Switcher) */}
                    <Box pt={2} borderTopWidth="1px" borderColor={borderColor}>
                      <Text fontSize="xs" fontWeight="900" letterSpacing="wider" color={subHeadingColor} mb={3}>
                        PILIH EPISODE PODCAST:
                      </Text>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                        {podcastEpisodes.map((ep) => {
                          const isCurrent = selectedEpisode.id === ep.id;
                          return (
                            <Box
                              key={ep.id}
                              p={3.5}
                              borderRadius="xl"
                              borderWidth="1.5px"
                              borderColor={isCurrent ? "brand.500" : borderColor}
                              bg={isCurrent ? activeEpisodeBg : 'transparent'}
                              cursor="pointer"
                              onClick={() => handleSelectEpisode(ep)}
                              transition="all 0.2s ease"
                              _hover={{ borderColor: 'brand.400', transform: 'translateY(-2px)' }}
                            >
                              <HStack spacing={3} align="center">
                                <IconButton
                                  size="sm"
                                  colorScheme={isCurrent && isPlaying ? "green" : "brand"}
                                  variant={isCurrent ? "solid" : "outline"}
                                  borderRadius="full"
                                  icon={isCurrent && isPlaying ? <FaPause fontSize="10px" /> : <FaPlay fontSize="10px" />}
                                  aria-label="Play episode"
                                  pointerEvents="none"
                                />
                                <Box flex={1} overflow="hidden">
                                  <Text fontSize="xs" fontWeight="bold" color="brand.500">
                                    {ep.episodeNumber}
                                  </Text>
                                  <Text fontSize="xs" fontWeight="bold" noOfLines={1}>
                                    {ep.title}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </Box>
            </MotionBox>
          )}

          {/* 2. YOUTUBE VIDEO SECTION */}
          {(activeTab === 'video' || activeTab === 'both') && (
            <MotionBox
              key="video-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                bg={cardBg}
                borderRadius="3xl"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="2xl"
                overflow="hidden"
                p={{ base: 5, md: 8 }}
              >
                <VStack spacing={6} align="stretch">
                  <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
                    <HStack spacing={3}>
                      <Icon as={FaYoutube} color="red.500" boxSize={7} />
                      <Box>
                        <Heading size="md" fontWeight="900">
                          Video Dokumenter & Podcast Resmi
                        </Heading>
                        <Text fontSize="xs" color={subHeadingColor}>
                          Tonton tayangan video eksklusif perbincangan digitalisasi Desa Ngawonggo
                        </Text>
                      </Box>
                    </HStack>

                    <Button
                      as={Link}
                      href="https://youtu.be/LjrjMjTKthc"
                      isExternal
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="full"
                      rightIcon={<FaExternalLinkAlt fontSize="10px" />}
                      _hover={{ bg: "red.500", color: "white", textDecoration: "none" }}
                    >
                      Buka di YouTube
                    </Button>
                  </Flex>

                  {/* 16:9 Responsive Video Iframe */}
                  <Box
                    position="relative"
                    w="100%"
                    borderRadius="2xl"
                    overflow="hidden"
                    boxShadow="2xl"
                    bg="black"
                    sx={{ aspectRatio: '16/9' }}
                  >
                    <Box
                      as="iframe"
                      src="https://www.youtube.com/embed/LjrjMjTKthc?rel=0"
                      title="Podcast & Dokumenter Portal Desa Ngawonggo"
                      w="100%"
                      h="100%"
                      position="absolute"
                      top={0}
                      left={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      border="0"
                    />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Pride Credits Strip */}
        <MotionFlex
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          mt={8}
          justify="center"
        >
          <HStack
            bg={creditsBg}
            px={6}
            py={3}
            borderRadius="full"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="md"
            spacing={3}
            wrap="wrap"
            justify="center"
          >
            <Icon as={FaGraduationCap} color="amber.500" boxSize={5} />
            <Text fontSize="xs" fontWeight="bold">
              Karya Resmi Siswa <strong>SMK Muhammadiyah Bandongan (10 TJKT A 2026)</strong>
            </Text>
            <Button
              as={Link}
              href="/credits"
              size="xs"
              colorScheme="brand"
              variant="link"
              rightIcon={<FaExternalLinkAlt fontSize="9px" />}
              _hover={{ textDecoration: 'none' }}
            >
              Lihat Profil Tim
            </Button>
          </HStack>
        </MotionFlex>
      </Container>
    </Box>
  );
};

export default PodcastSection;
