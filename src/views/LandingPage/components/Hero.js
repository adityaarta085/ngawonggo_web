import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaArrowRight, FaPlay } from 'react-icons/fa';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);
const MotionBox = motion(Box);

const Hero = ({ isReady }) => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box
      position="relative"
      height={{ base: '85vh', md: '100vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="brand.900"
      bgGradient="linear(to-br, #0F172A, brand.900, #0F2F24)"
      pt={{ base: "180px", md: "220px" }}
    >
      {/* Animated Aurora Background Effect */}
      <MotionBox
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        zIndex={1}
        opacity={0.5}
        bgGradient="radial(circle at 20% 30%, brand.400 0%, transparent 50%), radial(circle at 80% 70%, purple.600 0%, transparent 50%), radial(circle at 50% 50%, teal.500 0%, transparent 40%)"
        filter="blur(100px)"
        animate={{
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={2}
        bg="blackAlpha.400"
        backdropFilter="contrast(1.1) saturate(1.2)"
      />

      <Container maxW="container.xl" zIndex={3} position="relative">
        <Stack spacing={8} maxW="4xl">
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
             <Flex align="center" gap={3} mb={4}>
                <Box h="2px" w="40px" bg="accent.gold" />
                <Text color="accent.gold" fontWeight="800" letterSpacing="widest" fontSize="sm">
                   SELAMAT DATANG DI DESA DIGITAL
                </Text>
             </Flex>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '8xl' })}
            color="white"
            lineHeight="1.05"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            textShadow="0 10px 30px rgba(0,0,0,0.5)"
            fontWeight="900"
          >
            {t.title}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: '2xl' })}
            color="whiteAlpha.900"
            fontWeight="500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            textShadow="0 4px 10px rgba(0,0,0,0.3)"
            maxW="2xl"
            lineHeight="tall"
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={6}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            pt={4}
          >
            <Button
              as={RouterLink}
              to="/profil"
              size="xl"
              colorScheme="brand"
              px={10}
              height="70px"
              fontSize="lg"
              boxShadow="0 15px 30px -10px rgba(19, 127, 236, 0.5)"
              borderRadius="full"
              rightIcon={<Icon as={FaArrowRight} />}
              _hover={{ transform: 'translateY(-3px) scale(1.02)', boxShadow: '0 20px 40px -10px rgba(19, 127, 236, 0.6)' }}
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="xl"
              variant="outline"
              color="white"
              _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-3px)' }}
              px={10}
              height="70px"
              fontSize="lg"
              borderColor="whiteAlpha.500"
              borderRadius="full"
              leftIcon={<Icon as={FaPlay} />}
              backdropFilter="blur(10px)"
            >
              {language === 'id' ? 'Galeri Media' : 'Media Gallery'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>

      {/* Scroll Indicator */}
      <MotionBox
        position="absolute"
        bottom="40px"
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
        animate={{
          y: [0, 10, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box w="2px" h="60px" bgGradient="linear(to-b, whiteAlpha.800, transparent)" />
      </MotionBox>
    </Box>
  );
};

export default Hero;
