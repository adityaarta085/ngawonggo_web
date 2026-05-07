import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  IconButton,
  HStack,
  useToast
} from '@chakra-ui/react';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload } from 'react-icons/fa';


const MotionBox = motion(Box);

const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Detect mobile
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/.test(userAgent);

    // Check if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

    // Detect iOS devices specifically, as they don't support beforeinstallprompt
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const isDismissed = localStorage.getItem('pwa_dismissed');

    // Show popup if: it's a mobile device, NOT already installed, NOT dismissed,
    // AND (isInstallable via Android event OR is iOS where we show manual instruction)
    if (isMobileDevice && !isStandalone && !isDismissed && (isInstallable || isIOSDevice)) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable]);

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('pwa_dismissed', 'true');
    } catch (e) {
      console.warn('Failed to save dismissal to localStorage:', e);
    }
  };

  const handleInstall = async () => {
    if (isIOS) {
      // iOS doesn't support programmatic install. Show instructions.
      toast({
        title: 'Cara Install di iOS',
        description: "Ketuk ikon Share di bawah layar, lalu pilih 'Add to Home Screen'.",
        status: 'info',
        duration: 7000,
        isClosable: true,
        position: 'bottom',
      });
    } else {
      // Android / Chrome supports programmatic install
      await installApp();
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          position="fixed"
          bottom="4"
          left="4"
          right="4"
          zIndex={10000}
        >
          <Box
            layerStyle="glassCard"
            p={3}
            maxW="md"
            mx="auto"
            position="relative"
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            boxShadow="0 10px 30px -10px rgba(0,0,0,0.2)"
            border="1px solid"
            borderColor="whiteAlpha.400"
            _hover={{ transform: 'none' }} // Disable the hover lift for this specific popup
          >
            <Flex align="center" justify="space-between" gap={3}>
              <HStack spacing={3} flex={1}>
                <Box boxSize="40px" borderRadius="xl" overflow="hidden" flexShrink={0} bg="white" _dark={{ bg: "gray.800" }} p={1} boxShadow="sm" border="1px solid" borderColor="gray.100">
                   <Box bg="brand.600" p={1} borderRadius="md"><Image src="/logo_desa.png" boxSize="full" objectFit="contain" /></Box>
                </Box>

                <Box overflow="hidden">
                   <Text fontWeight="bold" fontSize="sm" color={textColor} isTruncated>
                     Desa Ngawonggo App
                   </Text>
                   <Text fontSize="2xs" color={subTextColor} isTruncated>
                     Akses lebih cepat & ringan
                   </Text>
                </Box>
              </HStack>

              <Flex align="center" gap={1}>
                <Button
                  colorScheme="brand"
                  size="xs"
                  leftIcon={<FaDownload fontSize="10px" />}
                  onClick={handleInstall}
                  borderRadius="full"
                  px={3}
                  fontSize="2xs"
                  h="28px"
                  fontWeight="bold"
                >
                   Pasang
                </Button>
                <IconButton
                  icon={<FaTimes size="12px" />}
                  size="xs"
                  variant="ghost"
                  onClick={handleDismiss}
                  aria-label="Tutup"
                  borderRadius="full"
                  h="28px"
                  w="28px"
                  color="gray.500"
                />
              </Flex>
            </Flex>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default InstallPWA;
