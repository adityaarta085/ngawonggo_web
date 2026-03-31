import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaArrowRight, FaPlay } from 'react-icons/fa';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);
const MotionBox = motion(Box);

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box
      position="relative"
      minH="100svh"
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
        <Stack spacing={{ base: 6, md: 10 }} maxW="4xl" align="center" textAlign="center" mx="auto">
          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '8xl' })}
            color="white"
            lineHeight="1.1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, type: "spring", stiffness: 50 }}
            textShadow="0 15px 40px rgba(0,0,0,0.6)"
            fontWeight="900"
            bgClip="text"
            bgGradient="linear(to-r, white, whiteAlpha.800)"
          >
            {t.title}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: '2xl' })}
            color="whiteAlpha.900"
            fontWeight="500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
            textShadow="0 4px 15px rgba(0,0,0,0.4)"
            maxW="2xl"
            lineHeight="tall"
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={6}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 50 }}
            pt={6}
            justify="center"
          >
            <Button
              as={RouterLink}
              to="/profil"
              size="xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              color="white"
              px={12}
              height="70px"
              fontSize="lg"
              boxShadow="0 15px 30px -10px rgba(19, 127, 236, 0.6)"
              borderRadius="full"
              rightIcon={<Icon as={FaArrowRight} />}
              _hover={{
                transform: 'translateY(-5px) scale(1.05)',
                boxShadow: '0 25px 50px -10px rgba(19, 127, 236, 0.8)',
                bgGradient: "linear(to-r, brand.300, brand.500)"
              }}
              transition="all 0.4s cubic-bezier(.4,0,.2,1)"
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="xl"
              variant="outline"
              color="white"
              _hover={{
                bg: 'whiteAlpha.200',
                transform: 'translateY(-5px)',
                borderColor: 'white'
              }}
              px={12}
              height="70px"
              fontSize="lg"
              borderColor="whiteAlpha.500"
              borderRadius="full"
              leftIcon={<Icon as={FaPlay} />}
              backdropFilter="blur(15px)"
              transition="all 0.4s cubic-bezier(.4,0,.2,1)"
            >
              {language === 'id' ? 'Galeri Media' : 'Media Gallery'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>

      {/* Enhanced Scroll Indicator */}
      <MotionBox
        position="absolute"
        bottom="40px"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="widest" mb={3} textTransform="uppercase">Scroll</Text>
        <MotionBox
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box w="2px" h="60px" bgGradient="linear(to-b, whiteAlpha.900, transparent)" borderRadius="full" />
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default Hero;
