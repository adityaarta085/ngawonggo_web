import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  CloseButton,
} from '@chakra-ui/react';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = React.useState(true);

  const bgColor = useColorModeValue('white', 'gray.900');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const dividerColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  // Logic to determine if we should show the custom UI
  // We only show it on desktop because on mobile we want to use the native Chrome banner
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isInstallable || !isVisible || isMobile) return null;

  return (
    <AnimatePresence>
      {/* Desktop Version - Only shown on desktop */}
      <MotionBox
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        position="fixed"
        bottom="24px"
        right="24px"
        zIndex={5000}
        display={{ base: "none", md: "block" }}
      >
        <Flex
          bg={bgColor}
          p={4}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={dividerColor}
          align="center"
          gap={4}
          maxW="400px"
        >
          <Box boxSize="50px" borderRadius="xl" overflow="hidden" flexShrink={0}>
             <Image src="/logo_desa.png" boxSize="full" objectFit="contain" />
          </Box>
          <Box flex={1}>
             <Text fontWeight="bold" fontSize="sm">Aplikasi Desa Ngawonggo</Text>
             <Text fontSize="xs" color={subTextColor}>Pasang untuk akses lebih cepat</Text>
          </Box>
          <Button colorScheme="brand" size="sm" onClick={installApp} borderRadius="full" px={6}>
             Pasang
          </Button>
          <CloseButton size="sm" onClick={() => setIsVisible(false)} />
        </Flex>
      </MotionBox>
    </AnimatePresence>
  );
};

export default InstallPWA;
