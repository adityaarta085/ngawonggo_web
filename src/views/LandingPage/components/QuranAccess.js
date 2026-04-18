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
  const bg = useColorModeValue('brand.500', 'brand.600');

  return (
    <Container maxW="container.xl" py={6}>
      <MotionBox
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        bg={bg}
        borderRadius="2xl"
        p={{ base: 6, md: 8 }}
        color="white"
        position="relative"
        overflow="hidden"
        boxShadow="xl"
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
            <Heading size="lg" mb={2}>Al-Qur'an Digital Ngawonggo</Heading>
            <Text fontSize="md" opacity={0.9} maxW="xl">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara digital.
            </Text>
          </Box>

          <Button
            as={RouterLink}
            to="/quran"
            size="md"
            bg="white"
            color="brand.500"
            px={8}
            py={6}
            fontSize="lg"
            borderRadius="full"
            rightIcon={<FaArrowRight />}
            _hover={{
              bg: 'gray.100',
              transform: 'translateX(5px)',
            }}
            boxShadow="md"
          >
            Buka Al-Qur'an
          </Button>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default QuranAccess;
