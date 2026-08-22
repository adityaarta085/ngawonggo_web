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
  FaSearch,
  FaBolt,
} from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { socketService } from '../services/socketService';
import { BroadcastPlayer, extractYouTubeId, detectMediaType } from '../../../components/BroadcastPlayer';
import axios from 'axios';

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

// PRESET VIDEO & BROADCAST TEMPLATES
const BROADCAST_TEMPLATES = [
  {
    title: 'Siaran Langsung TVRI Nasional (HLS)',
    url: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
    media_type: 'hls',
    mode: 'live',
    duration: 3600,
    description: 'Siaran langsung TVRI Nasional resolusi tinggi melalui jaringan OTT HLS.',
    running_text: '🔴 TVRI NASIONAL: Menghadirkan berita nasional dan program edukasi untuk seluruh rakyat Indonesia.',
  },
  {
    title: 'Streaming Radio Studio Gemilang 98.6 FM',
    url: 'https://streaming-radio.magelangkab.go.id/studio',
    media_type: 'radio',
    mode: 'live',
    duration: 3600,
    description: 'Siaran radio audio streaming resmi Pemerintah Kabupaten Magelang.',
    running_text: '📻 RADIO GEMILANG: Menemani aktivitas warga Desa Ngawonggo dengan alunan musik dan informasi Magelang.',
  },
  {
    title: 'Profil Desa & Pesona Wisata Ngawonggo',
    url: 'https://www.youtube.com/watch?v=kYV3V5d9Dk8',
    media_type: 'youtube',
    mode: 'simulated',
    duration: 600,
    description: 'Menelusuri keindahan alam dan potensi wisata alam Desa Ngawonggo.',
    running_text: '🌿 PROFIL DESA: Keindahan panorama alam, kearifan lokal, dan kerukunan warga Desa Ngawonggo.',
  },
  {
    title: 'Pesona Alam Kaliangkrik & Gunung Sumbing',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    media_type: 'youtube',
    mode: 'simulated',
    duration: 1800,
    description: 'Pemandangan alam spektakuler lereng Gunung Sumbing Kaliangkrik Magelang.',
    running_text: '⛰️ PESONA SUMBING: Keagungan Gunung Sumbing dan pesona alam lereng Kaliangkrik.',
  },
  {
    title: 'Sejarah Peradaban & Budaya Magelang',
    url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
    media_type: 'youtube',
    mode: 'simulated',
    duration: 900,
    description: 'Kisah sejarah peradaban dan kearifan lokal masyarakat Magelang.',
    running_text: '🏛️ BUDAYA MAGELANG: Warisan sejarah leluhur dan nilai-nilai luhur masyarakat Magelang.',
  },
  {
    title: 'Kajian Islam & Mutiara Hikmah Warga',
    url: 'https://www.youtube.com/watch?v=Em2PWeaSzok',
    media_type: 'youtube',
    mode: 'simulated',
    duration: 1200,
    description: 'Siraman rohani, tadabbur Al-Quran, dan panduan ibadah harian.',
    running_text: '🕌 KAJIAN WARGA: Mari senantiasa mempererat ukhuwah islamiyah dan memakmurkan ibadah di Desa Ngawonggo.',
  },
];

// 1. DASHBOARD HOME (OVERVIEW)
const DashboardHome = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');
  
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [liveStream, setLiveStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const { count: sCount } = await supabase.from('display_schedules').select('id', { count: 'exact', head: true });
      setSchedulesCount(sCount || 0);

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
        <StatCard title="Jadwal Program Siaran" value={schedulesCount} icon={FaCalendarAlt} color="purple" />
        <StatCard title="Tipe Aliran Siaran" value={liveStream?.media_type ? liveStream.media_type.toUpperCase() : 'STANDBY'} icon={FaTv} color="teal" />
      </SimpleGrid>

      <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} shadow="sm">
        <Heading size="md" mb={4}>Status Saluran Televisi Utama</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Saluran TV</Th>
              <Th>Status Siaran</Th>
              <Th>Format Aliran</Th>
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
              <Td>
                <Badge colorScheme="purple">{liveStream?.media_type ? liveStream.media_type.toUpperCase() : 'NONE'}</Badge>
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

