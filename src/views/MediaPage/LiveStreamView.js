import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Spinner,
  Badge,
  HStack,
  VStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaTv,
  FaChevronLeft,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaClock,
  FaUsers,
  FaMosque,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Helper to extract YouTube Video ID from any format
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const DEFAULT_STREAM = {
  id: 'default-live',
  url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
  mode: 'simulated',
  title: 'Pesona Wisata, Sejarah & Budaya Ngawonggo',
  description: 'Dokumenter keindahan alam dan kearifan lokal Desa Ngawonggo.',
  is_active: true,
  started_at: new Date().toISOString(),
  duration: 900,
  loop_broadcast: true,
  running_text: '🔴 LIVE: Ngawonggo TV - Menghadirkan tayangan edukasi, kebudayaan, informasi desa, dan kajian 24 jam nonstop untuk seluruh masyarakat.',
  show_running_text: true,
  show_prayer_widget: true,
  show_breaking_news: false,
  breaking_news_title: 'WARTA KHUSUS NGAWONGGO',
  breaking_news_text: '',
  show_program_info: true,
  show_watermark: true,
  next_program_title: 'Warta Warga Desa Ngawonggo',
  next_program_time: '19:30 WIB',
  emergency_mode: false,
  emergency_title: 'PENGUMUMAN PENTING DESA',
  emergency_message: '',
};

