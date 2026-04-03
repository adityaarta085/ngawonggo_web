import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, VStack, HStack, Heading, Text, Badge, Button, Input, IconButton,
  Avatar, Divider, useToast
} from '@chakra-ui/react';
import { FaPaperPlane, FaSignOutAlt, FaUser, FaClock, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const CSDashboard = ({ csSession, setCsSession }) => {
  const [queue, setQueue] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const scrollRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();

    const chatsSub = supabase.channel('cs_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chatsCS' }, payload => {
          fetchChats();
      })
      .subscribe();

    return () => { supabase.removeChannel(chatsSub); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csSession]);

  useEffect(() => {
      if (!selectedChat) return;
      fetchMessages(selectedChat.chat_id);

      const msgSub = supabase.channel('cs_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messagesCS', filter: `chat_id=eq.${selectedChat.chat_id}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

      return () => { supabase.removeChannel(msgSub); };
  }, [selectedChat]);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const fetchChats = async () => {
      try {
          const { data: waiting } = await supabase.from('chatsCS').select('*, auth_users:user_id(email)').eq('status', 'waiting').order('created_at', { ascending: true });
          const { data: active } = await supabase.from('chatsCS').select('*, auth_users:user_id(email)').eq('status', 'active').eq('assigned_to', csSession.id).order('created_at', { ascending: false });

          if (waiting) setQueue(waiting);
          if (active) setActiveChats(active);
      } catch (e) {
          console.error(e);
      }
  };

  const fetchMessages = async (chatId) => {
      const { data } = await supabase.from('messagesCS').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      if (data) setMessages(data);
  };

  const handleTakeChat = async (chat) => {
      await supabase.from('chatsCS').update({ status: 'active', assigned_to: csSession.id }).eq('chat_id', chat.chat_id);
      setSelectedChat(chat);
      toast({ title: 'Chat Diambil', status: 'success', duration: 2000 });
      fetchChats();
  };

  const handleCloseChat = async () => {
      if (!selectedChat) return;
      await supabase.from('chatsCS').update({ status: 'closed' }).eq('chat_id', selectedChat.chat_id);
      setSelectedChat(null);
      setMessages([]);
      toast({ title: 'Chat Ditutup', status: 'info', duration: 2000 });
      fetchChats();
  };

  const handleSend = async () => {
      if (!inputMsg.trim() || !selectedChat) return;
      const msg = inputMsg;
      setInputMsg('');
      await supabase.from('messagesCS').insert({
          chat_id: selectedChat.chat_id,
          sender: csSession.username,
          message: msg
      });
  };

  const handleLogout = async () => {
      await supabase.from('usersCS').update({ status: 'offline' }).eq('id', csSession.id);
      localStorage.removeItem('csSession');
      setCsSession(null);
      navigate('/admin/cs/login');
  };

  return (
    <Flex h="100vh" bg="gray.100">
      {/* Sidebar List */}
      <Box w="300px" bg="white" borderRight="1px solid" borderColor="gray.200" display="flex" flexDirection="column">
         <Box p={4} bg="blue.600" color="white">
            <Flex justify="space-between" align="center">
                <HStack>
                    <Avatar size="sm" src={csSession.avatar_url} name={csSession.name} />
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">{csSession.name}</Text>
                        <Badge colorScheme="green" fontSize="10px">CS Online</Badge>
                    </VStack>
                </HStack>
                <IconButton size="xs" icon={<FaSignOutAlt />} colorScheme="red" variant="ghost" onClick={handleLogout} aria-label="logout" />
            </Flex>
         </Box>

         <Box flex={1} overflowY="auto" p={2}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={2}>CHAT AKTIF ({activeChats.length})</Text>
            <VStack align="stretch" spacing={2} mb={4}>
                {activeChats.map(c => (
                    <Box key={c.chat_id} p={3} bg={selectedChat?.chat_id === c.chat_id ? 'blue.50' : 'white'} borderRadius="md" border="1px solid" borderColor="gray.100" cursor="pointer" onClick={() => setSelectedChat(c)}>
                        <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" isTruncated>{c.auth_users?.email || 'User'}</Text>
                            <Badge colorScheme="blue">Active</Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.500" isTruncated mt={1}>{c.summary}</Text>
                    </Box>
                ))}
            </VStack>

            <Divider my={4} />

            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={2}>ANTRIAN ({queue.length})</Text>
            <VStack align="stretch" spacing={2}>
                {queue.map(c => (
                    <Box key={c.chat_id} p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                        <Text fontSize="sm" fontWeight="bold" isTruncated>{c.auth_users?.email || 'User'}</Text>
                        <Text fontSize="xs" color="gray.500" mt={1}>Keluhan: {c.summary}</Text>
                        <Text fontSize="xs" color="red.400" mt={1}>Alasan: {c.reason}</Text>
                        <HStack mt={2} justify="space-between">
                            <HStack color="gray.400" fontSize="xs"><FaClock /><Text>{new Date(c.created_at).toLocaleTimeString()}</Text></HStack>
                            <Button size="xs" colorScheme="blue" onClick={() => handleTakeChat(c)}>Take</Button>
                        </HStack>
                    </Box>
                ))}
            </VStack>
         </Box>
      </Box>

      {/* Chat Panel */}
      <Flex flex={1} direction="column" bg="white">
        {selectedChat ? (
            <>
              {/* Header */}
              <Box p={4} borderBottom="1px solid" borderColor="gray.200" bg="white">
                  <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                          <Heading size="md">{selectedChat.auth_users?.email || 'User'}</Heading>
                          <Text fontSize="xs" color="gray.500">Summary: {selectedChat.summary}</Text>
                      </VStack>
                      <Button size="sm" colorScheme="red" leftIcon={<FaCheckCircle />} onClick={handleCloseChat}>Akhiri Chat</Button>
                  </Flex>
              </Box>

              {/* Messages */}
              <Box flex={1} overflowY="auto" p={6} bg="gray.50" ref={scrollRef}>
                  <VStack spacing={4} align="stretch">
                      {messages.map(m => {
                          const isMe = m.sender === csSession.username;
                          const isSys = m.sender === 'ai';

                          if (isSys) {
                              return (
                                  <Box key={m.id} alignSelf="center" bg="yellow.100" px={4} py={2} borderRadius="md" fontSize="xs" color="yellow.800" maxW="80%">
                                      <Text whiteSpace="pre-wrap">{m.message}</Text>
                                  </Box>
                              );
                          }

                          return (
                              <Flex key={m.id} justify={isMe ? 'flex-end' : 'flex-start'}>
                                  <Box maxW="70%" bg={isMe ? 'blue.500' : 'white'} color={isMe ? 'white' : 'black'} px={4} py={2} borderRadius="lg" border={isMe ? 'none' : '1px solid'} borderColor="gray.200" boxShadow="sm">
                                      <Text fontSize="xs" fontWeight="bold" color={isMe ? 'blue.100' : 'gray.500'} mb={1}>
                                          {isMe ? 'Anda' : (m.sender === 'user' ? 'User' : m.sender)}
                                      </Text>
                                      <Text fontSize="sm" whiteSpace="pre-wrap">{m.message}</Text>
                                  </Box>
                              </Flex>
                          );
                      })}
                  </VStack>
              </Box>

              {/* Input */}
              <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
                  <HStack>
                      <Input
                          placeholder="Ketik balasan..."
                          value={inputMsg}
                          onChange={(e) => setInputMsg(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          bg="gray.50"
                      />
                      <IconButton colorScheme="blue" icon={<FaPaperPlane />} onClick={handleSend} aria-label="send" />
                  </HStack>
              </Box>
            </>
        ) : (
            <Flex flex={1} justify="center" align="center" direction="column" color="gray.400">
                <FaUser size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
                <Heading size="md">Tidak ada chat aktif</Heading>
                <Text>Pilih user dari antrian untuk mulai melayani</Text>
            </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default CSDashboard;
