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
    <Container maxW="container.xl" py={10}>
      <MotionBox
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        bg={bg}
        borderRadius="3xl"
        p={{ base: 8, md: 12 }}
        color="white"
        position="relative"
        overflow="hidden"
        boxShadow="2xl"
      >
        <Box position="absolute" right="-20px" bottom="-20px" opacity={0.1}>
          <Icon as={FaBookOpen} w="300px" h="300px" />
        </Box>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={8}
          position="relative"
          zIndex={1}
        >
          <Box textAlign={{ base: 'center', md: 'left' }} flex={1}>
            <Heading size="xl" mb={4}>Al-Qur'an Digital Ngawonggo</Heading>
            <Text fontSize="lg" opacity={0.9} maxW="xl">
              Akses kitab suci Al-Qur'an dengan terjemahan, audio, dan tafsir lengkap secara digital untuk kemudahan beribadah masyarakat Desa Ngawonggo.
            </Text>
          </Box>

          <Button
            as={RouterLink}
            to="/quran"
            size="lg"
            bg="white"
            color="brand.500"
            px={10}
            py={8}
            fontSize="xl"
            borderRadius="full"
            rightIcon={<FaArrowRight />}
            _hover={{
              bg: 'gray.100',
              transform: 'translateX(5px)',
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
