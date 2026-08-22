import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Flex, Text, Heading, Icon, Badge, HStack } from '@chakra-ui/react';
import { FaBroadcastTower, FaExclamationTriangle, FaMusic } from 'react-icons/fa';
import Hls from 'hls.js';

// Helper to extract YouTube Video ID cleanly from ANY link format
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const str = String(url).trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
  const match = str.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  return null;
};

// Helper to detect stream type
export const detectMediaType = (url, forcedType = null) => {
  if (forcedType && ['youtube', 'hls', 'radio', 'video'].includes(forcedType)) {
    return forcedType;
  }
  if (!url) return 'none';
  const u = url.toLowerCase();
  if (extractYouTubeId(url)) return 'youtube';
  if (u.includes('.m3u8') || u.includes('/hls/')) return 'hls';
  if (u.includes('radio') || u.includes('/studio') || u.includes('.mp3') || u.includes('/stream') || u.includes(':8000') || u.includes(':8080')) return 'radio';
  return 'video';
};

/**
 * Universal Broadcast Player supporting:
 * 1. YouTube Embed with seamless PostMessage JS-API (zero-flash mute/unmute & seek)
 * 2. HLS .m3u8 Stream with Hls.js
 * 3. Radio Streaming Audio with Studio Visualizer
 * 4. HTML5 Direct MP4/WebM Video
 */
