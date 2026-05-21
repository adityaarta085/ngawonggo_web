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

const MotionBox = motion(Box);

const QuranAccess = () => {
  const bg = useColorModeValue('linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)');

  return (
    <Container maxW="container.xl" py={6}>
      <MotionBox
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        bg={bg}
        borderRadius="3xl"
        p={{ base: 8, md: 10 }}
        color="white"
        position="relative"
        overflow="hidden"
        boxShadow="2xl"
        border="4px solid white"
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
            <Heading size="xl" mb={2} color="gray.900" style={{ textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>Al-Qur'an Digital Ngawonggo</Heading>
            <Text fontSize="lg" color="gray.800" fontWeight="bold" maxW="xl">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara digital.
            </Text>
          </Box>

          <Button
            as={RouterLink}
            to="/quran"
            size="md"
            bg="gray.900"
            color="white"
            px={10}
            py={8}
            fontSize="xl"
            fontWeight="bold"
            borderRadius="full"
            rightIcon={<FaArrowRight />}
            _hover={{
              bg: 'black',
              transform: 'translateX(5px) scale(1.05)',
            }}
            boxShadow="xl"
          >
            Buka Al-Qur'an
          </Button>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default QuranAccess;
