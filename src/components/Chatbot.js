import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Flex,
  Text,
  useColorModeValue,
  Portal,
  chakra,
  Tooltip,
} from '@chakra-ui/react';
import { FaRobot, FaTimes, FaMinus, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = chakra(motion.div);

const Chatbot = ({ isHidden = false, onHide }) => {
  const [isDocked, setIsDocked] = useState(true); // Default to docked
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.700');

  if (isHidden) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={{ base: 20, md: 24 }}
        right={0}
        zIndex={1001}
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
              <Box position="relative">
                <Tooltip label="Tanya AI Desa" placement="left">
                  <IconButton
                    aria-label="Show chat"
                    icon={<FaRobot />}
                    colorScheme="blue"
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
                <IconButton
                  size="xs"
                  icon={<FaTimes />}
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  colorScheme="red"
                  variant="solid"
                  isRound
                  onClick={onHide}
                  aria-label="Hide assistant"
                  boxShadow="md"
                />
              </Box>
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
                bg="blue.600"
                color="white"
              >
                <Flex align="center" gap={2}>
                  <FaRobot />
                  <Text fontSize="xs" fontWeight="bold">ASISTEN AI DESA</Text>
                </Flex>
                <Flex gap={1}>
                  <IconButton
                    size="xs"
                    icon={<FaMinus />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'blue.500' }}
                    onClick={() => setIsDocked(true)}
                    aria-label="Dock chat"
                  />
                  <IconButton
                    size="xs"
                    icon={<FaTimes />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'blue.500' }}
                    onClick={onHide}
                    aria-label="Close chat"
                  />
                </Flex>
              </Flex>

              {/* Chat Content */}
              <Box h="200px" p={4} overflowY="auto">
                <Box bg="gray.100" p={2} borderRadius="md" mb={2} fontSize="sm">
                  <Text color="gray.800">Halo! Ada yang bisa saya bantu terkait layanan Desa Ngawonggo?</Text>
                </Box>
              </Box>

              {/* Input Area */}
              <Flex p={2} borderTop="1px solid" borderColor={borderColor}>
                <chakra.input
                  flex={1}
                  px={2}
                  py={1}
                  fontSize="sm"
                  placeholder="Ketik pesan..."
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _focus={{ outline: 'none', borderColor: 'blue.400' }}
                />
                <IconButton
                  ml={2}
                  size="sm"
                  icon={<FaPaperPlane />}
                  colorScheme="blue"
                  aria-label="Send message"
                />
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Portal>
  );
};

export default Chatbot;
