import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Flex,
  Text,
  useColorModeValue,
  Tooltip,
  Portal,
  chakra,
} from '@chakra-ui/react';
import { FaYoutube, FaTimes, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = chakra(motion.div);

const MiniPlayer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDocked, setIsDocked] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Auto-dock after 10 seconds
    const timer = setTimeout(() => {
      setIsDocked(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={{ base: 4, md: 8 }}
        right={0}
        zIndex={1000}
        pointerEvents="none"
      >
        <AnimatePresence mode="wait">
          {isDocked ? (
            <MotionBox
              key="docked"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: -10, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              pointerEvents="auto"
            >
              <Tooltip label="Show Live Media" placement="left">
                <IconButton
                  aria-label="Show player"
                  icon={<FaYoutube />}
                  colorScheme="red"
                  onClick={() => setIsDocked(false)}
                  size="lg"
                  isRound
                  boxShadow="2xl"
                  border="2px solid"
                  borderColor="white"
                  _hover={{ transform: 'scale(1.1)', x: -5 }}
                  transition="all 0.2s"
                />
              </Tooltip>
            </MotionBox>
          ) : (
            <MotionBox
              key="expanded"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: -20, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              pointerEvents="auto"
              w={{ base: '280px', md: '320px' }}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="2xl"
              border="1px solid"
              borderColor={borderColor}
              overflow="hidden"
            >
              {/* Header */}
              <Flex
                align="center"
                justify="space-between"
                px={4}
                py={2}
                bg="red.600"
                color="white"
              >
                <Flex align="center" gap={2}>
                  <FaYoutube />
                  <Text fontSize="xs" fontWeight="bold">LIVE MEDIA</Text>
                </Flex>
                <Flex gap={1}>
                  <IconButton
                    size="xs"
                    icon={<FaMinus />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'red.500' }}
                    onClick={() => setIsDocked(true)}
                    aria-label="Dock player"
                  />
                  <IconButton
                    size="xs"
                    icon={<FaTimes />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'red.500' }}
                    onClick={() => setIsOpen(false)}
                    aria-label="Close player"
                  />
                </Flex>
              </Flex>

              {/* Video Content */}
              <Box position="relative" pb="56.25%" h={0}>
                <chakra.iframe
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  src="https://www.youtube.com/embed/Wc7lxuRx0LI?autoplay=0&mute=1"
                  title="Desa Ngawonggo Profile"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>

              <Box p={3}>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  Sedang Tayang: Profil Desa Ngawonggo 2024
                </Text>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Portal>
  );
};

export default MiniPlayer;
