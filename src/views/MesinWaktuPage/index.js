import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Flex, Icon, Badge, HStack, Progress, useToast, Grid, GridItem, Spinner
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { FaRocket, FaHistory, FaShareAlt, FaUndo } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Custom hook untuk audio
const useAudio = (frequency, type = 'sine') => {
  const [audioCtx, setAudioCtx] = useState(null);

  useEffect(() => {
    // Inisialisasi AudioContext pada interaksi user pertama kali untuk menghindari error autoplay policy
    const initAudio = () => {
      if (!audioCtx) {
         setAudioCtx(new (window.AudioContext || window.webkitAudioContext)());
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, [audioCtx]);

  const playSound = (dur = 0.1, freq = frequency, vol = 0.1) => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + dur);
  };

  return playSound;
};

export default function MesinWaktuPage() {
  const [appState, setAppState] = useState('COCKPIT'); // COCKPIT, WARP, ADVENTURE, RESULT
  const [selectedYear, setSelectedYear] = useState('2026');
  const [fuel, setFuel] = useState(100);
  const [adventureData, setAdventureData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const playBleep = useAudio(800, 'square');
  const playWarp = useAudio(100, 'sawtooth');

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleYearChange = (year) => {
    playBleep(0.05, 1200);
    setSelectedYear(year);
  };

  const generateScenario = async (year) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, isMesinWaktu: true })
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.error || 'Gagal membuat skenario');
        return data;
    } catch(err) {
        console.error(err);
        return null;
    }
  }

  const generateResult = async (year, action) => {
      try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, action, isMesinWaktu: true })
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.error || 'Gagal membuat hasil');
        return data;
    } catch(err) {
        console.error(err);
        return null;
    }
  }

  const handleLaunch = async () => {
    if (fuel < 20) {
      toast({ title: "Bahan Bakar Kritis!", description: "Minyak Srimpi Ghaib tidak cukup.", status: "error" });
      return;
    }
    playWarp(2.0, 50, 0.5); // Suara derung
    setFuel(prev => prev - 20);
    setAppState('WARP');

    // Minta AI membuat skenario sambil warp
    const aiData = await generateScenario(selectedYear);

    setTimeout(() => {
      if(aiData) {
          setAdventureData(aiData);
      } else {
          toast({ title: "Kegagalan Mesin Waktu", description: "AI gagal menembus ruang dan waktu.", status: "error" });
          setAppState('COCKPIT');
          return;
      }
      setAppState('ADVENTURE');
    }, 4000); // Durasi warp minimum
  };

  const handleChoice = async (option) => {
    playBleep(0.1, 600);
    setLoading(true);

    const resData = await generateResult(selectedYear, option.text);
    setLoading(false);

    if(resData) {
        setResultData(resData);
        setAppState('RESULT');
    } else {
        toast({ title: "Kegagalan Paradox", description: "Masa depan tidak dapat diprediksi.", status: "error" });
    }
  };

  const resetTimeline = () => {
    setAppState('COCKPIT');
    setResultData(null);
    setAdventureData(null);
  };

  const shareTimeline = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hasil Mesin Waktu Ngawonggo',
        text: `Saya baru saja menjelajah waktu ke tahun ${selectedYear} dan mendapatkan julukan: ${resultData.title}! Coba sekarang!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
        navigator.clipboard.writeText(`Saya menjelajah waktu ke ${selectedYear} dan menjadi ${resultData.title}!`);
        toast({ title: "Disalin!", status: "success", duration: 2000 });
    }
  };

  return (
    <Box minH="100vh" bg="black" color="white" overflow="hidden" position="relative" fontFamily="mono">
      <AnimatePresence mode="wait">
        {appState === 'COCKPIT' && (
          <Cockpit
            key="cockpit"
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            onLaunch={handleLaunch}
            fuel={fuel}
          />
        )}
        {appState === 'WARP' && <HyperspaceWarp key="warp" />}
        {appState === 'ADVENTURE' && (
          <AdventureScreen
            key="adventure"
            data={adventureData}
            onChoice={handleChoice}
            loading={loading}
          />
        )}
        {appState === 'RESULT' && (
          <ResultScreen
            key="result"
            data={resultData}
            year={selectedYear}
            onReset={resetTimeline}
            onShare={shareTimeline}
            windowSize={windowSize}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

// --- Komponen Layar ---

const Cockpit = ({ selectedYear, onYearChange, onLaunch, fuel }) => {
  const years = ["926 M", "1945", "1998", "2026", "2050", "3000", "10000 SM"];

  return (
    <MotionFlex
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      p={4}
      bgImage="radial-gradient(circle at center, #1a202c 0%, #000000 100%)"
      position="relative"
    >
      {/* CRT Overlay */}
      <Box
        position="absolute" top={0} left={0} right={0} bottom={0}
        pointerEvents="none"
        backgroundImage="linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))"
        backgroundSize="100% 4px, 6px 100%"
        zIndex={10}
        opacity={0.6}
      />

      <VStack spacing={8} zIndex={1} maxW="md" w="full" bg="gray.900" p={8} borderRadius="2xl" border="2px solid" borderColor="cyan.500" boxShadow="0 0 20px rgba(0,255,255,0.3)">
        <Heading size="lg" color="cyan.400" textShadow="0 0 10px cyan" letterSpacing="widest" textAlign="center">
          KOKPIT MESIN WAKTU (AI)
        </Heading>

        <Box w="full">
          <Text color="cyan.200" mb={2}>KOORDINAT TAHUN TUJUAN:</Text>
          <Flex flexWrap="wrap" gap={2} bg="black" p={4} borderRadius="md" border="1px solid" borderColor="cyan.700" justify="center">
            {years.map(y => (
              <Button
                key={y}
                size="sm"
                variant={selectedYear === y ? "solid" : "outline"}
                colorScheme="cyan"
                onClick={() => onYearChange(y)}
              >
                {y}
              </Button>
            ))}
          </Flex>
        </Box>

        <Box w="full">
          <Flex justify="space-between" color="green.300" mb={2}>
            <Text>MINYAK SRIMPI GHAIB</Text>
            <Text>{fuel}%</Text>
          </Flex>
          <Progress value={fuel} colorScheme="green" size="lg" borderRadius="full" hasStripe isAnimated />
        </Box>

        <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} w="full">
          <Button
            w="full"
            h="64px"
            colorScheme="red"
            fontSize="2xl"
            letterSpacing="widest"
            onClick={onLaunch}
            leftIcon={<Icon as={FaRocket} />}
            boxShadow="0 0 20px red"
            _hover={{ boxShadow: "0 0 40px red" }}
          >
            WARP!
          </Button>
        </MotionBox>
      </VStack>
    </MotionFlex>
  );
};

const HyperspaceWarp = () => {
  return (
    <MotionFlex
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      bg="black"
      position="relative"
      overflow="hidden"
    >
      {/* CSS Animation for Stars */}
      <Box
        position="absolute"
        top="50%" left="50%"
        w="200vmax" h="200vmax"
        transform="translate(-50%, -50%)"
        sx={{
            background: 'radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent)',
            backgroundSize: '10vmin 10vmin',
            animation: 'warp 2s infinite linear'
        }}
      />
      <style>{`
        @keyframes warp {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
        }
      `}</style>

      <VStack zIndex={1} spacing={4}>
         <Heading color="white" size="2xl" textShadow="0 0 20px white" style={{ animation: 'shake 0.5s infinite' }}>
            MELOMPATI DIMENSI...
         </Heading>
         <style>{`
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-1deg); }
                20% { transform: translate(-3px, 0px) rotate(1deg); }
                30% { transform: translate(3px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(1deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(3px, 1px) rotate(-1deg); }
                80% { transform: translate(-1px, -1px) rotate(1deg); }
                90% { transform: translate(1px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
         `}</style>
         <Text color="cyan.300">AI Sedang Menghitung probabilitas timeline...</Text>
      </VStack>
    </MotionFlex>
  );
};

const AdventureScreen = ({ data, onChoice, loading }) => {
  return (
    <MotionFlex
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      p={4}
      bg="gray.900"
    >
      <VStack spacing={6} maxW="2xl" w="full" bg="gray.800" p={8} borderRadius="xl" border="1px solid" borderColor="gray.600">
        <Badge colorScheme="cyan" fontSize="md" p={2} borderRadius="md">TAHUN {data.year}</Badge>
        <Heading size="md" color="white" textAlign="center">{data.title}</Heading>
        <Text color="gray.300" fontSize="lg" textAlign="center" lineHeight="tall">
          {data.description}
        </Text>

        <VStack w="full" spacing={4} mt={4}>
          {data.options.map((opt, idx) => (
            <Button
              key={idx}
              w="full"
              variant="outline"
              colorScheme="cyan"
              whiteSpace="normal"
              h="auto"
              py={4}
              onClick={() => onChoice(opt)}
              _hover={{ bg: 'cyan.900' }}
              isDisabled={loading}
            >
              {opt.text}
            </Button>
          ))}
          {loading && <Spinner color="cyan.400" />}
        </VStack>
      </VStack>
    </MotionFlex>
  );
};

const ResultScreen = ({ data, year, onReset, onShare, windowSize }) => {
  return (
    <MotionFlex
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      p={4}
      bg="gray.900"
      position="relative"
    >
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />

      <VStack spacing={6} maxW="2xl" w="full" bg="gray.800" p={8} borderRadius="xl" border="1px solid" borderColor="purple.500" boxShadow="0 0 30px rgba(128,0,128,0.3)">
        <Icon as={FaHistory} w={12} h={12} color="purple.400" />
        <Heading size="md" color="purple.300">BUTTERFLY EFFECT TERCIPTA</Heading>

        <Box textAlign="center" bg="blackAlpha.500" p={4} borderRadius="md" w="full">
            <Text color="gray.200" fontSize="lg" mb={2}>Akibat tindakanmu di tahun {year}:</Text>
            <Text color="white" fontSize="xl" fontWeight="bold">"{data.result}"</Text>
        </Box>

        <Badge colorScheme="yellow" fontSize="xl" p={3} borderRadius="full">
          Julukan: {data.title}
        </Badge>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" mt={4}>
           <StatBar label="Kemakmuran" value={data.impact?.wealth || 0} color="green" />
           <StatBar label="Kemistisan" value={data.impact?.mystic || 0} color="purple" />
           <StatBar label="Teknologi" value={data.impact?.tech || 0} color="cyan" />
           <StatBar label="Keharmonisan" value={data.impact?.harmony || 0} color="pink" />
        </Grid>

        <HStack w="full" spacing={4} mt={6}>
            <Button flex={1} leftIcon={<Icon as={FaUndo} />} colorScheme="gray" onClick={onReset}>Kembali</Button>
            <Button flex={1} leftIcon={<Icon as={FaShareAlt} />} colorScheme="purple" onClick={onShare}>Bagikan</Button>
        </HStack>
      </VStack>
    </MotionFlex>
  );
};

const StatBar = ({ label, value, color }) => {
    // Normalisasi nilai (-100 s/d 100) ke persentase (0 s/d 100)
    const displayValue = Math.max(0, Math.min(100, 50 + (value / 2)));
    return (
        <GridItem>
            <Text fontSize="xs" color="gray.400" mb={1}>{label} ({value > 0 ? `+${value}` : value})</Text>
            <Progress value={displayValue} colorScheme={color} size="sm" borderRadius="full" />
        </GridItem>
    );
};
