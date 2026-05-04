import React, { useState, useEffect, useRef } from 'react';
import {
  Box, VStack, HStack, Input, Button, Text, Heading, useToast, Flex, Avatar,
  IconButton, Badge, Select, Textarea, FormControl, FormLabel, Icon, Image
} from '@chakra-ui/react';
import { FaPaperPlane, FaImage, FaSignOutAlt, FaSync, FaLock, FaHistory } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { uploadDeline } from '../../lib/uploader';
import { Link as RouterLink } from 'react-router-dom';

const ComplaintSystem = () => {
  const [user, setUser] = useState(null);
  const [complaintId, setComplaintId] = useState(localStorage.getItem('complaint_id') || '');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [category, setCategory] = useState('Infrastruktur');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [isVip, setIsVip] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        setContact(session.user.email || '');
        checkVip(session.user.id);
      }
    });

    if (complaintId) {
      fetchComplaint(complaintId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const subscription = supabase
      .channel('public:complaint_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaint_messages', filter: `complaint_id=eq.${complaintId}` }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkVip = async (userId) => {
    try {
      const { data } = await supabase.from('user_tiers').select('tier_name').eq('user_id', userId).single();
      if (data && data.tier_name !== 'Free' && data.tier_name) {
        setIsVip(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComplaint = async (id) => {
    setLoading(true);
    try {
      const { data: compData, error: compErr } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (compErr) throw compErr;
      setComplaintData(compData);

      const { data: msgData } = await supabase
        .from('complaint_messages')
        .select('*')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (msgData) setMessages(msgData);
    } catch (err) {
      toast({ title: 'ID tidak ditemukan', status: 'error' });
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleStartComplaint = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setLoading(true);

    const newId = `NGA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    try {
      const { error } = await supabase.from('complaints').insert([{
        id: newId,
        user_id: user.id,
        name: fullName,
        contact: contact,
        category: category,
        status: 'pending'
      }]);

      if (error) throw error;

      await supabase.from('complaint_messages').insert([{
        complaint_id: newId,
        sender_type: 'user',
        message: newMessage
      }]);


      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `<b>Ada Pengaduan/Laporan Baru!</b>\n\n<b>Pelapor:</b> ${fullName}\n<b>NIK:</b> ${contact}\n<b>Kategori:</b> ${category}\n<b>Laporan:</b> ${newMessage}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
      }).catch(err => console.error("Telegram error:", err));


      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `<b>Ada Pengaduan/Laporan Baru!</b>\n\n<b>Pelapor:</b> ${fullName}\n<b>NIK:</b> ${contact}\n<b>Kategori:</b> ${category}\n<b>Laporan:</b> ${newMessage}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
      }).catch(err => console.error("Telegram error:", err));

      fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'adityaarta085@gmail.com',
          subject: `Laporan Baru [${category}] - ${fullName}`,
          content: `<p>Ada keluhan baru dengan ID <strong>${newId}</strong>.</p><p>Pengirim: ${fullName}</p><p>Kontak: ${contact}</p><p>Pesan:<br/>${newMessage}</p>`
        })
      }).catch(console.error);

      if (!isVip && user.email) {
          fetch('/api/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              subject: `Akses Pengaduan Anda: ${newId}`,
              content: `<p>Terima kasih telah melapor, ${fullName}.</p><p>Gunakan ID ini jika Anda perlu melacak nanti: <strong>${newId}</strong>.</p><p>Tingkatkan akun Anda menjadi VIP untuk menyimpan riwayat ini secara otomatis di web.</p>`
            })
          }).catch(console.error);
          toast({ title: 'ID Keluhan Terkirim ke Email', description: 'Silakan cek email Anda karena Anda pengguna Free Tier.', status: 'info', duration: 7000 });
      }

      setComplaintId(newId);
      if (!isVip) {
        localStorage.setItem('complaint_id', newId);
      }
      setNewMessage('');
    } catch (err) {
      toast({ title: 'Gagal membuat pengaduan', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (imgUrl = null) => {
    if (!newMessage.trim() && !imgUrl) return;
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

  if (!user) {
      return (
        <Box p={{ base: 6, md: 10 }} bg="white" borderRadius="3xl" boxShadow="xl" maxW="800px" mx="auto" textAlign="center">
            <Icon as={FaLock} boxSize={16} color="brand.500" mb={6} />
            <Heading size="lg" color="brand.500" mb={4}>Login Diperlukan</Heading>
            <Text fontSize="md" color="gray.600" mb={8}>
              Untuk memastikan keaslian identitas dan mencegah spam, Anda diwajibkan untuk masuk (login) sebelum dapat menggunakan layanan Pengaduan Desa Ngawonggo.
            </Text>
            <Button as={RouterLink} to="/auth" colorScheme="brand" size="lg" borderRadius="full" px={10}>
              Masuk Sekarang
            </Button>
        </Box>
      );
  }

  if (!complaintId) {
    return (
      <Box p={{ base: 4, md: 8 }} bg="white" borderRadius="3xl" boxShadow="xl" maxW="800px" mx="auto" border="1px solid" borderColor="gray.100">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" color="brand.500" mb={3}>Sampaikan Aspirasi & Keluhan Anda</Heading>
            <Text fontSize="md" color="gray.600">
              Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga.
            </Text>
          </Box>

          <HStack justify="space-between" bg="brand.50" p={4} borderRadius="xl">
             <Text fontSize="sm" fontWeight="bold">Pengguna: {user.user_metadata?.full_name || user.email}</Text>
             <Button as={RouterLink} to="/layanan/history" size="sm" colorScheme="brand" variant="outline" leftIcon={<FaHistory />}>
               Riwayat VIP
             </Button>
          </HStack>



          <form onSubmit={handleStartComplaint}>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontWeight="bold">Kontak Opsional (WA)</FormLabel>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Nomor WhatsApp"
                  borderRadius="xl"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Kategori</FormLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)} borderRadius="xl">
                  <option value="Infrastruktur">Infrastruktur</option>
                  <option value="Pelayanan Publik">Pelayanan Publik</option>
                  <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                  <option value="Saran & Kritik">Saran & Kritik</option>
                  <option value="Lainnya">Lainnya</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Isi Pengaduan</FormLabel>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ceritakan detail pengaduan atau aspirasi Anda..."
                  borderRadius="xl"
                  rows={4}
                />
              </FormControl>

              <Button colorScheme="brand" w="full" type="submit" isLoading={loading} size="lg" borderRadius="xl">
                Kirim Pengaduan Sekarang
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" borderRadius="xl" boxShadow="lg" maxW="800px" mx="auto" h="600px" display="flex" flexDirection="column">
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

      <Box flex={1} overflowY="auto" p={2} mb={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((msg) => (
            <Flex key={msg.id} justify={msg.sender_type === 'user' ? 'flex-end' : 'flex-start'}>
              <Box maxW="80%" bg={msg.sender_type === 'user' ? 'brand.500' : 'gray.100'} color={msg.sender_type === 'user' ? 'white' : 'black'} p={3} borderRadius="lg" borderBottomRightRadius={msg.sender_type === 'user' ? '0' : 'lg'} borderBottomLeftRadius={msg.sender_type === 'user' ? 'lg' : '0'}>
                {msg.message && <Text fontSize="sm">{msg.message}</Text>}
                {msg.image_url && <Image src={msg.image_url} mt={2} borderRadius="md" maxH="200px" cursor="pointer" onClick={() => window.open(msg.image_url)} />}
                <Text fontSize="10px" mt={1} opacity={0.7} textAlign="right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={chatEndRef} />
        </VStack>
      </Box>

      {complaintData?.status !== 'resolved' ? (
        <HStack spacing={2}>
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
          <IconButton icon={<FaImage />} onClick={() => fileInputRef.current.click()} isLoading={uploading} colorScheme="gray" />
          <IconButton icon={<FaPaperPlane />} colorScheme="brand" onClick={() => handleSendMessage()} isDisabled={!newMessage && !uploading} />
        </HStack>
      ) : (
        <Box p={3} bg="green.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="green.700" fontWeight="bold">Pengaduan ini telah ditandai sebagai Selesai.</Text>
        </Box>
      )}
    </Box>
  );
};

export default ComplaintSystem;