import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaRocket, FaChevronDown } from 'react-icons/fa';

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
      minH="700px"
      width="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg="ikn.green"
    >
      {/* Background Image */}
      <Box
        position="absolute"
        inset={0}
        bgImage="url('https://images.unsplash.com/photo-1570535171731-030f2c0022d2?auto=format&fit=crop&q=80&w=2000')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        zIndex={0}
      />

      {/* Hero Gradient Overlay */}
      <Box
        position="absolute"
        inset={0}
        zIndex={1}
        background="linear-gradient(180deg, rgba(15, 47, 36, 0.4) 0%, rgba(15, 47, 36, 0.2) 50%, rgba(15, 47, 36, 0.95) 100%)"
      />

      {/* Hero Content */}
      <Container maxW="container.xl" zIndex={2} position="relative" mt={20}>
        <Flex direction="column" align="center" textAlign="center" maxW="4xl" mx="auto">
          <MotionBox
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={4}
            py={1}
            rounded="full"
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            mb={8}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box w={2} h={2} rounded="full" bg="green.400" />
            <Text color="white" fontSize="xs" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
              {language === 'id' ? 'Menuju Desa Digital 2045' : 'Towards Digital Village 2045'}
            </Text>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '84px' })}
            color="white"
            fontWeight="900"
            lineHeight="1.1"
            letterSpacing="tight"
            mb={6}
            textShadow="0 4px 12px rgba(0,0,0,0.3)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {language === 'id' ? (
              <>Desa Mandiri untuk <Text as="span" color="ikn.gold">Masa Depan</Text></>
            ) : (
              <>Independent Village for <Text as="span" color="ikn.gold">The Future</Text></>
            )}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}
            color="whiteAlpha.900"
            fontWeight="medium"
            maxW="2xl"
            mb={10}
            lineHeight="relaxed"
            textShadow="0 2px 4px rgba(0,0,0,0.3)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            w={{ base: 'full', sm: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              as={RouterLink}
              to="/profil"
              height="60px"
              px={10}
              rounded="full"
              variant="solid"
              leftIcon={<Icon as={FaRocket} />}
              fontSize="md"
              boxShadow="2xl"
              _hover={{ transform: 'scale(1.05)' }}
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              height="60px"
              px={10}
              rounded="full"
              variant="glass"
              leftIcon={<Icon as={FaChevronDown} />}
              fontSize="md"
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              {language === 'id' ? 'Pelajari Visi' : 'Learn Vision'}
            </Button>
          </MotionStack>
        </Flex>
      </Container>

      {/* Scroll Indicator */}
      <MotionBox
        position="absolute"
        bottom={10}
        zIndex={2}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon as={FaChevronDown} color="whiteAlpha.700" boxSize={8} />
      </MotionBox>
    </Box>
  );
};

export default Hero;
