import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, Badge, Icon, VStack } from '@chakra-ui/react';
import { FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import DoodleLogo from '../../../components/DoodleLogo';
import QuickLinks from './QuickLinks';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

// Background effects components
const SnowEffect = () => (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1} pointerEvents="none" opacity={0.6}>
        <div className="snow-container">
            {/* We'll use simple CSS for snow in index.css, or just a placeholder if not defined. We can also render dots. */}
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
                        animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
        </div>
        <style>{`
            @keyframes fall {
                0% { transform: translateY(-10vh); }
                100% { transform: translateY(110vh); }
            }
        `}</style>
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
                    animation: `fall ${Math.random() * 3 + 2}s linear infinite, spinConfetti ${Math.random() * 2 + 1}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                }}
            />
        ))}
        <style>{`
            @keyframes spinConfetti {
                0% { transform: rotate(0deg) rotateX(0deg) rotateY(0deg); }
                100% { transform: rotate(360deg) rotateX(360deg) rotateY(360deg); }
            }
        `}</style>
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
                    animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                }}
            />
        ))}
        <style>{`
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
            }
        `}</style>
    </Box>
);

const AuroraEffect = () => (
    <MotionBox
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        zIndex={1}
        opacity={0.6}
        bgGradient="radial(circle at 20% 30%, brand.400 0%, transparent 50%), radial(circle at 80% 70%, purple.600 0%, transparent 50%), radial(circle at 50% 50%, teal.400 0%, transparent 40%), radial(circle at 10% 80%, accent.gold 0%, transparent 40%)"
        filter="blur(120px)"
        animate={{
          rotate: [0, 15, -5, 0],
          scale: [1, 1.15, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
    />
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

  const renderBackgroundEffect = () => {
      if (!activeDoodle || activeDoodle.background_effect === 'aurora' || !activeDoodle.background_effect) {
          return <AuroraEffect />;
      }
      switch (activeDoodle.background_effect) {
          case 'snow': return <SnowEffect />;
          case 'stars': return <StarsEffect />;
          case 'confetti_bg': return <ConfettiBGEffect />;
          case 'none': return null;
          // You can add more complex ones like fireworks if needed.
          default: return <AuroraEffect />;
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
      bg="brand.900"
      bgGradient="linear(to-br, #0F172A, #002952, #0F2F24)"
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
        backgroundImage="linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
        backgroundSize="50px 50px"
        opacity={0.3}
      />

      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={2}
        bg="blackAlpha.500"
        backdropFilter="contrast(1.1) saturate(1.2)"
      />

      <Container maxW="container.xl" zIndex={3} position="relative">
        <Stack spacing={{ base: 10, md: 16 }} align="center" textAlign="center" mx="auto" w="full">

          <Box mt={{ base: 4, md: 8 }}>
            <DoodleLogo doodleData={activeDoodle} />
          </Box>

          <VStack spacing={6} align="center" mt={-4}>
            <Badge
              colorScheme="brand"
              variant="subtle"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="none"
              fontSize="sm"
              bg="whiteAlpha.200"
              color="white"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FaMapMarkerAlt} color="accent.gold" />
              <Typewriter
                words={['Kecamatan Kaliangkrik, Kab. Magelang']}
                loop={1}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </Badge>


          </VStack>

          <Box w="full" maxW="4xl" mt={8}>
            <QuickLinks isHero={true} />
          </Box>

        </Stack>
      </Container>

      {/* Animated Scroll Indicator */}
      <Box
        position="absolute"
        bottom={8}
        left="50%"
        transform="translateX(-50%)"
        zIndex={3}
      >
        <MotionBox
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Icon as={FaChevronDown} color="whiteAlpha.800" w={6} h={6} />
        </MotionBox>
      </Box>

    </Box>
  );
};

export default Hero;
