import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  Avatar,
  IconButton,
  Image,
  Flex,
  Badge,
  Textarea,
  Heading,
} from '@chakra-ui/react';
import { FaPaperPlane, FaImage, FaSync, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { uploadDeline } from '../../lib/uploader';

const generateComplaintId = () => {
  return 'NGA-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

const ComplaintSystem = () => {
  const [complaintId, setComplaintId] = useState(localStorage.getItem('complaint_id') || '');
  const [complaintData, setComplaintData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchComplaint = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data: complaint, error: cError } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (cError || !complaint) {
        throw new Error('Pengaduan tidak ditemukan');
      }

      setComplaintData(complaint);

      const { data: msgs, error: mError } = await supabase
        .from('complaint_messages')
        .select('*')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (mError) throw mError;
      setMessages(msgs);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat pengaduan', description: err.message, status: 'error' });
      setComplaintId('');
      localStorage.removeItem('complaint_id');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (complaintId) {
      fetchComplaint(complaintId);
      // Subscribe to new messages
      const subscription = supabase
        .channel(`complaint_${complaintId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'complaint_messages',
          filter: `complaint_id=eq.${complaintId}`
        }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [complaintId, fetchComplaint]);

  const handleStartComplaint = async (e) => {
    e.preventDefault();
    if (!name || !newMessage) return;

    setLoading(true);
    const newId = generateComplaintId();

    try {
      const { error: cError } = await supabase
        .from('complaints')
        .insert([{ id: newId, name: name }]);

      if (cError) throw cError;

      const { error: mError } = await supabase
        .from('complaint_messages')
        .insert([{
          complaint_id: newId,
          sender_type: 'user',
          message: newMessage
        }]);

      if (mError) throw mError;

      setComplaintId(newId);
      localStorage.setItem('complaint_id', newId);
      setNewMessage('');
    } catch (err) {
      toast({ title: 'Gagal membuat pengaduan', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (imgUrl = null) => {
    if (!newMessage && !imgUrl) return;

    try {
      const { error } = await supabase
        .from('complaint_messages')
        .insert([{
          complaint_id: complaintId,
          sender_type: 'user',
          message: newMessage,
          image_url: imgUrl
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      toast({ title: 'Gagal mengirim pesan', description: err.message, status: 'error' });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File terlalu besar', description: 'Maksimal 2MB', status: 'warning' });
      return;
    }

    setUploading(true);
    try {
      const link = await uploadDeline(file);
      await handleSendMessage(link);
    } catch (err) {
      toast({ title: 'Gagal upload gambar', description: err.message, status: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    setComplaintId('');
    setComplaintData(null);
    setMessages([]);
    localStorage.removeItem('complaint_id');
  };

  if (!complaintId) {
    return (
      <Box p={6} bg="white" borderRadius="xl" boxShadow="md" maxW="600px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="md" color="brand.500" mb={2}>Layanan Pengaduan Mandiri</Heading>
            <Text fontSize="sm" color="gray.500">Sampaikan keluhan atau aspirasi Anda secara langsung.</Text>
          </Box>
          <form onSubmit={handleStartComplaint}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Lengkap</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama Anda" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Pesan / Keluhan Awal</FormLabel>
                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Apa yang ingin Anda sampaikan?" />
              </FormControl>
              <Button colorScheme="brand" w="full" type="submit" isLoading={loading}>
                Kirim Pengaduan
              </Button>
            </VStack>
          </form>
          <Divider />
          <Box>
            <Text fontSize="xs" fontWeight="bold" mb={2}>Sudah punya ID Pengaduan?</Text>
            <HStack>
              <Input
                size="sm"
                placeholder="NGA-XXXXX"
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                value={trackId}
              />
              <Button size="sm" colorScheme="blue" onClick={() => {
                if(trackId.trim()) {
                   setComplaintId(trackId.trim());
                   localStorage.setItem('complaint_id', trackId.trim());
                }
              }}>Lacak</Button>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" borderRadius="xl" boxShadow="lg" maxW="800px" mx="auto" h="600px" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4} pb={2} borderBottom="1px solid" borderColor="gray.100">
        <HStack>
          <Avatar size="sm" bg="brand.500" />
          <Box>
            <Text fontWeight="bold" fontSize="sm">{complaintData?.name || 'User'}</Text>
            <HStack spacing={2}>
               <Badge colorScheme="purple" fontSize="10px">{complaintId}</Badge>
               <Badge colorScheme={complaintData?.status === 'resolved' ? 'green' : 'orange'} fontSize="10px">
                 {complaintData?.status === 'resolved' ? 'Selesai' : 'Diproses'}
               </Badge>
            </HStack>
          </Box>
        </HStack>
        <HStack>
          <IconButton size="sm" icon={<FaSync />} onClick={() => fetchComplaint(complaintId)} isLoading={loading} variant="ghost" />
          <IconButton size="sm" icon={<FaSignOutAlt />} onClick={handleLogout} variant="ghost" colorScheme="red" />
        </HStack>
      </Flex>

      {/* Messages */}
      <Box flex={1} overflowY="auto" p={2} mb={4} css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
      }}>
        <VStack spacing={4} align="stretch">
          {messages.map((msg) => (
            <Flex key={msg.id} justify={msg.sender_type === 'user' ? 'flex-end' : 'flex-start'}>
              <Box
                maxW="80%"
                bg={msg.sender_type === 'user' ? 'brand.500' : 'gray.100'}
                color={msg.sender_type === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                borderBottomRightRadius={msg.sender_type === 'user' ? '0' : 'lg'}
                borderBottomLeftRadius={msg.sender_type === 'user' ? 'lg' : '0'}
                boxShadow="sm"
              >
                {msg.message && <Text fontSize="sm">{msg.message}</Text>}
                {msg.image_url && (
                  <Image src={msg.image_url} mt={2} borderRadius="md" maxH="200px" cursor="pointer" onClick={() => window.open(msg.image_url)} />
                )}
                <Text fontSize="10px" mt={1} opacity={0.7} textAlign="right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={chatEndRef} />
        </VStack>
      </Box>

      {/* Input */}
      {complaintData?.status !== 'resolved' ? (
        <HStack spacing={2}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
          <IconButton
            icon={<FaImage />}
            onClick={() => fileInputRef.current.click()}
            isLoading={uploading}
            colorScheme="gray"
          />
          <IconButton
            icon={<FaPaperPlane />}
            colorScheme="brand"
            onClick={() => handleSendMessage()}
            isDisabled={!newMessage && !uploading}
          />
        </HStack>
      ) : (
        <Box p={3} bg="green.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="green.700" fontWeight="bold">Pengaduan ini telah ditandai sebagai Selesai oleh Admin.</Text>
        </Box>
      )}
    </Box>
  );
};

export default ComplaintSystem;
