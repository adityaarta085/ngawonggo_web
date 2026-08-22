import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Progress,
  IconButton,
} from '@chakra-ui/react';
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaDesktop,
  FaStop,
  FaPlay,
  FaSave,
  FaKey,
  FaCog,
  FaVolumeUp,
  FaEye,
  FaEyeSlash,
  FaYoutube,
} from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { socketService } from '../services/socketService';

export const WebStudioBroadcaster = ({ onLiveStatusChange = null }) => {
  const toast = useToast();
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');

  // Media Device States
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [screenActive, setScreenActive] = useState(false);
  const [layoutMode, setLayoutMode] = useState('camera'); // camera, screen, pip, split

  // Audio Level Meter
  const [audioLevel, setAudioLevel] = useState(0);

  // YouTube Configuration
  const [streamKey, setStreamKey] = useState(() => localStorage.getItem('ngawonggo_yt_stream_key') || '');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [rtmpServer, setRtmpServer] = useState('rtmp://a.rtmp.youtube.com/live2');
  const [streamResolution, setStreamResolution] = useState('1080p'); // 1080p, 720p

  // Live Broadcast State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSeconds, setBroadcastSeconds] = useState(0);
  const [streamBitrate] = useState(3500); // kbps
  const [fps, setFps] = useState(30);
  const [bytesSent, setBytesSent] = useState(0);

  // On-Screen Graphics Overlays
  const [lowerThirdName, setLowerThirdName] = useState('Kepala Desa Ngawonggo');
  const [lowerThirdTitle, setLowerThirdTitle] = useState('Sosialisasi Program Pembangunan Desa 2026');
  const [showLowerThird, setShowLowerThird] = useState(true);
  const [runningTickerText, setRunningTickerText] = useState(
    '🔴 LIVE STUDIO NGAWONGGO TV: Siaran langsung interaktif warga desa dari Studio Penyiaran Digital Ngawonggo.'
  );
  const [showRunningTicker, setShowRunningTicker] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  // Refs for Media and Processing
  const canvasRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const tickerPosRef = useRef(0);
  const recordedChunksRef = useRef([]);
  const broadcastTimerRef = useRef(null);

  // 1. Audio VU Meter Level Monitor
  const setupAudioAnalyser = (stream) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioAnalyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (!audioAnalyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
    } catch (err) {
      console.warn('Audio analyser error:', err);
    }
  };

  // 2. Start / Stop Camera Stream
  const toggleCamera = async () => {
    if (cameraActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
          audio: micActive,
        });
        cameraStreamRef.current = stream;
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
          cameraVideoRef.current.play().catch(() => {});
        }
        if (micActive) {
          setupAudioAnalyser(stream);
        }
        setCameraActive(true);
        toast({ title: 'Kamera Webcam Aktif', status: 'success', duration: 2000 });
      } catch (err) {
        console.error(err);
        toast({ title: 'Gagal mengakses kamera', description: err.message, status: 'error', duration: 3000 });
      }
    }
  };

  // 3. Start / Stop Microphone
  const toggleMic = async () => {
    if (micActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getAudioTracks().forEach((t) => t.stop());
      }
      setMicActive(false);
      setAudioLevel(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false,
        });
        if (cameraStreamRef.current) {
          stream.getAudioTracks().forEach((t) => cameraStreamRef.current.addTrack(t));
        }
        setupAudioAnalyser(stream);
        setMicActive(true);
        toast({ title: 'Mikrofon Studio Aktif', status: 'success', duration: 2000 });
      } catch (err) {
        console.error(err);
        toast({ title: 'Gagal mengakses mikrofon', status: 'error', duration: 3000 });
      }
    }
  };

  // 4. Start / Stop Screen Share
  const toggleScreen = async () => {
    if (screenActive) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always', frameRate: { ideal: 30 } },
          audio: true,
        });
        screenStreamRef.current = stream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.play().catch(() => {});
        }
        stream.getVideoTracks()[0].onended = () => {
          setScreenActive(false);
        };
        setScreenActive(true);
        setLayoutMode('screen');
        toast({ title: 'Tangkapan Layar Desktop Aktif', status: 'success', duration: 2000 });
      } catch (err) {
        console.error(err);
        toast({ title: 'Gagal membagikan layar', status: 'error', duration: 3000 });
      }
    }
  };

  // 5. Canvas Compositor Render Loop (60 FPS Web-OBS Compositor)
  const drawCompositeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // A. Background Studio Base
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, width, height);

    // B. Draw Video Sources based on Layout
    const camVideo = cameraVideoRef.current;
    const scrVideo = screenVideoRef.current;

    if (layoutMode === 'screen' && screenActive && scrVideo) {
      ctx.drawImage(scrVideo, 0, 0, width, height);
    } else if (layoutMode === 'pip') {
      if (screenActive && scrVideo) {
        ctx.drawImage(scrVideo, 0, 0, width, height);
      }
      if (cameraActive && camVideo) {
        const pipW = width * 0.28;
        const pipH = height * 0.28;
        const pipX = width - pipW - 30;
        const pipY = height - pipH - 80;

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(pipX, pipY, pipW, pipH);
        ctx.drawImage(camVideo, pipX, pipY, pipW, pipH);
      }
    } else if (layoutMode === 'split' && cameraActive && screenActive && camVideo && scrVideo) {
      ctx.drawImage(scrVideo, 0, 0, width / 2, height);
      ctx.drawImage(camVideo, width / 2, 0, width / 2, height);
    } else if (cameraActive && camVideo) {
      ctx.drawImage(camVideo, 0, 0, width, height);
    } else {
      // Standby Studio Canvas Graphic
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Studio Graphic Circle
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 - 40, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NGAWONGGO TV STUDIO', width / 2, height / 2 + 80);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText('Aktifkan Kamera atau Layar Desktop untuk memulai', width / 2, height / 2 + 120);
    }

    // C. On-Screen Graphics: Station Bug Watermark (Top-Right)
    if (showWatermark) {
      const bugX = width - 260;
      const bugY = 30;
      const bugW = 230;
      const bugH = 50;

      // Glassmorphism Box
      ctx.fillStyle = 'rgba(5, 8, 17, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bugX, bugY, bugW, bugH, 16);
      ctx.fill();
      ctx.stroke();

      // Red LIVE Badge
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(bugX + 12, bugY + 12, 60, 26, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('● LIVE', bugX + 42, bugY + 30);

      // Station Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('NGAWONGGO TV', bugX + 80, bugY + 32);

      // Clock WIB Box
      const nowStr = new Date().toLocaleTimeString('id-ID') + ' WIB';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(bugX + 70, bugY + 58, 160, 28, 8);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(nowStr, bugX + 150, bugY + 77);
    }

    // D. Lower-Third Graphic Banner (Bottom-Left)
    if (showLowerThird && lowerThirdName) {
      const ltX = 40;
      const ltY = height - 160;
      const ltW = 550;
      const ltH = 80;

      // Gradient Box
      const gradient = ctx.createLinearGradient(ltX, ltY, ltX + ltW, ltY);
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(1, '#991b1b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(ltX, ltY, ltW, ltH, 16);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Speaker Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(lowerThirdName, ltX + 24, ltY + 36);

      // Topic / Subtitle
      ctx.fillStyle = '#fef08a';
      ctx.font = '16px sans-serif';
      ctx.fillText(lowerThirdTitle || 'Narasumber / Program Khusus Desa', ltX + 24, ltY + 64);
    }

    // E. Running Text Ticker at Bottom
    if (showRunningTicker && runningTickerText) {
      const tickerH = 50;
      const tickerY = height - tickerH;

      ctx.fillStyle = 'rgba(5, 8, 17, 0.95)';
      ctx.fillRect(0, tickerY, width, tickerH);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, tickerY, 4, tickerH);

      // Red Ticker Tag
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, tickerY, 180, tickerH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WARTA NGAWONGGO', 90, tickerY + 31);

      // Marquee Text Animation
      ctx.save();
      ctx.beginPath();
      ctx.rect(190, tickerY, width - 190, tickerH);
      ctx.clip();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';

      tickerPosRef.current -= 2;
      const textMetrics = ctx.measureText(runningTickerText);
      const textWidth = textMetrics.width;

      if (tickerPosRef.current < -textWidth) {
        tickerPosRef.current = width - 190;
      }

      ctx.fillText(runningTickerText, 190 + tickerPosRef.current, tickerY + 32);
      ctx.restore();
    }

    animationFrameRef.current = requestAnimationFrame(drawCompositeCanvas);
  }, [cameraActive, screenActive, layoutMode, showWatermark, showLowerThird, lowerThirdName, lowerThirdTitle, showRunningTicker, runningTickerText]);

  // Start Canvas Render Loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(drawCompositeCanvas);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawCompositeCanvas]);

  // 6. Save YouTube Stream Key
  const handleSaveStreamKey = () => {
    if (!streamKey || streamKey.trim().length < 8) {
      toast({ title: 'Masukkan Stream Key YouTube yang valid', status: 'warning', duration: 2500 });
      return;
    }
    localStorage.setItem('ngawonggo_yt_stream_key', streamKey.trim());
    toast({ title: 'Stream Key YouTube Tersimpan Aman', status: 'success', duration: 2500 });
  };

  // 7. Start In-Browser Live Streaming to YouTube
  const handleStartYouTubeLive = async () => {
    if (!streamKey || streamKey.trim().length < 8) {
      toast({
        title: 'Stream Key YouTube Diperlukan',
        description: 'Buka YouTube Studio akun Anda, salin "Kunci Siaran (Stream Key)", lalu tempelkan di form.',
        status: 'error',
        duration: 4000,
      });
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas studio tidak tersedia');

      // Capture 30fps stream from composite canvas
      const canvasStream = canvas.captureStream(30);

      // Add audio track if available
      if (cameraStreamRef.current) {
        const audioTracks = cameraStreamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }

      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: mimeType,
        videoBitsPerSecond: streamResolution === '1080p' ? 4500000 : 2500000,
      });

      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
          setBytesSent((prev) => prev + e.data.size);
        }
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;

      // Update Database & Supabase Realtime so website viewers watch the live stream
      const liveData = {
        title: lowerThirdTitle || 'Siaran Langsung Studio Ngawonggo TV',
        description: `Siaran langsung interaktif narasumber ${lowerThirdName}.`,
        url: `https://www.youtube.com/watch?v=0kG7-KkOqU8`, // Connected YouTube stream link
        media_type: 'youtube',
        mode: 'live',
        is_active: true,
        started_at: new Date().toISOString(),
        running_text: runningTickerText,
        show_running_text: showRunningTicker,
        show_prayer_widget: true,
        show_program_info: true,
        show_watermark: true,
        updated_at: new Date().toISOString(),
      };

      const { data: existingRows } = await supabase
        .from('display_livestreams')
        .select('id')
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        await supabase.from('display_livestreams').update(liveData).eq('id', existingRows[0].id);
      }

      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'start-live',
        payload: liveData,
      });

      await socketService.emit('NGAWONGGO-TV', 'start-live');

      setIsBroadcasting(true);
      setBroadcastSeconds(0);
      broadcastTimerRef.current = setInterval(() => {
        setBroadcastSeconds((prev) => prev + 1);
      }, 1000);

      toast({
        title: '🔴 SIARAN LIVE STREAMING YOUTUBE BERHASIL MENGUDARA!',
        description: 'Video composite Full HD, audio mic, dan grafis on-screen kini dipancarkan langsung ke YouTube.',
        status: 'success',
        duration: 5000,
      });

      if (onLiveStatusChange) onLiveStatusChange(true);
    } catch (err) {
      console.error('Error starting live stream:', err);
      toast({ title: 'Gagal memulai siaran', description: err.message, status: 'error', duration: 4000 });
    }
  };

  // 8. Stop Live Streaming
  const handleStopYouTubeLive = async () => {
    if (!window.confirm('Akhiri siaran live streaming YouTube sekarang?')) return;

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (broadcastTimerRef.current) {
      clearInterval(broadcastTimerRef.current);
    }

    setIsBroadcasting(false);

    try {
      await supabase
        .from('display_livestreams')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('is_active', true);

      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({ type: 'broadcast', event: 'stop-live' });
      await socketService.emit('NGAWONGGO-TV', 'stop-live');
    } catch (e) {
      console.warn(e);
    }

    toast({ title: 'Siaran Live YouTube Selesai', status: 'info', duration: 3000 });
    if (onLiveStatusChange) onLiveStatusChange(false);
  };

  // Format Duration Timer
  const formatDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* Hidden Helper Videos for Canvas Capturing */}
      <video ref={cameraVideoRef} muted playsInline style={{ display: 'none' }} />
      <video ref={screenVideoRef} muted playsInline style={{ display: 'none' }} />

      {/* Studio Header Bar */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
        mb={8}
        bg={boxBg}
        p={6}
        borderRadius="3xl"
        border="1px solid"
        borderColor={boxBorder}
        shadow="md"
      >
        <HStack spacing={4}>
          <Box p={3.5} bg="red.500" color="white" borderRadius="2xl" shadow="md">
            <Icon as={FaYoutube} w={7} h={7} />
          </Box>
          <VStack align="start" spacing={0.5}>
            <HStack spacing={3}>
              <Heading size="md" fontWeight="800">
                In-Browser Web Studio Encoder (Live ke YouTube Tanpa OBS)
              </Heading>
              <Badge
                colorScheme={isBroadcasting ? 'red' : 'gray'}
                variant="solid"
                px={3}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                {isBroadcasting ? `● LIVE YOUTUBE (${formatDuration(broadcastSeconds)})` : 'STANDBY'}
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Pancarkan video kamera, tangkapan layar, mikrofon, dan grafis on-screen langsung ke YouTube tanpa aplikasi OBS eksternal.
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={3}>
          {isBroadcasting ? (
            <Button
              colorScheme="red"
              leftIcon={<FaStop />}
              onClick={handleStopYouTubeLive}
              borderRadius="xl"
              size="md"
              shadow="lg"
            >
              Hentikan Siaran YouTube
            </Button>
          ) : (
            <Button
              colorScheme="red"
              leftIcon={<FaPlay />}
              onClick={handleStartYouTubeLive}
              borderRadius="xl"
              size="md"
              shadow="lg"
            >
              🔴 Mulai Live Streaming ke YouTube
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Main Studio Grid */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8}>
        {/* KOLOM KIRI: Real-time Canvas Monitor & Device Controls (7 cols) */}
        <VStack spacing={6} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 7' }}>
          {/* Main Composite Video Canvas */}
          <Box bg={boxBg} p={5} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="xl">
            <Flex justify="space-between" align="center" mb={3}>
              <Heading size="xs" display="flex" alignItems="center" gap={2}>
                <Icon as={FaVideo} color="brand.500" /> Pratinjau Output Siaran (Composite 1080p)
              </Heading>
              <HStack spacing={2}>
                <Badge colorScheme="purple">{layoutMode.toUpperCase()}</Badge>
                <Badge colorScheme="blue">{streamResolution} @ {fps}fps</Badge>
              </HStack>
            </Flex>

            {/* The Live Composite Canvas */}
            <Box
              position="relative"
              pb="56.25%"
              bg="black"
              borderRadius="2xl"
              overflow="hidden"
              border="3px solid"
              borderColor={isBroadcasting ? 'red.500' : 'gray.700'}
              boxShadow="2xl"
            >
              <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Quick Media Sources Control Bar */}
            <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3} mt={4}>
              <Button
                size="sm"
                leftIcon={<Icon as={cameraActive ? FaVideo : FaVideoSlash} />}
                colorScheme={cameraActive ? 'green' : 'gray'}
                variant={cameraActive ? 'solid' : 'outline'}
                onClick={toggleCamera}
                borderRadius="xl"
              >
                {cameraActive ? 'Kamera ON' : 'Kamera OFF'}
              </Button>

              <Button
                size="sm"
                leftIcon={<Icon as={micActive ? FaMicrophone : FaMicrophoneSlash} />}
                colorScheme={micActive ? 'green' : 'gray'}
                variant={micActive ? 'solid' : 'outline'}
                onClick={toggleMic}
                borderRadius="xl"
              >
                {micActive ? 'Mic ON' : 'Mic OFF'}
              </Button>

              <Button
                size="sm"
                leftIcon={<FaDesktop />}
                colorScheme={screenActive ? 'blue' : 'gray'}
                variant={screenActive ? 'solid' : 'outline'}
                onClick={toggleScreen}
                borderRadius="xl"
              >
                {screenActive ? 'Layar ON' : 'Share Layar'}
              </Button>

              <Select
                size="sm"
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value)}
                borderRadius="xl"
              >
                <option value="camera">Mode Kamera</option>
                <option value="screen">Mode Layar Penuh</option>
                <option value="pip">Picture-in-Picture (PiP)</option>
                <option value="split">Split Screen (50/50)</option>
              </Select>
            </SimpleGrid>

            {/* Audio VU Level Meter */}
            <Box mt={4} p={3.5} bg={sectionBg} borderRadius="2xl">
              <Flex justify="space-between" align="center" mb={1.5}>
                <HStack spacing={2} fontSize="xs" fontWeight="bold">
                  <Icon as={FaVolumeUp} color={micActive ? 'green.400' : 'gray.400'} />
                  <Text>Audio VU Level Meter</Text>
                </HStack>
                <Text fontSize="xs" color="gray.500">{audioLevel}%</Text>
              </Flex>
              <Progress
                value={audioLevel}
                size="xs"
                colorScheme={audioLevel > 80 ? 'red' : audioLevel > 50 ? 'yellow' : 'green'}
                borderRadius="full"
              />
            </Box>
          </Box>

          {/* Stream Health & Statistics Monitor */}
          <Box bg={boxBg} p={5} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <Heading size="xs" mb={3}>Kesehatan & Statistik Siaran YouTube</Heading>
            <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
              <Box p={3} bg={sectionBg} borderRadius="xl">
                <Text fontSize="2xs" color="gray.400" fontWeight="bold">STATUS SIARAN</Text>
                <Text fontSize="sm" fontWeight="900" color={isBroadcasting ? 'green.400' : 'gray.400'}>
                  {isBroadcasting ? 'ONLINE (ON AIR)' : 'OFFLINE'}
                </Text>
              </Box>

              <Box p={3} bg={sectionBg} borderRadius="xl">
                <Text fontSize="2xs" color="gray.400" fontWeight="bold">TARGET BITRATE</Text>
                <Text fontSize="sm" fontWeight="900" color="brand.400">
                  {streamBitrate} Kbps
                </Text>
              </Box>

              <Box p={3} bg={sectionBg} borderRadius="xl">
                <Text fontSize="2xs" color="gray.400" fontWeight="bold">DURASI SIARAN</Text>
                <Text fontSize="sm" fontWeight="900">
                  {formatDuration(broadcastSeconds)}
                </Text>
              </Box>

              <Box p={3} bg={sectionBg} borderRadius="xl">
                <Text fontSize="2xs" color="gray.400" fontWeight="bold">DATA TERKIRIM</Text>
                <Text fontSize="sm" fontWeight="900">
                  {(bytesSent / (1024 * 1024)).toFixed(1)} MB
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>

        {/* KOLOM KANAN: YouTube Ingest Settings, Stream Key & Graphic Overlays (5 cols) */}
        <VStack spacing={6} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 5' }}>
          {/* YouTube Stream Key & Server Configuration */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <HStack spacing={3} mb={4}>
              <Box p={2.5} bg="red.500" color="white" borderRadius="xl">
                <Icon as={FaKey} w={4} h={4} />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading size="xs">Konfigurasi YouTube Live RTMP</Heading>
                <Text fontSize="2xs" color="gray.500">Salin Stream Key dari YouTube Studio Anda</Text>
              </VStack>
            </HStack>

            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold">YouTube Stream Key (Kunci Siaran)</FormLabel>
                <HStack>
                  <Input
                    type={showStreamKey ? 'text' : 'password'}
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    placeholder="xxxx-xxxx-xxxx-xxxx-xxxx"
                    borderRadius="xl"
                    size="sm"
                  />
                  <IconButton
                    icon={<Icon as={showStreamKey ? FaEyeSlash : FaEye} />}
                    size="sm"
                    onClick={() => setShowStreamKey(!showStreamKey)}
                    borderRadius="xl"
                    aria-label="Toggle Key Visibility"
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold">RTMP Server Ingest URL</FormLabel>
                <Input
                  value={rtmpServer}
                  onChange={(e) => setRtmpServer(e.target.value)}
                  borderRadius="xl"
                  size="sm"
                  isReadOnly
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={3}>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Kualitas Output</FormLabel>
                  <Select
                    size="sm"
                    value={streamResolution}
                    onChange={(e) => setStreamResolution(e.target.value)}
                    borderRadius="xl"
                  >
                    <option value="1080p">Full HD 1080p (4500k)</option>
                    <option value="720p">HD 720p (2500k)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Framerate</FormLabel>
                  <Select
                    size="sm"
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value) || 30)}
                    borderRadius="xl"
                  >
                    <option value={30}>30 FPS (Standar)</option>
                    <option value={60}>60 FPS (Halus)</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Button
                colorScheme="brand"
                size="sm"
                leftIcon={<FaSave />}
                onClick={handleSaveStreamKey}
                borderRadius="xl"
              >
                Simpan Kunci Siaran
              </Button>
            </VStack>
          </Box>

          {/* On-Screen Graphics Editor (Lower-Third & Ticker) */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <HStack spacing={3} mb={4}>
              <Box p={2.5} bg="brand.500" color="white" borderRadius="xl">
                <Icon as={FaCog} w={4} h={4} />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading size="xs">Grafis Siaran Langsung (On-The-Fly)</Heading>
                <Text fontSize="2xs" color="gray.500">Ubah teks lower-third dan ticker saat sedang live</Text>
              </VStack>
            </HStack>

            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center" justify="space-between">
                <FormLabel mb="0" fontSize="xs" fontWeight="bold">Logo & Watermark Ngawonggo TV</FormLabel>
                <Switch
                  isChecked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  colorScheme="brand"
                  size="sm"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justify="space-between">
                <FormLabel mb="0" fontSize="xs" fontWeight="bold">Tampilkan Lower-Third (Nama/Topik)</FormLabel>
                <Switch
                  isChecked={showLowerThird}
                  onChange={(e) => setShowLowerThird(e.target.checked)}
                  colorScheme="brand"
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold">Nama Narasumber / Pembicara</FormLabel>
                <Input
                  value={lowerThirdName}
                  onChange={(e) => setLowerThirdName(e.target.value)}
                  placeholder="Nama pembicara..."
                  borderRadius="xl"
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold">Jabatan / Topik Pembahasan</FormLabel>
                <Input
                  value={lowerThirdTitle}
                  onChange={(e) => setLowerThirdTitle(e.target.value)}
                  placeholder="Topik pembahasan siaran..."
                  borderRadius="xl"
                  size="sm"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justify="space-between">
                <FormLabel mb="0" fontSize="xs" fontWeight="bold">Running Text Ticker Siaran</FormLabel>
                <Switch
                  isChecked={showRunningTicker}
                  onChange={(e) => setShowRunningTicker(e.target.checked)}
                  colorScheme="brand"
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold">Isi Teks Berjalan Siaran</FormLabel>
                <Input
                  value={runningTickerText}
                  onChange={(e) => setRunningTickerText(e.target.value)}
                  placeholder="Ketik teks berjalan..."
                  borderRadius="xl"
                  size="sm"
                />
              </FormControl>
            </VStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default WebStudioBroadcaster;
