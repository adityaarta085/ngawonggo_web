
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaBroadcastTower,
  FaTv,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const MiniPlayer = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const [activeMedia, setActiveMedia] = useState('radio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Radio Logic
  const toggleRadio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
    if (playerRef.current) {
      playerRef.current.volume(volume / 100);
      playerRef.current.muted(isMuted);
    }
  }, [volume, isMuted]);

  // Video JS Init
  useEffect(() => {
    if (activeMedia === 'tv' && !playerRef.current && videoRef.current) {
      const player = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
          type: 'application/x-mpegURL'
        }]
      });
      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [activeMedia]);

  const handleTabChange = (index) => {
    const media = index === 0 ? 'radio' : 'tv';
    setActiveMedia(media);
    if (isPlaying) {
      if (media === 'tv') {
        audioRef.current?.pause();
      } else {
        playerRef.current?.pause();
      }
      setIsPlaying(false);
    }
  };

  return (
    <Box
      position="fixed"
      bottom={{ base: 4, md: 8 }}
      right={{ base: 4, md: 8 }}
      zIndex={2000}
    >
      <Collapse in={isOpen} animateOpacity>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={4}
          borderRadius="2xl"
          boxShadow="2xl"
          width={{ base: "300px", md: "350px" }}
          mb={4}
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="800" fontSize="sm" color="brand.500">MEDIA PLAYER</Text>
            <IconButton
              size="xs"
              icon={<FaTimes />}
              onClick={onToggle}
              variant="ghost"
              aria-label="Close player"
            />
          </HStack>

          <Tabs variant="soft-rounded" colorScheme="brand" size="sm" onChange={handleTabChange}>
            <TabList mb={4}>
              <Tab><Icon as={FaBroadcastTower} mr={2} /> Radio</Tab>
              <Tab><Icon as={FaTv} mr={2} /> TVRI</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box bg="gray.50" p={4} borderRadius="xl" textAlign="center">
                    <Text fontWeight="700" fontSize="sm">Gemilang FM 98.6</Text>
                    <Text fontSize="xs" color="gray.500">Live Streaming</Text>
                  </Box>
                  <HStack spacing={4} justify="center">
                    <IconButton
                      icon={isPlaying ? <FaPause /> : <FaPlay />}
                      onClick={toggleRadio}
                      colorScheme="brand"
                      borderRadius="full"
                      size="lg"
                      aria-label="Play/Pause"
                    />
                  </HStack>
                </VStack>
              </TabPanel>
              <TabPanel p={0}>
                <Box borderRadius="xl" overflow="hidden" bg="black">
                  <div data-vjs-player>
                    <video ref={videoRef} className="video-js vjs-big-play-centered" />
                  </div>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box mt={6}>
            <HStack spacing={3}>
              <Icon as={isMuted ? FaVolumeMute : FaVolumeUp} color="gray.400" cursor="pointer" onClick={() => setIsMuted(!isMuted)} />
              <Slider value={volume} onChange={(v) => setVolume(v)} min={0} max={100} colorScheme="brand">
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </HStack>
          </Box>
        </Box>
      </Collapse>

      <Tooltip label={isOpen ? "Minimize" : "Live Radio & TV"} placement="left">
        <Button
          onClick={onToggle}
          colorScheme="brand"
          size="lg"
          borderRadius="full"
          boxShadow="xl"
          leftIcon={<Icon as={isOpen ? FaChevronDown : FaBroadcastTower} />}
          px={6}
        >
          {isOpen ? "Tutup" : "Live Media"}
        </Button>
      </Tooltip>

      <audio
        ref={audioRef}
        src="https://streaming-radio.magelangkab.go.id/studio"
        preload="none"
      />
    </Box>
  );
};

export default MiniPlayer;
