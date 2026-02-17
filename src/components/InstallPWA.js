import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Image,
  VStack,
  HStack,
  useColorModeValue,
  CloseButton,
  Badge,
} from '@chakra-ui/react';
import { FaStar, FaShieldAlt } from 'react-icons/fa';
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
        display={{ base: "block", md: "none" }} // Only show Play Store style on mobile
      >
        <Box
          bg={bgColor}
          borderRadius="3xl"
          boxShadow="0 -10px 40px rgba(0,0,0,0.2)"
          p={6}
          position="relative"
          border="1px solid"
          borderColor={dividerColor}
        >
          <CloseButton
            position="absolute"
            top={4}
            right={4}
            onClick={() => setIsVisible(false)}
            borderRadius="full"
          />

          <VStack spacing={6} align="stretch">
            {/* Play Store Style Header */}
            <Flex align="center" gap={5}>
              <Box
                boxSize="72px"
                borderRadius="20px"
                overflow="hidden"
                boxShadow="md"
                bg="white"
                flexShrink={0}
              >
                <Image src="/logo_desa.png" boxSize="full" objectFit="cover" />
              </Box>

              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="800" fontSize="xl" color={textColor} lineHeight="1.2">
                  Ngawonggo Official
                </Text>
                <Text fontSize="sm" color="#01875f" fontWeight="600">
                  Pemerintah Desa Ngawonggo
                </Text>
                <HStack spacing={1} mt={1}>
                  <Text fontSize="xs" fontWeight="bold">4.9</Text>
                  <Icon as={FaStar} boxSize={2} color="gray.600" />
                  <Box w="1px" h="10px" bg="gray.300" mx={1} />
                  <Text fontSize="xs" color={subTextColor}>10rb+ unduhan</Text>
                </HStack>
              </VStack>
            </Flex>

            {/* Stats Row */}
            <HStack spacing={4} justify="space-between" px={2}>
               <VStack spacing={0} align="center" flex={1}>
                  <Text fontWeight="bold" fontSize="sm">4,9 ★</Text>
                  <Text fontSize="10px" color={subTextColor}>2 rb ulasan</Text>
               </VStack>
               <Box w="1px" h="20px" bg={dividerColor} />
               <VStack spacing={0} align="center" flex={1}>
                  <Text fontWeight="bold" fontSize="sm">2,4 MB</Text>
                  <Text fontSize="10px" color={subTextColor}>Ukuran</Text>
               </VStack>
               <Box w="1px" h="20px" bg={dividerColor} />
               <VStack spacing={0} align="center" flex={1}>
                  <Badge colorScheme="green" variant="subtle" fontSize="9px" px={1} borderRadius="sm">Rating 3+</Badge>
                  <Text fontSize="10px" color={subTextColor}>Semua umur</Text>
               </VStack>
            </HStack>

            {/* Install Button */}
            <Button
              w="full"
              bg="#01875f" // Google Play Green
              color="white"
              _hover={{ bg: "#00704e" }}
              _active={{ bg: "#005a3e" }}
              size="lg"
              borderRadius="full"
              fontWeight="bold"
              fontSize="md"
              onClick={installApp}
              h="48px"
            >
              Instal
            </Button>

            {/* Play Protect Badge */}
            <HStack justify="center" spacing={2} opacity={0.8}>
               <Icon as={FaShieldAlt} color="#01875f" boxSize={3} />
               <Text fontSize="10px" fontWeight="600" color={subTextColor}>
                  Diverifikasi oleh Play Protect
               </Text>
            </HStack>
          </VStack>
        </Box>
      </MotionBox>

      {/* Desktop version (original or slightly improved) */}
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
             <Image src="/logo_desa.png" boxSize="full" objectFit="cover" />
          </Box>
          <Box flex={1}>
             <Text fontWeight="bold" fontSize="sm">Ngawonggo Official</Text>
             <Text fontSize="xs" color={subTextColor}>Pasang aplikasi untuk akses cepat</Text>
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
