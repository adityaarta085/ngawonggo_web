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
  Image,
  Button,
} from '@chakra-ui/react';
import { FaRobot, FaTimes, FaMinus, FaPaperPlane, FaHeadset } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
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
  const [sessionUser, setSessionUser] = useState(null);
  const [chatSession, setChatSession] = useState(null); // The CS chat session ID
  const [csStatus, setCsStatus] = useState('none'); // none, waiting, active
  const [csAssigned, setCsAssigned] = useState(null); // Assigned CS info
  const [queuePosition, setQueuePosition] = useState(0); // Position in queue
  const [csIsTyping, setCsIsTyping] = useState(false);
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Fetch active session on mount if logged in
  useEffect(() => {
    if (sessionUser) {
      const checkActiveSession = async () => {
        const { data } = await supabase
          .from('chatsCS')
          .select('*, usersCS:assigned_to(name)')
          .eq('user_id', sessionUser.id)
          .in('status', ['waiting', 'active'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setChatSession(data.chat_id);
          setCsStatus(data.status);
          if (data.usersCS) {
            setCsAssigned(data.usersCS.name);
          }

          // Load existing messages
          const { data: msgs } = await supabase
            .from('messagesCS')
            .select('*')
            .eq('chat_id', data.chat_id)
            .order('created_at', { ascending: true });

          if (msgs) {
            const mapped = msgs.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.message,
              realSender: m.sender
            }));
            setMessages(prev => {
                const init = [...prev];
                // Add a divider or just replace if we want to show history.
                // For simplicity, replace all but first.
                return [init[0], ...mapped];
            });
          }
        }
      };
      checkActiveSession();
    }
  }, [sessionUser]);

  // Realtime subscription for messages & chat status
  useEffect(() => {
    if (!chatSession) return;

    const fetchQueuePosition = async () => {
        if (csStatus !== 'waiting') return;
        const { data } = await supabase
            .from('chatsCS')
            .select('created_at')
            .eq('status', 'waiting')
            .order('created_at', { ascending: true });

        if (data) {
            // Find my own chat session by querying my own session created_at
            const { data: myChat } = await supabase.from('chatsCS').select('created_at').eq('chat_id', chatSession).single();
            if (myChat) {
                const pos = data.findIndex(c => c.created_at === myChat.created_at) + 1;
                setQueuePosition(pos);
            }
        }
    };

    if (csStatus === 'waiting') {
        fetchQueuePosition();
        // Since we can't easily listen to all queue changes efficiently without complex sub,
        // we use a simple interval polling when waiting
        const qInt = setInterval(fetchQueuePosition, 5000);
        return () => clearInterval(qInt);
    }
  }, [chatSession, csStatus]);

  useEffect(() => {
    if (!chatSession) return;

    const messageSub = supabase
      .channel('messagesCS_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messagesCS', filter: `chat_id=eq.${chatSession}` }, payload => {
        const newMsg = payload.new;
        if (newMsg.sender !== 'user') { // Only add non-user messages (we optimistically add user msgs)
           setMessages(prev => [...prev, { role: 'assistant', content: newMsg.message, realSender: newMsg.sender }]);
        }
      })
      .subscribe();

    let typingTimer;
    const typingSub = supabase
      .channel(`typing:${chatSession}`)
      .on('broadcast', { event: 'typing' }, payload => {
          setCsIsTyping(true);
          clearTimeout(typingTimer);
          typingTimer = setTimeout(() => setCsIsTyping(false), 3000);
      })
      .subscribe();

    const chatSub = supabase
      .channel('chatsCS_channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chatsCS', filter: `chat_id=eq.${chatSession}` }, async payload => {
        const updated = payload.new;
        setCsStatus(updated.status);
        if (updated.status === 'active' && updated.assigned_to) {
             const { data: csUser } = await supabase.from('usersCS').select('name').eq('id', updated.assigned_to).single();
             if (csUser) setCsAssigned(csUser.name);
        } else if (updated.status === 'closed') {
             setChatSession(null);
             setCsStatus('none');
             setCsAssigned(null);
             setMessages(prev => [...prev, { role: 'assistant', content: 'Sesi chat dengan CS telah diakhiri. Kembali ke Asisten AI.' }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(chatSub);
      supabase.removeChannel(typingSub);
      clearTimeout(typingTimer);
    };
  }, [chatSession]);

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

    if (!sessionUser && csStatus === 'none' && input.toLowerCase().includes('cs')) {
        // Just a little hint
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (csStatus === 'active' || csStatus === 'waiting') {
       try {
           await supabase.from('messagesCS').insert({
               chat_id: chatSession,
               sender: 'user',
               message: userMessage.content
           });
       } catch (error) {
           console.error("CS Send Error", error);
       } finally {
           setIsLoading(false);
       }
       return;
    }

    if (!input.trim() || isLoading) return;

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].slice(-6) // Send last 6 messages for context
      });

      const botMessage = response.data.choices[0].message;

      // Try to parse if it's an escalation JSON
      let isEscalation = false;
      try {
          // Remove markdown JSON formatting if present
          let cleanContent = botMessage.content.trim();
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
          // Not json, normal message
      }

      if (!isEscalation) {
        setMessages(prev => [...prev, botMessage]);
      }
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

  const handleEscalation = async (summary, reason) => {
      setIsLoading(true);
      // Check CS availability first
      const { data: onlineCs, error: csError } = await supabase.from('usersCS').select('id').eq('status', 'online');
      if (csError || !onlineCs || onlineCs.length === 0) {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Mohon maaf, saat ini tidak ada Customer Service yang online. Silakan coba lagi nanti.' }]);
          setIsLoading(false);
          return;
      }

      try {
          const { data: newChat, error } = await supabase.from('chatsCS').insert({
              user_id: sessionUser ? sessionUser.id : null,
              summary: summary || 'Permintaan CS',
              reason: reason || 'User meminta eskalasi',
              status: 'waiting'
          }).select().single();

          if (error) throw error;

          setChatSession(newChat.chat_id);
          setCsStatus('waiting');

          // Save context to messagesCS
          const recentContext = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
          await supabase.from('messagesCS').insert({
              chat_id: newChat.chat_id,
              sender: 'ai',
              message: `[AI Context]\n${recentContext}`
          });

          setMessages(prev => [...prev, { role: 'assistant', content: 'Mohon tunggu sebentar, Anda sedang disambungkan ke Customer Service. Anda berada di antrian.' }]);
          setIsLoading(false);
      } catch (err) {
          console.error("Escalation error:", err);
          setMessages(prev => [...prev, { role: 'assistant', content: 'Gagal menghubungi CS. Silakan coba lagi.' }]);
      }
  };

  if (isHidden) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={isDocked ? { base: 20, md: 24 } : 0}
        right={isDocked ? 0 : 0}
        left={isDocked ? "auto" : 0}
        w={isDocked ? "auto" : "100vw"}
        zIndex={9998}
        pointerEvents="none"
        display="flex"
        justifyContent="center"
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
                    icon={csStatus !== 'none' ? <FaHeadset size={20} /> : <Image src="/ai_logo.png" w="24px" h="24px" />}
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
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              pointerEvents="auto"
              position="fixed"
              top="0" bottom="0"
              left="0"
              right="0"
              w="100vw"
              h="100vh" maxW="100%" margin="0"
              bg={bgColor}
              borderTopRadius="0"
              boxShadow="0 -10px 40px rgba(0,0,0,0.1)"
              borderTop="1px solid"
              borderColor={borderColor}
              overflow="hidden"
              display="flex"
              flexDirection="column"
              zIndex={9999}
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
                    {csStatus === 'waiting' ? (
    <Text fontSize="10px" opacity={0.8} color="yellow.200">
        Menunggu CS... {queuePosition > 0 ? `(Antrian ke-${queuePosition})` : ''}
    </Text>
  ) : csStatus === 'active' ? (
    <Text fontSize="10px" opacity={0.8} color="green.200">Terhubung dengan CS {csAssigned}</Text>
  ) : (
    <Text fontSize="10px" opacity={0.8}>Aktif • Didukung oleh Groq</Text>
  )}
                  </VStack>
                </Flex>
                <Flex gap={2}>
                  {csStatus === 'none' && (
                    <Tooltip label="Hubungi Manusia (CS)" placement="bottom-end">
                      <IconButton
                        size="xs"
                        icon={<FaHeadset />}
                        variant="solid"
                        colorScheme="green"
                        onClick={() => handleEscalation("User meminta eskalasi langsung ke CS", "Permintaan Manual melalui tombol")}
                        aria-label="Hubungi CS"
                      />
                    </Tooltip>
                  )}
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
                        <Text whiteSpace="pre-wrap">
     {msg.realSender && msg.realSender !== 'user' && msg.realSender !== 'ai' ? (
         <Box as="span" fontWeight="bold" display="block" fontSize="xs" mb={1} color="blue.500">
             CS {csAssigned || 'Admin'}
         </Box>
     ) : null}
     {msg.content}
   </Text>
                      </Box>
                    </Flex>
                  ))}
                  {csIsTyping && csStatus === 'active' && (
                    <Flex justify="flex-start">
                      <Box bg={botBubbleBg} px={4} py={3} borderRadius="xl" borderBottomLeftRadius="2px" display="flex" alignItems="center" gap={1}>
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, backgroundColor: '#A0AEC0', borderRadius: '50%' }} />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, backgroundColor: '#A0AEC0', borderRadius: '50%' }} />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, backgroundColor: '#A0AEC0', borderRadius: '50%' }} />
                      </Box>
                    </Flex>
                  )}
                  {isLoading && (
                    <Flex justify="flex-start">
                      <Box bg={botBubbleBg} px={3} py={2} borderRadius="xl" borderBottomLeftRadius="2px">
                        <Spinner size="xs" color="blue.500" />
                      </Box>
                    </Flex>
                  )}
                </VStack>
              </Box>

              {/* Quick Replies */}
              {csStatus === 'none' && !isLoading && (
                <Flex px={4} pb={2} overflowX="auto" gap={2} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                  <Button
                    size="xs"
                    rounded="full"
                    colorScheme="green"
                    variant="outline"
                    onClick={() => handleEscalation("User meminta dihubungkan ke CS melalui Quick Reply", "Tombol Quick Reply")}
                    flexShrink={0}
                  >
                    Saya ingin terhubung dengan CS
                  </Button>
                </Flex>
              )}

              {/* Input Area */}
              <Box p={3} borderTop="1px solid" borderColor={borderColor}>
                <Flex gap={2}>
                  <chakra.input
                    isDisabled={csStatus === 'waiting'}
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
