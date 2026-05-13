import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, useColorModeValue, keyframes } from '@chakra-ui/react';
import DoodleLogo from '../../../components/DoodleLogo';
import QuickLinks from './QuickLinks';
import { supabase } from '../../../lib/supabase';

// Keyframes
const fall = keyframes`
  0% { transform: translateY(-10vh); }
  100% { transform: translateY(110vh); }
`;

const spinConfetti = keyframes`
  0% { transform: rotate(0deg) rotateX(0deg) rotateY(0deg); }
  100% { transform: rotate(360deg) rotateX(360deg) rotateY(360deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
`;

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const blobFloat = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(10%, 10%) scale(1.1); }
`;

const waveBlob = keyframes`
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
  100% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(15deg) scale(1.05); }
`;

const waveBlob2 = keyframes`
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg) scale(1); }
  100% { border-radius: 30% 70% 70% 30% / 50% 60% 30% 60%; transform: rotate(-15deg) scale(1.1); }
`;

// Background effects components
const SnowEffect = () => (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1} pointerEvents="none" opacity={0.6}>
        <div className="snow-container">
            {[...Array(50)].map((_, i) => (
                <Box
                    key={i}
                    position="absolute"
                    bg="white" _dark={{ bg: "gray.800" }}
                    borderRadius="full"
                    w={`${Math.random() * 4 + 2}px`}
                    h={`${Math.random() * 4 + 2}px`}
                    left={`${Math.random() * 100}%`}
                    top={`-${Math.random() * 20}%`}
                    opacity={Math.random() * 0.5 + 0.3}
                    style={{
                        animation: `${fall} ${Math.random() * 3 + 2}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
        </div>
    </Box>
);

const ConfettiBGEffect = () => (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1} pointerEvents="none" opacity={0.4}>
        {[...Array(30)].map((_, i) => (
            <Box
                key={i}
                position="absolute"
                bg={['red.400', 'blue.400', 'green.400', 'yellow.400', 'purple.400'][Math.floor(Math.random() * 5)]}
                w={`${Math.random() * 10 + 5}px`}
                h={`${Math.random() * 20 + 10}px`}
                left={`${Math.random() * 100}%`}
                top={`-${Math.random() * 20}%`}
                style={{
                    animation: `${fall} ${Math.random() * 3 + 2}s linear infinite, ${spinConfetti} ${Math.random() * 2 + 1}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                }}
            />
        ))}
    </Box>
);

const StarsEffect = () => (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1} pointerEvents="none">
        {[...Array(100)].map((_, i) => (
            <Box
                key={i}
                position="absolute"
                bg="white" _dark={{ bg: "gray.800" }}
                borderRadius="full"
                w={`${Math.random() * 2 + 1}px`}
                h={`${Math.random() * 2 + 1}px`}
                left={`${Math.random() * 100}%`}
                top={`${Math.random() * 100}%`}
                opacity={Math.random()}
                style={{
                    animation: `${twinkle} ${Math.random() * 4 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                }}
            />
        ))}
    </Box>
);

const FluidWaveEffect = () => {
    const isDark = useColorModeValue(false, true);

    const c1 = isDark ? "#0F172A" : "#137fec";
    const c2 = isDark ? "#002952" : "#80b3ff";
    const c3 = isDark ? "#0F2F24" : "#4d94ff";
    const c4 = isDark ? "#1a202c" : "#e6f0ff";

    return (
        <Box
            position="absolute"
            top="-50%"
            left="-50%"
            right="-50%"
            bottom="-50%"
            zIndex={1}
            opacity={isDark ? 0.8 : 0.6}
            style={{
                background: `linear-gradient(-45deg, ${c1}, ${c2}, ${c3}, ${c4})`,
                backgroundSize: '400% 400%',
                animation: `${gradientBG} 15s ease infinite`,
            }}
        >
            <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                opacity="0.5"
                style={{
                   background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                   animation: `${blobFloat} 20s infinite alternate ease-in-out`,
                }}
            />
            <Box
                position="absolute"
                top="20%"
                left="20%"
                w="60%"
                h="60%"
                opacity="0.3"
                borderRadius="40% 60% 70% 30% / 40% 50% 60% 50%"
                bgGradient={`linear(to-r, ${c2}, ${c3})`}
                filter="blur(80px)"
                style={{
                   animation: `${waveBlob} 12s infinite alternate ease-in-out`,
                }}
            />
            <Box
                position="absolute"
                bottom="10%"
                right="10%"
                w="50%"
                h="50%"
                opacity="0.4"
                borderRadius="60% 40% 30% 70% / 60% 30% 70% 40%"
                bgGradient={`linear(to-l, ${c1}, ${c2})`}
                filter="blur(100px)"
                style={{
                   animation: `${waveBlob2} 18s infinite alternate ease-in-out`,
                }}
            />
        </Box>
    );
};

const Hero = () => {
  const [activeDoodle, setActiveDoodle] = useState(null);
  const bgColor = useColorModeValue("brand.50", "brand.900");

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

  const renderBackgroundEffect = () => {
      if (!activeDoodle || activeDoodle.background_effect === 'aurora' || !activeDoodle.background_effect) {
          return <FluidWaveEffect />;
      }
      switch (activeDoodle.background_effect) {
          case 'snow': return <SnowEffect />;
          case 'stars': return <StarsEffect />;
          case 'confetti_bg': return <ConfettiBGEffect />;
          case 'none': return null;
          default: return <FluidWaveEffect />;
      }
  };

  return (
    <Box
      position="relative"
      minH={{ base: "80svh", md: "100svh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg={bgColor}
      pt={{ base: "88px", md: "124px" }}
      pb={{ base: "56px", md: "40px" }}
    >
      {renderBackgroundEffect()}

      {/* Grid Pattern Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={2}
        backgroundImage={useColorModeValue(
            "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
        )}
        backgroundSize="50px 50px"
        opacity={useColorModeValue(0.5, 0.3)}
      />

      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={2}
        bg={useColorModeValue("whiteAlpha.500", "blackAlpha.500")}
        backdropFilter="contrast(1.1) saturate(1.2)"
      />

      <Container maxW="container.xl" zIndex={3} position="relative">
        <Stack spacing={{ base: 10, md: 16 }} align="center" textAlign="center" mx="auto" w="full">
          <Box mt={{ base: 4, md: 8 }}>
            <DoodleLogo doodleData={activeDoodle} showText={false} />
          </Box>

          <Box w="full" maxW="4xl">
            <QuickLinks isHero={true} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
