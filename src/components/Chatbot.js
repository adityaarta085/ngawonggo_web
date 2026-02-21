import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Flex,
  Text,
  useColorModeValue,
  Portal,
  chakra,
  Tooltip,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { FaRobot, FaTimes, FaMinus, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MotionBox = chakra(motion.div);

const Chatbot = ({ isHidden = false, onHide }) => {
  const [isDocked, setIsDocked] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Desa Ngawonggo. Ada yang bisa saya bantu?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const userBubbleBg = useColorModeValue('blue.500', 'blue.600');
  const botBubbleBg = useColorModeValue('gray.100', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isDocked]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].slice(-6) // Send last 6 messages for context
      });

      const botMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan saat menghubungi asisten AI. ' + (error.response?.data?.error || 'Silakan coba lagi nanti.')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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
              w={{ base: '300px', md: '350px' }}
              bg={bgColor}
              borderRadius="2xl"
              boxShadow="2xl"
              border="1px solid"
              borderColor={borderColor}
              overflow="hidden"
              display="flex"
              flexDirection="column"
              maxH="500px"
            >
              {/* Header */}
              <Flex
                align="center"
                justify="space-between"
                px={4}
                py={3}
                bg="blue.600"
                color="white"
              >
                <Flex align="center" gap={2}>
                  <FaRobot />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold">ASISTEN AI DESA</Text>
                    <Text fontSize="10px" opacity={0.8}>Aktif • Didukung oleh Groq</Text>
                  </VStack>
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
              <Box
                ref={scrollRef}
                flex={1}
                p={4}
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '4px' },
                }}
              >
                <VStack spacing={4} align="stretch">
                  {messages.map((msg, i) => (
                    <Flex
                      key={i}
                      justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="85%"
                        bg={msg.role === 'user' ? userBubbleBg : botBubbleBg}
                        color={msg.role === 'user' ? 'white' : 'inherit'}
                        px={3}
                        py={2}
                        borderRadius="xl"
                        borderBottomRightRadius={msg.role === 'user' ? '2px' : 'xl'}
                        borderBottomLeftRadius={msg.role === 'assistant' ? '2px' : 'xl'}
                        fontSize="sm"
                        boxShadow="sm"
                      >
                        <Text whiteSpace="pre-wrap">{msg.content}</Text>
                      </Box>
                    </Flex>
                  ))}
                  {isLoading && (
                    <Flex justify="flex-start">
                      <Box bg={botBubbleBg} px={3} py={2} borderRadius="xl" borderBottomLeftRadius="2px">
                        <Spinner size="xs" color="blue.500" />
                      </Box>
                    </Flex>
                  )}
                </VStack>
              </Box>

              {/* Input Area */}
              <Box p={3} borderTop="1px solid" borderColor={borderColor}>
                <Flex gap={2}>
                  <chakra.input
                    flex={1}
                    px={3}
                    py={2}
                    fontSize="sm"
                    placeholder="Tanya sesuatu..."
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="full"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    _focus={{ outline: 'none', borderColor: 'blue.400', bg: bgColor }}
                  />
                  <IconButton
                    size="sm"
                    icon={isLoading ? <Spinner size="xs" /> : <FaPaperPlane />}
                    colorScheme="blue"
                    onClick={handleSend}
                    isDisabled={!input.trim() || isLoading}
                    isRound
                    aria-label="Send message"
                  />
                </Flex>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Portal>
  );
};

export default Chatbot;
