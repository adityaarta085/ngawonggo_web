import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload } from 'react-icons/fa';

const MotionBox = motion(Box);

const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = React.useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  // Logic to determine if we should show the custom UI
  // User requested: "custom install ... cuma hadir di mobile ... di bagian bawah"
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isInstallable || !isVisible || !isMobile) return null;

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex={10000}
        p={4}
        pb={{ base: 6, md: 4 }}
      >
        <Box
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="0 -4px 20px rgba(0,0,0,0.15)"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          maxW="md"
          mx="auto"
        >
          <Flex align="center" p={4} gap={4}>
            <Box boxSize="50px" borderRadius="xl" overflow="hidden" flexShrink={0} bg="gray.100">
               <Image src="/logo_desa.png" boxSize="full" objectFit="contain" />
            </Box>

            <Box flex={1}>
               <Text fontWeight="bold" fontSize="md" color={textColor} lineHeight="tight">
                 Aplikasi Desa Ngawonggo
               </Text>
               <Text fontSize="xs" color={subTextColor}>
                 Pasang di layar utama untuk akses cepat
               </Text>
            </Box>

            <Flex align="center" gap={2}>
              <Button
                colorScheme="brand"
                size="sm"
                leftIcon={<FaDownload fontSize="12px" />}
                onClick={installApp}
                borderRadius="full"
                px={4}
                fontSize="sm"
              >
                 Pasang
              </Button>
              <IconButton
                icon={<FaTimes />}
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                aria-label="Tutup"
                borderRadius="full"
              />
            </Flex>
          </Flex>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default InstallPWA;