// 2. MASTER CONTROL PENYIARAN NGAWONGGO TV (LIVESTREAM STUDIO)
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
  const [detecting, setDetecting] = useState(false);
  const [viewerCount, setViewerCount] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const [streamForm, setStreamForm] = useState({
    title: 'Pesona Wisata, Sejarah & Budaya Ngawonggo',
    description: 'Dokumenter keindahan alam, kearifan lokal, dan kehidupan masyarakat Desa Ngawonggo.',
    url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
    media_type: 'youtube',
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

  // Automatic YouTube / Stream Info & Duration Detection
  const handleAutoDetectInfo = async () => {
    if (!streamForm.url || !streamForm.url.trim()) {
      toast({ title: 'Masukkan URL video terlebih dahulu', status: 'warning', duration: 2500 });
      return;
    }

    try {
      setDetecting(true);
      const cleanUrl = streamForm.url.trim();
      const detected = detectMediaType(cleanUrl);
      const ytId = extractYouTubeId(cleanUrl);

      if (ytId) {
        // Fetch YouTube metadata via oEmbed
        const oembedRes = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
        if (oembedRes.data?.title) {
          setStreamForm((prev) => ({
            ...prev,
            title: oembedRes.data.title || prev.title,
            media_type: 'youtube',
            description: `Tayangan resmi "${oembedRes.data.title}" oleh ${oembedRes.data.author_name || 'Ngawonggo TV'}.`,
          }));
          toast({
            title: 'Info Video Berhasil Dideteksi!',
            description: `Judul: ${oembedRes.data.title}`,
            status: 'success',
            duration: 3000,
          });
        }
      } else if (detected === 'hls') {
        setStreamForm((prev) => ({
          ...prev,
          media_type: 'hls',
          mode: 'live',
          duration: 3600,
        }));
        toast({ title: 'Format HLS (.m3u8) Dideteksi!', status: 'info', duration: 2500 });
      } else if (detected === 'radio') {
        setStreamForm((prev) => ({
          ...prev,
          media_type: 'radio',
          mode: 'live',
          duration: 3600,
        }));
        toast({ title: 'Format Audio Radio Streaming Dideteksi!', status: 'info', duration: 2500 });
      } else {
        toast({ title: 'Format video standar terdeteksi', status: 'info', duration: 2000 });
      }
    } catch (err) {
      console.warn('Auto detect warning:', err);
      toast({ title: 'Deteksi otomatis selesai', status: 'info', duration: 2000 });
    } finally {
      setDetecting(false);
    }
  };

  // Robust handleStartBroadcast without duplicate key errors
  const handleStartBroadcast = async (customConfig = null) => {
    const payload = customConfig || streamForm;
    if (!payload.url || !payload.url.trim()) {
      toast({ title: 'Masukkan URL video / stream', status: 'warning', duration: 2500 });
      return;
    }

    try {
      setSaving(true);
      const cleanUrl = payload.url.trim();
      const detected = detectMediaType(cleanUrl, payload.media_type);

      const broadcastData = {
        title: payload.title || 'Siaran Ngawonggo TV',
        description: payload.description || '',
        url: cleanUrl,
        media_type: detected,
        mode: payload.mode || (detected === 'youtube' ? 'simulated' : 'live'),
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

      // Broadcast update to all viewers and displays
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
      const cleanUrl = streamForm.url.trim();
      const detected = detectMediaType(cleanUrl, streamForm.media_type);

      const configData = {
        title: streamForm.title,
        description: streamForm.description,
        url: cleanUrl,
        media_type: detected,
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
          .insert([{ ...configData, is_active: false }]);
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
                  SYNC AKTIF ({activeLive.media_type ? activeLive.media_type.toUpperCase() : 'STREAM'})
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
                <BroadcastPlayer
                  url={activeLive.url}
                  mediaType={activeLive.media_type}
                  isMuted={true}
                  syncTimestamp={0}
                  loop={activeLive.loop_broadcast}
                  title={activeLive.title}
                  isStudioMonitor={true}
                />
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
                  zIndex={10}
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
                <Text fontSize="xs" color="gray.500">Pilih template atau mulai siaran di sebelah kanan</Text>
              </Flex>
            )}

            {activeLive && (
              <VStack align="stretch" spacing={2} mt={4} p={3.5} bg={sectionBg} borderRadius="2xl" fontSize="xs">
                <HStack justify="space-between">
                  <Text color="gray.500">Judul Program:</Text>
                  <Text fontWeight="bold" noOfLines={1}>{activeLive.title}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.500">Format Aliran:</Text>
                  <Badge colorScheme="purple">
                    {activeLive.media_type ? activeLive.media_type.toUpperCase() : 'YOUTUBE'}
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

          {/* Template Siaran Lengkap (YouTube, TVRI HLS, Radio Gemilang) */}
          <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="md">
            <Heading size="sm" mb={2}>Template Siaran Langsung & Video</Heading>
            <Text fontSize="xs" color="gray.500" mb={4}>Klik template untuk menyiarkan seketika ke seluruh layar:</Text>

            <VStack spacing={3} align="stretch">
              {BROADCAST_TEMPLATES.map((tpl, idx) => (
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
                      title: tpl.title,
                      url: tpl.url,
                      media_type: tpl.media_type,
                      mode: tpl.mode,
                      duration: tpl.duration,
                      description: tpl.description,
                      running_text: tpl.running_text || prev.running_text,
                    }));
                    toast({ title: `Template dipilih: ${tpl.title}`, status: 'info', duration: 1500 });
                  }}
                >
                  <Flex justify="space-between" align="start" mb={1}>
                    <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                      {tpl.title}
                    </Text>
                    <Badge colorScheme={tpl.media_type === 'hls' ? 'blue' : tpl.media_type === 'radio' ? 'purple' : 'red'} fontSize="2xs">
                      {tpl.media_type.toUpperCase()}
                    </Badge>
                  </Flex>
                  <Text fontSize="2xs" color="gray.500" noOfLines={1} mb={2}>
                    {tpl.description}
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
                          title: tpl.title,
                          url: tpl.url,
                          media_type: tpl.media_type,
                          mode: tpl.mode,
                          duration: tpl.duration,
                          description: tpl.description,
                          running_text: tpl.running_text || streamForm.running_text,
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
                          title: tpl.title,
                          url: tpl.url,
                          media_type: tpl.media_type,
                          mode: tpl.mode,
                          duration: tpl.duration,
                          description: tpl.description,
                          running_text: tpl.running_text || prev.running_text,
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
                      <FormLabel fontSize="sm" fontWeight="bold">URL Video / Stream</FormLabel>
                      <HStack>
                        <Input
                          value={streamForm.url}
                          onChange={(e) => setStreamForm({ ...streamForm, url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=... atau .m3u8 atau audio stream"
                          borderRadius="xl"
                        />
                        <Button
                          leftIcon={<FaSearch />}
                          onClick={handleAutoDetectInfo}
                          isLoading={detecting}
                          colorScheme="blue"
                          borderRadius="xl"
                          size="md"
                          flexShrink={0}
                        >
                          Deteksi Info
                        </Button>
                      </HStack>
                      <Text fontSize="2xs" color="gray.500" mt={1}>
                        * Mendukung link YouTube apa pun (normal, short, embed), HLS Live (.m3u8), dan Radio Audio Stream.
                      </Text>
                    </FormControl>

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

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">Format Aliran</FormLabel>
                        <Select
                          value={streamForm.media_type}
                          onChange={(e) => setStreamForm({ ...streamForm, media_type: e.target.value })}
                          borderRadius="xl"
                        >
                          <option value="youtube">YouTube Embed (Video / Live)</option>
                          <option value="hls">HLS Stream (.m3u8 TVRI)</option>
                          <option value="radio">Radio Audio Streaming</option>
                          <option value="video">Direct MP4 / WebM Video</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">Mode Penyiaran</FormLabel>
                        <Select
                          value={streamForm.mode}
                          onChange={(e) => setStreamForm({ ...streamForm, mode: e.target.value })}
                          borderRadius="xl"
                        >
                          <option value="simulated">Simulated Live (Presisi Sinkron)</option>
                          <option value="live">Real Live Stream</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">Durasi (Detik)</FormLabel>
                        <Input
                          type="number"
                          value={streamForm.duration}
                          onChange={(e) => setStreamForm({ ...streamForm, duration: parseInt(e.target.value) || 0 })}
                          borderRadius="xl"
                        />
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
                          Jadwal sholat terhubung langsung dengan API Aladhan (Wilayah Magelang) dengan pembaruan otomatis setiap hari.
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

// 3. JADWAL PENYIARAN OTOMATIS & PLAYLIST TV (BROADCAST SCHEDULER)
const BroadcastScheduler = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    speaker: 'Pemerintah Desa Ngawonggo',
    start_time: '08:00',
    end_time: '09:00',
    type: 'berita',
    url: 'https://www.youtube.com/watch?v=kYV3V5d9Dk8',
    media_type: 'youtube',
    duration: 600,
    is_active: true,
    order_num: 1,
    description: '',
    running_text: '',
  });

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('display_schedules').select('*').order('order_num', { ascending: true });
      setSchedules(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat jadwal siaran', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleOpenModal = (sched = null) => {
    if (sched) {
      setFormData(sched);
    } else {
      setFormData({
        id: null,
        title: '',
        speaker: 'Tim Penyiaran Desa',
        start_time: '08:00',
        end_time: '09:00',
        type: 'berita',
        url: '',
        media_type: 'youtube',
        duration: 900,
        is_active: true,
        order_num: schedules.length + 1,
        description: '',
        running_text: '',
      });
    }
    onOpen();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const cleanUrl = formData.url ? formData.url.trim() : '';
      const detected = detectMediaType(cleanUrl, formData.media_type);

      const payload = {
        title: formData.title,
        speaker: formData.speaker || 'Pemerintah Desa',
        time: new Date(),
        start_time: formData.start_time || '08:00',
        end_time: formData.end_time || '09:00',
        type: formData.type || 'berita',
        url: cleanUrl,
        media_type: detected,
        duration: formData.duration || 900,
        is_active: formData.is_active !== false,
        order_num: formData.order_num || 1,
        description: formData.description || '',
        running_text: formData.running_text || '',
        updated_at: new Date(),
      };

      if (formData.id) {
        const { error } = await supabase.from('display_schedules').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Slot Jadwal Siaran Diperbarui', status: 'success', duration: 2500 });
      } else {
        const { error } = await supabase.from('display_schedules').insert([payload]);
        if (error) throw error;
        toast({ title: 'Slot Jadwal Siaran Ditambahkan', status: 'success', duration: 2500 });
      }
      onClose();
      fetchSchedules();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menyimpan jadwal', status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus slot jadwal siaran ini?')) return;
    try {
      const { error } = await supabase.from('display_schedules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Slot jadwal dihapus', status: 'success', duration: 2500 });
      fetchSchedules();
      socketService.emit('NGAWONGGO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghapus jadwal', status: 'error', duration: 3000 });
    }
  };

  // Instant broadcast this schedule slot
  const handleBroadcastSlotNow = async (slot) => {
    try {
      const cleanUrl = slot.url ? slot.url.trim() : '';
      const detected = detectMediaType(cleanUrl, slot.media_type);

      const broadcastData = {
        title: slot.title,
        description: slot.description || `Program siaran ${slot.title} (${slot.start_time} - ${slot.end_time} WIB)`,
        url: cleanUrl,
        media_type: detected,
        mode: detected === 'youtube' ? 'simulated' : 'live',
        duration: slot.duration || 900,
        loop_broadcast: true,
        running_text: slot.running_text || `🔴 SIARAN JADWAL: ${slot.title} (${slot.start_time} - ${slot.end_time} WIB) - Ngawonggo TV.`,
        show_running_text: true,
        show_prayer_widget: true,
        show_program_info: true,
        show_watermark: true,
        next_program_title: 'Program Berikutnya',
        next_program_time: slot.end_time || 'WIB',
        is_active: true,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: existingRows } = await supabase
        .from('display_livestreams')
        .select('id')
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        await supabase
          .from('display_livestreams')
          .update(broadcastData)
          .eq('id', existingRows[0].id);
      } else {
        await supabase
          .from('display_livestreams')
          .insert([broadcastData]);
      }

      const tvChannel = supabase.channel('ngawonggo_live_tv_main');
      await tvChannel.send({
        type: 'broadcast',
        event: 'start-live',
        payload: broadcastData,
      });

      await socketService.emit('NGAWONGGO-TV', 'start-live', { url: cleanUrl });
      toast({
        title: `⚡ Siaran Diluncurkan: ${slot.title}`,
        description: 'Seluruh pemirsa langsung memutar program jadwal ini sekarang.',
        status: 'success',
        duration: 3500,
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menyiarkan slot', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
        <VStack align="start" spacing={1}>
          <Heading size="lg">Penjadwalan Siaran TV Otomatis</Heading>
          <Text fontSize="sm" color="gray.500">
            Susun jadwal tayang harian Ngawonggo TV (Jam tayang, video YouTube, siaran HLS TVRI, dan Radio).
          </Text>
        </VStack>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()} borderRadius="xl">
          Tambah Slot Jadwal
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>
      ) : (
        <Box bg={boxBg} p={6} rounded="3xl" border="1px solid" borderColor={boxBorder} shadow="sm" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Urutan / Jam</Th>
                <Th>Judul Program</Th>
                <Th>Format</Th>
                <Th>Durasi</Th>
                <Th>Sumber Stream / Video</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Badge colorScheme="teal">#{s.order_num}</Badge>
                      <Text fontWeight="bold" fontSize="xs" color="brand.500">
                        {s.start_time} - {s.end_time} WIB
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontWeight="bold">{s.title}</Text>
                    <Text fontSize="2xs" color="gray.500" noOfLines={1}>{s.speaker || s.description}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={s.media_type === 'hls' ? 'blue' : s.media_type === 'radio' ? 'purple' : 'red'}>
                      {s.media_type ? s.media_type.toUpperCase() : 'YOUTUBE'}
                    </Badge>
                  </Td>
                  <Td fontSize="xs">{Math.floor((s.duration || 900) / 60)} Menit</Td>
                  <Td maxW="200px">
                    <Text fontSize="2xs" noOfLines={1} color="gray.400">{s.url}</Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<FaBolt />}
                        onClick={() => handleBroadcastSlotNow(s)}
                      >
                        Siarkan Sekarang
                      </Button>
                      <IconButton icon={<FaEdit />} size="xs" onClick={() => handleOpenModal(s)} aria-label="Edit" />
                      <IconButton icon={<FaTrash />} size="xs" colorScheme="red" onClick={() => handleDelete(s.id)} aria-label="Delete" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {schedules.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8} color="gray.500">
                    Belum ada slot jadwal siaran. Klik "Tambah Slot Jadwal" di atas.
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
        <ModalContent rounded="3xl" p={2}>
          <form onSubmit={handleSave}>
            <ModalHeader>{formData.id ? 'Edit Slot Jadwal Siaran' : 'Tambah Slot Jadwal Siaran Baru'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">Judul Program Siaran</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Warta Pagi & Profil Desa Ngawonggo"
                    borderRadius="xl"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="bold">Jam Mulai (WIB)</FormLabel>
                    <Input
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      placeholder="08:00"
                      borderRadius="xl"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="bold">Jam Selesai (WIB)</FormLabel>
                    <Input
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      placeholder="10:00"
                      borderRadius="xl"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">URL Video / Sumber Siaran</FormLabel>
                  <Input
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... atau .m3u8"
                    borderRadius="xl"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="bold">Format Aliran</FormLabel>
                    <Select
                      value={formData.media_type}
                      onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                      borderRadius="xl"
                    >
                      <option value="youtube">YouTube Embed</option>
                      <option value="hls">HLS Stream (.m3u8 TVRI)</option>
                      <option value="radio">Radio Audio Stream</option>
                      <option value="video">Direct MP4 Video</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="bold">Durasi Video (Detik)</FormLabel>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 900 })}
                      borderRadius="xl"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="bold">Running Text Khusus Program</FormLabel>
                  <Input
                    value={formData.running_text}
                    onChange={(e) => setFormData({ ...formData, running_text: e.target.value })}
                    placeholder="Ketik warta teks berjalan untuk program ini..."
                    borderRadius="xl"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="bold">Urutan Playlist</FormLabel>
                    <Input
                      type="number"
                      value={formData.order_num}
                      onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 1 })}
                      borderRadius="xl"
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center" pt={8}>
                    <FormLabel mb="0" fontSize="sm" fontWeight="bold">Status Aktif</FormLabel>
                    <Switch
                      isChecked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      colorScheme="brand"
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
              <Button colorScheme="brand" type="submit" borderRadius="xl">Simpan Slot Jadwal</Button>
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
            icon={FaCalendarAlt}
            to="/admin/live/schedule"
            isActive={location.pathname === '/admin/live/schedule'}
          >
            Penjadwalan Siaran TV
          </SidebarItem>

          <SidebarItem
            icon={FaTv}
            to="/admin/live/overview"
            isActive={location.pathname === '/admin/live/overview'}
          >
            Overview Sistem
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
          <Route path="/schedule" element={<BroadcastScheduler />} />
          <Route path="/content" element={<BroadcastScheduler />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
