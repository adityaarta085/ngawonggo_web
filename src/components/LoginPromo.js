import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,

  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Heading,
  Icon,
  Box,
  useDisclosure,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { FaUserCircle, FaRocket, FaLock, FaGift } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoginPromo = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (user || hasShown) return;

    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    const newVisitCount = visitCount + 1;
    localStorage.setItem('visitCount', newVisitCount.toString());

    // Show on second visit
    if (newVisitCount === 2) {
      const timer = setTimeout(() => {
        onOpen();
        setHasShown(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [user, hasShown, onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(10px) saturate(180%)" bg="blackAlpha.700" />
      <ModalContent
        borderRadius="3xl"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg="white"
      >
        <Box
          bgGradient="linear(to-br, brand.500, brand.700)"
          px={8}
          py={10}
          color="white"
          position="relative"
          textAlign="center"
        >
          <Box position="absolute" top="-20px" right="-20px" opacity={0.1}>
            <Icon as={FaRocket} w="150px" h="150px" />
          </Box>
          <VStack spacing={4}>
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Flex
                w={20}
                h={20}
                bg="whiteAlpha.200"
                borderRadius="full"
                align="center"
                justify="center"
                backdropFilter="blur(5px)"
                border="2px solid"
                borderColor="whiteAlpha.400"
              >
                <Icon as={FaUserCircle} w={10} h={10} />
              </Flex>
            </MotionBox>
            <Box>
              <Heading size="lg" fontWeight="900">Halo, Tetangga!</Heading>
              <Text fontSize="md" fontWeight="600" opacity={0.9}>
                Ingin pengalaman yang lebih personal?
              </Text>
            </Box>
          </VStack>
        </Box>

        <ModalCloseButton color="white" borderRadius="full" />

        <ModalBody p={8}>
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={4}>
              <HStack spacing={4}>
                <Flex w={10} h={10} bg="blue.50" color="brand.500" borderRadius="xl" align="center" justify="center" flexShrink={0}>
                  <Icon as={FaLock} />
                </Flex>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="800" fontSize="sm">Akses Fitur Eksklusif</Text>
                  <Text fontSize="xs" color="gray.500">Gunakan Portal Warga untuk layanan mandiri.</Text>
                </VStack>
              </HStack>

              <HStack spacing={4}>
                <Flex w={10} h={10} bg="orange.50" color="orange.500" borderRadius="xl" align="center" justify="center" flexShrink={0}>
                  <Icon as={FaGift} />
                </Flex>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="800" fontSize="sm">Simpan Progres</Text>
                  <Text fontSize="xs" color="gray.500">Progres baca Al-Quran & skor game tersimpan otomatis.</Text>
                </VStack>
              </HStack>
            </VStack>

            <VStack spacing={3}>
              <Button
                as={RouterLink}
                to="/auth"
                w="full"
                colorScheme="brand"
                size="lg"
                borderRadius="2xl"
                fontWeight="800"
                boxShadow="xl"
                onClick={onClose}
              >
                Masuk / Daftar Sekarang
              </Button>
              <Button
                variant="ghost"
                w="full"
                size="sm"
                color="gray.400"
                fontWeight="700"
                onClick={onClose}
              >
                Mungkin Nanti Saja
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginPromo;
