import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DoodleLogo from '../../../components/DoodleLogo';
import QuickLinks from './QuickLinks';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

// Brutalist Marquee Component
const MarqueeStrip = ({ text, top }) => (
  <Box
    position="absolute"
    top={top ? 0 : 'auto'}
    bottom={top ? 'auto' : 0}
    left={0}
    right={0}
    zIndex={10}
    bg="neo.yellow"
    borderY="3px solid black"
    overflow="hidden"
    whiteSpace="nowrap"
    py={1}
  >
    <Box
      display="inline-block"
      style={{ animation: 'marquee 20s linear infinite' }}
    >
      <Text
        fontFamily="heading"
        fontSize={{ base: 'xs', md: 'sm' }}
        fontWeight="bold"
        color="black"
        letterSpacing="widest"
        textTransform="uppercase"
      >
        {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </Text>
    </Box>
  </Box>
);

// Floating Geometric Shapes
const FloatingShapes = () => (
  <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1} pointerEvents="none" overflow="hidden">
    <Box
      position="absolute"
      top="15%"
      left="10%"
      w="100px"
      h="100px"
      bg="neo.teal"
      borderRadius="full"
      border="3px solid black"
      boxShadow="brutal"
      style={{ animation: 'float-brutal 8s ease-in-out infinite' }}
    />
    <Box
      position="absolute"
      top="25%"
      right="15%"
      w="80px"
      h="80px"
      bg="neo.coral"
      border="3px solid black"
      boxShadow="brutal"
      transform="rotate(15deg)"
      style={{ animation: 'float-brutal 12s ease-in-out infinite reverse' }}
    />
    <Box
      position="absolute"
      bottom="30%"
      left="20%"
      w="60px"
      h="60px"
      bg="neo.yellow"
      border="3px solid black"
      boxShadow="brutal"
      clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
      style={{ animation: 'float-brutal 10s ease-in-out infinite 1s' }}
    />
     <Box
      position="absolute"
      bottom="15%"
      right="25%"
      w="120px"
      h="120px"
      bg="neo.slate"
      borderRadius="full"
      border="3px solid black"
      boxShadow="brutal"
      style={{ animation: 'float-brutal 14s ease-in-out infinite 2s' }}
    />
  </Box>
);


const Hero = () => {
  const [activeDoodle, setActiveDoodle] = useState(null);

  useEffect(() => {
    const fetchDoodle = async () => {
      // Find a currently active doodle. If multiple are active, take the first.
      const today = new Date().toISOString().split('T')[0];

      const { data } = await supabase
        .from('doodles')
        .select('*')
        .eq('is_active', true)
        // We handle date checking manually to support null dates (always active)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const validDoodle = data.find(d => {
            if (!d.start_date && !d.end_date) return true;
            if (d.start_date && d.end_date) {
                return today >= d.start_date && today <= d.end_date;
            }
            if (d.start_date) return today >= d.start_date;
            if (d.end_date) return today <= d.end_date;
            return false;
        });

        if (validDoodle) {
            setActiveDoodle(validDoodle);
        }
      }
    };

    fetchDoodle();
  }, []);

  return (
    <Box
      position="relative"
      minH={{ base: "80svh", md: "100svh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg="neo.slate"
      className="bg-dot-grid"
      pt={{ base: "88px", md: "124px" }}
      pb={{ base: "56px", md: "40px" }}
    >
      <MarqueeStrip text="★ DESA NGAWONGGO ★ KALIANGKRIK ★ MAGELANG" top={true} />

      <FloatingShapes />

      {/* Grid Pattern Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={2}
        backgroundImage="linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
        backgroundSize="50px 50px"
        opacity={0.6}
      />

      <Container maxW="container.xl" zIndex={3} position="relative">
        <Stack spacing={{ base: 10, md: 16 }} align="center" textAlign="center" mx="auto" w="full">
          <MotionBox
            mt={{ base: 4, md: 8 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            _hover={{ animation: 'wobble 0.5s ease-in-out' }}
            bg="white"
            p={4}
            border="4px solid black"
            boxShadow="brutalHover"
            borderRadius="xl"
            transform="rotate(-2deg)"
          >
            <DoodleLogo doodleData={activeDoodle} />
          </MotionBox>

          <Box w="full" maxW="4xl">
            <QuickLinks isHero={true} />
          </Box>
        </Stack>
      </Container>

      <MarqueeStrip text="★ DESA NGAWONGGO ★ KALIANGKRIK ★ MAGELANG" top={false} />
    </Box>
  );
};

export default Hero;
