import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const QuranAccess = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring' }}
        bg="neo.teal"
        border="4px solid black"
        boxShadow="6px 6px 0px black"
        borderRadius="xl"
        p={{ base: 6, md: 10 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" right="-20px" bottom="-20px" opacity={0.25} style={{ animation: 'spin-slow 60s linear infinite' }}>
          <Icon as={FaBookOpen} w="250px" h="250px" color="black" />
        </Box>

        {/* Decorative corner stars */}
        <Box position="absolute" top={4} left={4} color="black">★</Box>
        <Box position="absolute" bottom={4} left={4} color="black">★</Box>
        <Box position="absolute" top={4} right={4} color="black">★</Box>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={6}
          position="relative"
          zIndex={1}
        >
          <Box textAlign={{ base: 'center', md: 'left' }} flex={1} px={4}>
            <Heading fontFamily="heading" size="2xl" mb={3} color="black" fontWeight="900" textTransform="uppercase">
              Al-Qur'an Digital
            </Heading>
            <Text fontFamily="body" fontSize="lg" color="black" opacity={0.8} fontWeight="bold" maxW="2xl">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara digital.
            </Text>
          </Box>

          <Button
            as={RouterLink}
            to="/quran"
            size="lg"
            bg="black"
            color="white"
            border="3px solid"
            borderColor="neo.yellow"
            boxShadow="6px 6px 0px #FFE156"
            px={8}
            py={8}
            fontSize="xl"
            borderRadius="md"
            rightIcon={<FaArrowRight />}
            _hover={{
              transform: 'translate(-2px, -2px)',
              boxShadow: '8px 8px 0px #FFE156',
              bg: 'gray.900'
            }}
            _active={{
              transform: 'translate(2px, 2px)',
              boxShadow: '0px 0px 0px #FFE156',
            }}
          >
            BUKA AL-QUR'AN
          </Button>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default QuranAccess;
