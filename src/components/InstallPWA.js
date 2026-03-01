import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  VStack,
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
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const dividerColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  if (!isInstallable || !isVisible) return null;

  return (
    <AnimatePresence>
      {/* Mobile Version - Clean & Honest */}
      <MotionBox
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={5000}
        p={4}
        display={{ base: "block", md: "none" }}
      >
        <Box
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="0 -10px 40px rgba(0,0,0,0.15)"
          p={5}
          position="relative"
          border="1px solid"
          borderColor={dividerColor}
        >
          <CloseButton
            position="absolute"
            top={2}
            right={2}
            onClick={() => setIsVisible(false)}
            size="sm"
          />

          <VStack spacing={4} align="stretch">
            <Flex align="center" gap={4}>
              <Box
                boxSize="60px"
                borderRadius="15px"
                overflow="hidden"
                bg="white"
                flexShrink={0}
                border="1px solid"
                borderColor="gray.100"
              >
                <Image src="/logo_desa.png" boxSize="full" objectFit="contain" p={1} />
              </Box>

              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="700" fontSize="lg" color={textColor} lineHeight="1.2">
                  Desa Ngawonggo
                </Text>
                <Text fontSize="xs" color={subTextColor} fontWeight="500">
                  Aplikasi Resmi Pemerintah Desa
                </Text>
                <Text fontSize="xs" color="blue.500" mt={1}>
                  Versi PWA (Web App)
                </Text>
              </VStack>
            </Flex>

            <Box>
                <Text fontSize="xs" color={subTextColor} mb={3}>
                    Pasang aplikasi di layar utama untuk akses informasi desa yang lebih cepat dan mudah.
                </Text>
                <Button
                    w="full"
                    colorScheme="brand"
                    size="md"
                    borderRadius="full"
                    fontWeight="bold"
                    onClick={installApp}
                    h="44px"
                >
                    Pasang Sekarang
                </Button>
            </Box>
          </VStack>
        </Box>
      </MotionBox>

      {/* Desktop Version */}
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
