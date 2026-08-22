import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  useToast,
  Badge,
  Spinner,
  HStack,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  FaTv,
  FaBroadcastTower,
  FaCalendarAlt,
  FaImages,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSyncAlt,
  FaExclamationTriangle,
  FaSave,
  FaExternalLinkAlt,
  FaBell,
  FaPlay,
  FaStop,
  FaVideo,
  FaSignOutAlt,
  FaUsers,
  FaMosque,
  FaClock,
  FaShieldAlt,
} from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { socketService } from '../services/socketService';
import { getYouTubeVideoId } from '../../MediaPage/LiveStreamView';

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box p={6} bg={cardBg} rounded="2xl" shadow="md" borderWidth="1px" borderColor={cardBorder}>
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text color={labelColor} fontSize="sm" fontWeight="bold">
            {title}
          </Text>
          <Heading size="lg">{value}</Heading>
        </VStack>
        <Box p={3} bg={`${color}.50`} color={`${color}.500`} _dark={{ bg: 'whiteAlpha.100' }} rounded="xl">
          <Icon as={icon} w={6} h={6} />
        </Box>
      </Flex>
    </Box>
  );
};

// SIDEBAR ITEM
const SidebarItem = ({ icon, children, to, isActive }) => {
  const normalColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const hoverColor = useColorModeValue('gray.900', 'white');

  return (
    <Link to={to} style={{ width: '100%' }}>
      <Flex
        align="center"
        p="3.5"
        mx="3"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : normalColor}
        _hover={{
          bg: isActive ? 'brand.600' : hoverBg,
          color: isActive ? 'white' : hoverColor,
        }}
        transition="all 0.2s"
        fontWeight="bold"
        fontSize="sm"
      >
        <Icon
          mr="3"
          fontSize="16"
          _groupHover={{ color: isActive ? 'white' : hoverColor }}
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};

// 1. DASHBOARD HOME (OVERVIEW - SINGLE NGAWONGGO TV)
const DashboardHome = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');
  
  const [counts, setCounts] = useState({ contents: 0, schedules: 0 });
  const [liveStream, setLiveStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      
      const { count: cCount } = await supabase.from('display_contents').select('id', { count: 'exact', head: true });
      const { count: sCount } = await supabase.from('display_schedules').select('id', { count: 'exact', head: true });
      
      setCounts({
        contents: cCount || 0,
        schedules: sCount || 0
      });

      const { data: liveData } = await supabase
        .from('display_livestreams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      setLiveStream(liveData);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat overview', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleControlTV = async (action, extraPayload = {}) => {
    try {
      await socketService.emit('NGAWONGGO-TV', action, extraPayload);
      toast({ title: `Sinyal ${action} dikirim ke Ngawonggo TV`, status: 'success', duration: 2500 });
      fetchOverview();
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengirim perintah', status: 'error', duration: 2500 });
    }
  };

  if (loading) {
    return (
      <Flex p={8} justify="center" align="center" h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Overview Penyiaran Ngawonggo TV</Heading>
        <Button leftIcon={<FaSyncAlt />} onClick={fetchOverview} size="sm" colorScheme="gray">
          Refresh Data
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <StatCard
          title="Status Penyiaran"
          value={liveStream ? 'ON AIR' : 'OFF AIR'}
          icon={FaBroadcastTower}
          color={liveStream ? 'red' : 'gray'}
        />
        <StatCard title="Konten Slideshow" value={counts.contents} icon={FaImages} color="green" />
        <StatCard title="Agenda & Jadwal" value={counts.schedules} icon={FaCalendarAlt} color="purple" />
      </SimpleGrid>

      <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} shadow="sm">
        <Heading size="md" mb={4}>Status Saluran Televisi Utama</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Saluran TV</Th>
              <Th>Status Siaran</Th>
              <Th>Program Saat Ini</Th>
              <Th>Aksi Cepat</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Ngawonggo TV Utama</Td>
              <Td>
                <Badge colorScheme={liveStream ? 'green' : 'gray'}>
                  {liveStream ? '● ON AIR' : 'STANDBY'}
                </Badge>
              </Td>
              <Td color="gray.500">
                {liveStream?.title || 'Layar Standby'}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button size="xs" colorScheme="red" onClick={() => window.open('/media/live', '_blank')} rightIcon={<FaExternalLinkAlt />}>
                    Buka Siaran TV
                  </Button>
                  <Button size="xs" colorScheme="gray" onClick={() => handleControlTV('reload')}>
                    Refresh TV
                  </Button>
                  <Button size="xs" colorScheme="teal" onClick={() => handleControlTV('set-mode', { mode: 'normal' })}>
                    Set Normal
                  </Button>
                </HStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

// 2. KONTEN MANAGER (SLIDESHOW)
const ContentManager = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    type: 'image',
    media_url: '',
    duration: 10,
    order: 0,
    is_active: true
  });

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('display_contents').select('*').order('order', { ascending: true });
      setContents(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat konten', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleOpenModal = (content = null) => {
    if (content) {
      setFormData(content);
    } else {
      setFormData({
        id: null,
        title: '',
        type: 'image',
        media_url: '',
        duration: 10,
        order: contents.length + 1,
        is_active: true
      });
    }
    onOpen();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { error } = await supabase.from('display_contents').update(formData).eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Konten berhasil diupdate', status: 'success', duration: 2500 });
      } else {
        const { error } = await supabase.from('display_contents').insert([formData]);
        if (error) throw error;
        toast({ title: 'Konten berhasil ditambahkan', status: 'success', duration: 2500 });
      }
      onClose();
      fetchContents();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menyimpan konten', status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus konten ini?')) return;
    try {
      const { error } = await supabase.from('display_contents').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Konten dihapus', status: 'success', duration: 2500 });
      fetchContents();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghapus', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manajemen Konten Slideshow TV</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Tambah Konten
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>
      ) : (
        <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} shadow="sm">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Urutan</Th>
                <Th>Judul Konten</Th>
                <Th>Tipe</Th>
                <Th>Durasi (Detik)</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contents.map(c => (
                <Tr key={c.id}>
                  <Td fontWeight="bold">#{c.order}</Td>
                  <Td fontWeight="semibold">{c.title}</Td>
                  <Td><Badge colorScheme="teal">{c.type.toUpperCase()}</Badge></Td>
                  <Td>{c.duration}s</Td>
                  <Td>
                    <Badge colorScheme={c.is_active ? 'green' : 'red'}>
                      {c.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FaEdit />} size="sm" onClick={() => handleOpenModal(c)} aria-label="Edit" />
                      <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(c.id)} aria-label="Delete" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {contents.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8} color="gray.500">
                    Belum ada konten display.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent rounded="2xl" p={2}>
          <form onSubmit={handleSave}>
            <ModalHeader>{formData.id ? 'Edit Konten' : 'Tambah Konten Baru'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul Konten</FormLabel>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Jadwal Sholat Tarawih, Pengumuman Zakat" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tipe Konten</FormLabel>
                  <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="image">Gambar / Poster</option>
                    <option value="text">Teks Pengumuman</option>
                    <option value="video">Video Singkat</option>
                  </Select>
                </FormControl>

                <FormControl isRequired={formData.type !== 'text'}>
                  <FormLabel>URL Media</FormLabel>
                  <Input value={formData.media_url || ''} onChange={e => setFormData({ ...formData, media_url: e.target.value })} placeholder="https://..." />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Durasi Tampil (Detik)</FormLabel>
                    <Input type="number" min={5} max={120} value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 10 })} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Urutan Slide</FormLabel>
                    <Input type="number" min={1} value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })} />
                  </FormControl>
                </SimpleGrid>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Aktifkan Konten</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} colorScheme="brand" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit">Simpan Konten</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// 3. MASTER CONTROL PENYIARAN NGAWONGGO TV (LIVESTREAM & OVERLAYS STUDIO)
