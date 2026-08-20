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
  Checkbox,
  Tooltip,
} from '@chakra-ui/react';
import { FaReply, FaTrash, FaCheck, FaPaperPlane, FaImage, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { uploadDeline } from '../../../lib/uploader';
import axios from 'axios';

const ComplaintManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notifyUser, setNotifyUser] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const [userEmailMap, setUserEmailMap] = useState({});

  const toast = useToast();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed && parsed.username) setAdminName(parsed.username);
      } catch (e) {}
    }

    const fetchUsers = async () => {
      try {
        const { data } = await supabase.rpc('get_all_users');
        if (data) {
          const map = {};
          data.forEach(u => {
            if (u.id && u.email) map[u.id] = u.email;
          });
          setUserEmailMap(map);
        }
      } catch (e) {
        console.warn('Could not fetch user email map:', e);
      }
    };
    fetchUsers();
  }, []);

  const getUserEmail = useCallback((complaint) => {
    if (!complaint) return '';
    if (complaint.user_id && userEmailMap[complaint.user_id]) {
      return userEmailMap[complaint.user_id];
    }
    if (complaint.contact && complaint.contact.includes('@')) {
      return complaint.contact;
    }
    return '';
  }, [userEmailMap]);

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
    const messageText = newMessage;
    setNewMessage('');

    const { error } = await supabase
      .from('complaint_messages')
      .insert([{
        complaint_id: selectedComplaint.id,
        sender_type: 'admin',
        message: messageText,
        image_url: imgUrl
      }]);

    if (!error) {
       const targetEmail = getUserEmail(selectedComplaint);

       // Send email notification to user's registered email
       if (notifyUser && targetEmail) {
          try {
             await axios.post('/api/broadcast', {
               to: targetEmail,
               subject: `Respon Pengaduan [${selectedComplaint.id}] - Desa Ngawonggo`,
               content: `
                 <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                   <h2 style="color: #6C5CE7; margin-bottom: 8px;">Respon Pengaduan Warga Desa Ngawonggo</h2>
                   <p>Halo <b>${selectedComplaint.name || 'Warga'}</b>,</p>
                   <p>Laporan pengaduan Anda dengan ID: <b>${selectedComplaint.id}</b> telah mendapat tanggapan dari Perangkat Desa (<b>${adminName}</b>):</p>
                   <div style="background: #f7fafc; border-left: 4px solid #6C5CE7; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                     <p style="margin: 0; font-style: italic;">"${messageText || (imgUrl ? '[Melampirkan Gambar/Dokumen]' : '')}"</p>
                   </div>
                   <p>Silakan kunjungi portal layanan pengaduan Desa Ngawonggo untuk melihat detail atau membalas pesan.</p>
                   <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                   <p style="font-size: 12px; color: #718096; margin: 0;">Email ini dikirim secara otomatis oleh Sistem Informasi Layanan Desa Ngawonggo.</p>
                 </div>
               `
             });
             toast({ title: 'Notifikasi Email Terkirim', description: `Terkirim ke ${targetEmail}`, status: 'success', duration: 3000 });
          } catch (e) {
             console.error('Email send error:', e);
          }
       }

       // In-app notification
       if (selectedComplaint.user_id) {
         try {
           await supabase.rpc('send_system_notification', {
             p_user_id: selectedComplaint.user_id,
             p_title: `Tanggapan Pengaduan [${selectedComplaint.id}]`,
             p_message: `Admin (${adminName}): "${messageText ? messageText.slice(0, 100) : 'Lampiran baru'}"`,
             p_type: 'complaint'
           });
         } catch (e) {}
       }
    }
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
      toast({ title: 'Pengaduan Diselesaikan', status: 'success' });
      fetchComplaints();
      if(selectedComplaint?.id === id) setSelectedComplaint({...selectedComplaint, status: 'resolved'});

      const comp = complaints.find(c => c.id === id) || selectedComplaint;
      const targetEmail = getUserEmail(comp);

      if (targetEmail) {
        try {
          await axios.post('/api/broadcast', {
            to: targetEmail,
            subject: `Pengaduan Selesai [${id}] - Desa Ngawonggo`,
            content: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #38A169; margin-bottom: 8px;">Pengaduan Anda Telah Selesai Ditindaklanjuti ✅</h2>
                <p>Halo <b>${comp?.name || 'Warga'}</b>,</p>
                <p>Pengaduan Anda dengan ID: <b>${id}</b> telah dinyatakan <b>SELESAI</b> ditindaklanjuti oleh Perangkat Desa (<b>${adminName}</b>).</p>
                <p>Terima kasih atas kepedulian dan partisipasi Anda dalam membangun Desa Ngawonggo yang lebih baik.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #718096; margin: 0;">Email ini dikirim secara otomatis oleh Sistem Informasi Layanan Desa Ngawonggo.</p>
              </div>
            `
          });
          toast({ title: 'Notifikasi Selesai Terkirim', description: `Email dikirim ke ${targetEmail}`, status: 'info' });
        } catch (err) {
          console.error('Failed to send completion email:', err);
        }
      }

      if (comp?.user_id) {
        try {
          await supabase.rpc('send_system_notification', {
            p_user_id: comp.user_id,
            p_title: `Pengaduan [${id}] Telah Selesai`,
            p_message: `Laporan Anda telah berhasil diselesaikan oleh perangkat desa (${adminName}). Terima kasih!`,
            p_type: 'complaint'
          });
        } catch (e) {}
      }
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
    const targetEmail = getUserEmail(selectedComplaint);

    return (
      <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" h="700px" display="flex" flexDirection="column">
        <HStack mb={4} justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Button leftIcon={<FaArrowLeft />} variant="ghost" size="sm" onClick={() => setSelectedComplaint(null)}>Kembali</Button>
            <HStack>
              <Text fontWeight="bold" fontSize="lg">{selectedComplaint.name}</Text>
              <Badge colorScheme="purple">{selectedComplaint.id}</Badge>
            </HStack>
            <HStack fontSize="sm" color="gray.600" flexWrap="wrap">
               <Text><b>Kontak:</b> {selectedComplaint.contact || '-'}</Text>
               <Text>•</Text>
               <Text><b>Email Akun:</b></Text>
               <Badge colorScheme={targetEmail ? "teal" : "gray"} fontSize="xs">
                 {targetEmail || 'Tidak terdeteksi'}
               </Badge>
               <Text>•</Text>
               <Text><b>Kategori:</b> {selectedComplaint.category || '-'}</Text>
            </HStack>
          </VStack>
          <Badge colorScheme={selectedComplaint.status === 'resolved' ? 'green' : 'orange'} p={2} borderRadius="md">
            {selectedComplaint.status === 'resolved' ? 'Selesai' : 'Terbuka'}
          </Badge>
        </HStack>

        <Box flex={1} overflowY="auto" mb={4} p={2} border="1px solid" borderColor="gray.100" borderRadius="md">
           <VStack spacing={4} align="stretch">
             {messages.map(msg => (
               <Flex key={msg.id} justify={msg.sender_type === 'admin' ? 'flex-end' : 'flex-start'}>
                 <Box maxW="70%" bg={msg.sender_type === 'admin' ? 'purple.600' : 'gray.100'} color={msg.sender_type === 'admin' ? 'white' : 'black'} p={3} borderRadius="lg">
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
          <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Ketik balasan admin..." onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }} />
          <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
          <IconButton icon={<FaImage />} onClick={() => fileInputRef.current.click()} isLoading={uploading} aria-label="Unggah gambar" />
          <IconButton icon={<FaPaperPlane />} colorScheme="purple" onClick={() => handleSendMessage()} aria-label="Kirim balasan" />

          <Tooltip label={targetEmail ? `Kirim email notifikasi otomatis ke: ${targetEmail}` : 'Email pengguna belum terdaftar'} placement="top">
             <Checkbox isChecked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} colorScheme="purple" mr={2}>
                Beritahu Pengguna {targetEmail ? `(${targetEmail})` : ''}
             </Checkbox>
          </Tooltip>
          {selectedComplaint.status !== 'resolved' && (
            <Button colorScheme="green" leftIcon={<FaCheck />} onClick={() => markResolved(selectedComplaint.id)}>Selesaikan</Button>
          )}
        </HStack>
      </Box>
    );
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" overflow="hidden">
      <Table variant="simple">
        <Thead bg="gray.50" _dark={{ bg: "gray.900" }}>
          <Tr>
            <Th>ID</Th>
            <Th>Nama & Kontak</Th>
            <Th>Email Akun</Th>
            <Th>Kategori</Th>
            <Th>Status</Th>
            <Th>Tanggal</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {complaints.map(c => {
            const targetEmail = getUserEmail(c);
            return (
              <Tr key={c.id}>
                <Td><Badge colorScheme="purple">{c.id}</Badge></Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{c.name}</Text>
                    <Text fontSize="xs" color="gray.500">{c.contact}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Text fontSize="xs" color="teal.600" fontWeight="medium">
                    {targetEmail || '-'}
                  </Text>
                </Td>
                <Td>
                  <Badge variant="outline" colorScheme="blue">{c.category}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme={c.status === 'resolved' ? 'green' : 'orange'}>{c.status}</Badge>
                </Td>
                <Td fontSize="xs">{new Date(c.created_at).toLocaleDateString()}</Td>
                <Td>
                  <HStack>
                    <IconButton size="sm" icon={<FaReply />} onClick={() => setSelectedComplaint(c)} aria-label="Buka Chat" />
                    <IconButton size="sm" icon={<FaCheck />} colorScheme="green" onClick={() => markResolved(c.id)} isDisabled={c.status === 'resolved'} aria-label="Selesaikan" />
                    <IconButton size="sm" icon={<FaTrash />} colorScheme="red" onClick={() => deleteComplaint(c.id)} aria-label="Hapus" />
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ComplaintManager;