export const BroadcastPlayer = ({
  url,
  mediaType = 'youtube',
  isMuted = true,
  syncTimestamp = 0,
  loop = true,
  title = 'Siaran Ngawonggo TV',
  onDurationDetected = null,
  onError = null,
  style = {},
  isStudioMonitor = false,
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const ytIframeRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  const detectedType = detectMediaType(url, mediaType);
  const ytId = extractYouTubeId(url);

  // Send command to YouTube iframe via postMessage without re-mounting
  const sendYouTubeCommand = useCallback((func, args = []) => {
    try {
      if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      }
    } catch (e) {
      console.warn('YouTube postMessage warning:', e);
    }
  }, []);

  // Handle Mute / Unmute for YouTube via PostMessage
  useEffect(() => {
    if (detectedType === 'youtube' && ytId) {
      sendYouTubeCommand(isMuted ? 'mute' : 'unMute');
      sendYouTubeCommand('playVideo');
    }
  }, [isMuted, detectedType, ytId, sendYouTubeCommand]);

  // Handle Sync Seek for YouTube via PostMessage (only when syncTimestamp changes)
  useEffect(() => {
    if (detectedType === 'youtube' && ytId && syncTimestamp > 0) {
      sendYouTubeCommand('seekTo', [Math.floor(syncTimestamp), true]);
      sendYouTubeCommand('playVideo');
    }
  }, [syncTimestamp, detectedType, ytId, sendYouTubeCommand]);

  // HLS Stream Setup
  useEffect(() => {
    setLoadError(false);
    if (detectedType === 'hls' && videoRef.current && url) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setLoadError(true);
                if (onError) onError(data);
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        videoRef.current.src = url;
        videoRef.current.play().catch(() => {});
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, detectedType, onError]);

  // Radio Audio Stream Setup
  useEffect(() => {
    if (detectedType === 'radio' && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }
  }, [url, detectedType, isMuted]);

  // Handle Mute & Sync for HTML5 Video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (syncTimestamp > 0 && Math.abs(videoRef.current.currentTime - syncTimestamp) > 3) {
        videoRef.current.currentTime = syncTimestamp;
      }
    }
  }, [isMuted, syncTimestamp]);

  if (!url) {
    return (
      <Flex w="full" h="full" bg="#0a0f1d" justify="center" align="center" color="gray.400" direction="column">
        <Icon as={FaBroadcastTower} w={12} h={12} mb={3} color="gray.600" />
        <Text fontSize="sm" fontWeight="bold">TIDAK ADA SUMBER SIARAN</Text>
      </Flex>
    );
  }

  if (loadError) {
    return (
      <Flex w="full" h="full" bg="#1a0b0b" justify="center" align="center" color="red.300" direction="column" p={6} textAlign="center">
        <Icon as={FaExclamationTriangle} w={10} h={10} mb={3} color="red.400" />
        <Heading size="xs" mb={1} color="white">SUMBER SIARAN SEMENTARA TIDAK DAPAT DIAKSES</Heading>
        <Text fontSize="2xs" color="red.200">Periksa format link stream atau pastikan koneksi penyiaran online.</Text>
      </Flex>
    );
  }

  // 1. YOUTUBE EMBED (Stable Mount with PostMessage Control)
  if (detectedType === 'youtube' && ytId) {
    const initialStart = Math.max(0, Math.floor(syncTimestamp));
    // Embed URL with enablejsapi=1 and stable origin
    const embedSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&start=${initialStart}&controls=${isStudioMonitor ? 1 : 0}&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;

    return (
      <Box
        ref={ytIframeRef}
        as="iframe"
        key={ytId} // STABLE KEY - Never re-mounts on mute/seek!
        src={embedSrc}
        title="Ngawonggo TV Stream"
        w="100%"
        h="100%"
        border="0"
        position="absolute"
        top={0}
        left={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style,
        }}
        onLoad={() => {
          // Send initial play and mute state when iframe finishes loading
          sendYouTubeCommand(isMuted ? 'mute' : 'unMute');
          sendYouTubeCommand('playVideo');
        }}
      />
    );
  }

  // 2. RADIO STREAM WITH STUDIO VISUALIZER
  if (detectedType === 'radio') {
    return (
      <Flex
        w="full"
        h="full"
        position="absolute"
        top={0}
        left={0}
        bgGradient="radial(circle at center, #1e1b4b 0%, #030712 100%)"
        direction="column"
        justify="center"
        align="center"
        p={8}
        textAlign="center"
        color="white"
        overflow="hidden"
      >
        <audio ref={audioRef} autoPlay preload="auto" />

        {/* Ambient Glow */}
        <Box
          position="absolute"
          w="400px"
          h="400px"
          bg="purple.500"
          opacity={0.15}
          filter="blur(100px)"
          borderRadius="full"
          animation="pulse-slow 4s infinite"
        />

        {/* Radio Station Icon */}
        <Box
          p={6}
          bg="rgba(255, 255, 255, 0.08)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          border="2px solid"
          borderColor="purple.400"
          mb={6}
          boxShadow="0 0 50px rgba(168, 85, 247, 0.3)"
          animation="float-slow 3s infinite ease-in-out"
        >
          <Icon as={FaMusic} w={12} h={12} color="purple.300" />
        </Box>

        <Badge colorScheme="purple" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="900" mb={3} letterSpacing="wider">
          📻 SIARAN RADIO STUDIO ON AIR
        </Badge>

        <Heading size={isStudioMonitor ? 'sm' : 'lg'} fontWeight="900" mb={2}>
          {title || 'Radio Gemilang 98.6 FM Magelang'}
        </Heading>
        <Text fontSize={isStudioMonitor ? '2xs' : 'sm'} color="gray.300" maxW="md" mb={6}>
          Siaran audio streaming kualitas tinggi menemani warga Desa Ngawonggo.
        </Text>

        {/* Equalizer Visualizer Bars */}
        <HStack spacing={2} align="flex-end" h="40px">
          {[40, 70, 30, 90, 50, 80, 60, 100, 45, 75, 85, 35, 95, 65, 55].map((val, idx) => (
            <Box
              key={idx}
              w={isStudioMonitor ? '3px' : '5px'}
              h={`${val}%`}
              bg="purple.400"
              borderRadius="full"
              animation={`equalizer-bar ${0.6 + (idx % 5) * 0.2}s infinite ease-in-out alternate`}
            />
          ))}
        </HStack>

        <style>{`
          @keyframes equalizer-bar {
            0% { height: 15%; opacity: 0.4; }
            100% { height: 100%; opacity: 1; }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </Flex>
    );
  }

  // 3. HLS STREAM (.m3u8 like TVRI) OR MP4 VIDEO
  return (
    <Box w="full" h="full" position="absolute" top={0} left={0} bg="black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        loop={loop}
        controls={isStudioMonitor}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          ...style,
        }}
        onLoadedMetadata={(e) => {
          const dur = e.target.duration;
          if (dur && isFinite(dur) && dur > 0 && onDurationDetected) {
            onDurationDetected(Math.floor(dur));
          }
        }}
      />
    </Box>
  );
};
