import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Button,
  Badge,
  Tooltip,
  Spinner,
  useColorModeValue,
  Portal,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaMinus, FaHeadset, FaRobot, FaRedo, FaSmile, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { getById, getList } from '../lib/dataFetcher';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Mini Geometric Mascot with Cursor Eye Tracking
const MiniGeometricMascot = ({ eyePos = { x: 0, y: 0 }, isLoading = false, size = 'normal' }) => {
  const isMini = size === 'small';
  const width = isMini ? 52 : 140;
  const height = isMini ? 52 : 75;

  return (
    <Box position="relative" display="flex" alignItems="center" justifyContent="center">
      <svg
        viewBox="0 0 200 160"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'visible',
          filter: 'drop-shadow(0px 6px 12px rgba(0,0,0,0.15))',
        }}
      >
        <defs>
          <linearGradient id="miniPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#5138EE" />
          </linearGradient>
          <linearGradient id="miniDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D3436" />
            <stop offset="100%" stopColor="#1E1E24" />
          </linearGradient>
          <linearGradient id="miniYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="100%" stopColor="#FDCB6E" />
          </linearGradient>
          <linearGradient id="miniPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9E88" />
            <stop offset="100%" stopColor="#FF7052" />
          </linearGradient>
        </defs>

        {/* 1. PURPLE TALL CHARACTER (Left) */}
        <g transform="translate(25, 10)">
          <motion.rect
            x="0"
            y="0"
            width="55"
            height="135"
            rx="27.5"
            fill="url(#miniPurpleGrad)"
            animate={{
              y: isLoading ? [-4, 4, -4] : [-2, 2, -2],
            }}
            transition={{
              duration: isLoading ? 0.5 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Eyes & Pupils */}
          <g transform="translate(14, 30)">
            <circle cx="0" cy="0" r="8.5" fill="#FFFFFF" />
            <motion.circle
              cx={eyePos.x * 0.7}
              cy={eyePos.y * 0.7}
              r="4"
              fill="#1E1E24"
              animate={{ scale: isLoading ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.6, repeat: isLoading ? Infinity : 0 }}
            />
            <circle cx="27" cy="0" r="8.5" fill="#FFFFFF" />
            <motion.circle
              cx={27 + eyePos.x * 0.7}
              cy={eyePos.y * 0.7}
              r="4"
              fill="#1E1E24"
              animate={{ scale: isLoading ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.6, repeat: isLoading ? Infinity : 0 }}
            />
          </g>
        </g>

        {/* 2. DARK PILL CHARACTER (Center) */}
        <g transform="translate(75, 40)">
          <motion.rect
            x="0"
            y="0"
            width="48"
            height="105"
            rx="24"
            fill="url(#miniDarkGrad)"
            animate={{
              y: isLoading ? [-6, 2, -6] : [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: isLoading ? 0.45 : 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
          {/* Eyes & Pupils */}
          <g transform="translate(12, 25)">
            <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
            <circle cx={eyePos.x * 0.6} cy={eyePos.y * 0.6} r="3.2" fill="#1E1E24" />
            <circle cx="24" cy="0" r="7" fill="#FFFFFF" />
            <circle cx={24 + eyePos.x * 0.6} cy={eyePos.y * 0.6} r="3.2" fill="#1E1E24" />
          </g>
        </g>

        {/* 3. YELLOW ARCH CHARACTER (Right) */}
        <g transform="translate(120, 60)">
          <motion.path
            d="M 0 85 L 0 35 A 26 26 0 0 1 52 35 L 52 85 Z"
            fill="url(#miniYellowGrad)"
            animate={{
              y: isLoading ? [-5, 5, -5] : [-3, 1, -3],
            }}
            transition={{
              duration: isLoading ? 0.4 : 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <g transform="translate(16, 28)">
            <circle cx={eyePos.x * 0.5} cy={eyePos.y * 0.5} r="3" fill="#2D3436" />
            <circle cx={20 + eyePos.x * 0.5} cy={eyePos.y * 0.5} r="3" fill="#2D3436" />
            {isLoading ? (
              <path d="M 4 10 Q 10 16 16 10" fill="none" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <line x1="5" y1="10" x2="15" y2="10" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        </g>

        {/* 4. SALMON PINK BLOB (Bottom Left Front) */}
        <g transform="translate(10, 85)">
          <motion.path
            d="M 0 60 A 35 35 0 0 1 70 60 Z"
            fill="url(#miniPinkGrad)"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <g transform="translate(24, 25)">
            <circle cx={eyePos.x * 0.4} cy={eyePos.y * 0.4} r="2.8" fill="#1E1E24" />
            <circle cx="22" cy={eyePos.y * 0.4} r="2.8" fill="#1E1E24" />
          </g>
        </g>
      </svg>
    </Box>
  );
};

const QUICK_PROMPTS = [
  { label: '📜 Surat & Layanan', query: 'Bagaimana cara mengurus surat keterangan di Desa Ngawonggo?' },
  { label: '🕌 Quran & Sholat', query: 'Di mana saya bisa melihat fitur Quran dan Jadwal Sholat?' },
  { label: '📢 Berita Desa', query: 'Apa berita terbaru dari Desa Ngawonggo?' },
  { label: '🎧 Hubungi CS', query: 'Saya butuh bantuan langsung dengan Customer Service' },
];

const SiteMascot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  // Chatbot logic states
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! 👋 Saya Maskot AI Desa Ngawonggo. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [csStatus, setCsStatus] = useState('none'); // none, waiting, active
  const [csAssigned, setCsAssigned] = useState(null);
  const [queuePosition, setQueuePosition] = useState(0);

  const mascotContainerRef = useRef(null);
  const scrollRef = useRef(null);

  // Theme values - Clean neutral glassmorphism without blue background
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('purple.100', 'purple.900');
  const userBubbleBg = useColorModeValue('purple.600', 'purple.500');
  const botBubbleBg = useColorModeValue('gray.100', 'gray.700');
  const textColorBot = useColorModeValue('gray.800', 'gray.100');
  const inputBg = useColorModeValue('gray.50', 'gray.900');
  const widgetBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const headerBg = useColorModeValue('purple.700', 'gray.900');
  const widgetBorderColor = useColorModeValue('purple.300', 'purple.700');

  // Mouse move eye-tracking listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      let centerX = window.innerWidth - 60;
      let centerY = window.innerHeight - 60;

      if (mascotContainerRef.current) {
        const rect = mascotContainerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = 400;
      const factor = Math.min(distance / maxDistance, 1);
      const angle = Math.atan2(deltaY, deltaX);

      setEyePos({
        x: Math.cos(angle) * 8 * factor,
        y: Math.sin(angle) * 8 * factor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Supabase Auth session check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Auto-scroll chat view on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  // Realtime subscription for CS queue & messages
  useEffect(() => {
    if (!chatSession) return;

    const messageSub = supabase
      .channel('messagesCS_channel_mascot')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messagesCS', filter: `chat_id=eq.${chatSession}` }, payload => {
        const newMsg = payload.new;
        if (newMsg.sender !== 'user') {
          setMessages(prev => [...prev, { role: 'assistant', content: newMsg.message, realSender: newMsg.sender }]);
        }
      })
      .subscribe();

    const chatSub = supabase
      .channel('chatsCS_channel_mascot')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chatsCS', filter: `chat_id=eq.${chatSession}` }, async payload => {
        const updated = payload.new;
        setCsStatus(updated.status);
        if (updated.status === 'active' && updated.assigned_to) {
          const { data: csUser } = await getById('usersCS', updated.assigned_to);
          if (csUser) setCsAssigned(csUser.name);
        } else if (updated.status === 'closed') {
          setChatSession(null);
          setCsStatus('none');
          setCsAssigned(null);
          setMessages(prev => [...prev, { role: 'assistant', content: 'Sesi chat dengan CS telah diakhiri. Kembali ke Asisten Maskot AI.' }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(chatSub);
    };
  }, [chatSession]);

  // Handle CS Escalation
  const handleEscalation = async (summary, reason) => {
    if (!sessionUser) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🔒 Anda harus login terlebih dahulu untuk menghubungkan ke Customer Service.' }]);
      return;
    }

    setIsLoading(true);
    const { data: allCs, ok: csOk } = await getList('usersCS', { limit: 1000 });
    const onlineCs = allCs?.filter(cs => cs.status === 'online');
    if (!csOk || !onlineCs || onlineCs.length === 0) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Mohon maaf, saat ini petugas Customer Service belum ada yang online. Silakan tinggalkan pesan atau tanya AI.' }]);
      setIsLoading(false);
      return;
    }

    try {
      const { data: newChat, error } = await supabase.from('chatsCS').insert({
        user_id: sessionUser ? sessionUser.id : null,
        summary: summary || 'Permintaan Bantuan Maskot CS',
        reason: reason || 'User meminta eskalasi via Maskot',
        status: 'waiting'
      }).select().single();

      if (error) throw error;

      setChatSession(newChat.chat_id);
      setCsStatus('waiting');
      setQueuePosition(1);

      await supabase.from('messagesCS').insert({
        chat_id: newChat.chat_id,
        sender: 'ai',
        message: `Ringkasan Permintaan: ${summary || 'Bantuan CS'}`
      });

      setMessages(prev => [...prev, { role: 'assistant', content: 'Menghubungkan Anda ke Customer Service Desa... Mohon tunggu sebentar.' }]);
    } catch (err) {
      console.error('Escalation error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Gagal membuat sesi CS. Silakan coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message action
  const handleSendMessage = async (textToSend) => {
    if (!sessionUser) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🔒 Anda harus login terlebih dahulu sebelum dapat menggunakan Asisten AI.' }]);
      return;
    }

    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Active CS session message forward
    if (csStatus === 'active' || csStatus === 'waiting') {
      try {
        await supabase.from('messagesCS').insert({
          chat_id: chatSession,
          sender: 'user',
          message: queryText
        });
      } catch (error) {
        console.error("CS Send Error", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Direct CS request trigger check
    if (queryText.toLowerCase().includes('hubungi cs') || queryText.toLowerCase().includes('customer service')) {
      await handleEscalation('Permintaan CS Langsung', 'Diakses via tombol / chat');
      return;
    }

    // AI API Call
    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].slice(-6),
        userId: sessionUser?.id || null
      });

      if (response.data.limitReached) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.error }]);
        setIsLoading(false);
        return;
      }

      const botMsg = response.data.choices[0].message;

      // Check for escalation JSON format
      let isEscalation = false;
      try {
        let cleanContent = botMsg.content.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        const parsed = JSON.parse(cleanContent);
        if (parsed.escalate) {
          isEscalation = true;
          handleEscalation(parsed.summary, parsed.reason);
        }
      } catch (e) {
        // Normal text response
      }

      if (!isEscalation) {
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, Maskot sedang mengalami gangguan koneksi ke server. ' + (error.response?.data?.error || 'Silakan coba beberapa saat lagi!')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Portal>
      <Box position="fixed" bottom={{ base: "75px", md: "24px" }} right="24px" zIndex={9999} ref={mascotContainerRef}>
        {/* Expanded Chat Modal */}
        <AnimatePresence>
          {isOpen && (
            <MotionFlex
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ duration: 0.35, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              direction="column"
              bg={bgCard}
              w={{ base: "calc(100vw - 32px)", sm: "380px" }}
              h={{ base: "480px", sm: "530px" }}
              borderRadius="3xl"
              boxShadow="0 25px 50px -12px rgba(108, 92, 231, 0.25), 0 0 0 1px rgba(108, 92, 231, 0.15)"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              mb={4}
              position="relative"
            >
              {/* Header with Mini Geometric Mascot & Status */}
              <Flex
                bg={headerBg}
                p={3.5}
                align="center"
                justify="space-between"
                color="white"
                position="relative"
              >
                <Flex align="center" gap={3}>
                  <Box
                    bg="whiteAlpha.200"
                    backdropFilter="blur(8px)"
                    p={1.5}
                    borderRadius="2xl"
                    boxShadow="sm"
                    overflow="hidden"
                  >
                    <MiniGeometricMascot eyePos={eyePos} isLoading={isLoading} size="small" />
                  </Box>
                  <Box>
                    <Flex align="center" gap={1.5}>
                      <Text fontWeight="extrabold" fontSize="sm" letterSpacing="tight">
                        Maskot Ngawonggo
                      </Text>
                      <Badge colorScheme="green" variant="solid" borderRadius="full" px={1.5} py={0.2} fontSize="3xs">
                        {csStatus === 'active' ? 'CS Online' : 'AI Online'}
                      </Badge>
                    </Flex>
                    <Text fontSize="2xs" color="whiteAlpha.800" fontWeight="medium">
                      {csStatus === 'active'
                        ? `Terhubung dengan: ${csAssigned || 'Petugas CS'}`
                        : csStatus === 'waiting'
                        ? `Antrean #${queuePosition} - Menunggu CS...`
                        : 'Asisten AI & Pelayanan Digital Desa'}
                    </Text>
                  </Box>
                </Flex>

                <HStack spacing={1}>
                  {messages.length > 2 && sessionUser && (
                    <Tooltip label="Reset Chat" fontSize="xs">
                      <IconButton
                        icon={<FaRedo />}
                        size="xs"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.300" }}
                        aria-label="Reset Chat"
                        onClick={() => setMessages([{ role: 'assistant', content: 'Halo! Percakapan telah diperbarui. Ada yang bisa Maskot bantu?' }])}
                      />
                    </Tooltip>
                  )}
                  <IconButton
                    icon={<FaMinus />}
                    size="xs"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    aria-label="Minimize Chat"
                    onClick={() => setIsOpen(false)}
                  />
                  <IconButton
                    icon={<FaTimes />}
                    size="xs"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    aria-label="Close Chat"
                    onClick={() => setIsOpen(false)}
                  />
                </HStack>
              </Flex>

              {/* Chat Message List */}
              <VStack
                ref={scrollRef}
                flex="1"
                p={4}
                spacing={3}
                overflowY="auto"
                align="stretch"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '4px' },
                }}
              >
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <Flex key={idx} justify={isUser ? 'flex-end' : 'flex-start'} align="flex-start" gap={2}>
                      {!isUser && (
                        <Box
                          w="28px"
                          h="28px"
                          borderRadius="full"
                          bg="purple.600"
                          color="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          flexShrink={0}
                          boxShadow="sm"
                          mt={1}
                        >
                          {msg.realSender === 'cs' ? <FaHeadset /> : <FaRobot />}
                        </Box>
                      )}
                      <Box
                        maxW="80%"
                        bg={isUser ? userBubbleBg : botBubbleBg}
                        color={isUser ? 'white' : textColorBot}
                        px={3.5}
                        py={2.5}
                        borderRadius="2xl"
                        borderTopRightRadius={isUser ? 'xs' : '2xl'}
                        borderTopLeftRadius={!isUser ? 'xs' : '2xl'}
                        fontSize="xs"
                        lineHeight="relaxed"
                        boxShadow="xs"
                      >
                        {msg.content}
                      </Box>
                    </Flex>
                  );
                })}

                {/* Login Required Notice for Guests */}
                {!sessionUser && (
                  <Box
                    p={4}
                    bg="purple.50"
                    _dark={{ bg: "purple.950", borderColor: "purple.800" }}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="purple.200"
                    textAlign="center"
                    my={2}
                    boxShadow="sm"
                  >
                    <Flex justify="center" align="center" color="purple.600" mb={2}>
                      <FaLock size={22} />
                    </Flex>
                    <Text fontWeight="extrabold" fontSize="xs" color="purple.900" _dark={{ color: "purple.100" }} mb={1}>
                      Akses AI Chatbot Terkunci 🔒
                    </Text>
                    <Text fontSize="2xs" color="gray.600" _dark={{ color: "gray.300" }} mb={3} lineHeight="relaxed">
                      Anda harus masuk (login) ke akun Anda terlebih dahulu sebelum dapat menggunakan fitur Asisten AI Desa Ngawonggo.
                    </Text>
                    <Button
                      size="xs"
                      colorScheme="purple"
                      borderRadius="full"
                      px={5}
                      py={3}
                      fontSize="xs"
                      fontWeight="bold"
                      boxShadow="md"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/auth');
                      }}
                    >
                      🔑 Login Sekarang
                    </Button>
                  </Box>
                )}

                {isLoading && (
                  <Flex align="center" gap={2} color="purple.500" fontSize="2xs" fontWeight="bold">
                    <Spinner size="xs" color="purple.500" />
                    <Text>Maskot sedang memikirkan jawaban...</Text>
                  </Flex>
                )}
              </VStack>

              {/* Quick Prompts Chips */}
              {messages.length < 4 && !isLoading && sessionUser && (
                <Flex px={3} py={1.5} gap={1.5} overflowX="auto" borderTopWidth="1px" borderColor={borderColor}>
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <Button
                      key={idx}
                      size="2xs"
                      variant="outline"
                      colorScheme="purple"
                      borderRadius="full"
                      fontSize="3xs"
                      flexShrink={0}
                      onClick={() => handleSendMessage(qp.query)}
                    >
                      {qp.label}
                    </Button>
                  ))}
                </Flex>
              )}

              {/* Input Footer */}
              <Box p={3} borderTopWidth="1px" borderColor={borderColor} bg={bgCard}>
                <Flex gap={2} align="center">
                  <Input
                    placeholder={
                      !sessionUser
                        ? "Silakan login untuk mengirim pesan..."
                        : csStatus === 'active'
                        ? "Tulis pesan ke CS..."
                        : "Tanya Maskot Desa..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    isDisabled={!sessionUser}
                    size="sm"
                    borderRadius="full"
                    bg={inputBg}
                    fontSize="xs"
                    focusBorderColor="purple.500"
                  />
                  <IconButton
                    icon={<FaPaperPlane />}
                    size="sm"
                    colorScheme="purple"
                    borderRadius="full"
                    aria-label="Kirim Pesan"
                    isLoading={isLoading}
                    isDisabled={!sessionUser || !input.trim()}
                    onClick={() => handleSendMessage()}
                  />
                </Flex>
              </Box>
            </MotionFlex>
          )}
        </AnimatePresence>

        {/* Floating Mascot Button without solid blue background */}
        <Box position="relative">
          {/* Greeting Tooltip Bubble */}
          <AnimatePresence>
            {!isOpen && showTooltip && (
              <MotionFlex
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                position="absolute"
                bottom="100%"
                right="0"
                mb={3}
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                color="gray.800"
                p={2.5}
                px={3.5}
                borderRadius="2xl"
                boxShadow="xl"
                borderWidth="1px"
                borderColor="purple.200"
                align="center"
                gap={2}
                whiteSpace="nowrap"
                cursor="pointer"
                onClick={() => {
                  setIsOpen(true);
                  setShowTooltip(false);
                }}
              >
                <FaSmile color="#6C5CE7" />
                <Text fontSize="xs" fontWeight="bold" color="purple.700" _dark={{ color: "purple.200" }}>
                  Ada yang bisa Maskot bantu? 💬
                </Text>
                <IconButton
                  icon={<FaTimes />}
                  size="2xs"
                  variant="ghost"
                  aria-label="Tutup Tooltip"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                />
              </MotionFlex>
            )}
          </AnimatePresence>

          {/* Interactive Floating Mascot Button - Transparent Glass Background */}
          <MotionBox
            whileHover={{ scale: 1.12, rotate: [0, -4, 4, 0] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setIsOpen(!isOpen);
              if (showTooltip) setShowTooltip(false);
            }}
            cursor="pointer"
            bg={widgetBg}
            backdropFilter="blur(12px)"
            p={1.5}
            borderRadius="full"
            boxShadow="0 12px 30px -4px rgba(108, 92, 231, 0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="64px"
            h="64px"
            borderWidth="2px"
            borderColor={widgetBorderColor}
          >
            <MiniGeometricMascot eyePos={eyePos} isLoading={isLoading} size="normal" />
          </MotionBox>
        </Box>
      </Box>
    </Portal>
  );
};

export default SiteMascot;