const LiveStreamView = () => {
  const [streamData, setStreamData] = useState(DEFAULT_STREAM);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted to guarantee autoplay across all browsers
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [showProgramBanner, setShowProgramBanner] = useState(true);
  const [viewerCount, setViewerCount] = useState(1);
  const [currentTimeWIB, setCurrentTimeWIB] = useState('');
  const [currentDateWIB, setCurrentDateWIB] = useState('');
  const [syncTimestamp, setSyncTimestamp] = useState(0);

  // Prayer times state
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [prayerCountdown, setPrayerCountdown] = useState('');

  // References
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const audioChimeRef = useRef(null);
  const videoElementRef = useRef(null);
  const navigate = useNavigate();

  // Play audio chime alert
  const playChime = useCallback(() => {
    try {
      if (!audioChimeRef.current) {
        audioChimeRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      }
      audioChimeRef.current.play().catch(() => {});
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }, []);

  // 1. Fetch active livestream data from database
  const fetchStreamData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('display_livestreams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStreamData((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        setStreamData((prev) => ({ ...prev, is_active: false }));
      }
    } catch (err) {
      console.error('Error fetching livestream:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Prayer Times for Magelang
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const cached = localStorage.getItem(`tv_prayer_times_${todayStr}`);
        if (cached) {
          setPrayerTimes(JSON.parse(cached));
          return;
        }

        const res = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: { city: 'Magelang', country: 'Indonesia', method: 11 },
          timeout: 5000,
        });

        if (res.data?.data?.timings) {
          const t = res.data.data.timings;
          const mapped = {
            Subuh: t.Fajr,
            Dzuhur: t.Dhuhr,
            Ashar: t.Asr,
            Maghrib: t.Maghrib,
            Isya: t.Isha,
          };
          localStorage.setItem(`tv_prayer_times_${todayStr}`, JSON.stringify(mapped));
          setPrayerTimes(mapped);
        }
      } catch (e) {
        setPrayerTimes({
          Subuh: '04:30',
          Dzuhur: '11:55',
          Ashar: '15:15',
          Maghrib: '17:50',
          Isya: '19:00',
        });
      }
    };

    fetchPrayerTimes();
  }, []);

  // 3. Realtime Clock & Prayer Countdown Tracker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeWIB(format(now, 'HH:mm:ss') + ' WIB');
      setCurrentDateWIB(format(now, 'EEEE, dd MMMM yyyy', { locale: id }));

      if (prayerTimes) {
        const prayerList = [
          { name: 'Subuh', time: prayerTimes.Subuh },
          { name: 'Dzuhur', time: prayerTimes.Dzuhur },
          { name: 'Ashar', time: prayerTimes.Ashar },
          { name: 'Maghrib', time: prayerTimes.Maghrib },
          { name: 'Isya', time: prayerTimes.Isya },
        ];

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        let target = null;

        for (const p of prayerList) {
          if (!p.time) continue;
          const [h, m] = p.time.split(':').map(Number);
          const pMin = h * 60 + m;
          if (pMin > currentMinutes) {
            target = { ...p, minutes: pMin };
            break;
          }
        }

        if (!target && prayerList[0]) {
          const [h, m] = prayerList[0].time.split(':').map(Number);
          target = { ...prayerList[0], minutes: h * 60 + m + 24 * 60 };
        }

        if (target) {
          setNextPrayer(target);
          const diffSeconds = (target.minutes - currentMinutes) * 60 - now.getSeconds();
          if (diffSeconds > 0) {
            const hrs = Math.floor(diffSeconds / 3600);
            const mins = Math.floor((diffSeconds % 3600) / 60);
            const secs = diffSeconds % 60;
            setPrayerCountdown(
              `${hrs > 0 ? `${hrs}j ` : ''}${mins}m ${String(secs).padStart(2, '0')}s`
            );
          }
        }
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // 4. Time-Anchored Virtual Broadcast Sync Calculation
  const calculateTargetTimestamp = useCallback(() => {
    if (!streamData || !streamData.started_at) return 0;
    if (streamData.mode !== 'simulated') return 0;

    const startedAt = new Date(streamData.started_at).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - startedAt) / 1000);
    const effectiveDuration = streamData.duration > 0 ? streamData.duration : 900;

    if (streamData.loop_broadcast !== false) {
      return Math.floor(elapsedSeconds % effectiveDuration);
    }
    return Math.floor(Math.min(elapsedSeconds, effectiveDuration));
  }, [streamData]);

  // Update initial sync timestamp
  useEffect(() => {
    const ts = calculateTargetTimestamp();
    setSyncTimestamp(ts);
  }, [calculateTargetTimestamp, streamData?.started_at, streamData?.url]);

  // 5. Supabase Realtime Channels: Broadcast updates, presence viewer counter & instant signals
  useEffect(() => {
    fetchStreamData();

    const tvChannel = supabase.channel('ngawonggo_live_tv_main', {
      config: {
        presence: { key: `viewer_${Math.random().toString(36).substring(2, 9)}` },
      },
    });

    tvChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'display_livestreams' },
      () => {
        fetchStreamData();
      }
    );

    tvChannel.on('broadcast', { event: 'start-live' }, (payload) => {
      if (payload?.payload) {
        setStreamData((prev) => ({ ...prev, ...payload.payload, is_active: true }));
      }
    });

    tvChannel.on('broadcast', { event: 'update-overlay' }, (payload) => {
      if (payload?.payload) {
        setStreamData((prev) => ({ ...prev, ...payload.payload }));
      }
    });

    tvChannel.on('broadcast', { event: 'stop-live' }, () => {
      setStreamData((prev) => ({ ...prev, is_active: false }));
    });

    tvChannel.on('broadcast', { event: 'sync-player' }, () => {
      const ts = calculateTargetTimestamp();
      setSyncTimestamp(ts);
      if (videoElementRef.current) {
        videoElementRef.current.currentTime = ts;
      }
    });

    tvChannel.on('broadcast', { event: 'play-chime' }, () => {
      playChime();
    });

    tvChannel.on('broadcast', { event: 'reload' }, () => {
      window.location.reload();
    });

    tvChannel.on('presence', { event: 'sync' }, () => {
      const state = tvChannel.presenceState();
      const count = Object.keys(state).length;
      setViewerCount(Math.max(1, count));
    });

    tvChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await tvChannel.track({
          online_at: new Date().toISOString(),
          page: 'live_tv',
        });
      }
    });

    return () => {
      supabase.removeChannel(tvChannel);
    };
  }, [calculateTargetTimestamp, fetchStreamData, playChime]);

  // 6. Auto-hide banner after 12 seconds
  useEffect(() => {
    const bannerTimer = setTimeout(() => {
      setShowProgramBanner(false);
    }, 12000);
    return () => clearTimeout(bannerTimer);
  }, [streamData?.url, streamData?.title]);

  // 7. Auto-hide mouse controls after 4 seconds of inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  // 8. Fullscreen Toggle (Native API)
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const youtubeId = getYouTubeVideoId(streamData?.url);

  return (
    <Box
      ref={containerRef}
      w="100vw"
      h="100vh"
      bg="#050811"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={9999}
      onMouseMove={handleMouseMove}
      userSelect="none"
      cursor={showControls ? 'default' : 'none'}
    >
      {/* 1. Video Player Container */}
      {loading ? (
        <Flex w="full" h="full" justify="center" align="center" direction="column" bg="#050811">
          <Spinner size="xl" color="brand.500" thickness="4px" speed="0.8s" mb={6} />
          <Heading color="white" size="md" fontWeight="700" letterSpacing="wider">
            MENGHUBUNGKAN KE NGAWONGGO TV...
          </Heading>
          <Text color="gray.400" fontSize="sm" mt={2}>
            Menyelaraskan frekuensi siaran televisi digital desa
          </Text>
        </Flex>
      ) : streamData?.is_active && streamData?.url ? (
        <Box w="full" h="full" position="relative" bg="black">
          {youtubeId ? (
            /* 100% Reliable Native YouTube Embed with Synchronized Seek */
            <Box
              as="iframe"
              key={`${youtubeId}-${isMuted ? 'muted' : 'unmuted'}-${syncTimestamp}`}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&start=${syncTimestamp}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${youtubeId}&enablejsapi=1&iv_load_policy=3&showinfo=0`}
              title="Ngawonggo TV Stream"
              w="100vw"
              h="100vh"
              border="0"
              position="absolute"
              top={0}
              left={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                width: '100vw',
                height: '100vh',
                pointerEvents: 'auto',
              }}
            />
          ) : (
            /* HTML5 Direct Video Stream (MP4/HLS) */
            <video
              ref={videoElementRef}
              src={streamData.url}
              autoPlay
              playsInline
              muted={isMuted}
              loop={streamData.loop_broadcast}
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
        </Box>
      ) : (
        /* Standby / Off-Air Screen */
        <Flex
          w="full"
          h="full"
          direction="column"
          justify="center"
          align="center"
          bgGradient="radial(circle at center, #111827 0%, #030712 100%)"
          color="white"
          p={8}
          textAlign="center"
          position="relative"
        >
          <Box
            position="absolute"
            w="600px"
            h="600px"
            bg="brand.500"
            opacity={0.08}
            filter="blur(120px)"
            borderRadius="full"
            pointerEvents="none"
          />

          <Box
            p={6}
            bg="whiteAlpha.100"
            backdropFilter="blur(20px)"
            borderRadius="3xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            mb={8}
            boxShadow="0 0 50px rgba(0,0,0,0.5)"
          >
            <Icon as={FaTv} w={16} h={16} color="brand.400" />
          </Box>

          <Badge
            colorScheme="yellow"
            px={4}
            py={1.5}
            borderRadius="full"
            fontSize="sm"
            fontWeight="800"
            letterSpacing="widest"
            mb={4}
          >
            STANDBY / OFFLINE
          </Badge>

          <Heading size="xl" fontWeight="900" letterSpacing="tight" mb={3}>
            Siaran Ngawonggo TV Sedang Istirahat
          </Heading>
          <Text fontSize="lg" color="gray.300" maxW="xl" mb={6}>
            Studio penyiaran sedang mempersiapkan program siaran berikutnya. Tetap terhubung untuk warta dan acara budaya Desa Ngawonggo.
          </Text>

          <HStack
            spacing={4}
            bg="blackAlpha.600"
            px={6}
            py={3}
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Icon as={FaClock} color="brand.400" />
            <Text fontWeight="bold" fontSize="md" color="brand.200">
              Waktu Studio: {currentTimeWIB || 'WIB'}
            </Text>
          </HStack>
        </Flex>
      )}

      {/* 2. Top-Left Control Bar (Auto-Hides on Idle) */}
      <Flex
        position="absolute"
        top={5}
        left={5}
        zIndex={100}
        opacity={showControls ? 1 : 0}
        transform={showControls ? 'translateY(0)' : 'translateY(-10px)'}
        transition="all 0.3s ease"
        gap={3}
        align="center"
      >
        {/* Back Button */}
        <Flex
          bg="rgba(15, 23, 42, 0.75)"
          backdropFilter="blur(16px)"
          px={4}
          py={2.5}
          borderRadius="2xl"
          align="center"
          gap={2.5}
          cursor="pointer"
          onClick={() => navigate('/media')}
          border="1px solid rgba(255, 255, 255, 0.15)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.37)"
          _hover={{ bg: 'rgba(30, 41, 59, 0.9)', transform: 'scale(1.03)' }}
          transition="all 0.2s"
          color="white"
        >
          <Icon as={FaChevronLeft} />
          <Text fontSize="sm" fontWeight="700">
            Kembali
          </Text>
        </Flex>

        {/* Audio Mute/Unmute */}
        <Tooltip label={isMuted ? 'Nyalakan Suara (M)' : 'Bisukan Suara (M)'} placement="bottom">
          <IconButton
            icon={<Icon as={isMuted ? FaVolumeMute : FaVolumeUp} />}
            onClick={() => setIsMuted(!isMuted)}
            bg="rgba(15, 23, 42, 0.75)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.15)"
            color={isMuted ? 'red.400' : 'white'}
            borderRadius="2xl"
            size="md"
            _hover={{ bg: 'rgba(30, 41, 59, 0.9)' }}
            aria-label="Toggle Audio"
          />
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip label={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'} placement="bottom">
          <IconButton
            icon={<Icon as={isFullscreen ? FaCompress : FaExpand} />}
            onClick={toggleFullscreen}
            bg="rgba(15, 23, 42, 0.75)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.15)"
            color="white"
            borderRadius="2xl"
            size="md"
            _hover={{ bg: 'rgba(30, 41, 59, 0.9)' }}
            aria-label="Toggle Fullscreen"
          />
        </Tooltip>

        {/* Toggle Overlays */}
        <Tooltip label={showOverlays ? 'Sembunyikan Overlay Grafis' : 'Tampilkan Overlay Grafis'} placement="bottom">
          <IconButton
            icon={<Icon as={showOverlays ? FaEyeSlash : FaEye} />}
            onClick={() => setShowOverlays(!showOverlays)}
            bg="rgba(15, 23, 42, 0.75)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.15)"
            color="white"
            borderRadius="2xl"
            size="md"
            _hover={{ bg: 'rgba(30, 41, 59, 0.9)' }}
            aria-label="Toggle Overlays"
          />
        </Tooltip>
      </Flex>

      {/* 3. Station Bug & Live Indicator (Top-Right) */}
      {showOverlays && streamData?.show_watermark && (
        <Flex
          position="absolute"
          top={5}
          right={5}
          zIndex={90}
          direction="column"
          align="flex-end"
          gap={2}
          pointerEvents="none"
        >
          {/* Channel Bug Pill */}
          <Flex
            bg="rgba(10, 15, 30, 0.75)"
            backdropFilter="blur(16px)"
            px={4}
            py={2}
            borderRadius="2xl"
            align="center"
            gap={3}
            border="1px solid rgba(255, 255, 255, 0.15)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
          >
            {streamData?.is_active && (
              <HStack spacing={1.5} bg="red.600" px={2.5} py={0.5} borderRadius="full">
                <Box w={2} h={2} bg="white" borderRadius="full" animation="pulse-dot 1.2s infinite" />
                <Text fontSize="xs" fontWeight="900" color="white" letterSpacing="widest">
                  LIVE
                </Text>
              </HStack>
            )}
            <Text fontSize="sm" fontWeight="900" color="brand.300" letterSpacing="wider">
              NGAWONGGO TV
            </Text>
          </Flex>

          {/* Clock & Viewer Counter */}
          <HStack
            spacing={3}
            bg="rgba(10, 15, 30, 0.6)"
            backdropFilter="blur(12px)"
            px={3.5}
            py={1.5}
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.08)"
            fontSize="xs"
            color="whiteAlpha.900"
            fontWeight="bold"
          >
            <HStack spacing={1.5}>
              <Icon as={FaUsers} color="cyan.400" />
              <Text>{viewerCount} Pemirsa</Text>
            </HStack>
            <Box w="1px" h="12px" bg="whiteAlpha.300" />
            <Text color="yellow.300">{currentTimeWIB || 'WIB'}</Text>
          </HStack>
        </Flex>
      )}

      {/* 4. Jadwal Sholat (Prayer Times) Widget */}
      {showOverlays && streamData?.show_prayer_widget && prayerTimes && (
        <Flex
          position="absolute"
          top={5}
          left="50%"
          transform="translateX(-50%)"
          zIndex={80}
          display={{ base: 'none', lg: 'flex' }}
          bg="rgba(10, 15, 30, 0.75)"
          backdropFilter="blur(16px)"
          px={5}
          py={2}
          borderRadius="2xl"
          border="1px solid rgba(255, 255, 255, 0.15)"
          align="center"
          gap={4}
          boxShadow="0 8px 32px rgba(0,0,0,0.4)"
          pointerEvents="none"
        >
          <HStack spacing={2} color="emerald.400" pr={2} borderRight="1px solid rgba(255,255,255,0.1)">
            <Icon as={FaMosque} color="teal.300" />
            <Text fontSize="xs" fontWeight="800" color="white">
              MAGELANG
            </Text>
          </HStack>

          {Object.entries(prayerTimes).map(([name, time]) => {
            const isTarget = nextPrayer && nextPrayer.name === name;
            return (
              <HStack
                key={name}
                spacing={1.5}
                bg={isTarget ? 'rgba(16, 185, 129, 0.25)' : 'transparent'}
                px={2.5}
                py={1}
                borderRadius="xl"
                border={isTarget ? '1px solid rgba(16, 185, 129, 0.6)' : 'none'}
              >
                <Text
                  fontSize="xs"
                  fontWeight={isTarget ? '900' : '600'}
                  color={isTarget ? 'teal.200' : 'gray.300'}
                >
                  {name}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight={isTarget ? '900' : 'bold'}
                  color={isTarget ? 'white' : 'whiteAlpha.700'}
                >
                  {time}
                </Text>
              </HStack>
            );
          })}

          {nextPrayer && (
            <Badge
              colorScheme="teal"
              variant="solid"
              borderRadius="full"
              fontSize="xx-small"
              px={2}
              py={0.5}
            >
              {nextPrayer.name} in {prayerCountdown}
            </Badge>
          )}
        </Flex>
      )}

      {/* 5. Program Banner: "Sedang Tayang" & "Berikutnya" */}
      {showOverlays && streamData?.show_program_info && showProgramBanner && (
        <Box
          position="absolute"
          bottom={{ base: 24, md: 28 }}
          left={6}
          zIndex={85}
          maxW={{ base: '90vw', md: '500px' }}
          bg="rgba(10, 15, 30, 0.85)"
          backdropFilter="blur(20px)"
          p={4}
          borderRadius="2xl"
          border="1px solid rgba(255, 255, 255, 0.15)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.6)"
          animation="slide-in-up 0.5s ease"
        >
          <HStack spacing={2} mb={1.5}>
            <Badge colorScheme="red" borderRadius="md" px={2} fontSize="xx-small">
              SEDANG TAYANG
            </Badge>
            <Text fontSize="xs" color="gray.400">
              {currentDateWIB}
            </Text>
          </HStack>
          <Heading size="sm" color="white" fontWeight="800" noOfLines={1} mb={1}>
            {streamData.title || 'Siaran Khusus Ngawonggo TV'}
          </Heading>
          {streamData.description && (
            <Text fontSize="xs" color="gray.300" noOfLines={2} mb={2}>
              {streamData.description}
            </Text>
          )}
          {streamData.next_program_title && (
            <HStack
              spacing={2}
              pt={2}
              borderTop="1px solid rgba(255, 255, 255, 0.1)"
              fontSize="xs"
              color="brand.300"
            >
              <Text fontWeight="bold">Berikutnya:</Text>
              <Text color="whiteAlpha.900" noOfLines={1}>
                {streamData.next_program_title} ({streamData.next_program_time || 'Segera'})
              </Text>
            </HStack>
          )}
        </Box>
      )}

      {/* 6. Breaking News / Warta Khusus Lower-Third Bulletin */}
      {showOverlays && streamData?.show_breaking_news && streamData?.breaking_news_text && (
        <Box
          position="absolute"
          bottom={{ base: 20, md: 24 }}
          left="50%"
          transform="translateX(-50%)"
          zIndex={95}
          w={{ base: '95vw', md: '750px' }}
          bg="rgba(185, 28, 28, 0.9)"
          backdropFilter="blur(20px)"
          p={3.5}
          borderRadius="2xl"
          border="2px solid rgba(254, 202, 202, 0.4)"
          boxShadow="0 15px 40px rgba(220, 38, 38, 0.5)"
          animation="pulse-slow 2s infinite"
        >
          <HStack spacing={3} align="center">
            <Box bg="white" color="red.700" p={2} borderRadius="xl">
              <Icon as={FaExclamationTriangle} w={5} h={5} />
            </Box>
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="xs" fontWeight="900" color="yellow.300" letterSpacing="widest" textTransform="uppercase">
                {streamData.breaking_news_title || 'WARTA KHUSUS NGAWONGGO'}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="white">
                {streamData.breaking_news_text}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}

      {/* 7. Emergency Broadcast System (EBS) Takeover Screen */}
      {streamData?.emergency_mode && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bg="red.900"
          zIndex={200}
          direction="column"
          justify="center"
          align="center"
          p={10}
          textAlign="center"
          color="white"
          animation="emergency-flash 1.5s infinite"
        >
          <Icon as={FaExclamationTriangle} w={24} h={24} color="yellow.400" mb={6} />
          <Heading fontSize={{ base: '3xl', md: '6xl' }} fontWeight="900" letterSpacing="wider" mb={4}>
            {streamData.emergency_title || 'PERINGATAN DARURAT DESA'}
          </Heading>
          <Box
            maxW="4xl"
            bg="blackAlpha.700"
            p={8}
            borderRadius="3xl"
            border="3px solid white"
            boxShadow="0 0 60px rgba(0,0,0,0.8)"
          >
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" lineHeight="tall">
              {streamData.emergency_message || 'Harap seluruh warga memperhatikan himbauan darurat ini dan tetap waspada.'}
            </Text>
          </Box>
        </Flex>
      )}

      {/* 8. Autoplay Unmute Assistant Overlay (If Browser Muted Audio) */}
      {isMuted && streamData?.is_active && (
        <Flex
          position="absolute"
          bottom={{ base: 20, md: 24 }}
          left="50%"
          transform="translateX(-50%)"
          zIndex={100}
          bg="rgba(15, 23, 42, 0.9)"
          backdropFilter="blur(20px)"
          p={3.5}
          px={6}
          borderRadius="2xl"
          border="2px solid"
          borderColor="brand.400"
          boxShadow="0 10px 40px rgba(239, 68, 68, 0.5)"
          align="center"
          gap={3}
          cursor="pointer"
          onClick={() => setIsMuted(false)}
          _hover={{ transform: 'translateX(-50%) scale(1.04)', bg: 'rgba(30, 41, 59, 0.98)' }}
          transition="all 0.2s"
          animation="bounce-subtle 2s infinite"
        >
          <Box p={2.5} bg="red.500" color="white" borderRadius="full" animation="pulse-dot 1.5s infinite">
            <Icon as={FaVolumeUp} w={4} h={4} />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="900" color="white">
              🔊 Klik di Sini untuk Menyalakan Suara Siaran
            </Text>
            <Text fontSize="xs" color="gray.300">
              Siaran telah terhubung dan berputar secara langsung
            </Text>
          </VStack>
        </Flex>
      )}

      {/* 9. Bottom Running Text Ticker */}
      {showOverlays && streamData?.show_running_text && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={90}
          bg="rgba(5, 8, 17, 0.92)"
          backdropFilter="blur(20px)"
          borderTop="2px solid"
          borderColor="brand.500"
          boxShadow="0 -10px 30px rgba(0, 0, 0, 0.8)"
          h={{ base: '48px', md: '54px' }}
          display="flex"
          alignItems="center"
          overflow="hidden"
        >
          <Flex
            bg="brand.500"
            color="white"
            h="full"
            px={{ base: 3, md: 5 }}
            align="center"
            gap={2}
            fontWeight="900"
            fontSize={{ base: 'xs', md: 'sm' }}
            letterSpacing="wider"
            zIndex={2}
            boxShadow="5px 0 15px rgba(0,0,0,0.5)"
            flexShrink={0}
          >
            <Icon as={FaTv} />
            <Text display={{ base: 'none', sm: 'inline' }}>WARTA NGAWONGGO</Text>
            <Text display={{ base: 'inline', sm: 'none' }}>N-TV</Text>
          </Flex>

          <Box flex={1} overflow="hidden" position="relative" h="full" display="flex" alignItems="center">
            <Box
              as="div"
              className="tv-marquee-track"
              display="inline-block"
              whiteSpace="nowrap"
              color="white"
              fontWeight="600"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {streamData.running_text ||
                'Selamat Datang di Ngawonggo TV - Menghadirkan informasi desa, edukasi, budaya, dan kajian 24 jam nonstop untuk seluruh masyarakat.'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {streamData.running_text ||
                'Selamat Datang di Ngawonggo TV - Menghadirkan informasi desa, edukasi, budaya, dan kajian 24 jam nonstop untuk seluruh masyarakat.'}
            </Box>
          </Box>
        </Box>
      )}

      {/* Global CSS for Animations & Marquee */}
      <style>{`
        @keyframes pulse-dot {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; transform: translateX(-50%) scale(1.01); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes emergency-flash {
          0%, 100% { background-color: #7f1d1d; }
          50% { background-color: #991b1b; }
        }
        .tv-marquee-track {
          animation: tv-marquee-anim 35s linear infinite;
          padding-left: 100%;
        }
        @keyframes tv-marquee-anim {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </Box>
  );
};

export default LiveStreamView;
