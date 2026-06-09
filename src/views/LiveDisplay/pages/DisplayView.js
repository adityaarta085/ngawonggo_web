import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Heading, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { socketService } from '../services/socketService';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const DisplayClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <VStack spacing={0} align="end">
      <Heading fontSize="8xl" fontWeight="bold" lineHeight="1">{format(time, 'HH:mm')}</Heading>
      <Text fontSize="2xl" color="gray.400">{format(time, 'EEEE, dd MMMM yyyy', { locale: id })}</Text>
    </VStack>
  );
};

const PrayerTimes = () => {
  const dummyTimes = [
    { name: 'Subuh', time: '04:20' },
    { name: 'Dzuhur', time: '11:45' },
    { name: 'Ashar', time: '15:00' },
    { name: 'Maghrib', time: '17:45' },
    { name: 'Isya', time: '19:00' }
  ];

  return (
    <HStack spacing={8} w="full" justify="space-between" bg="blackAlpha.600" p={6} rounded="2xl" backdropFilter="blur(10px)">
      {dummyTimes.map(p => (
        <VStack key={p.name} spacing={1}>
          <Text fontSize="xl" color="gray.400" textTransform="uppercase" letterSpacing="wider">{p.name}</Text>
          <Heading fontSize="4xl" color="white">{p.time}</Heading>
        </VStack>
      ))}
    </HStack>
  );
};

const RunningText = () => {
  return (
    <Box w="full" bg="brand.600" color="white" py={3} px={6} overflow="hidden" whiteSpace="nowrap">
      <Text fontSize="2xl" fontWeight="medium" display="inline-block" animation="marquee 20s linear infinite">
        Selamat datang di Masjid Ngawonggo. Mohon nonaktifkan telepon seluler saat sholat berlangsung. • Kajian ahad pagi bersama Ustadz Fulan pukul 06:00 WIB.
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

const NormalMode = () => (
  <Flex direction="column" h="full" justify="space-between" p={12}>
    <Flex justify="space-between" align="start">
      <VStack align="start" spacing={4}>
        <Heading size="2xl" color="brand.400">Masjid Ngawonggo</Heading>
        <Text fontSize="2xl" color="gray.300">Menuju sholat Dzuhur dalam 02:15:30</Text>
      </VStack>
      <DisplayClock />
    </Flex>

    <Box flex={1} my={12} bg="whiteAlpha.100" rounded="3xl" display="flex" alignItems="center" justify="center" border="2px dashed" borderColor="whiteAlpha.300">
        <Heading color="whiteAlpha.400" textAlign="center" w="full">Slideshow / Poster Content Here</Heading>
    </Box>

    <PrayerTimes />
  </Flex>
);

const AdhanMode = () => (
  <Flex direction="column" h="full" justify="center" align="center" bg="black" color="white" p={12}>
    <Heading fontSize="8vw" color="brand.400" mb={4}>WAKTU ADZAN</Heading>
    <Heading fontSize="4vw">M A G H R I B</Heading>
    <Text mt={8} fontSize="2vw" color="gray.400">Mohon persiapkan diri Anda untuk sholat berjamaah</Text>
  </Flex>
);

const DisplayView = () => {
  const { code } = useParams();
  const [displayState, setDisplayState] = useState({ mode: 'normal', data: null });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Hide scrollbar and margins for TV display
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#000000';

    socketService.connect(code);

    socketService.on('connected', () => setIsConnected(true));

    socketService.on('update-state', (payload) => {
      console.log('Update state received:', payload);
      setDisplayState(payload);
    });

    socketService.on('set-mode', (payload) => {
       setDisplayState(prev => ({ ...prev, mode: payload.mode }));
    });

    socketService.on('reload', () => {
      window.location.reload();
    });

    return () => {
      socketService.disconnect();
      document.body.style.overflow = 'auto';
    };
  }, [code]);

  const renderMode = () => {
    switch (displayState.mode) {
      case 'adhan':
        return <AdhanMode />;
      case 'iqomah':
        return <Flex h="full" justify="center" align="center"><Heading color="white">IQOMAH COUNTDOWN</Heading></Flex>;
      case 'live':
        return <Flex h="full" justify="center" align="center"><Heading color="white">LIVE STREAMING</Heading></Flex>;
      case 'emergency':
        return <Flex h="full" justify="center" align="center" bg="red.600"><Heading color="white">EMERGENCY: {displayState.data?.message}</Heading></Flex>;
      case 'normal':
      default:
        return <NormalMode />;
    }
  };

  return (
    <Box h="100vh" w="100vw" bg="gray.900" color="white" position="relative" overflow="hidden">
      {/* Network Status Indicator */}
      {!isConnected && (
        <Box position="absolute" top={4} left={4} bg="red.500" color="white" px={3} py={1} rounded="full" fontSize="sm" zIndex={9999}>
          Offline
        </Box>
      )}

      {/* Main Content Area */}
      <Box h="calc(100vh - 60px)">
        {renderMode()}
      </Box>

      {/* Persistent Bottom Bar */}
      <Box position="absolute" bottom={0} left={0} right={0} h="60px">
        <RunningText />
      </Box>
    </Box>
  );
};

export default DisplayView;
