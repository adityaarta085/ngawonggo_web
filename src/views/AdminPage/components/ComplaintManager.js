import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Badge,
  Flex,
  Image,
} from '@chakra-ui/react';
import { FaReply, FaTrash, FaCheck, FaPaperPlane, FaImage, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { uploadDeline } from '../../../lib/uploader';

const ComplaintManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchComplaints = useCallback(async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setComplaints(data);
  }, []);

  const fetchMessages = useCallback(async (id) => {
    const { data, error } = await supabase
      .from('complaint_messages')
      .select('*')
      .eq('complaint_id', id)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data);
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    if (selectedComplaint) {
      fetchMessages(selectedComplaint.id);
      const sub = supabase
        .channel(`admin_complaint_${selectedComplaint.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaint_messages', filter: `complaint_id=eq.${selectedComplaint.id}` },
        payload => setMessages(prev => [...prev, payload.new]))
        .subscribe();
      return () => supabase.removeChannel(sub);
    }
  }, [selectedComplaint, fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (imgUrl = null) => {
    if (!newMessage && !imgUrl) return;
    const { error } = await supabase
      .from('complaint_messages')
      .insert([{
        complaint_id: selectedComplaint.id,
        sender_type: 'admin',
        message: newMessage,
        image_url: imgUrl
      }]);
    if (!error) setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const link = await uploadDeline(file);
      await handleSendMessage(link);
    } finally {
      setUploading(false);
    }
  };

  const markResolved = async (id) => {
    const { error } = await supabase.from('complaints').update({ status: 'resolved' }).eq('id', id);
    if (!error) {
      toast({ title: 'Selesai', status: 'success' });
      fetchComplaints();
      if(selectedComplaint?.id === id) setSelectedComplaint({...selectedComplaint, status: 'resolved'});
    }
  };

  const deleteComplaint = async (id) => {
    if (window.confirm('Hapus pengaduan ini?')) {
      const { error } = await supabase.from('complaints').delete().eq('id', id);
      if (!error) {
        toast({ title: 'Dihapus', status: 'success' });
        fetchComplaints();
        if(selectedComplaint?.id === id) setSelectedComplaint(null);
      }
    }
  };

  if (selectedComplaint) {
    return (
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" h="700px" display="flex" flexDirection="column">
        <HStack mb={4} justify="space-between">
          <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => setSelectedComplaint(null)}>Kembali</Button>
          <HStack>
            <Badge colorScheme="purple">{selectedComplaint.id}</Badge>
            <Badge colorScheme={selectedComplaint.status === 'resolved' ? 'green' : 'orange'}>
              {selectedComplaint.status === 'resolved' ? 'Selesai' : 'Terbuka'}
            </Badge>
          </HStack>
        </HStack>

        <Box flex={1} overflowY="auto" mb={4} p={2} border="1px solid" borderColor="gray.100" borderRadius="md">
           <VStack spacing={4} align="stretch">
             {messages.map(msg => (
               <Flex key={msg.id} justify={msg.sender_type === 'admin' ? 'flex-end' : 'flex-start'}>
                 <Box maxW="70%" bg={msg.sender_type === 'admin' ? 'blue.500' : 'gray.100'} color={msg.sender_type === 'admin' ? 'white' : 'black'} p={3} borderRadius="lg">
                    {msg.message && <Text fontSize="sm">{msg.message}</Text>}
                    {msg.image_url && <Image src={msg.image_url} mt={2} borderRadius="md" maxH="200px" />}
                    <Text fontSize="10px" mt={1} opacity={0.7}>{new Date(msg.created_at).toLocaleString()}</Text>
                 </Box>
               </Flex>
             ))}
             <div ref={chatEndRef} />
           </VStack>
        </Box>

        <HStack>
          <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Ketik balasan admin..." />
          <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
          <IconButton icon={<FaImage />} onClick={() => fileInputRef.current.click()} isLoading={uploading} />
          <IconButton icon={<FaPaperPlane />} colorScheme="blue" onClick={() => handleSendMessage()} />
          {selectedComplaint.status !== 'resolved' && (
            <Button colorScheme="green" leftIcon={<FaCheck />} onClick={() => markResolved(selectedComplaint.id)}>Selesaikan</Button>
          )}
        </HStack>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>ID</Th>
            <Th>Nama</Th>
            <Th>Status</Th>
            <Th>Tanggal</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {complaints.map(c => (
            <Tr key={c.id}>
              <Td><Badge>{c.id}</Badge></Td>
              <Td fontWeight="bold">{c.name}</Td>
              <Td>
                <Badge colorScheme={c.status === 'resolved' ? 'green' : 'orange'}>{c.status}</Badge>
              </Td>
              <Td fontSize="xs">{new Date(c.created_at).toLocaleDateString()}</Td>
              <Td>
                <HStack>
                  <IconButton size="sm" icon={<FaReply />} onClick={() => setSelectedComplaint(c)} />
                  <IconButton size="sm" icon={<FaCheck />} colorScheme="green" onClick={() => markResolved(c.id)} isDisabled={c.status === 'resolved'} />
                  <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => deleteComplaint(c.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ComplaintManager;
