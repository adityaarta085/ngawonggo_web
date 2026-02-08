
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

const AdBlockOverlay = () => {
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const handleDetected = (e) => {
      setIsDetected(e.detail);
    };

    window.addEventListener('adBlockDetected', handleDetected);
    return () => window.removeEventListener('adBlockDetected', handleDetected);
  }, []);

  if (!isDetected) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={99999}
      bg="rgba(0, 0, 0, 0.85)"
      style={{ backdropFilter: 'blur(10px)' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Center p={8}>
        <VStack
          bg={useColorModeValue('white', 'gray.800')}
          p={10}
          borderRadius="2xl"
          spacing={6}
          maxW="md"
          textAlign="center"
          boxShadow="2xl"
        >
          <WarningIcon w={12} h={12} color="orange.400" />
          <Heading size="lg">Adblocker Terdeteksi</Heading>
          <Text fontSize="md">
            Kami mendeteksi Anda menggunakan pemblokir iklan.
          </Text>
          <Text fontSize="sm" color="gray.500">
            Website ini bergantung pada iklan untuk operasional.
            Silakan nonaktifkan adblocker lalu refresh halaman untuk melanjutkan.
            Terima kasih atas pengertiannya 🙏
          </Text>
          <Button
            colorScheme="brand"
            size="lg"
            width="full"
            onClick={() => window.location.reload()}
          >
            Saya sudah menonaktifkan adblock
          </Button>
          <Text fontSize="xs" color="gray.400">
            Jika ini kesalahan, silakan refresh halaman.
          </Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default AdBlockOverlay;
