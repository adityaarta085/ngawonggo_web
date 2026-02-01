
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box
      position="relative"
      height={{ base: '70vh', md: '85vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="accent.blue"
    >
      {/* Ambient Motion Background */}
      <MotionBox
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        zIndex={0}
        animate={{
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(0,86,179,0.3) 0%, rgba(15,23,42,1) 70%)',
        }}
      />

      <Container maxW="container.xl" zIndex={1} position="relative">
        <Stack spacing={6} maxW="3xl">
          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '7xl' })}
            color="white"
            lineHeight="1.1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.title}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}
            color="gray.300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
            >
              {language === 'id' ? 'Lihat Video' : 'Watch Video'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>

      {/* Decorative element */}
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="40%"
        height="100%"
        opacity={0.1}
        pointerEvents="none"
        bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')"
      />
    </Box>
  );
};

export default Hero;
