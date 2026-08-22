import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { socketService } from '../services/socketService';
import { supabase } from '../../../lib/supabase';
import { format, differenceInSeconds } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { FaClock, FaBookOpen, FaUser, FaInfoCircle, FaPhoneSlash } from 'react-icons/fa';

// Clock component
const DisplayClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <VStack spacing={0} align="end">
      <Heading fontSize="7xl" fontWeight="black" lineHeight="1" textShadow="0 4px 12px rgba(0,0,0,0.5)">
        {format(time, 'HH:mm:ss')}
      </Heading>
      <Text fontSize="xl" fontWeight="bold" color="brand.300">
        {format(time, 'EEEE, dd MMMM yyyy', { locale: id })}
      </Text>
    </VStack>
  );
};

// Running text marque marquee
const MarqueeRunningText = ({ text }) => {
  return (
    <Box w="full" bg="brand.650" borderTop="4px solid" borderColor="brand.500" color="white" py={3} px={6} overflow="hidden" whiteSpace="nowrap" boxShadow="0 -4px 20px rgba(0,0,0,0.3)">
      <Text fontSize="2xl" fontWeight="bold" display="inline-block" animation="marquee 25s linear infinite">
        {text}
      </Text>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </Box>
  );
};

const DisplayView = () => {
  const { code } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [displayMode, setDisplayMode] = useState('normal'); // normal, adhan, iqomah, sholat, emergency, live
  const [emergencyMessage, setEmergencyMessage] = useState('');
  
  // Real database states
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdownStr, setCountdownStr] = useState('00:00:00');
  const [runningText, setRunningText] = useState('Selamat datang di Ngawonggo TV.');
  const [contents, setContents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [liveUrl, setLiveUrl] = useState(null);
  const [liveStreamData, setLiveStreamData] = useState(null);
  
  // Carousel slide index
  const [slideIndex, setSlideIndex] = useState(0);
  
  // Automated transition timers
  const [activePrayerName, setActivePrayerName] = useState('');
  const [adhanTimer, setAdhanTimer] = useState(0); // seconds
  const [iqomahTimer, setIqomahTimer] = useState(0); // seconds
  const [sholatTimer, setSholatTimer] = useState(0); // seconds
  
  // Iqomah configuration defaults
  const [iqomahSettings, setIqomahSettings] = useState({
    subuh: 10,
    dzuhur: 5,
    ashar: 5,
    maghrib: 5,
    isya: 10
  });

  const adhanAudioRef = useRef(null);
  const playerRef = useRef(null);
  const hasSeekedRef = useRef(false);

  // Play audio chime
  const playAlert = () => {
    try {
      if (!adhanAudioRef.current) {
        adhanAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      }
      adhanAudioRef.current.play().catch(e => console.log('Chime autoplay blocked by browser', e));
    } catch (err) {
      console.error(err);
    }
  };

  // Reset seek state when stream URL changes
  useEffect(() => {
    hasSeekedRef.current = false;
  }, [liveUrl]);

  // Handle simulated live synchronization
  const handleDuration = (duration) => {
    if (liveStreamData && liveStreamData.mode === 'simulated') {
      if (duration > 0 && !hasSeekedRef.current) {
        const startedAt = new Date(liveStreamData.started_at || liveStreamData.created_at);
        const now = new Date();
        const diffSeconds = Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000));
        const seekTime = diffSeconds % duration;
        console.log(`Syncing video player: elapsed=${diffSeconds}s, duration=${duration}s, seeking to=${seekTime}s`);
        if (playerRef.current) {
          playerRef.current.seekTo(seekTime, 'seconds');
          hasSeekedRef.current = true;
        }
      }
    }
  };

  // 1. Initial fetches & Realtime listener setup
  const loadData = async () => {
    // 1.1 Prayer Times Aladhan API
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const cached = localStorage.getItem(`prayer_times_${todayStr}`);
      if (cached) {
        setPrayerTimes(JSON.parse(cached));
      } else {
        const res = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: { city: 'Magelang', country: 'Indonesia', method: 11 }
        });
        if (res.data?.data?.timings) {
          const timings = res.data.data.timings;
          const mapped = {
            Subuh: timings.Fajr,
            Dzuhur: timings.Dhuhr,
            Ashar: timings.Asr,
            Maghrib: timings.Maghrib,
            Isya: timings.Isha
          };
          localStorage.setItem(`prayer_times_${todayStr}`, JSON.stringify(mapped));
          setPrayerTimes(mapped);
        }
      }
    } catch (err) {
      console.error('Error fetching prayer times from API, fallback to defaults:', err);
      setPrayerTimes({
        Subuh: '04:25',
        Dzuhur: '11:45',
        Ashar: '15:01',
        Maghrib: '17:38',
        Isya: '18:52'
      });
    }

    // 1.2 Iqomah Settings
    try {
      const { data } = await supabase.from('display_prayer_settings').select('prayer, iqomah_delay');
      if (data && data.length > 0) {
        const settings = {};
        data.forEach(item => {
          settings[item.prayer.toLowerCase()] = item.iqomah_delay;
        });
        setIqomahSettings(settings);
      }
    } catch (err) {
      console.error('Error fetching iqomah settings:', err);
    }

    // 1.3 Announcements (Running Text)
    try {
      const { data } = await supabase.from('announcements').select('content');
      if (data && data.length > 0) {
        setRunningText(data.map(a => a.content).join('   •   '));
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }

    // 1.4 Slideshow Contents
    try {
      const { data } = await supabase
        .from('display_contents')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      setContents(data || []);
      setSlideIndex(0);
    } catch (err) {
      console.error('Error fetching contents:', err);
    }

    // 1.5 Schedules
    try {
      const { data } = await supabase
        .from('display_schedules')
        .select('*')
        .order('time', { ascending: true });
      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }

    // 1.6 Livestream URL
    try {
      const { data } = await supabase
        .from('display_livestreams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        setLiveStreamData(data);
        setLiveUrl(data.url);
      } else {
        setLiveStreamData(null);
        setLiveUrl(null);
      }
    } catch (err) {
      console.error('Error fetching livestream URL:', err);
    }
  };

  useEffect(() => {
    // Hide main site wrappers
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#0b0f19';

    // Socket Connection
    const displayTargetCode = code || 'NGAWONGGO-TV';
    socketService.connect(displayTargetCode);
    socketService.on('connected', () => setIsConnected(true));

    socketService.on('reload', () => {
      window.location.reload();
    });

    socketService.on('content-updated', () => {
      console.log('Realtime notify: content updated');
      loadData();
    });

    socketService.on('show-popup', (payload) => {
      alert(`Pesan Masjid: ${payload.message}`);
    });

    socketService.on('play-chime', () => {
      console.log('Realtime play-chime received');
      playAlert();
    });

    socketService.on('sync-player', () => {
      console.log('Realtime sync-player received');
      hasSeekedRef.current = false;
      if (playerRef.current && liveStreamData) {
        const duration = playerRef.current.getDuration();
        if (duration && duration > 0) {
          handleDuration(duration);
        }
      }
    });

    socketService.on('set-mode', (payload) => {
      console.log('Realtime set-mode:', payload);
      setDisplayMode(payload.mode);
      if (payload.mode === 'emergency') {
        setEmergencyMessage(payload.message || 'Pemberitahuan penting dari pengurus masjid.');
      } else if (payload.mode === 'live') {
        loadData();
      } else if (payload.mode === 'normal') {
        setLiveStreamData(null);
        setLiveUrl(null);
      } else if (payload.mode === 'adhan') {
        setActivePrayerName(payload.prayer || 'Sholat');
        setAdhanTimer(180); // 3 mins
        playAlert();
      } else if (payload.mode === 'iqomah') {
        setActivePrayerName(payload.prayer || 'Sholat');
        const delay = iqomahSettings[payload.prayer?.toLowerCase()] || 5;
        setIqomahTimer(delay * 60);
        playAlert();
      }
    });

    socketService.on('start-live', () => {
      setDisplayMode('live');
      loadData();
    });

    socketService.on('stop-live', () => {
      setDisplayMode('normal');
      setLiveStreamData(null);
      setLiveUrl(null);
    });

    socketService.on('start-adhan', (payload) => {
      setDisplayMode('adhan');
      setActivePrayerName(payload?.prayer || 'Adzan');
      setAdhanTimer(180);
      playAlert();
    });

    socketService.on('start-iqomah', (payload) => {
      setDisplayMode('iqomah');
      setActivePrayerName(payload?.prayer || 'Iqomah');
      const delay = iqomahSettings[payload?.prayer?.toLowerCase()] || 5;
      setIqomahTimer(delay * 60);
      playAlert();
    });

    loadData();

    return () => {
      socketService.disconnect();
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // 2. Realtime loops (Ticks)
  useEffect(() => {
    const mainTimer = setInterval(() => {
      if (!prayerTimes) return;

      const now = new Date();
      const nowTimeStr = format(now, 'HH:mm:ss');

      // 2.1 Calculate Next Prayer
      const prayerList = [
        { name: 'Subuh', time: prayerTimes.Subuh },
        { name: 'Dzuhur', time: prayerTimes.Dzuhur },
        { name: 'Ashar', time: prayerTimes.Ashar },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isya', time: prayerTimes.Isya }
      ];

      let next = null;
      for (const p of prayerList) {
        if (p.time + ':00' > nowTimeStr) {
          next = { ...p, isTomorrow: false };
          break;
        }
      }

      if (!next) {
        next = { ...prayerList[0], isTomorrow: true };
      }
      setNextPrayer(next);

      // 2.2 Calculate countdown
      const [hours, minutes] = next.time.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      if (next.isTomorrow) {
        target.setDate(target.getDate() + 1);
      }

      const diffSecs = differenceInSeconds(target, now);
      if (diffSecs <= 0) {
        setCountdownStr('00:00:00');
        
        // 2.3 Automated Trigger: Transition to Adhan when countdown hits 0 (only if currently normal)
        if (displayMode === 'normal') {
          console.log(`Time for ${next.name}! Triggering Adhan automatically.`);
          setDisplayMode('adhan');
          setActivePrayerName(next.name);
          setAdhanTimer(180); // 3 minutes adzan duration
          playAlert();
        }
      } else {
        const secs = diffSecs % 60;
        const mins = Math.floor(diffSecs / 60) % 60;
        const hrs = Math.floor(diffSecs / 3600);
        const pad = (n) => String(n).padStart(2, '0');
        setCountdownStr(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
      }

      // 2.4 State Machine countdown updates
      if (displayMode === 'adhan') {
        setAdhanTimer(prev => {
          if (prev <= 1) {
            // Auto transition to Iqomah
            console.log('Adhan ended. Transitioning to Iqomah.');
            setDisplayMode('iqomah');
            const delay = iqomahSettings[activePrayerName.toLowerCase()] || 5;
            setIqomahTimer(delay * 60);
            playAlert();
            return 0;
          }
          return prev - 1;
        });
      } else if (displayMode === 'iqomah') {
        setIqomahTimer(prev => {
          if (prev <= 1) {
            // Auto transition to Sholat Mode
            console.log('Iqomah ended. Starting Sholat.');
            setDisplayMode('sholat');
            setSholatTimer(60 + 15 * 60); // 1 min shaf warning + 15 mins black screen
            playAlert();
            return 0;
          }
          return prev - 1;
        });
      } else if (displayMode === 'sholat') {
        setSholatTimer(prev => {
          if (prev <= 1) {
            // Auto transition back to normal
            console.log('Sholat finished. Returning to Normal.');
            setDisplayMode('normal');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(mainTimer);
  }, [prayerTimes, displayMode, activePrayerName, iqomahSettings]);

  // 3. Slideshow Carousel loop
  useEffect(() => {
    if (contents.length <= 1) return;
    const carouselTimer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % contents.length);
    }, 15000); // Rotate every 15 seconds
    return () => clearInterval(carouselTimer);
  }, [contents]);

  // 3.5 Auto-sync interval check
  useEffect(() => {
    if (displayMode !== 'live' || !liveStreamData || liveStreamData.mode !== 'simulated' || !hasSeekedRef.current) return;

    const syncInterval = setInterval(() => {
      if (playerRef.current) {
        const startedAt = new Date(liveStreamData.created_at);
        const now = new Date();
        const diffSeconds = Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000));
        
        try {
          const duration = playerRef.current.getDuration();
          if (duration && duration > 0) {
            const targetTime = diffSeconds % duration;
            const currentTime = playerRef.current.getCurrentTime();
            
            if (Math.abs(currentTime - targetTime) > 2.5) {
              console.log(`Auto-Sync: adjusting player from ${currentTime}s to ${targetTime}s (diff=${Math.abs(currentTime - targetTime)}s)`);
              playerRef.current.seekTo(targetTime, 'seconds');
            }
          }
        } catch (e) {
          console.warn('Sync check failed:', e);
        }
      }
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [displayMode, liveStreamData]);

  // 4. Render Helper for modes
  const renderMode = () => {
    switch (displayMode) {
      case 'emergency':
        return (
          <Flex h="full" w="full" direction="column" justify="center" align="center" bg="red.700" color="white" p={12} textAlign="center">
            <Icon as={FaInfoCircle} w={24} h={24} color="white" mb={8} animation="pulse 2s infinite" />
            <Heading fontSize="7xl" mb={6} fontWeight="black" letterSpacing="wider">PENGUMUMAN DARURAT</Heading>
            <Text fontSize="4xl" maxW="4xl" lineHeight="normal" bg="blackAlpha.400" p={8} borderRadius="2xl" border="2px solid white">
              {emergencyMessage}
            </Text>
          </Flex>
        );

      case 'live':
        return (
          <Box h="full" w="full" bg="black" position="relative">
            {liveUrl ? (
              <>
                <ReactPlayer
                  ref={playerRef}
                  url={liveUrl}
                  width="100%"
                  height="100%"
                  playing={true}
                  controls={true}
                  muted={false}
                  volume={0.8}
                  onDuration={handleDuration}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />

                {/* Floating Premium TV Indicator Overlay */}
                <Flex
                  position="absolute"
                  top={6}
                  right={6}
                  bg="rgba(0, 0, 0, 0.6)"
                  backdropFilter="blur(8px)"
                  px={4}
                  py={2}
                  borderRadius="full"
                  align="center"
                  gap={3}
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  pointerEvents="none"
                  zIndex={10}
                >
                  <Box w={3} h={3} bg="red.500" borderRadius="full" animation="pulse-blink 1.5s infinite" />
                  <Text fontSize="lg" fontWeight="black" letterSpacing="widest" color="white">
                    LIVE
                  </Text>
                  <Box w="1px" h="16px" bg="whiteAlpha.400" />
                  <Text fontSize="md" fontWeight="bold" color="brand.300">
                    Ngawonggo TV
                  </Text>
                </Flex>

                {/* Bottom Watermark or Station Tag */}
                <Box
                  position="absolute"
                  bottom={20}
                  left={6}
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(8px)"
                  px={4}
                  py={2}
                  borderRadius="xl"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  pointerEvents="none"
                  zIndex={10}
                >
                  <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.700" textTransform="uppercase">
                    Mata Acara: {liveStreamData?.mode === 'simulated' ? 'Siaran Edukasi / Budaya (Simulated Live)' : 'Siaran Langsung'}
                  </Text>
                </Box>
                
                <style>{`
                  @keyframes pulse-blink {
                    0% { opacity: 0.3; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0.3; transform: scale(0.9); }
                  }
                `}</style>
              </>
            ) : (
              <Flex h="full" justify="center" align="center">
                <VStack spacing={4}>
                  <Spinner size="xl" color="brand.500" />
                  <Heading color="white">Menghubungkan ke Siaran Langsung...</Heading>
                </VStack>
              </Flex>
            )}
          </Box>
        );

      case 'adhan':
        return (
          <Flex h="full" w="full" direction="column" justify="center" align="center" bg="teal.950" color="white" p={12} textAlign="center" bgGradient="linear(to-b, teal.950, gray.900)">
            <Heading fontSize="5xl" color="brand.400" mb={4} fontWeight="extrabold">WAKTU MASUK SHOLAT</Heading>
            <Heading fontSize="9vw" fontWeight="black" color="white" textShadow="0 4px 20px rgba(0,0,0,0.5)">
              A D Z A N  {activePrayerName.toUpperCase()}
            </Heading>
            <Text mt={10} fontSize="3xl" color="gray.350" maxW="3xl">
              Dengarkan adzan dengan khidmat dan segera bersiap merapatkan barisan shaf.
            </Text>
            <Badge mt={12} variant="solid" colorScheme="teal" fontSize="2xl" px={6} py={2} borderRadius="full">
              IQOMAH DI MULAI DALAM {Math.floor(adhanTimer / 60)} MENIT {String(adhanTimer % 60).padStart(2, '0')} DETIK
            </Badge>
          </Flex>
        );

      case 'iqomah': {
        const mins = Math.floor(iqomahTimer / 60);
        const secs = iqomahTimer % 60;
        return (
          <Flex h="full" w="full" direction="column" justify="center" align="center" bg="indigo.950" color="white" p={12} textAlign="center" bgGradient="linear(to-b, indigo.950, gray.900)">
            <Heading fontSize="4xl" color="brand.350" mb={4} fontWeight="extrabold">HITUNG MUNDUR IQOMAH</Heading>
            <Heading fontSize="8xl" fontWeight="black" textShadow="0 4px 20px rgba(0,0,0,0.6)">
              {mins}:{String(secs).padStart(2, '0')}
            </Heading>
            <HStack mt={10} spacing={6} bg="blackAlpha.400" px={8} py={4} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.300">
              <Icon as={FaPhoneSlash} w={8} h={8} color="red.400" />
              <Text fontSize="2xl" fontWeight="medium">Matikan atau Senyapkan Handphone Anda</Text>
            </HStack>
            <Text mt={6} fontSize="2xl" color="gray.400">Silakan menempati shaf terdepan yang masih kosong</Text>
          </Flex>
        );
      }

      case 'sholat': {
        // First 60 seconds show warning, remaining show pure black screen
        if (sholatTimer > 15 * 60) {
          return (
            <Flex h="full" w="full" direction="column" justify="center" align="center" bg="black" color="white" p={12} textAlign="center">
              <Heading fontSize="6vw" color="orange.400" mb={8} fontWeight="black">LURUSKAN DAN RAPATKAN SHAF</Heading>
              <Text fontSize="3vw" color="gray.300" maxW="4xl" lineHeight="normal">
                "Sesungguhnya meluruskan shaf adalah bagian dari kesempurnaan sholat."
              </Text>
              <Text mt={6} fontSize="2vw" color="gray.400">Sholat sedang berlangsung...</Text>
            </Flex>
          );
        } else {
          // Pure black screen to avoid any light distraction
          return <Box h="full" w="full" bg="black" />;
        }
      }

      case 'normal':
      default: {
        const activeSlide = contents[slideIndex];
        return (
          <Flex direction="column" h="full" justify="space-between" p={10}>
            {/* Top Bar inside Display */}
            <Flex justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="3xl" color="brand.400" fontWeight="extrabold" textShadow="0 2px 8px rgba(0,0,0,0.3)">
                  Ngawonggo TV
                </Heading>
                {nextPrayer && (
                  <HStack spacing={3} bg="whiteAlpha.100" p={2} px={4} borderRadius="full" backdropFilter="blur(8px)">
                    <Icon as={FaClock} color="brand.300" />
                    <Text fontSize="xl" fontWeight="bold">
                      Menuju {nextPrayer.name} dalam <Box as="span" color="brand.300">{countdownStr}</Box>
                    </Text>
                  </HStack>
                )}
              </VStack>
              <DisplayClock />
            </Flex>

            {/* Main Center Area: Grid of Slideshow and Schedules */}
            <SimpleGrid columns={{ base: 1, md: 5 }} spacing={8} flex={1} my={8} overflow="hidden">
              {/* Left 3 columns: Slideshow Carousel */}
              <Box gridColumn={{ md: 'span 3' }} bg="whiteAlpha.50" rounded="3xl" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100" boxShadow="xl" position="relative">
                {activeSlide ? (
                  <Flex direction="column" h="full">
                    <Box flex={1} position="relative" overflow="hidden">
                      {activeSlide.type === 'image' || activeSlide.media_url ? (
                        <Image
                          src={activeSlide.media_url}
                          alt={activeSlide.title}
                          objectFit="cover"
                          w="full"
                          h="full"
                          position="absolute"
                        />
                      ) : (
                        <Flex h="full" align="center" justify="center" p={8} bg="brand.900">
                          <VStack spacing={4}>
                            <Icon as={FaInfoCircle} w={16} h={16} color="brand.400" />
                            <Heading size="lg" textAlign="center" color="white">{activeSlide.title}</Heading>
                          </VStack>
                        </Flex>
                      )}
                    </Box>
                    <Box bg="blackAlpha.700" p={6} borderTop="1px solid" borderColor="whiteAlpha.100">
                      <Heading size="md" color="white" mb={1}>{activeSlide.title}</Heading>
                      <Text size="sm" color="gray.450">Pengumuman Ngawonggo TV</Text>
                    </Box>
                  </Flex>
                ) : (
                  // Default Slide
                  <Flex h="full" direction="column" align="center" justify="center" p={10} textAlign="center" bgGradient="linear(to-br, brand.900, slate.900)">
                    <Image src="/logo.svg" w={32} h={32} mb={6} filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.5))" />
                    <Heading size="xl" color="brand.400" mb={4}>Ngawonggo TV</Heading>
                    <Text fontSize="xl" maxW="2xl" color="gray.300">
                      "Hanyalah yang memakmurkan masjid-masjid Allah ialah orang-orang yang beriman kepada Allah dan hari kemudian." (QS. At-Tawbah: 18)
                    </Text>
                  </Flex>
                )}
              </Box>

              {/* Right 2 columns: Agenda List */}
              <Box gridColumn={{ md: 'span 2' }} bg="whiteAlpha.50" rounded="3xl" p={6} border="1px solid" borderColor="whiteAlpha.100" overflow="hidden" display="flex" direction="column">
                <Heading size="md" color="brand.300" mb={4} display="flex" alignItems="center">
                  <Icon as={FaBookOpen} mr={2} /> Agenda & Kegiatan Masjid
                </Heading>
                <VStack spacing={4} align="stretch" overflowY="auto" flex={1} pr={2}>
                  {schedules.length > 0 ? (
                    schedules.slice(0, 4).map(item => (
                      <Box key={item.id} p={4} bg="whiteAlpha.100" rounded="2xl" borderLeft="4px solid" borderColor="brand.400" _hover={{ bg: 'whiteAlpha.150' }} transition="all 0.2s">
                        <Flex justify="space-between" align="start">
                          <Text fontWeight="bold" fontSize="lg" color="white" noOfLines={1}>{item.title}</Text>
                          <Badge colorScheme={item.type === 'kajian' ? 'purple' : 'green'} fontSize="xs">
                            {item.type.toUpperCase()}
                          </Badge>
                        </Flex>
                        {item.speaker && (
                          <HStack spacing={2} mt={1} color="gray.300" fontSize="sm">
                            <Icon as={FaUser} w={3} h={3} />
                            <Text>{item.speaker}</Text>
                          </HStack>
                        )}
                        <HStack spacing={2} mt={2} color="brand.300" fontSize="sm" fontWeight="bold">
                          <Icon as={FaClock} w={3.5} h={3.5} />
                          <Text>{format(new Date(item.time), 'EEEE, dd MMM - HH:mm', { locale: id })} WIB</Text>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <Flex h="full" align="center" justify="center" color="gray.450" py={12}>
                      <VStack>
                        <Icon as={FaInfoCircle} w={8} h={8} mb={2} />
                        <Text fontSize="sm">Belum ada agenda terjadwal.</Text>
                      </VStack>
                    </Flex>
                  )}
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Bottom Prayer Times Grid */}
            {prayerTimes && (
              <SimpleGrid columns={5} spacing={6} w="full" mb={4}>
                {Object.entries(prayerTimes).map(([name, time]) => {
                  const isCurrentNext = nextPrayer && nextPrayer.name === name;
                  return (
                    <VStack
                      key={name}
                      spacing={1}
                      p={5}
                      bg={isCurrentNext ? 'brand.600' : 'whiteAlpha.100'}
                      rounded="2xl"
                      border={isCurrentNext ? '2px solid' : '1px solid'}
                      borderColor={isCurrentNext ? 'white' : 'whiteAlpha.100'}
                      boxShadow={isCurrentNext ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'md'}
                      transform={isCurrentNext ? 'scale(1.05)' : 'none'}
                      transition="all 0.3s ease"
                    >
                      <Text fontSize="lg" fontWeight="bold" color={isCurrentNext ? 'white' : 'gray.400'} textTransform="uppercase" letterSpacing="wider">
                        {name}
                      </Text>
                      <Heading fontSize="4xl" color="white" fontWeight="black">
                        {time}
                      </Heading>
                    </VStack>
                  );
                })}
              </SimpleGrid>
            )}
          </Flex>
        );
      }
    }
  };

  return (
    <Box h="100vh" w="100vw" bg="#0b0f19" color="white" position="relative" overflow="hidden" fontFamily="body">
      {/* Network Offline Indicator */}
      {!isConnected && (
        <Box position="absolute" top={4} left={4} bg="red.500" color="white" px={4} py={1.5} rounded="full" fontSize="sm" zIndex={9999} fontWeight="bold" shadow="md">
          MENUNGGU KONEKSI...
        </Box>
      )}

      {/* Main Mode Render */}
      <Box h="calc(100vh - 68px)">
        {renderMode()}
      </Box>

      {/* Marquee Footer */}
      <Box position="absolute" bottom={0} left={0} right={0} h="68px">
        <MarqueeRunningText text={runningText} />
      </Box>
    </Box>
  );
};

export default DisplayView;
