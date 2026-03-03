import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, Badge, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaChevronRight, FaPlay } from 'react-icons/fa';

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
      height={{ base: '75vh', md: '85vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="gray.900"
    >
      {/* Dynamic Aurora-style Static Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={0}
        overflow="hidden"
      >
        {/* Main Gradient Base */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-br, #0F2F24, #0d1117)"
        />

        {/* Animated Aurora Blobs */}
        <MotionBox
          position="absolute"
          top="-10%"
          right="-5%"
          width={{ base: '300px', md: '600px' }}
          height={{ base: '300px', md: '600px' }}
          borderRadius="full"
          bg="brand.500"
          filter="blur(100px)"
          opacity={0.3}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <MotionBox
          position="absolute"
          bottom="-5%"
          left="-5%"
          width={{ base: '250px', md: '500px' }}
          height={{ base: '250px', md: '500px' }}
          borderRadius="full"
          bg="purple.600"
          filter="blur(100px)"
          opacity={0.2}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Texture/Grid Overlay */}
        <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity={0.1}
            backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
            backgroundSize="40px 40px"
        />
      </Box>

      {/* Gradient Overlay (IKN Inspired Deep Green) */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
        background="linear-gradient(180deg, rgba(15, 47, 36, 0.4) 0%, rgba(13, 17, 23, 0.3) 50%, rgba(13, 17, 23, 0.95) 100%)"
      />

      <Container maxW="container.xl" zIndex={2} position="relative">
        <Stack spacing={8} maxW="3xl">
          <VStack align="start" spacing={3}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                  <Badge
                    px={4} py={1}
                    borderRadius="full"
                    bg="rgba(19, 127, 236, 0.2)"
                    color="brand.300"
                    border="1px solid"
                    borderColor="brand.500"
                    backdropFilter="blur(10px)"
                  >
                      {language === 'id' ? 'Selamat Datang di Portal Resmi' : 'Welcome to the Official Portal'}
                  </Badge>
              </MotionBox>

              <MotionHeading
                as="h1"
                fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '8xl' })}
                color="white"
                lineHeight="1.0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                fontWeight="800"
                letterSpacing="-0.02em"
              >
                {t.title.split(' ').map((word, i) => (
                    <Text as="span" key={i} color={i === t.title.split(' ').length - 1 ? "brand.400" : "inherit"}>
                        {word}{' '}
                    </Text>
                ))}
              </MotionHeading>
          </VStack>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: '2xl' })}
            color="whiteAlpha.800"
            fontWeight="400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            maxW="2xl"
            lineHeight="1.6"
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={6}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              as={RouterLink}
              to="/profil"
              size="xl"
              colorScheme="brand"
              px={10}
              height="70px"
              fontSize="lg"
              boxShadow="0 20px 40px -10px rgba(19, 127, 236, 0.5)"
              borderRadius="2xl"
              rightIcon={<FaChevronRight />}
              _hover={{ transform: 'translateY(-4px)', boxShadow: '0 25px 50px -12px rgba(19, 127, 236, 0.6)' }}
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="xl"
              variant="outline"
              color="white"
              px={10}
              height="70px"
              fontSize="lg"
              borderColor="whiteAlpha.400"
              borderRadius="2xl"
              backdropFilter="blur(10px)"
              leftIcon={<FaPlay />}
              _hover={{ bg: 'whiteAlpha.200', borderColor: 'white' }}
            >
              {language === 'id' ? 'Jelajahi Media' : 'Explore Media'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
