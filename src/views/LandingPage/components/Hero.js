import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, useColorModeValue, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DoodleLogo from '../../../components/DoodleLogo';
import QuickLinks from './QuickLinks';
import { supabase } from '../../../lib/supabase';

// High-end Fluid Gradient Animation
const flowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const waveFloat = keyframes`
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-15px) rotate(2deg) scale(1.05); }
  100% { transform: translateY(0) rotate(0deg) scale(1); }
`;

const SvgWave = ({ color, opacity, delay, duration, height, isReverse }) => (
    <Box
        position="absolute"
        bottom="0"
        left="0"
        w="200%"
        h={height}
        opacity={opacity}
        transform="translateZ(0)"
        style={{
            animation: `waveSlide ${duration}s linear infinite ${isReverse ? 'reverse' : 'normal'}, ${waveFloat} ${duration * 1.5}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            transformOrigin: 'bottom center',
        }}
        zIndex={1}
    >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path
                d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
                fill={color}
            />
        </svg>
        <style>{`
            @keyframes waveSlide {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `}</style>
    </Box>
);

const MasterpieceFluidBackground = () => {
    // Beautiful dynamic color palettes
    const isDark = useColorModeValue(false, true);

    // Light Mode: Vibrant, deep ocean to tropical water
    const lightGradients = [
        "linear-gradient(-45deg, #00C9FF, #92FE9D, #1CB5E0, #000046)",
        "linear-gradient(-45deg, #00f2fe, #4facfe, #00C9FF, #92FE9D)"
    ];

    // Dark Mode: Deep cosmic nebula to midnight ocean
    const darkGradients = [
        "linear-gradient(-45deg, #091236, #1E215D, #290a59, #ff3860)",
        "linear-gradient(-45deg, #1A0B2E, #110F1F, #0D1E30, #17324F)"
    ];

    const bgGradient = isDark ? darkGradients[0] : lightGradients[0];
    const waveColors = isDark
        ? ["#1a202c", "rgba(45, 55, 72, 0.8)", "rgba(23, 25, 35, 0.9)"]
        : ["#ffffff", "rgba(240, 248, 255, 0.8)", "rgba(224, 247, 250, 0.9)"];

    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex={0}
            overflow="hidden"
            bg="black"
        >
            {/* The main flowing color base */}
            <Box
                position="absolute"
                top="-50%" left="-50%" right="-50%" bottom="-50%"
                style={{
                    background: bgGradient,
                    backgroundSize: '400% 400%',
                    animation: `${flowAnimation} 20s ease-in-out infinite alternate`,
                }}
                opacity={isDark ? 0.9 : 1}
            />

            {/* Soft glowing orbs to add depth */}
            <Box
                position="absolute"
                top="10%" left="20%"
                w="40vw" h="40vw"
                bg={isDark ? "blue.500" : "teal.300"}
                filter="blur(100px)"
                opacity={isDark ? 0.3 : 0.4}
                borderRadius="full"
                style={{ animation: `${waveFloat} 15s ease-in-out infinite alternate` }}
            />
            <Box
                position="absolute"
                bottom="10%" right="10%"
                w="50vw" h="50vw"
                bg={isDark ? "purple.600" : "blue.400"}
                filter="blur(120px)"
                opacity={isDark ? 0.3 : 0.5}
                borderRadius="full"
                style={{ animation: `${waveFloat} 25s ease-in-out infinite alternate-reverse`, animationDelay: '2s' }}
            />

            {/* Overlapping animated SVG waves */}
            <SvgWave color={waveColors[1]} opacity={0.6} duration={12} delay={0} height="150px" />
            <SvgWave color={waveColors[2]} opacity={0.8} duration={18} delay={-5} height="120px" isReverse />
            <SvgWave color={waveColors[0]} opacity={1} duration={25} delay={-2} height="90px" />

            {/* Glassmorphism subtle overlay to tie it together */}
            <Box
                position="absolute"
                top="0" left="0" right="0" bottom="0"
                bg={useColorModeValue("whiteAlpha.200", "blackAlpha.400")}
                backdropFilter="blur(2px)"
                zIndex={2}
            />
        </Box>
    );
};

const Hero = () => {
  const [activeDoodle, setActiveDoodle] = useState(null);

  useEffect(() => {
    const fetchDoodle = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('doodles')
        .select('*')
        .eq('is_active', true)
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
      minH={{ base: "85svh", md: "100svh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      pt={{ base: "88px", md: "124px" }}
      pb={{ base: "80px", md: "60px" }}
    >
      {/* Our beautiful masterpiece background */}
      <MasterpieceFluidBackground />

      <Container maxW="container.xl" zIndex={10} position="relative">
        <Stack spacing={{ base: 10, md: 16 }} align="center" textAlign="center" mx="auto" w="full">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
              <Box mt={{ base: 4, md: 8 }} filter="drop-shadow(0px 10px 20px rgba(0,0,0,0.3))">
                <DoodleLogo doodleData={activeDoodle} showText={false} />
              </Box>
          </motion.div>

          <Box w="full" maxW="5xl">
            <QuickLinks isHero={true} />
          </Box>

        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
