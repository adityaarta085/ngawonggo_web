
import React, { useState, useRef, useEffect } from 'react';
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
  Spinner,
} from '@chakra-ui/react';
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import Groq from 'groq-sdk';

const Chatbot = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [messages, setMessages] = useState([
    { text: "Halo! Saya Asisten Digital Desa Ngawonggo. Ada yang bisa saya bantu?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const groq = new Groq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        dangerouslyAllowBrowser: true // Essential for client-side usage, though risky
      });

      const systemPrompt = `Anda adalah Asisten Digital Resmi Desa Ngawonggo, Magelang.
      Visi Desa: "Mewujudkan Desa Ngawonggo yang Mandiri, Religius, dan Berbudaya Berbasis Potensi Lokal Menuju Era Digital 2045".
      Data Desa:
      - Lokasi: Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah.
      - Penduduk: 6.052 jiwa (3.088 Laki-laki, 2.964 Perempuan) - Data BPS 2024.
      - Luas Wilayah: 5,34 km2.
      - Komoditas Unggulan: Kopi Arabika dan Hortikultura.
      - Layanan: Surat menyurat, kependudukan, pengaduan masyarakat.
      - Wisata: Keindahan alam lereng Gunung Sumbing.
      - Kontak: Phone 081215030896, Email ngawonggodesa@gmail.com.
      - Jam Kerja: Senin-Jumat, 08:00 - 15:00 WIB.

      Berikan jawaban yang ramah, informatif, dan profesional dalam Bahasa Indonesia (atau Bahasa Jawa jika ditanya dalam Bahasa Jawa).
      Gunakan data di atas untuk menjawab pertanyaan pengguna tentang Desa Ngawonggo. Jika tidak tahu, arahkan untuk menghubungi kantor desa.`;

      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({
            role: m.isBot ? "assistant" : "user",
            content: m.text
          })),
          { role: "user", content: input }
        ],
        temperature: 0.7,
        max_completion_tokens: 512,
        stream: true,
      });

      let botText = "";
      setMessages(prev => [...prev, { text: "", isBot: true, isStreaming: true }]);

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        botText += content;

        // eslint-disable-next-line no-loop-func
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.isBot && lastMsg.isStreaming) {
            lastMsg.text = botText;
          }
          return newMessages;
        });
      }

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg) lastMsg.isStreaming = false;
        return newMessages;
      });

    } catch (error) {
      console.error("Groq Error:", error);
      setMessages(prev => [...prev, {
        text: "Maaf, sistem sedang sibuk. Silakan coba beberapa saat lagi atau hubungi kami via WhatsApp.",
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="fixed" bottom={{ base: 20, md: 8 }} right={{ base: 4, md: 8 }} zIndex={2000}>
      <Collapse in={isOpen} animateOpacity>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          w={{ base: "320px", md: "380px" }}
          h="500px"
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
                <Text fontWeight="bold" fontSize="sm">Asisten Desa Digital</Text>
                <Text fontSize="xs" opacity={0.8}>Powered by Groq AI</Text>
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
          <VStack
            ref={scrollRef}
            flex={1}
            p={4}
            overflowY="auto"
            align="stretch"
            spacing={4}
            bg="gray.50"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
            }}
          >
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
                maxW="85%"
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">{msg.text}</Text>
                {msg.isStreaming && <Spinner size="xs" mt={2} />}
              </Box>
            ))}
          </VStack>

          {/* Input */}
          <HStack p={4} bg="white" borderTop="1px solid" borderColor="gray.100">
            <Input
              placeholder="Tanya sesuatu..."
              size="sm"
              borderRadius="full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <IconButton
              icon={<FaPaperPlane />}
              colorScheme="brand"
              borderRadius="full"
              size="sm"
              onClick={handleSend}
              isLoading={isLoading}
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
