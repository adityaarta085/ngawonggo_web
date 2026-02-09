import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaChevronDown, FaRocket } from 'react-icons/fa';
import LandingImg from '../../../assets/Landing.jpg';

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
      height="100vh"
      minH="600px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg="accent.blue"
    >
      {/* Background Image with Overlay */}
      <Box
        position="absolute"
        inset={0}
        bgImage={`url(${LandingImg})`}
        bgSize="cover"
        bgPosition="center"
        zIndex={0}
        _after={{
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(15, 23, 42, 0.9) 100%)',
        }}
      />

      <Container maxW="container.xl" zIndex={1} position="relative" textAlign="center">
        <Stack spacing={8} alignItems="center">
          {/* Badge */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
          >
            <Box w={2} h={2} borderRadius="full" bg="green.400" className="pulse-animation" />
            <Text color="white" fontSize="xs" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
              {language === 'id' ? 'Menuju Desa Digital 2045' : 'Towards Digital Village 2045'}
            </Text>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '8xl' })}
            color="white"
            lineHeight="1.1"
            fontWeight="900"
            maxW="1000px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {language === 'id' ? (
              <>
                Desa Masa Depan untuk <Box as="span" bgGradient="linear(to-r, #C5A96F, #F7E7C0)" bgClip="text">Semua</Box>
              </>
            ) : (
              <>
                Future Village for <Box as="span" bgGradient="linear(to-r, #C5A96F, #F7E7C0)" bgClip="text">All</Box>
              </>
            )}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}
            color="whiteAlpha.900"
            maxW="700px"
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
              px={10}
              height="60px"
              fontSize="md"
              borderRadius="full"
              rightIcon={<Icon as={FaRocket} />}
              _hover={{ transform: 'scale(1.05)' }}
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="lg"
              variant="outline"
              color="white"
              borderColor="whiteAlpha.400"
              bg="whiteAlpha.100"
              backdropFilter="blur(10px)"
              _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
              px={10}
              height="60px"
              fontSize="md"
              borderRadius="full"
            >
              {language === 'id' ? 'Pelajari Visi' : 'Learn Vision'}
            </Button>
          </MotionStack>
        </Stack>
      </Container>

      {/* Scroll Indicator */}
      <MotionBox
        position="absolute"
        bottom={10}
        left="50%"
        transform="translateX(-50%)"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        zIndex={2}
      >
        <Icon as={FaChevronDown} color="whiteAlpha.700" boxSize={8} />
      </MotionBox>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
          }
          .pulse-animation {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default Hero;
