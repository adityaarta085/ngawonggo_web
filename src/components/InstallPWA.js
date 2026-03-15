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
} from '@chakra-ui/react';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload } from 'react-icons/fa';

const MotionBox = motion(Box);

const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the popup
    const isDismissed = localStorage.getItem('pwa_dismissed');
    if (!isDismissed && isInstallable) {
      // Delay showing the popup slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');

  // Logic to determine if we should show the custom UI
  // User requested: "custom install ... cuma hadir di mobile ... di bagian bawah"
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_dismissed', 'true');
  };

  const handleInstall = async () => {
    await installApp();
    setIsVisible(false);
  };

  if (!isInstallable || !isVisible || !isMobile) return null;

  return (
    <AnimatePresence>
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
          _hover={{ transform: 'none' }} // Disable the hover lift for this specific popup
        >
          <Flex align="center" justify="space-between" gap={3}>
            <HStack spacing={3} flex={1}>
              <Box boxSize="40px" borderRadius="xl" overflow="hidden" flexShrink={0} bg="white" p={1} boxShadow="sm">
                 <Image src="/logo_desa.png" boxSize="full" objectFit="contain" />
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
              />
            </Flex>
          </Flex>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default InstallPWA;
