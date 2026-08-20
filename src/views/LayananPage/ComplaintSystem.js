import React, { useState, useEffect, useRef } from 'react';
import {
  Box, VStack, HStack, Input, Button, Text, Heading, useToast, Flex, Avatar,
  IconButton, Badge, Select, Textarea, FormControl, FormLabel, Icon, Image
} from '@chakra-ui/react';
import { FaPaperPlane, FaImage, FaSignOutAlt, FaSync, FaLock, FaHistory, FaRocket } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { uploadDeline } from '../../lib/uploader';
import { Link as RouterLink } from 'react-router-dom';
import { useMonetization } from '../../contexts/MonetizationContext';

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

  const { isVIP, settings, currency, deductCurrency } = useMonetization();
  const toast = useToast();
  const fileInputRef = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        setContact(session.user.email || '');
      }
    });

    if (complaintId) {
      fetchComplaint(complaintId);
    }

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

    try {
      // 1. Check dynamic limits from Monetization settings
      if (settings?.monetization_enabled) {
        const limitDays = isVIP ? (settings.layanan_vip_limit_days || 3) : (settings.layanan_free_limit_days || 1);
        const limitCount = isVIP ? (settings.layanan_vip_limit_count || 3) : (settings.layanan_free_limit_count || 1);
        const sinceDate = new Date(Date.now() - limitDays * 24 * 60 * 60 * 1000).toISOString();

        const { count: recentCount } = await supabase
          .from('complaints')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', sinceDate);

        if (recentCount !== null && recentCount >= limitCount) {
          const fastTrackPrice = settings.fast_track_price || 50;
          if (currency?.coins >= fastTrackPrice) {
            const confirmFastTrack = window.confirm(
              `Batas pengaduan tercapai (${recentCount}/${limitCount} dalam ${limitDays} hari).\n\nApakah Anda ingin menggunakan Fast Track (${fastTrackPrice} Koin) untuk langsung mengajukan laporan ini tanpa menunggu cooldown?`
            );
            if (confirmFastTrack) {
              const deducted = await deductCurrency(fastTrackPrice, 'coins', 'Fast Track Pengaduan');
              if (!deducted) {
                setLoading(false);
                return;
              }
            } else {
              setLoading(false);
              return;
            }
          } else {
            toast({
              title: 'Batas Pengaduan Tercapai',
              description: `Batas pengaduan akun Anda adalah ${limitCount} laporan per ${limitDays} hari. Butuh ${fastTrackPrice} Koin untuk Fast Track atau upgrade ke VIP.`,
              status: 'warning',
              duration: 7000
            });
            setLoading(false);
            return;
          }
        }
      }

      const newId = `NGA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

      const { error } = await supabase.from('complaints').insert([{
        id: newId,
        user_id: user.id,
        name: fullName,
        contact: contact || user.email,
        category: category,
        status: 'pending'
      }]);

      if (error) throw error;

      await supabase.from('complaint_messages').insert([{
        complaint_id: newId,
        sender_type: 'user',
        message: newMessage
      }]);

      // Telegram notification to admin
      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `<b>Ada Pengaduan/Laporan Baru!</b>\n\n<b>Pelapor:</b> ${fullName}\n<b>Email/Kontak:</b> ${contact || user.email}\n<b>Kategori:</b> ${category}\n<b>Laporan:</b> ${newMessage}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
      }).catch(err => console.error("Telegram error:", err));

      // Email confirmation to user's registered login email
      if (user.email) {
        fetch('/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            subject: `Akses Pengaduan Anda [${newId}] - Desa Ngawonggo`,
            content: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #6C5CE7; margin-bottom: 8px;">Pengaduan Anda Berhasil Diterima</h2>
                <p>Halo <b>${fullName}</b>,</p>
                <p>Terima kasih telah menyampaikan pengaduan di Desa Ngawonggo. Laporan Anda telah tercatat dengan detail:</p>
                <div style="background: #f7fafc; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><b>ID Pengaduan:</b> <span style="color: #6C5CE7; font-weight: bold;">${newId}</span></p>
                  <p style="margin: 4px 0;"><b>Kategori:</b> ${category}</p>
                  <p style="margin: 4px 0;"><b>Pesan:</b> "${newMessage}"</p>
                </div>
                <p>Perangkat desa akan segera meninjau dan merespon pengaduan Anda. Anda akan menerima email notifikasi saat ada respon baru.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #718096; margin: 0;">Sistem Informasi Layanan Desa Ngawonggo</p>
              </div>
            `
          })
        }).catch(console.error);
        toast({ title: 'Pengaduan Terkirim', description: `ID ${newId} dan notifikasi dikirim ke ${user.email}`, status: 'success', duration: 5000 });
      }

      // In-app notification
      try {
        await supabase.rpc('send_system_notification', {
          p_user_id: user.id,
          p_title: 'Pengaduan Terkirim',
          p_message: `Pengaduan Anda [${newId}] berhasil diajukan dan sedang dalam antrean review admin.`,
          p_type: 'complaint'
        });
      } catch (e) {}

      setComplaintId(newId);
      if (!isVIP) {
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
        <Box p={{ base: 6, md: 10 }} bg="white" _dark={{ bg: "gray.800" }} borderRadius="3xl" boxShadow="xl" maxW="800px" mx="auto" textAlign="center">
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
      <Box p={{ base: 4, md: 8 }} bg="white" _dark={{ bg: "gray.800" }} borderRadius="3xl" boxShadow="xl" maxW="800px" mx="auto" border="1px solid" borderColor="gray.100">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" color="brand.500" mb={3}>Sampaikan Aspirasi & Keluhan Anda</Heading>
            <Text fontSize="md" color="gray.600">
              Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga.
            </Text>
          </Box>

          <HStack justify="space-between" bg="purple.50" _dark={{ bg: "purple.950" }} p={4} borderRadius="xl" flexWrap="wrap" gap={2}>
             <VStack align="start" spacing={0.5}>
               <Text fontSize="sm" fontWeight="bold">Pengguna: {user.user_metadata?.full_name || user.email}</Text>
               <HStack spacing={2} fontSize="xs">
                 <Badge colorScheme={isVIP ? "teal" : "purple"}>{isVIP ? "👑 VIP Member" : "Warga (Free)"}</Badge>
                 <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="xs">
                   Kuota: {isVIP ? `${settings.layanan_vip_limit_count || 3} laporan / ${settings.layanan_vip_limit_days || 3} hari` : `${settings.layanan_free_limit_count || 1} laporan / ${settings.layanan_free_limit_days || 1} hari`}
                 </Text>
               </HStack>
             </VStack>
             <HStack spacing={2}>
               <Button as={RouterLink} to="/topup" size="xs" colorScheme="orange" leftIcon={<FaRocket />}>
                 Fast Track ({settings.fast_track_price || 50} Koin)
               </Button>
               <Button as={RouterLink} to="/layanan/history" size="xs" colorScheme="purple" variant="outline" leftIcon={<FaHistory />}>
                 Riwayat VIP
               </Button>
             </HStack>
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
    <Box p={4} bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="lg" maxW="800px" mx="auto" h="600px" display="flex" flexDirection="column">
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