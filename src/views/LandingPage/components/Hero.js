import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);

const Hero = ({ isReady }) => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box
      position="relative"
      height={{ base: '70vh', md: '85vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="brand.600"
      bgGradient="linear(to-br, brand.600, brand.800, #0F2F24)"
    >
      {/* Animated Aurora Background Effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
        opacity={0.4}
        bgGradient="radial(circle at 20% 30%, brand.400 0%, transparent 50%), radial(circle at 80% 70%, purple.500 0%, transparent 50%)"
        filter="blur(80px)"
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
            textShadow="2px 2px 8px rgba(0,0,0,0.3)"
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
            textShadow="1px 1px 4px rgba(0,0,0,0.3)"
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
              borderRadius="full"
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
              borderRadius="full"
            >
              {language === 'id' ? 'Galeri Media' : 'Media Gallery'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
