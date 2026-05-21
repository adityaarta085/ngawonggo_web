import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemePreference } from '../../../contexts/ThemePreferenceContext';

const MotionBox = motion(Box);

const QuranAccess = () => {
  const { landingTheme } = useThemePreference();
  const minButtonBg = useColorModeValue("white", "gray.800");
  const bgVibrant = useColorModeValue('linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)');
  const bgMinimalist = useColorModeValue('brand.500', 'brand.600');
  const bg = landingTheme === 'vibrant' ? bgVibrant : bgMinimalist;

  return (
    <Container maxW="container.xl" py={6}>
      <MotionBox
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        bg={bg}
        borderRadius={landingTheme === 'vibrant' ? "3xl" : "2xl"}
        p={landingTheme === 'vibrant' ? { base: 8, md: 10 } : { base: 6, md: 8 }}
        color="white"
        position="relative"
        overflow="hidden"
        boxShadow={landingTheme === 'vibrant' ? "2xl" : "xl"}
        border={landingTheme === 'vibrant' ? "4px solid white" : "none"}
      >
        <Box position="absolute" right="-10px" bottom="-10px" opacity={0.1}>
          <Icon as={FaBookOpen} w="200px" h="200px" />
        </Box>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={6}
          position="relative"
          zIndex={1}
        >
          <Box textAlign={{ base: 'center', md: 'left' }} flex={1}>
            <Heading size={landingTheme === 'vibrant' ? "xl" : "lg"} mb={2} color={landingTheme === 'vibrant' ? "gray.900" : "inherit"} style={landingTheme === 'vibrant' ? { textShadow: '0 2px 4px rgba(255,255,255,0.5)' } : {}}>Al-Qur'an Digital Ngawonggo</Heading>
            <Text fontSize={landingTheme === 'vibrant' ? "lg" : "md"} color={landingTheme === 'vibrant' ? "gray.800" : "inherit"} fontWeight={landingTheme === 'vibrant' ? "bold" : "normal"} opacity={landingTheme === 'vibrant' ? 1 : 0.9} maxW="xl">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara digital.
            </Text>
          </Box>

          <Button
            as={RouterLink}
            to="/quran"
            size="md"
            bg={landingTheme === 'vibrant' ? "gray.900" : minButtonBg}
            color={landingTheme === 'vibrant' ? "white" : "brand.500"}
            px={landingTheme === 'vibrant' ? 10 : 8}
            py={landingTheme === 'vibrant' ? 8 : 6}
            fontSize={landingTheme === 'vibrant' ? "xl" : "lg"}
            fontWeight={landingTheme === 'vibrant' ? "bold" : "normal"}
            borderRadius="full"
            rightIcon={<FaArrowRight />}
            _hover={landingTheme === 'vibrant' ? {
              bg: 'black',
              transform: 'translateX(5px) scale(1.05)',
            } : {
              bg: 'gray.100',
              transform: 'translateX(5px)',
            }}
            boxShadow={landingTheme === 'vibrant' ? "xl" : "md"}
          >
            Buka Al-Qur'an
          </Button>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default QuranAccess;