const LiveStreamControl = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const presetBg = useColorModeValue('gray.50', 'gray.800');
  const presetBorder = useColorModeValue('gray.200', 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  const tagBg = useColorModeValue('gray.100', 'gray.800');
  const alertBorderColor = useColorModeValue('gray.300', 'gray.700');

  const [activeLive, setActiveLive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewerCount, setViewerCount] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const [streamForm, setStreamForm] = useState({
    title: 'Pesona Wisata, Sejarah & Budaya Ngawonggo',
    description: 'Dokumenter keindahan alam, kearifan lokal, dan kehidupan masyarakat Desa Ngawonggo.',
    url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
    mode: 'simulated',
    duration: 900,
    loop_broadcast: true,
    running_text: '🔴 LIVE: Ngawonggo TV - Menghadirkan tayangan edukasi, kebudayaan, informasi desa, dan kajian 24 jam nonstop untuk seluruh masyarakat.',
    show_running_text: true,
    show_prayer_widget: true,
    show_breaking_news: false,
    breaking_news_title: 'WARTA KHUSUS NGAWONGGO',
    breaking_news_text: 'Pemerintah Desa Ngawonggo mengajak seluruh warga untuk senantiasa menjaga kebersihan lingkungan dan kerukunan bersama.',
    show_program_info: true,
    show_watermark: true,
    next_program_title: 'Warta Warga Desa Ngawonggo',
    next_program_time: '19:30 WIB',
    emergency_mode: false,
    emergency_title: 'PENGUMUMAN PENTING DESA',
    emergency_message: 'Harap seluruh warga memperhatikan himbauan darurat ini dan tetap waspada.',
  });

  const PRESET_VIDEOS = [
    {
      title: 'Profil Desa & Wisata Ngawonggo',
      url: 'https://www.youtube.com/watch?v=kYV3V5d9Dk8',
      mode: 'simulated',
      duration: 600,
      description: 'Menelusuri keindahan alam dan potensi wisata alam Desa Ngawonggo.',
    },
    {
      title: 'Pesona Sejarah & Kebudayaan Magelang',
      url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
      mode: 'simulated',
      duration: 900,
      description: 'Kisah sejarah peradaban dan kearifan lokal masyarakat Magelang.',
    },
    {
      title: 'Pesona Alam Kaliangkrik & Gunung Sumbing',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      mode: 'simulated',
      duration: 1800,
      description: 'Pemandangan alam spektakuler lereng Gunung Sumbing Kaliangkrik.',
    },
    {
      title: 'Kajian & Mutiara Hikmah Warga',
      url: 'https://www.youtube.com/watch?v=Em2PWeaSzok',
      mode: 'simulated',
      duration: 1200,
      description: 'Siraman rohani dan panduan ibadah harian untuk masyarakat.',
    },
  ];

  const TICKER_PRESETS = [
    '🔴 LIVE: Ngawonggo TV - Menghadirkan tayangan edukasi, kebudayaan, informasi desa, dan kajian 24 jam nonstop untuk seluruh masyarakat.',
    '🕌 JADWAL IBADAH: Mari memakmurkan masjid dengan sholat berjamaah tepat waktu dan mengikuti kajian berkala di Desa Ngawonggo.',
    '🌿 LINGKUNGAN: Gotong royong kebersihan lingkungan dan pemilahan sampah desa akan serentak dilaksanakan pada Ahad pagi pukul 07.00 WIB.',
    '📢 WARTA WARGA: Pelayanan administrasi kependudukan (KTP, KK, Surat Pengantar) buka setiap hari kerja pukul 08.00 - 15.00 WIB di Kantor Balai Desa.',
  ];

  const fetchLiveStatus = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('display_livestreams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setActiveLive(data);
        setStreamForm((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        setActiveLive(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveStatus();

    const tvChannel = supabase.channel('ngawonggo_live_tv_main');
    tvChannel.on('presence', { event: 'sync' }, () => {
      const state = tvChannel.presenceState();
      setViewerCount(Math.max(1, Object.keys(state).length));
    });
    tvChannel.subscribe();

    return () => {
      supabase.removeChannel(tvChannel);
    };
  }, [fetchLiveStatus]);

  // Robust handleStartBroadcast without duplicate key errors
  const handleStartBroadcast = async (customConfig = null) => {
    const payload = customConfig || streamForm;
    if (!payload.url || !payload.url.trim()) {
      toast({ title: 'Masukkan URL video / stream', status: 'warning', duration: 2500 });
      return;
    }

    try {
      setSaving(true);
      
      const broadcastData = {
        title: payload.title || 'Siaran Ngawonggo TV',
        description: payload.description || '',
        url: payload.url.trim(),
        mode: payload.mode || 'simulated',
        duration: payload.duration || 900,
        loop_broadcast: payload.loop_broadcast !== false,
        running_text: payload.running_text || '',
        show_running_text: payload.show_running_text !== false,
        show_prayer_widget: payload.show_prayer_widget !== false,
        show_breaking_news: !!payload.show_breaking_news,
        breaking_news_title: payload.breaking_news_title || 'WARTA KHUSUS NGAWONGGO',
        breaking_news_text: payload.breaking_news_text || '',
        show_program_info: payload.show_program_info !== false,
        show_watermark: payload.show_watermark !== false,
        next_program_title: payload.next_program_title || 'Warta Warga Desa Ngawonggo',
        next_program_time: payload.next_program_time || '19:30 WIB',
        emergency_mode: !!payload.emergency_mode,
        emergency_title: payload.emergency_title || 'PENGUMUMAN PENTING DESA',
        emergency_message: payload.emergency_message || '',
        is_active: true,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let savedData = null;

      // Update existing single row or insert fresh
      const { data: existingRows } = await supabase
        .from('display_livestreams')
        .select('id')
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        const targetId = existingRows[0].id;
        const { data, error } = await supabase
          .from('display_livestreams')
          .update(broadcastData)
          .eq('id', targetId)
          .select()
          .single();

        if (error) throw error;
        savedData = data;
      } else {
        const { data, error } = await supabase
          .from('display_livestreams')
          .insert([broadcastData])
          .select()
          .single();

        if (error) throw error;
        savedData = data;
      }

      setActiveLive(savedData);
      setStreamForm((prev) => ({ ...prev, ...savedData }));

      // Broadcast update to all viewers and display
      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'start-live',
        payload: savedData,
      });

      await socketService.emit('NGAWONGGO-TV', 'start-live', { url: savedData.url });
      await socketService.emit('NGAWONGGO-TV', 'set-mode', { mode: 'live', url: savedData.url });

      toast({
        title: 'Siaran Berhasil Mengudara (ON AIR)!',
        description: 'Seluruh pengguna dan layar TV kini memutar siaran secara tersinkronisasi.',
        status: 'success',
        duration: 3500,
      });
      fetchLiveStatus();
    } catch (err) {
      console.error('Error starting broadcast:', err);
      toast({ title: 'Gagal memulai siaran', description: err.message, status: 'error', duration: 3500 });
    } finally {
      setSaving(false);
    }
  };

  // Robust handleStopBroadcast
  const handleStopBroadcast = async () => {
    if (!window.confirm('Hentikan siaran Ngawonggo TV sekarang dan alihkan ke layar Standby?')) return;

    try {
      setSaving(true);
      await supabase
        .from('display_livestreams')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('is_active', true);

      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'stop-live',
      });

      await socketService.emit('NGAWONGGO-TV', 'stop-live');
      await socketService.emit('NGAWONGGO-TV', 'set-mode', { mode: 'normal' });

      setActiveLive(null);
      toast({ title: 'Siaran dihentikan. Mode Standby aktif.', status: 'info', duration: 3000 });
      fetchLiveStatus();
    } catch (err) {
      console.error('Error stopping broadcast:', err);
      toast({ title: 'Gagal menghentikan siaran', status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  // Robust handleSaveLiveConfig
  const handleSaveLiveConfig = async () => {
    try {
      setSaving(true);
      const configData = {
        title: streamForm.title,
        description: streamForm.description,
        mode: streamForm.mode,
        duration: streamForm.duration,
        loop_broadcast: streamForm.loop_broadcast,
        running_text: streamForm.running_text,
        show_running_text: streamForm.show_running_text,
        show_prayer_widget: streamForm.show_prayer_widget,
        show_breaking_news: streamForm.show_breaking_news,
        breaking_news_title: streamForm.breaking_news_title,
        breaking_news_text: streamForm.breaking_news_text,
        show_program_info: streamForm.show_program_info,
        show_watermark: streamForm.show_watermark,
        next_program_title: streamForm.next_program_title,
        next_program_time: streamForm.next_program_time,
        emergency_mode: streamForm.emergency_mode,
        emergency_title: streamForm.emergency_title,
        emergency_message: streamForm.emergency_message,
        updated_at: new Date().toISOString(),
      };

      const { data: existingRows } = await supabase
        .from('display_livestreams')
        .select('id')
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        const { error } = await supabase
          .from('display_livestreams')
          .update(configData)
          .eq('id', existingRows[0].id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('display_livestreams')
          .insert([{ ...configData, is_active: false, url: streamForm.url }]);
        if (error) throw error;
      }

      // Broadcast update
      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'update-overlay',
        payload: configData,
      });

      toast({
        title: 'Pengaturan Berhasil Disimpan & Diterapkan',
        description: 'Perubahan ticker, overlay, dan grafis otomatis tampil di seluruh layar pemirsa.',
        status: 'success',
        duration: 3000,
      });
      fetchLiveStatus();
    } catch (err) {
      console.error('Error saving config:', err);
      toast({ title: 'Gagal menyimpan pengaturan', status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSyncAnchor = async () => {
    try {
      setSaving(true);
      const newStartedAt = new Date().toISOString();
      
      const { data: existingRows } = await supabase
        .from('display_livestreams')
        .select('id')
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        await supabase
          .from('display_livestreams')
          .update({ started_at: newStartedAt, updated_at: newStartedAt })
          .eq('id', existingRows[0].id);
      }

      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'sync-player',
      });
      await socketService.emit('NGAWONGGO-TV', 'sync-player');

      toast({
        title: 'Jam Sinkronisasi Direset ke Detik Ini!',
        description: 'Seluruh pemirsa langsung melompat ke detik 00:00 dan tersinkronisasi bersamaan.',
        status: 'success',
        duration: 3000,
      });
      fetchLiveStatus();
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mereset sinkronisasi', status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleForceSync = async () => {
    try {
      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'sync-player',
      });
      await socketService.emit('NGAWONGGO-TV', 'sync-player');
      toast({ title: 'Sinyal sinkronisasi dikirim ke semua layar!', status: 'success', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengirim sinyal sinkronisasi', status: 'error', duration: 2000 });
    }
  };

  const handlePlayChime = async () => {
    try {
      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'play-chime',
      });
      await socketService.emit('NGAWONGGO-TV', 'play-chime');
      toast({ title: 'Nada lonceng studio dipicu di semua pemirsa!', status: 'teal', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memicu lonceng', status: 'error', duration: 2000 });
    }
  };

  const handleForceReload = async () => {
    if (!window.confirm('Muat ulang seluruh layar TV pemirsa sekarang?')) return;
    try {
      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'reload',
      });
      await socketService.emit('NGAWONGGO-TV', 'reload');
      toast({ title: 'Sinyal reload dikirim!', status: 'warning', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengirim reload', status: 'error', duration: 2000 });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* Studio Header Bar */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
        mb={8}
        bg={boxBg}
        p={6}
        borderRadius="3xl"
        border="1px solid"
        borderColor={boxBorder}
        shadow="md"
      >
        <HStack spacing={4}>
          <Box p={3.5} bg="red.500" color="white" borderRadius="2xl" shadow="md">
            <Icon as={FaBroadcastTower} w={7} h={7} />
          </Box>
          <VStack align="start" spacing={0.5}>
            <HStack spacing={3}>
              <Heading size="md" fontWeight="800">
                Master Control Room Ngawonggo TV
              </Heading>
              <Badge
                colorScheme={activeLive ? 'red' : 'gray'}
                variant="solid"
                px={3}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                {activeLive ? '● ON AIR' : 'STANDBY'}
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Pusat kendali penyiaran, sinkronisasi video realtime, running text ticker, dan grafis on-screen.
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={3}>
          <HStack
            bg={tagBg}
            px={4}
            py={2}
            borderRadius="xl"
            fontSize="sm"
            fontWeight="bold"
          >
            <Icon as={FaUsers} color="cyan.400" />
            <Text>{viewerCount} Pemirsa Terhubung</Text>
          </HStack>

          <Button
            as="a"
            href="/media/live"
            target="_blank"
            colorScheme="red"
            variant="solid"
            size="md"
            borderRadius="xl"
            leftIcon={<FaTv />}
            rightIcon={<FaExternalLinkAlt />}
          >
            Buka Siaran TV
          </Button>
        </HStack>
      </Flex>

      {/* Main Studio Grid */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8}>
        {/* KOLOM KIRI: Live Preview & Quick Actions (5 cols) */}
        <VStack spacing={6} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 5' }}>
          {/* Studio Monitor */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="sm" display="flex" alignItems="center" gap={2}>
                <Icon as={FaTv} color="brand.500" /> Monitor Siaran Studio
              </Heading>
              {activeLive && (
                <Badge colorScheme="green" fontSize="xx-small">
                  SYNC AKTIF
                </Badge>
              )}
            </Flex>

            {activeLive ? (
              <Box
                position="relative"
                pb="56.25%"
                bg="black"
                borderRadius="2xl"
                overflow="hidden"
                border="3px solid"
                borderColor="red.500"
                boxShadow="xl"
              >
                {getYouTubeVideoId(activeLive.url) ? (
                  <Box
                    as="iframe"
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(activeLive.url)}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                    title="Live Studio Monitor"
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    border="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeLive.url}
                    autoPlay
                    playsInline
                    muted
                    controls
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  colorScheme="red"
                  variant="solid"
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  fontSize="2xs"
                  zIndex={2}
                >
                  ● LIVE STUDIO (MUTED)
                </Badge>
              </Box>
            ) : (
              <Flex
                h="220px"
                bg="gray.900"
                borderRadius="2xl"
                direction="column"
                justify="center"
                align="center"
                color="whiteAlpha.600"
                border="2px dashed"
                borderColor={alertBorderColor}
              >
                <Icon as={FaTv} w={10} h={10} mb={2} color="gray.500" />
                <Text fontWeight="bold" fontSize="sm">SIARAN STANDBY / OFFLINE</Text>
                <Text fontSize="xs" color="gray.500">Pilih preset atau mulai siaran di sebelah kanan</Text>
              </Flex>
            )}

            {activeLive && (
              <VStack align="stretch" spacing={2} mt={4} p={3.5} bg={sectionBg} borderRadius="2xl" fontSize="xs">
                <HStack justify="space-between">
                  <Text color="gray.500">Judul Program:</Text>
                  <Text fontWeight="bold" noOfLines={1}>{activeLive.title}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.500">Mode Siaran:</Text>
                  <Badge colorScheme={activeLive.mode === 'simulated' ? 'purple' : 'teal'}>
                    {activeLive.mode === 'simulated' ? 'SIMULATED LIVE (SINKRON)' : 'REAL LIVE'}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.500">Jam Mulai:</Text>
                  <Text fontWeight="bold">
                    {new Date(activeLive.started_at || activeLive.created_at).toLocaleTimeString('id-ID')} WIB
                  </Text>
                </HStack>
              </VStack>
            )}
          </Box>

          {/* Quick Actions Console */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <Heading size="sm" mb={4}>Konsol Aksi Real-Time Studio</Heading>
            <SimpleGrid columns={2} spacing={3}>
              <Button
                leftIcon={<FaSyncAlt />}
                onClick={handleForceSync}
                colorScheme="blue"
                variant="outline"
                borderRadius="xl"
                size="sm"
                isDisabled={!activeLive}
              >
                Force Resync
              </Button>

              <Button
                leftIcon={<FaBell />}
                onClick={handlePlayChime}
                colorScheme="teal"
                variant="outline"
                borderRadius="xl"
                size="sm"
              >
                Bunyikan Chime
              </Button>

              <Button
                leftIcon={<FaClock />}
                onClick={handleResetSyncAnchor}
                colorScheme="purple"
                variant="outline"
                borderRadius="xl"
                size="sm"
                isDisabled={!activeLive || streamForm.mode !== 'simulated'}
              >
                Reset Jam Siaran
              </Button>

              <Button
                leftIcon={<FaSyncAlt />}
                onClick={handleForceReload}
                colorScheme="orange"
                variant="outline"
                borderRadius="xl"
                size="sm"
              >
                Reload Semua TV
              </Button>
            </SimpleGrid>
          </Box>

          {/* Preset Video Library */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <Heading size="sm" mb={2}>Preset Video Siaran Cepat</Heading>
            <Text fontSize="xs" color="gray.500" mb={4}>Klik salah satu video untuk mengisi konfigurasi dan siarkan seketika:</Text>

            <VStack spacing={3} align="stretch">
              {PRESET_VIDEOS.map((video, idx) => (
                <Box
                  key={idx}
                  p={3.5}
                  bg={presetBg}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={presetBorder}
                  _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)', shadow: 'sm' }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => {
                    setStreamForm((prev) => ({
                      ...prev,
                      title: video.title,
                      url: video.url,
                      mode: video.mode,
                      duration: video.duration || 900,
                      description: video.description || prev.description,
                    }));
                    toast({ title: `Preset dipilih: ${video.title}`, status: 'info', duration: 1500 });
                  }}
                >
                  <Flex justify="space-between" align="start" mb={1}>
                    <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                      {video.title}
                    </Text>
                    <Badge colorScheme={video.mode === 'simulated' ? 'purple' : 'green'} fontSize="2xs">
                      {video.mode.toUpperCase()}
                    </Badge>
                  </Flex>
                  <Text fontSize="2xs" color="gray.500" noOfLines={1} mb={2}>
                    {video.description}
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="brand"
                      leftIcon={<FaPlay />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartBroadcast({
                          ...streamForm,
                          title: video.title,
                          url: video.url,
                          mode: video.mode,
                          duration: video.duration || 900,
                        });
                      }}
                    >
                      Siarkan Sekarang
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStreamForm((prev) => ({
                          ...prev,
                          title: video.title,
                          url: video.url,
                          mode: video.mode,
                          duration: video.duration || 900,
                        }));
                      }}
                    >
                      Pilih ke Form
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>

        {/* KOLOM KANAN: Master Broadcast Settings, Overlays, and EBS (7 cols) */}
        <VStack spacing={6} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 7' }}>
          <Box bg={boxBg} p={{ base: 5, md: 8 }} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            {/* Master On-Air Action Banner */}
            <Flex
              bg={activeLive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)'}
              p={5}
              borderRadius="2xl"
              border="1px solid"
              borderColor={activeLive ? 'red.400' : 'gray.400'}
              justify="space-between"
              align="center"
              mb={6}
              wrap="wrap"
              gap={4}
            >
              <HStack spacing={3}>
                <Box p={3} bg={activeLive ? 'red.500' : 'gray.500'} color="white" borderRadius="xl">
                  <Icon as={FaBroadcastTower} w={6} h={6} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.500">
                    MASTER STATUS PENYIARAN
                  </Text>
                  <Heading size="md" color={activeLive ? 'red.500' : 'gray.600'}>
                    {activeLive ? 'SIARAN SEDANG MENGUDARA (ON AIR)' : 'SIARAN STANDBY / MATI'}
                  </Heading>
                </VStack>
              </HStack>

              {activeLive ? (
                <Button
                  colorScheme="red"
                  leftIcon={<FaStop />}
                  onClick={handleStopBroadcast}
                  size="md"
                  borderRadius="xl"
                  isLoading={saving}
                >
                  Hentikan Siaran
                </Button>
              ) : (
                <Button
                  colorScheme="green"
                  leftIcon={<FaPlay />}
                  onClick={() => handleStartBroadcast()}
                  size="md"
                  borderRadius="xl"
                  isLoading={saving}
                >
                  Mulai Siarkan Sekarang
                </Button>
              )}
            </Flex>

            {/* Tabs for Configuration */}
            <Tabs index={activeTab} onChange={(idx) => setActiveTab(idx)} variant="soft-rounded" colorScheme="brand">
              <TabList mb={6} bg={tagBg} p={1.5} borderRadius="2xl" overflowX="auto">
                <Tab borderRadius="xl" fontSize="xs" fontWeight="bold">
                  <Icon as={FaVideo} mr={2} /> Video & Stream
                </Tab>
                <Tab borderRadius="xl" fontSize="xs" fontWeight="bold">
                  <Icon as={FaTv} mr={2} /> Ticker & Grafis
                </Tab>
                <Tab borderRadius="xl" fontSize="xs" fontWeight="bold">
                  <Icon as={FaMosque} mr={2} /> Jadwal & Program
                </Tab>
                <Tab borderRadius="xl" fontSize="xs" fontWeight="bold">
                  <Icon as={FaExclamationTriangle} mr={2} /> Peringatan Darurat
                </Tab>
              </TabList>

              <TabPanels>
                {/* TAB 1: VIDEO STREAM CONFIG */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">Judul Program Siaran</FormLabel>
                      <Input
                        value={streamForm.title}
                        onChange={(e) => setStreamForm({ ...streamForm, title: e.target.value })}
                        placeholder="Contoh: Pesona Wisata & Kebudayaan Ngawonggo"
                        borderRadius="xl"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">Deskripsi / Sinopsis Program</FormLabel>
                      <Textarea
                        value={streamForm.description}
                        onChange={(e) => setStreamForm({ ...streamForm, description: e.target.value })}
                        placeholder="Deskripsi singkat tayangan..."
                        borderRadius="xl"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">URL Video / Stream (YouTube, MP4, HLS m3u8)</FormLabel>
                      <Input
                        value={streamForm.url}
                        onChange={(e) => setStreamForm({ ...streamForm, url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... atau .m3u8"
                        borderRadius="xl"
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">Mode Penyiaran</FormLabel>
                        <Select
                          value={streamForm.mode}
                          onChange={(e) => setStreamForm({ ...streamForm, mode: e.target.value })}
                          borderRadius="xl"
                        >
                          <option value="simulated">Simulated Live (Presisi Sinkron 24 Jam)</option>
                          <option value="live">Real Live Stream (HLS / YouTube Live)</option>
                        </Select>
                        <Text fontSize="2xs" color="gray.500" mt={1}>
                          * Simulated Live menjamin detik video sama persis di seluruh pemirsa.
                        </Text>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">Durasi Video (Detik)</FormLabel>
                        <Input
                          type="number"
                          value={streamForm.duration}
                          onChange={(e) => setStreamForm({ ...streamForm, duration: parseInt(e.target.value) || 0 })}
                          borderRadius="xl"
                        />
                        <Text fontSize="2xs" color="gray.500" mt={1}>
                          * Diperlukan untuk perhitungan perulangan loop sinkron.
                        </Text>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl display="flex" alignItems="center" justify="space-between" p={3.5} bg={sectionBg} borderRadius="2xl">
                      <VStack align="start" spacing={0}>
                        <FormLabel mb="0" fontSize="sm" fontWeight="bold">Perulangan Video Nonstop (24 Jam Loop)</FormLabel>
                        <Text fontSize="xs" color="gray.500">Video akan berulang otomatis tanpa jeda untuk seluruh pemirsa</Text>
                      </VStack>
                      <Switch
                        isChecked={streamForm.loop_broadcast}
                        onChange={(e) => setStreamForm({ ...streamForm, loop_broadcast: e.target.checked })}
                        colorScheme="brand"
                      />
                    </FormControl>

                    <HStack spacing={3} pt={2}>
                      <Button
                        colorScheme="brand"
                        leftIcon={<FaSave />}
                        onClick={handleSaveLiveConfig}
                        isLoading={saving}
                        borderRadius="xl"
                      >
                        Simpan Pengaturan
                      </Button>
                      {!activeLive && (
                        <Button
                          colorScheme="green"
                          leftIcon={<FaPlay />}
                          onClick={() => handleStartBroadcast()}
                          isLoading={saving}
                          borderRadius="xl"
                        >
                          Mulai Siarkan
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </TabPanel>

                {/* TAB 2: TICKER & ON-SCREEN GRAPHICS */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <FormControl display="flex" alignItems="center" justify="space-between" p={3.5} bg={sectionBg} borderRadius="2xl">
                      <VStack align="start" spacing={0}>
                        <FormLabel mb="0" fontSize="sm" fontWeight="bold">Aktifkan Running Text Ticker</FormLabel>
                        <Text fontSize="xs" color="gray.500">Menampilkan teks berjalan warta desa di bagian bawah TV</Text>
                      </VStack>
                      <Switch
                        isChecked={streamForm.show_running_text}
                        onChange={(e) => setStreamForm({ ...streamForm, show_running_text: e.target.checked })}
                        colorScheme="brand"
                      />
                    </FormControl>

                    <FormControl isRequired={streamForm.show_running_text}>
                      <FormLabel fontSize="sm" fontWeight="bold">Isi Teks Berjalan (Running Text Ticker)</FormLabel>
                      <Textarea
                        value={streamForm.running_text}
                        onChange={(e) => setStreamForm({ ...streamForm, running_text: e.target.value })}
                        placeholder="Ketik teks berjalan..."
                        borderRadius="xl"
                        rows={3}
                      />
                    </FormControl>

                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
                        Template Teks Cepat:
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {TICKER_PRESETS.map((tText, i) => (
                          <Button
                            key={i}
                            size="xs"
                            variant="ghost"
                            justifyContent="start"
                            textAlign="left"
                            py={2}
                            h="auto"
                            whiteSpace="normal"
                            onClick={() => setStreamForm({ ...streamForm, running_text: tText })}
                          >
                            • {tText}
                          </Button>
                        ))}
                      </VStack>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl display="flex" alignItems="center" justify="space-between" p={3.5} bg={sectionBg} borderRadius="2xl">
                        <VStack align="start" spacing={0}>
                          <FormLabel mb="0" fontSize="sm" fontWeight="bold">Logo & Watermark LIVE</FormLabel>
                          <Text fontSize="xs" color="gray.500">Badge LIVE & Station Tag pojok kanan atas</Text>
                        </VStack>
                        <Switch
                          isChecked={streamForm.show_watermark}
                          onChange={(e) => setStreamForm({ ...streamForm, show_watermark: e.target.checked })}
                          colorScheme="brand"
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center" justify="space-between" p={3.5} bg={sectionBg} borderRadius="2xl">
                        <VStack align="start" spacing={0}>
                          <FormLabel mb="0" fontSize="sm" fontWeight="bold">Info Program Siaran</FormLabel>
                          <Text fontSize="xs" color="gray.500">Banner "Sedang Tayang" di layar TV</Text>
                        </VStack>
                        <Switch
                          isChecked={streamForm.show_program_info}
                          onChange={(e) => setStreamForm({ ...streamForm, show_program_info: e.target.checked })}
                          colorScheme="brand"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <Button
                      colorScheme="brand"
                      leftIcon={<FaSave />}
                      onClick={handleSaveLiveConfig}
                      isLoading={saving}
                      borderRadius="xl"
                      size="md"
                    >
                      Simpan & Perbarui Grafis TV
                    </Button>
                  </VStack>
                </TabPanel>

                {/* TAB 3: JADWAL & PROGRAM INFO */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <FormControl display="flex" alignItems="center" justify="space-between" p={3.5} bg={sectionBg} borderRadius="2xl">
                      <VStack align="start" spacing={0}>
                        <FormLabel mb="0" fontSize="sm" fontWeight="bold">Widget Jadwal Sholat Realtime</FormLabel>
                        <Text fontSize="xs" color="gray.500">Menampilkan bar waktu sholat Magelang & hitung mundur di layar TV</Text>
                      </VStack>
                      <Switch
                        isChecked={streamForm.show_prayer_widget}
                        onChange={(e) => setStreamForm({ ...streamForm, show_prayer_widget: e.target.checked })}
                        colorScheme="teal"
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">Program Berikutnya (Up Next)</FormLabel>
                        <Input
                          value={streamForm.next_program_title}
                          onChange={(e) => setStreamForm({ ...streamForm, next_program_title: e.target.value })}
                          placeholder="Contoh: Warta Desa Ngawonggo"
                          borderRadius="xl"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">Jam Tayang Berikutnya</FormLabel>
                        <Input
                          value={streamForm.next_program_time}
                          onChange={(e) => setStreamForm({ ...streamForm, next_program_time: e.target.value })}
                          placeholder="Contoh: 19:30 WIB"
                          borderRadius="xl"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <Box p={4} bg="teal.50" _dark={{ bg: 'rgba(20, 184, 166, 0.15)' }} borderRadius="2xl" border="1px solid" borderColor="teal.200">
                      <HStack spacing={3}>
                        <Icon as={FaMosque} color="teal.500" w={5} h={5} />
                        <Text fontSize="xs" color="teal.800" _dark={{ color: 'teal.200' }} fontWeight="semibold">
                          Jadwal sholat terhubung langsung dengan API Aladhan (Metode Kemenag RI / Wilayah Magelang) dengan pembaruan otomatis setiap hari.
                        </Text>
                      </HStack>
                    </Box>

                    <Button
                      colorScheme="brand"
                      leftIcon={<FaSave />}
                      onClick={handleSaveLiveConfig}
                      isLoading={saving}
                      borderRadius="xl"
                    >
                      Simpan Jadwal Program
                    </Button>
                  </VStack>
                </TabPanel>

                {/* TAB 4: PERINGATAN DARURAT & BREAKING NEWS */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    {/* Breaking News Card */}
                    <Box p={5} bg="yellow.50" _dark={{ bg: 'rgba(234, 179, 8, 0.1)' }} borderRadius="2xl" border="1px solid" borderColor="yellow.300">
                      <Heading size="xs" color="yellow.800" _dark={{ color: 'yellow.200' }} mb={3}>
                        Warta Khusus / Breaking News Banner
                      </Heading>
                      <FormControl display="flex" alignItems="center" justify="space-between" mb={3}>
                        <FormLabel mb="0" fontSize="xs" fontWeight="bold">Tampilkan Banner Warta Khusus</FormLabel>
                        <Switch
                          isChecked={streamForm.show_breaking_news}
                          onChange={(e) => setStreamForm({ ...streamForm, show_breaking_news: e.target.checked })}
                          colorScheme="yellow"
                        />
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel fontSize="xs" fontWeight="bold">Judul Headline Warta Khusus</FormLabel>
                        <Input
                          value={streamForm.breaking_news_title}
                          onChange={(e) => setStreamForm({ ...streamForm, breaking_news_title: e.target.value })}
                          placeholder="WARTA KHUSUS NGAWONGGO"
                          borderRadius="xl"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl mb={2}>
                        <FormLabel fontSize="xs" fontWeight="bold">Isi Pesan Warta Khusus</FormLabel>
                        <Textarea
                          value={streamForm.breaking_news_text}
                          onChange={(e) => setStreamForm({ ...streamForm, breaking_news_text: e.target.value })}
                          placeholder="Ketik pengumuman khusus..."
                          borderRadius="xl"
                          rows={2}
                          size="sm"
                        />
                      </FormControl>
                    </Box>

                    {/* Emergency Mode Card */}
                    <Box p={5} bg="red.50" _dark={{ bg: 'rgba(239, 68, 68, 0.15)' }} borderRadius="2xl" border="2px solid" borderColor="red.400">
                      <HStack spacing={3} mb={3}>
                        <Icon as={FaExclamationTriangle} color="red.500" w={6} h={6} />
                        <Heading size="xs" color="red.700" _dark={{ color: 'red.200' }}>
                          Sistem Peringatan Darurat Desa (Emergency Broadcast Takeover)
                        </Heading>
                      </HStack>
                      <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }} mb={4}>
                        PERHATIAN: Mengaktifkan mode ini akan mengambil alih seluruh layar TV dengan tampilan merah darurat dan pesan khusus.
                      </Text>

                      <FormControl display="flex" alignItems="center" justify="space-between" mb={3}>
                        <FormLabel mb="0" fontSize="xs" fontWeight="bold" color="red.600" _dark={{ color: 'red.200' }}>
                          STATUS SIARAN DARURAT
                        </FormLabel>
                        <Switch
                          isChecked={streamForm.emergency_mode}
                          onChange={(e) => setStreamForm({ ...streamForm, emergency_mode: e.target.checked })}
                          colorScheme="red"
                        />
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel fontSize="xs" fontWeight="bold">Judul Peringatan Darurat</FormLabel>
                        <Input
                          value={streamForm.emergency_title}
                          onChange={(e) => setStreamForm({ ...streamForm, emergency_title: e.target.value })}
                          placeholder="PERINGATAN DARURAT DESA"
                          borderRadius="xl"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl mb={2}>
                        <FormLabel fontSize="xs" fontWeight="bold">Isi Instruksi Warga</FormLabel>
                        <Textarea
                          value={streamForm.emergency_message}
                          onChange={(e) => setStreamForm({ ...streamForm, emergency_message: e.target.value })}
                          placeholder="Harap seluruh warga memperhatikan..."
                          borderRadius="xl"
                          rows={2}
                          size="sm"
                        />
                      </FormControl>
                    </Box>

                    <Button
                      colorScheme="red"
                      leftIcon={<FaSave />}
                      onClick={handleSaveLiveConfig}
                      isLoading={saving}
                      borderRadius="xl"
                      size="md"
                    >
                      Simpan & Publikasikan Peringatan
                    </Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

// 4. JADWAL & AGENDA MANAGER
const ScheduleManager = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    speaker: '',
    time: '',
    type: 'kajian'
  });

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('display_schedules').select('*').order('time', { ascending: true });
      setSchedules(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat jadwal', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleOpenModal = (sched = null) => {
    if (sched) {
      const date = new Date(sched.time);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);
      
      setFormData({
        id: sched.id,
        title: sched.title,
        speaker: sched.speaker || '',
        time: localISOTime,
        type: sched.type
      });
    } else {
      setFormData({
        id: null,
        title: '',
        speaker: '',
        time: '',
        type: 'kajian'
      });
    }
    onOpen();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        speaker: formData.speaker || null,
        time: new Date(formData.time).toISOString(),
        type: formData.type,
        updated_at: new Date()
      };

      if (formData.id) {
        const { error } = await supabase.from('display_schedules').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Agenda diperbarui', status: 'success', duration: 2500 });
      } else {
        const { error } = await supabase.from('display_schedules').insert([payload]);
        if (error) throw error;
        toast({ title: 'Agenda baru ditambahkan', status: 'success', duration: 2500 });
      }
      onClose();
      fetchSchedules();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menyimpan agenda', status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus agenda ini?')) return;
    try {
      const { error } = await supabase.from('display_schedules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Agenda dihapus', status: 'success', duration: 2500 });
      fetchSchedules();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghapus agenda', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Jadwal & Agenda Masjid</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Tambah Agenda
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>
      ) : (
        <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} shadow="sm">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nama Kegiatan / Topik</Th>
                <Th>Pembicara / Imam</Th>
                <Th>Waktu Pelaksanaan</Th>
                <Th>Kategori</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.map(s => (
                <Tr key={s.id}>
                  <Td fontWeight="bold">{s.title}</Td>
                  <Td>{s.speaker || '-'}</Td>
                  <Td fontWeight="bold" color="brand.500">
                    {new Date(s.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB
                  </Td>
                  <Td><Badge colorScheme={s.type === 'kajian' ? 'purple' : 'green'}>{s.type.toUpperCase()}</Badge></Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FaEdit />} size="sm" onClick={() => handleOpenModal(s)} aria-label="Edit" />
                      <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(s.id)} aria-label="Delete" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {schedules.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8} color="gray.500">
                    Belum ada agenda terjadwal.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* MODAL FORM */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent rounded="2xl" p={2}>
          <form onSubmit={handleSave}>
            <ModalHeader>{formData.id ? 'Edit Agenda Masjid' : 'Tambah Agenda Baru'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama Kegiatan</FormLabel>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Kajian Ahad Pagi, Sholat Jum'at" />
                </FormControl>

                <FormControl>
                  <FormLabel>Pembicara / Penceramah / Imam</FormLabel>
                  <Input value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} placeholder="Contoh: Ustadz Ahmad, S.Pd.I" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Waktu Pelaksanaan</FormLabel>
                  <Input type="datetime-local" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Kategori Agenda</FormLabel>
                  <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="kajian">Kajian / Pengajian</option>
                    <option value="sholat">Sholat Berjamaah / Jum'at</option>
                    <option value="event">Acara / Peringatan PHBI</option>
                    <option value="lainnya">Lainnya</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit">Simpan Agenda</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// MAIN STUDIO DASHBOARD LAYOUT
const DashboardLayout = ({ setSession }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminSession, setAdminSession] = useState(() => {
    try {
      const local = localStorage.getItem('adminSession');
      return local ? JSON.parse(local) : null;
    } catch (e) {
      return null;
    }
  });

  const mainBg = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.850');
  const borderCol = useColorModeValue('gray.200', 'gray.750');

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    if (setSession) setSession(null);
    setAdminSession(null);
    navigate('/admin/login');
  };

  const isTvAdmin = adminSession?.role === 'tv_admin';

  return (
    <Flex minH="100vh" bg={mainBg} pt={{ base: '70px', md: '80px' }}>
      {/* Sidebar */}
      <Box
        w={{ base: '240px', md: '280px' }}
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderCol}
        pos="fixed"
        h="full"
        py={6}
        boxShadow="md"
        zIndex={100}
      >
        <VStack spacing={2} align="stretch">
          {/* User Profile Badge */}
          <Box px={6} mb={4}>
            <HStack spacing={3} mb={2}>
              <Box p={2.5} bg={isTvAdmin ? 'red.500' : 'brand.500'} color="white" borderRadius="xl">
                <Icon as={isTvAdmin ? FaBroadcastTower : FaShieldAlt} w={5} h={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  {isTvAdmin ? 'ADMIN STUDIO TV' : 'SUPER ADMIN'}
                </Text>
                <Heading size="xs" noOfLines={1}>
                  {adminSession?.username || 'Admin'}
                </Heading>
              </VStack>
            </HStack>
          </Box>

          <SidebarItem
            icon={FaBroadcastTower}
            to="/admin/live"
            isActive={location.pathname === '/admin/live' || location.pathname === '/admin/live/'}
          >
            Master Control Live TV
          </SidebarItem>

          <SidebarItem
            icon={FaTv}
            to="/admin/live/overview"
            isActive={location.pathname === '/admin/live/overview'}
          >
            Overview Sistem
          </SidebarItem>

          <SidebarItem
            icon={FaImages}
            to="/admin/live/content"
            isActive={location.pathname === '/admin/live/content'}
          >
            Konten Display Slideshow
          </SidebarItem>

          <SidebarItem
            icon={FaCalendarAlt}
            to="/admin/live/schedule"
            isActive={location.pathname === '/admin/live/schedule'}
          >
            Jadwal & Agenda TV
          </SidebarItem>

          <Box px={4} pt={6} borderTop="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} mt={6}>
            <VStack spacing={2}>
              {!isTvAdmin && (
                <Button
                  w="full"
                  colorScheme="gray"
                  variant="outline"
                  size="sm"
                  borderRadius="xl"
                  onClick={() => navigate('/admin')}
                >
                  Kembali ke Admin Desa
                </Button>
              )}

              <Button
                w="full"
                colorScheme="red"
                variant="ghost"
                size="sm"
                borderRadius="xl"
                leftIcon={<FaSignOutAlt />}
                onClick={handleLogout}
              >
                Keluar (Logout)
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml={{ base: '240px', md: '280px' }} w="full" minH="85vh" bg={mainBg}>
        <Routes>
          <Route path="/" element={<LiveStreamControl />} />
          <Route path="/overview" element={<DashboardHome />} />
          <Route path="/live" element={<LiveStreamControl />} />
          <Route path="/content" element={<ContentManager />} />
          <Route path="/schedule" element={<ScheduleManager />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
