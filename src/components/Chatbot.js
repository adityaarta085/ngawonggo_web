
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Collapse,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Input,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [messages, setMessages] = useState([
    { text: "Halo! Saya Asisten Digital Desa Ngawonggo. Ada yang bisa saya bantu?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages([...messages, userMsg]);
    setInput("");

    // Simple bot response logic
    setTimeout(() => {
      let botText = "Maaf, saya belum memahami pertanyaan tersebut. Silakan hubungi kantor desa untuk informasi lebih lanjut.";
      const lowInput = input.toLowerCase();

      if (lowInput.includes("layanan") || lowInput.includes("surat")) {
        botText = "Untuk layanan surat menyurat, Anda bisa datang ke kantor desa pada jam kerja (Senin-Jumat, 08:00 - 15:00) atau cek menu Layanan Publik.";
      } else if (lowInput.includes("wisata") || lowInput.includes("jalan")) {
        botText = "Desa Ngawonggo memiliki wisata alam yang indah. Cek menu Potensi Desa untuk melihat daftar destinasi wisata kami.";
      } else if (lowInput.includes("halo") || lowInput.includes("pagi") || lowInput.includes("siang")) {
        botText = "Halo juga! Ada yang bisa saya bantu hari ini?";
      }

      setMessages(prev => [...prev, { text: botText, isBot: true }]);
    }, 1000);
  };

  return (
    <Box position="fixed" bottom={{ base: 20, md: 8 }} right={{ base: 4, md: 8 }} zIndex={2000}>
      <Collapse in={isOpen} animateOpacity>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          w={{ base: "300px", md: "350px" }}
          h="450px"
          borderRadius="2xl"
          boxShadow="2xl"
          mb={4}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Header */}
          <HStack bg="brand.500" p={4} color="white" justify="space-between">
            <HStack>
              <Avatar size="sm" icon={<FaRobot />} bg="white" color="brand.500" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">Asisten Desa</Text>
                <Text fontSize="xs" opacity={0.8}>Online</Text>
              </VStack>
            </HStack>
            <IconButton
              size="sm"
              icon={<FaTimes />}
              variant="ghost"
              color="white"
              onClick={onToggle}
              aria-label="Close chat"
            />
          </HStack>

          {/* Messages */}
          <VStack flex={1} p={4} overflowY="auto" align="stretch" spacing={4} bg="gray.50">
            {messages.map((msg, i) => (
              <Box
                key={i}
                alignSelf={msg.isBot ? "flex-start" : "flex-end"}
                bg={msg.isBot ? "white" : "brand.500"}
                color={msg.isBot ? "gray.800" : "white"}
                px={4}
                py={2}
                borderRadius="2xl"
                borderTopLeftRadius={msg.isBot ? "0" : "2xl"}
                borderTopRightRadius={msg.isBot ? "2xl" : "0"}
                boxShadow="sm"
                maxW="80%"
              >
                <Text fontSize="sm">{msg.text}</Text>
              </Box>
            ))}
          </VStack>

          {/* Input */}
          <HStack p={4} bg="white" borderTop="1px solid" borderColor="gray.100">
            <Input
              placeholder="Ketik pesan..."
              size="sm"
              borderRadius="full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton
              icon={<FaPaperPlane />}
              colorScheme="brand"
              borderRadius="full"
              size="sm"
              onClick={handleSend}
              aria-label="Send message"
            />
          </HStack>
        </Box>
      </Collapse>

      {!isOpen && (
        <IconButton
          icon={<FaComments />}
          colorScheme="brand"
          size="lg"
          borderRadius="full"
          boxShadow="2xl"
          w={16}
          h={16}
          fontSize="2xl"
          onClick={onToggle}
          aria-label="Open chat"
        />
      )}
    </Box>
  );
};

export default Chatbot;
