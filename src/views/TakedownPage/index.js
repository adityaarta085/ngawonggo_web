import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Image,
  Flex,
  Input,
  IconButton,
  Spinner,
  useColorModeValue,
  Icon,
  chakra,
  ScaleFade,
} from '@chakra-ui/react';
import { FaRobot, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import axios from 'axios';
import SEO from '../../components/SEO';

const MotionBox = chakra(motion.div);

const TakedownPage = () => {
  const [settings, setSettings] = useState({
    message: 'Website sedang dalam pemeliharaan.',
    image: '',
    prompt: ''
  });
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo. Saya Asisten AI Desa Ngawonggo. Meskipun website sedang dalam pemeliharaan, saya di sini untuk menjawab pertanyaan Anda seputar informasi desa. Apa yang ingin Anda tanyakan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('red.200', 'red.700');
  const userBubbleBg = useColorModeValue('red.500', 'red.600');

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['takedown_message', 'takedown_image', 'takedown_ai_prompt']);

      if (error) throw error;

      const mapped = {};
      data.forEach(item => {
        if (item.key === 'takedown_message') mapped.message = item.value;
        if (item.key === 'takedown_image') mapped.image = item.value;
        if (item.key === 'takedown_ai_prompt') mapped.prompt = item.value;
      });
      setSettings(mapped);
    } catch (error) {
      console.error('Error fetching takedown settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].slice(-10),
        customPrompt: settings.prompt
      });

      const botMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, sistem AI sedang mengalami gangguan. Silakan coba beberapa saat lagi.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <SEO
        title="Pemeliharaan Sistem - Desa Ngawonggo"
        description="Website Desa Ngawonggo sedang dalam pemeliharaan."
      />
      <Container maxW="container.lg">
        <VStack spacing={8} align="center">
          {/* Warning Banner */}
          <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            w="full"
            bg="red.500"
            color="white"
            p={6}
            borderRadius="2xl"
            boxShadow="xl"
            textAlign="center"
          >
            <Flex align="center" justify="center" gap={4} mb={2}>
              <Icon as={FaExclamationTriangle} w={8} h={8} />
              <Heading size="lg">PERINGATAN SISTEM</Heading>
            </Flex>
            <Text fontSize="md" fontWeight="medium">
              Akses Terbatas: Website Sedang Dalam Mode Pemeliharaan (Takedown)
            </Text>
          </MotionBox>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={8}
            w="full"
            align="stretch"
          >
            {/* Info Section */}
            <VStack flex={1} spacing={6} align="start">
              <Box
                bg={bgColor}
                p={6}
                borderRadius="2xl"
                boxShadow="lg"
                w="full"
                border="1px solid"
                borderColor={borderColor}
              >
                <Heading size="md" mb={4} color="red.600">Pesan Administrator</Heading>
                <Text color="gray.600" lineHeight="tall">
                  {settings.message}
                </Text>
              </Box>

              {settings.image && (
                <Box
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="lg"
                  w="full"
                  bg="white"
                >
                  <Image
                    src={settings.image}
                    alt="Takedown Info"
                    fallback={<Box h="200px" bg="gray.100" />}
                    w="full"
                    objectFit="cover"
                  />
                </Box>
              )}
            </VStack>

            {/* AI Chat Section */}
            <VStack
              flex={1}
              bg={bgColor}
              borderRadius="2xl"
              boxShadow="2xl"
              border="1px solid"
              borderColor={borderColor}
              overflow="hidden"
              h="600px"
            >
              <Flex bg="red.600" color="white" w="full" px={6} py={4} align="center" gap={3}>
                <FaRobot size="24px" />
                <VStack align="start" spacing={0}>
                  <Heading size="xs">ASISTEN DARURAT AI</Heading>
                  <Text fontSize="10px" opacity={0.8}>Tanya</Text>
                </VStack>
              </Flex>

              <Box
                ref={scrollRef}
                flex={1}
                p={4}
                overflowY="auto"
                w="full"
                bg="gray.50"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '4px' },
                }}
              >
                <VStack spacing={4} align="stretch">
                  {messages.map((msg, i) => (
                    <ScaleFade in={true} key={i}>
                      <Flex justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
                        <Box
                          maxW="85%"
                          bg={msg.role === 'user' ? userBubbleBg : 'white'}
                          color={msg.role === 'user' ? 'white' : 'gray.800'}
                          px={4}
                          py={3}
                          borderRadius="2xl"
                          borderBottomRightRadius={msg.role === 'user' ? '2px' : '2xl'}
                          borderBottomLeftRadius={msg.role === 'assistant' ? '2px' : '2xl'}
                          fontSize="sm"
                          boxShadow="sm"
                          border={msg.role === 'assistant' ? '1px solid' : 'none'}
                          borderColor="gray.100"
                        >
                          <Text whiteSpace="pre-wrap">{msg.content}</Text>
                        </Box>
                      </Flex>
                    </ScaleFade>
                  ))}
                  {isLoading && (
                    <Flex justify="flex-start">
                      <Box bg="white" px={4} py={3} borderRadius="2xl" borderBottomLeftRadius="2px" boxShadow="sm">
                        <Spinner size="xs" color="red.500" />
                      </Box>
                    </Flex>
                  )}
                </VStack>
              </Box>

              <Box p={4} bg="white" w="full" borderTop="1px solid" borderColor="gray.100">
                <Flex gap={2}>
                  <Input
                    placeholder="Ketik pertanyaan Anda..."
                    variant="filled"
                    bg="gray.100"
                    borderRadius="full"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    _focus={{ bg: 'white', borderColor: 'red.400' }}
                  />
                  <IconButton
                    aria-label="Send"
                    icon={<FaPaperPlane />}
                    colorScheme="red"
                    borderRadius="full"
                    onClick={handleSend}
                    isDisabled={!input.trim() || isLoading}
                  />
                </Flex>
              </Box>
            </VStack>
          </Flex>

          <Text fontSize="xs" color="gray.400">
            © 2026 Pemerintah Desa Ngawonggo. Dibuat dengan ❤️ oleh SMK Muhammadiyah Bandongan.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default TakedownPage;
