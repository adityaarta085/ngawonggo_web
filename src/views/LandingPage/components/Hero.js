import React, { useRef, useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, IconButton, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';


const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);

const Hero = ({ isReady }) => {
  const { language } = useLanguage();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
    }

    // Attempt to play video when isReady is true and on any user interaction
    const playVideo = () => {
      if (videoRef.current && isReady) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay blocked, waiting for interaction:", error);
          });
        }
      }
    };

    if (isReady) {
        playVideo();
    }

    window.addEventListener('click', playVideo);
    window.addEventListener('touchstart', playVideo);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      }
      window.removeEventListener('click', playVideo);
      window.removeEventListener('touchstart', playVideo);
    };
  }, [isReady]);

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent triggering the global click listener
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

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
      {isReady && (
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
      )}

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

      {/* Video Control Button */}
      {isReady && (
        <Box
          position="absolute"
          bottom={{ base: "4", md: "8" }}
          right={{ base: "4", md: "8" }}
          zIndex={10}
        >
          <Tooltip label={isPlaying ? (language === 'id' ? 'Jeda Video' : 'Pause Video') : (language === 'id' ? 'Putar Video' : 'Play Video')}>
            <IconButton
              onClick={togglePlay}
              icon={isPlaying ? <FaPause size="12px" /> : <FaPlay size="12px" style={{ marginLeft: '2px' }} />}
              aria-label="Toggle Video"
              size="sm"
              rounded="full"
              bg="whiteAlpha.200"
              color="white"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _hover={{
                bg: "whiteAlpha.400",
                transform: "scale(1.1)"
              }}
              _active={{
                bg: "whiteAlpha.500"
              }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Box>
      )}

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
            {'Mewujudkan Desa Ngawonggo yang Mandiri & Digital'}
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
            {'Menuju Era Digital 2045 dengan kearifan lokal dan potensi alam yang asri.'}
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
              {'Jelajahi Desa'}
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
