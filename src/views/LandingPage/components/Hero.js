import React, { useRef, useEffect } from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const videoRef = useRef(null);

  useEffect(() => {
    // Attempt to play video on mount and on any user interaction
    const playVideo = () => {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay blocked, waiting for interaction:", error);
          });
        }
      }
    };

    playVideo();
    window.addEventListener('click', playVideo);
    window.addEventListener('touchstart', playVideo);

    return () => {
      window.removeEventListener('click', playVideo);
      window.removeEventListener('touchstart', playVideo);
    };
  }, []);

  return (
    <Box
      position="relative"
      height={{ base: '70vh', md: '85vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="black"
    >
      {/* Video Background */}
      <Box
        as="video"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src="https://api.deline.web.id/nKT00jDXVR.mp4"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={0}
        opacity={0.8}
      />

      {/* Gradient Overlay (IKN Inspired) */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
        background="linear-gradient(180deg, rgba(15, 47, 36, 0.4) 0%, rgba(15, 47, 36, 0.2) 50%, rgba(15, 47, 36, 0.9) 100%)"
      />

      <Container maxW="container.xl" zIndex={2} position="relative">
        <Stack spacing={6} maxW="3xl">
          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '7xl' })}
            color="white"
            lineHeight="1.1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            textShadow="2px 2px 8px rgba(0,0,0,0.5)"
          >
            {t.title}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}
            color="whiteAlpha.900"
            fontWeight="500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            textShadow="1px 1px 4px rgba(0,0,0,0.5)"
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              as={RouterLink}
              to="/profil"
              size="lg"
              colorScheme="brand"
              px={8}
              height="60px"
              fontSize="md"
              boxShadow="xl"
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="lg"
              variant="outline"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              px={8}
              height="60px"
              fontSize="md"
              borderColor="whiteAlpha.500"
            >
              {language === 'id' ? 'Lihat Video' : 'Watch Video'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
