import React from 'react';
import { Box, Container, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import QuickLinks from './QuickLinks';

const MotionBox = motion(Box);

const Hero = () => {
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
      {/* Animated Aurora Background Effect */}
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
          <MotionBox
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            _hover={{ scale: 1.05 }}
            cursor="pointer"
          >
            <NgawonggoLogo fontSize={{ base: "4xl", md: "5xl" }} iconSize={{ base: 24, md: 32 }} flexDirection="column" color="white" />
          </MotionBox>

          <Box w="full" maxW="4xl">
            <QuickLinks isHero={true} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
