import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  CloseButton,
} from '@chakra-ui/react';
import { FaDownload, FaMobileAlt } from 'react-icons/fa';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const InstallPWA = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = React.useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('brand.100', 'brand.900');

  if (!isInstallable || !isVisible) return null;

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        position="fixed"
        bottom={{ base: "80px", md: "24px" }}
        left="50%"
        transform="translateX(-50%)"
        zIndex={5000}
        w={{ base: "90%", md: "auto" }}
        maxW="500px"
      >
        <Flex
          bg={bgColor}
          p={4}
          borderRadius="2xl"
          boxShadow="2xl"
          border="2px solid"
          borderColor={borderColor}
          align="center"
          gap={4}
          backdropFilter="blur(10px)"
          position="relative"
        >
          <Flex
            bg="brand.500"
            w="50px"
            h="50px"
            borderRadius="xl"
            align="center"
            justify="center"
            color="white"
            flexShrink={0}
          >
            <Icon as={FaMobileAlt} fontSize="24px" />
          </Flex>

          <Box flex={1}>
            <Text fontWeight="bold" fontSize="md">
              Pasang Aplikasi Ngawonggo
            </Text>
            <Text fontSize="xs" color="gray.500">
              Akses cepat dan mudah langsung dari layar utama Anda.
            </Text>
          </Box>

          <Button
            leftIcon={<FaDownload />}
            colorScheme="brand"
            size="sm"
            borderRadius="full"
            onClick={installApp}
            px={6}
          >
            Pasang
          </Button>

          <CloseButton
            size="sm"
            position="absolute"
            top={1}
            right={1}
            onClick={() => setIsVisible(false)}
          />
        </Flex>
      </MotionBox>
    </AnimatePresence>
  );
};

export default InstallPWA;
