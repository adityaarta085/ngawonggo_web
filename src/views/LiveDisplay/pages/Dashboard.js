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
} from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { socketService } from '../services/socketService';
import { FaBell, FaPlay, FaStop, FaVideo } from 'react-icons/fa';
import ReactPlayer from 'react-player';

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
        p="4"
        mx="4"
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
      >
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{ color: isActive ? 'white' : hoverColor }}
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};

// 1. DASHBOARD HOME (OVERVIEW)
const DashboardHome = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');
  
  const [counts, setCounts] = useState({ displays: 0, contents: 0, schedules: 0 });
  const [displays, setDisplays] = useState([]);
  const [liveStream, setLiveStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch counts
      const { count: dCount } = await supabase.from('displays').select('id', { count: 'exact', head: true });
      const { count: cCount } = await supabase.from('display_contents').select('id', { count: 'exact', head: true });
      const { count: sCount } = await supabase.from('display_schedules').select('id', { count: 'exact', head: true });
      
      setCounts({
        displays: dCount || 0,
        contents: cCount || 0,
        schedules: sCount || 0
      });

      // Fetch displays list
      const { data: dData } = await supabase.from('displays').select('*');
      setDisplays(dData || []);

      // Fetch live streaming active status
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

  const handleControlTV = async (code, action, extraPayload = {}) => {
    try {
      await socketService.emit(code, action, extraPayload);
      toast({ title: `Sinyal ${action} dikirim ke ${code}`, status: 'success', duration: 2500 });
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
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Overview</Heading>
        <Button leftIcon={<FaSyncAlt />} onClick={fetchOverview} size="sm" color="gray">
          Refresh Data
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard title="Total TV Terdaftar" value={counts.displays} icon={FaTv} color="blue" />
        <StatCard title="Konten Slideshow" value={counts.contents} icon={FaImages} color="green" />
        <StatCard title="Agenda Terjadwal" value={counts.schedules} icon={FaCalendarAlt} color="purple" />
        <StatCard
          title="Status Live"
          value={liveStream ? 'LIVE' : 'OFFLINE'}
          icon={FaBroadcastTower}
          color={liveStream ? 'green' : 'red'}
        />
      </SimpleGrid>

      <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder}>
        <Heading size="md" mb={4}>TV Display yang Terhubung</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nama TV</Th>
              <Th>Kode TV</Th>
              <Th>Status Realtime</Th>
              <Th>Aksi Cepat</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displays.map(tv => (
              <Tr key={tv.id}>
                <Td fontWeight="bold">{tv.name}</Td>
                <Td><Badge colorScheme="blue">{tv.code}</Badge></Td>
                <Td>
                  <Badge colorScheme={tv.status === 'online' ? 'green' : 'red'}>
                    {tv.status.toUpperCase()}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => window.open(`/live/display/${tv.code}`, '_blank')} rightIcon={<FaExternalLinkAlt />}>
                      Buka TV
                    </Button>
                    <Button size="xs" colorScheme="gray" onClick={() => handleControlTV(tv.code, 'reload')}>
                      Refresh TV
                    </Button>
                    <Button size="xs" colorScheme="teal" onClick={() => handleControlTV(tv.code, 'set-mode', { mode: 'normal' })}>
                      Set Normal
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

// 2. KONTEN DISPLAY MANAGER
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
    priority: 0,
    is_active: true
  });

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('display_contents').select('*').order('priority', { ascending: false });
      setContents(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengambil konten', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleOpenModal = (content = null) => {
    if (content) {
      setFormData({
        id: content.id,
        title: content.title,
        type: content.type,
        media_url: content.media_url || '',
        priority: content.priority || 0,
        is_active: content.is_active
      });
    } else {
      setFormData({
        id: null,
        title: '',
        type: 'image',
        media_url: '',
        priority: 0,
        is_active: true
      });
    }
    onOpen();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        media_url: formData.media_url,
        priority: parseInt(formData.priority),
        is_active: formData.is_active,
        updated_at: new Date()
      };

      if (formData.id) {
        // Update
        const { error } = await supabase.from('display_contents').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Konten diperbarui', status: 'success', duration: 2500 });
      } else {
        // Insert
        const { error } = await supabase.from('display_contents').insert([payload]);
        if (error) throw error;
        toast({ title: 'Konten berhasil ditambahkan', status: 'success', duration: 2500 });
      }
      onClose();
      fetchContents();
      
      // Broadcast change to displays
      socketService.emit('DEMO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menyimpan konten', status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) return;
    try {
      const { error } = await supabase.from('display_contents').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Konten berhasil dihapus', status: 'success', duration: 2500 });
      fetchContents();
      
      // Broadcast change to displays
      socketService.emit('DEMO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghapus konten', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manajemen Konten Display</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Tambah Konten
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>
      ) : (
        <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Judul Pengumuman</Th>
                <Th>Tipe</Th>
                <Th>Media URL Preview</Th>
                <Th>Prioritas</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contents.map(c => (
                <Tr key={c.id}>
                  <Td fontWeight="bold">{c.title}</Td>
                  <Td><Badge>{c.type.toUpperCase()}</Badge></Td>
                  <Td maxW="200px" isTruncated>
                    {c.media_url ? (
                      <Link to={c.media_url} target="_blank" style={{ color: '#ef4444', textDecoration: 'underline' }}>
                        {c.media_url}
                      </Link>
                    ) : '-'}
                  </Td>
                  <Td>{c.priority}</Td>
                  <Td>
                    <Badge colorScheme={c.is_active ? 'green' : 'gray'}>
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
                    Belum ada konten slideshow. Silakan tambah konten baru.
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
            <ModalHeader>{formData.id ? 'Edit Konten Display' : 'Tambah Konten Baru'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Judul Konten</FormLabel>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Masukkan judul pengumuman" />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Tipe Konten</FormLabel>
                  <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="image">Gambar / Poster URL</option>
                    <option value="text">Hanya Teks Pengumuman</option>
                  </Select>
                </FormControl>

                {formData.type === 'image' && (
                  <FormControl isRequired>
                    <FormLabel>Media / Poster URL (Gambar)</FormLabel>
                    <Input value={formData.media_url} onChange={e => setFormData({ ...formData, media_url: e.target.value })} placeholder="https://example.com/poster.jpg" />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Prioritas Tampil (Lebih tinggi didahulukan)</FormLabel>
                  <Input type="number" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} />
                </FormControl>

                <FormControl display="flex" align="center" pt={2}>
                  <FormLabel mb="0">Konten Aktif?</FormLabel>
                  <Switch isChecked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} colorScheme="brand" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose} variant="ghost">Batal</Button>
              <Button type="submit" colorScheme="brand" leftIcon={<FaSave />}>Simpan Konten</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// 3. LIVE STREAM CONTROL
const LiveStreamControl = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');
  const iconBoxBg = useColorModeValue('green.50', 'whiteAlpha.100');
  const iconColor = useColorModeValue('green.500', 'green.300');
  const offlineIconBoxBg = useColorModeValue('red.50', 'whiteAlpha.100');
  const offlineIconColor = useColorModeValue('red.500', 'red.300');

  // Declare all ColorModeValue variables at the top of the component to comply with Hook rules
  const monitorBorderColor = useColorModeValue('gray.200', 'gray.700');
  const presetBg = useColorModeValue('gray.50', 'gray.800');
  const presetBorder = useColorModeValue('gray.200', 'gray.700');
  const presetTextCol = useColorModeValue('gray.800', 'white');
  const statusBoxBg = useColorModeValue('gray.50', 'gray.800');

  const [activeLive, setActiveLive] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [broadcastMode, setBroadcastMode] = useState('simulated'); // simulated or live
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const PRESET_VIDEOS = [
    {
      title: 'Profil Desa & Wisata Ngawonggo',
      url: 'https://www.youtube.com/watch?v=kYV3V5d9Dk8',
      mode: 'simulated'
    },
    {
      title: 'Sejarah dan Kebudayaan Magelang',
      url: 'https://www.youtube.com/watch?v=0kG7-KkOqU8',
      mode: 'simulated'
    },
    {
      title: 'Kajian Subuh Live Stream (Simulator)',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      mode: 'simulated'
    },
    {
      title: 'Siaran HLS Live Stream (TVRI)',
      url: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
      mode: 'live'
    }
  ];

  const fetchLiveStatus = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('display_livestreams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      setActiveLive(data);
      if (data) {
        setYoutubeUrl(data.url);
        setBroadcastMode(data.mode || 'simulated');
      } else {
        setYoutubeUrl('');
        setBroadcastMode('simulated');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveStatus();
  }, [fetchLiveStatus]);

  const handleStartLive = async (customUrl = null, customMode = null) => {
    const targetUrl = customUrl || youtubeUrl;
    const targetMode = customMode || broadcastMode;

    if (!targetUrl.trim()) {
      toast({ title: 'Harap masukkan URL Video/Siaran', status: 'warning', duration: 2500 });
      return;
    }
    try {
      setLoading(true);
      
      // 1. Nonaktifkan semua livestream sebelumnya
      await supabase.from('display_livestreams').update({ is_active: false }).eq('is_active', true);
      
      // 2. Tambah data siaran baru
      const { error } = await supabase.from('display_livestreams').insert([
        { url: targetUrl, mode: targetMode, is_active: true }
      ]);
      
      if (error) throw error;
      
      // 3. Update status displays state
      const { data: display } = await supabase.from('displays').select('id').eq('code', 'DEMO-TV').maybeSingle();
      if (display) {
        await supabase.from('display_states').update({ mode: 'live', updated_at: new Date() }).eq('display_id', display.id);
      }

      // 4. Kirim broadcast realtime ke TV
      await socketService.emit('DEMO-TV', 'start-live', { url: targetUrl });
      await socketService.emit('DEMO-TV', 'set-mode', { mode: 'live', url: targetUrl });

      toast({ title: 'Siaran langsung dimulai!', status: 'success', duration: 3000 });
      fetchLiveStatus();
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memulai siaran', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleStopLive = async () => {
    try {
      setLoading(true);
      
      // 1. Matikan semua status livestream aktif di db
      await supabase.from('display_livestreams').update({ is_active: false }).eq('is_active', true);
      
      // 2. Reset mode di display states ke normal
      const { data: display } = await supabase.from('displays').select('id').eq('code', 'DEMO-TV').maybeSingle();
      if (display) {
        await supabase.from('display_states').update({ mode: 'normal', updated_at: new Date() }).eq('display_id', display.id);
      }

      // 3. Kirim broadcast realtime untuk menyetop live
      await socketService.emit('DEMO-TV', 'stop-live');
      await socketService.emit('DEMO-TV', 'set-mode', { mode: 'normal' });

      toast({ title: 'Siaran langsung dihentikan.', status: 'success', duration: 3000 });
      fetchLiveStatus();
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghentikan siaran', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    try {
      await socketService.emit('DEMO-TV', 'sync-player');
      toast({ title: 'Sinyal sinkronisasi dikirim ke semua TV!', status: 'success', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengirim instruksi sinkronisasi', status: 'error', duration: 2000 });
    }
  };

  const handlePlayChime = async () => {
    try {
      await socketService.emit('DEMO-TV', 'play-chime');
      toast({ title: 'Nada lonceng dipicu di semua TV!', status: 'success', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memicu nada lonceng', status: 'error', duration: 2000 });
    }
  };

  const handleForceReload = async () => {
    if (!window.confirm('Muat ulang seluruh layar TV sekarang?')) return;
    try {
      await socketService.emit('DEMO-TV', 'reload');
      toast({ title: 'Sinyal muat ulang dikirim!', status: 'success', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal mengirim perintah reload', status: 'error', duration: 2000 });
    }
  };

  if (loading) {
    return <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>;
  }

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Master Control Penyiaran Ngawonggo TV</Heading>

      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8}>
        {/* KOLOM KIRI: Live Preview & Presets (7 columns) */}
        <VStack spacing={8} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 7' }}>
          {/* Live Preview Monitor */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} align="stretch" spacing={4}>
            <Heading size="sm">Monitor Siaran Studio</Heading>
            {activeLive ? (
              <Box
                position="relative"
                pb="56.25%"
                bg="black"
                borderRadius="2xl"
                overflow="hidden"
                border="4px solid"
                borderColor="brand.500"
                boxShadow="xl"
              >
                <ReactPlayer
                  url={activeLive.url}
                  width="100%"
                  height="100%"
                  playing={true}
                  muted={true}
                  controls={true}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
                <Badge position="absolute" top={4} left={4} colorScheme="red" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                  ● LIVE MONITOR (MUTED)
                </Badge>
              </Box>
            ) : (
              <Flex
                h="250px"
                bg="gray.900"
                borderRadius="2xl"
                direction="column"
                justify="center"
                align="center"
                color="whiteAlpha.600"
                border="2px dashed"
                borderColor={monitorBorderColor}
              >
                <Icon as={FaTv} w={12} h={12} mb={3} animation="pulse 2s infinite" />
                <Text fontWeight="bold">SIARAN STANDBY / OFFLINE</Text>
                <Text fontSize="xs">Pilih video di bawah atau masukkan URL untuk mulai bersiaran</Text>
              </Flex>
            )}
          </VStack>

          {/* Preset Video Library */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} align="stretch" spacing={4}>
            <Heading size="sm">Preset Pustaka Video Siaran Cepat</Heading>
            <Text fontSize="xs" color="gray.500">Mulai siaran langsung secara instan dengan memilih video preset di bawah ini:</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {PRESET_VIDEOS.map((video, idx) => (
                <VStack
                  key={idx}
                  p={4}
                  bg={presetBg}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={presetBorder}
                  align="start"
                  spacing={3}
                  _hover={{ shadow: 'md', borderColor: 'brand.500', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => {
                    setYoutubeUrl(video.url);
                    setBroadcastMode(video.mode);
                    toast({ title: `Preset dipilih: ${video.title}`, status: 'info', duration: 2000 });
                  }}
                >
                  <HStack spacing={2} w="full" justify="space-between">
                    <Icon as={FaVideo} color="brand.400" />
                    <Badge colorScheme={video.mode === 'simulated' ? 'purple' : 'green'} fontSize="xx-small">
                      {video.mode === 'simulated' ? 'SIMULATED LIVE' : 'REAL LIVE'}
                    </Badge>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm" color={presetTextCol} noOfLines={2}>
                    {video.title}
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="brand"
                    w="full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartLive(video.url, video.mode);
                    }}
                  >
                    Mulai Siarkan
                  </Button>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>

        {/* KOLOM KANAN: Broadcast Controller & Interactive Actions (5 columns) */}
        <VStack spacing={8} align="stretch" gridColumn={{ base: 'span 1', lg: 'span 5' }}>
          {/* Siaran Configuration Card */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} spacing={5} align="stretch">
            <Heading size="sm">Konfigurasi Siaran Aktif</Heading>
            
            <FormControl isRequired>
              <FormLabel fontSize="xs" fontWeight="bold">Video / Stream URL</FormLabel>
              <Input
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL atau file .mp4/.m3u8..."
                disabled={!!activeLive}
                size="md"
                borderRadius="xl"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="xs" fontWeight="bold">Mode Penyiaran</FormLabel>
              <Select
                value={broadcastMode}
                onChange={e => setBroadcastMode(e.target.value)}
                disabled={!!activeLive}
                borderRadius="xl"
              >
                <option value="simulated">Simulated Live (Pemutaran Sinkron)</option>
                <option value="live">Real Live Stream (HLS/YouTube Live)</option>
              </Select>
              <Text fontSize="xx-small" color="gray.500" mt={1}>
                * Simulated Live: Menjamin semua TV memutar detik video yang sama secara presisi.
              </Text>
            </FormControl>

            {activeLive ? (
              <Button colorScheme="red" leftIcon={<FaStop />} onClick={handleStopLive} h={12} borderRadius="xl" fontSize="md">
                Hentikan Siaran TV
              </Button>
            ) : (
              <Button colorScheme="green" leftIcon={<FaPlay />} onClick={() => handleStartLive()} h={12} borderRadius="xl" fontSize="md">
                Mulai Siarkan Sekarang
              </Button>
            )}
          </VStack>

          {/* Interactive Live Actions Console */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} spacing={4} align="stretch">
            <Heading size="sm">Konsol Aksi Real-Time TV</Heading>
            <Text fontSize="xs" color="gray.500">Kirim instruksi instan ke seluruh layar TV yang sedang aktif:</Text>
            
            <VStack spacing={3} align="stretch">
              <Button
                leftIcon={<FaSyncAlt />}
                onClick={handleForceSync}
                colorScheme="blue"
                variant="outline"
                isDisabled={!activeLive || broadcastMode !== 'simulated'}
                size="md"
                borderRadius="xl"
                justifyContent="start"
              >
                Paksa Sinkronisasi Video
              </Button>
              
              <Button
                leftIcon={<FaBell />}
                onClick={handlePlayChime}
                colorScheme="teal"
                variant="outline"
                size="md"
                borderRadius="xl"
                justifyContent="start"
              >
                Kirim Nada Lonceng (Chime)
              </Button>

              <Button
                leftIcon={<FaSyncAlt />}
                onClick={handleForceReload}
                colorScheme="orange"
                variant="outline"
                size="md"
                borderRadius="xl"
                justifyContent="start"
              >
                Paksa Reload Layar TV
              </Button>
            </VStack>
          </VStack>

          {/* Status Box */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} justify="center" align="center" textAlign="center" spacing={4}>
            <Box p={4} rounded="full" bg={activeLive ? iconBoxBg : offlineIconBoxBg} color={activeLive ? iconColor : offlineIconColor}>
              <Icon as={FaBroadcastTower} w={12} h={12} animation={activeLive ? "pulse 2s infinite" : "none"} />
            </Box>
            <VStack spacing={1}>
              <Heading size="xs">Status Penyiaran</Heading>
              <Badge fontSize="sm" px={4} py={1} borderRadius="full" colorScheme={activeLive ? 'green' : 'red'}>
                {activeLive ? 'ON AIR' : 'OFF AIR'}
              </Badge>
            </VStack>
            {activeLive && (
              <Box w="full" bg={statusBoxBg} p={2} borderRadius="md" border="1px solid" borderColor={boxBorder}>
                <Text fontSize="xx-small" color="gray.500" textAlign="left" noOfLines={1}>
                  Tipe: {activeLive.mode.toUpperCase()}
                </Text>
                <Text fontSize="xx-small" color="gray.500" textAlign="left" noOfLines={1} mt={1}>
                  Mulai: {new Date(activeLive.created_at).toLocaleTimeString('id-ID')}
                </Text>
              </Box>
            )}
          </VStack>
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
      // Format time to YYYY-MM-DDThh:mm for datetime-local input
      const date = new Date(sched.time);
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
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
        // Update
        const { error } = await supabase.from('display_schedules').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Agenda diperbarui', status: 'success', duration: 2500 });
      } else {
        // Insert
        const { error } = await supabase.from('display_schedules').insert([payload]);
        if (error) throw error;
        toast({ title: 'Agenda baru ditambahkan', status: 'success', duration: 2500 });
      }
      onClose();
      fetchSchedules();

      // Broadcast update to displays
      socketService.emit('DEMO-TV', 'content-updated');
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

      // Broadcast update to displays
      socketService.emit('DEMO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal menghapus agenda', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Jadwal & Agenda Masjid</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Tambah Agenda
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>
      ) : (
        <Box bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder}>
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
                  <FormLabel>Pembicara / Ustadz / Imam</FormLabel>
                  <Input value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} placeholder="Masukkan nama ustadz/penceramah" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Waktu Pelaksanaan</FormLabel>
                  <Input type="datetime-local" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Kategori Agenda</FormLabel>
                  <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="kajian">Kajian Rutin/Tabligh</option>
                    <option value="jumat">Petugas Sholat Jum'at</option>
                    <option value="kegiatan">Kegiatan Sosial/PHBI</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose} variant="ghost">Batal</Button>
              <Button type="submit" colorScheme="brand" leftIcon={<FaSave />}>Simpan Agenda</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// 5. MANAGE TV / DISPLAYS & PRAYER SETTINGS
const DisplaysManager = () => {
  const boxBg = useColorModeValue('white', 'gray.850');
  const boxBorder = useColorModeValue('gray.100', 'gray.700');

  const [displays, setDisplays] = useState([]);
  const [prayerSettings, setPrayerSettings] = useState([]);
  const [emergencyText, setEmergencyText] = useState('');
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadDisplaysConfig = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load displays
      const { data: dData } = await supabase.from('displays').select('*');
      setDisplays(dData || []);

      // Load prayer settings
      const { data: pData } = await supabase.from('display_prayer_settings').select('*');
      setPrayerSettings(pData || []);

      // Check current emergency states
      const demoTV = dData?.find(t => t.code === 'DEMO-TV');
      if (demoTV) {
        const { data: state } = await supabase
          .from('display_states')
          .select('*')
          .eq('display_id', demoTV.id)
          .maybeSingle();
        if (state && state.mode === 'emergency') {
          setActiveEmergency(true);
          setEmergencyText(state.message || '');
        } else {
          setActiveEmergency(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memuat konfigurasi TV', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDisplaysConfig();
  }, [loadDisplaysConfig]);

  const handleUpdateIqomah = async (id, val) => {
    try {
      const delay = parseInt(val);
      if (isNaN(delay) || delay < 0) return;
      
      const { error } = await supabase
        .from('display_prayer_settings')
        .update({ iqomah_delay: delay, updated_at: new Date() })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Waktu iqomah diperbarui', status: 'success', duration: 2000 });
      loadDisplaysConfig();

      // Notify display
      socketService.emit('DEMO-TV', 'content-updated');
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memperbarui iqomah', status: 'error', duration: 2000 });
    }
  };

  const handleTriggerEmergency = async () => {
    if (!emergencyText.trim()) {
      toast({ title: 'Masukkan pesan darurat terlebih dahulu', status: 'warning', duration: 2500 });
      return;
    }
    try {
      setLoading(true);
      const demoTV = displays.find(t => t.code === 'DEMO-TV');
      if (demoTV) {
        await supabase
          .from('display_states')
          .update({ mode: 'emergency', message: emergencyText, updated_at: new Date() })
          .eq('display_id', demoTV.id);
        
        await socketService.emit('DEMO-TV', 'set-mode', { mode: 'emergency', message: emergencyText });
        
        setActiveEmergency(true);
        toast({ title: 'Pesan darurat diaktifkan di TV!', colorScheme: 'red', duration: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal memicu darurat', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleClearEmergency = async () => {
    try {
      setLoading(true);
      const demoTV = displays.find(t => t.code === 'DEMO-TV');
      if (demoTV) {
        await supabase
          .from('display_states')
          .update({ mode: 'normal', message: '', updated_at: new Date() })
          .eq('display_id', demoTV.id);
        
        await socketService.emit('DEMO-TV', 'set-mode', { mode: 'normal' });
        
        setActiveEmergency(false);
        setEmergencyText('');
        toast({ title: 'TV kembali ke mode normal.', status: 'success', duration: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal membatalkan darurat', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleTestTrigger = async (mode, prayer = 'Dzuhur') => {
    try {
      await socketService.emit('DEMO-TV', `start-${mode}`, { prayer });
      await socketService.emit('DEMO-TV', 'set-mode', { mode, prayer });
      toast({ title: `Uji Coba ${mode.toUpperCase()} dikirim!`, status: 'success', duration: 2500 });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Flex justify="center" p={12}><Spinner size="xl" color="brand.500" /></Flex>;
  }

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Manajemen TV & Pengaturan Sholat</Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* KIRI: Iqomah Delay settings */}
        <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} spacing={4} align="stretch">
          <Heading size="md">Jeda Iqomah (Menit)</Heading>
          <Text fontSize="sm" color="gray.500">
            Atur waktu tunggu adzan ke iqomah secara spesifik untuk masing-masing waktu sholat.
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Nama Sholat</Th>
                <Th>Jeda Iqomah (Menit)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {prayerSettings.map(item => (
                <Tr key={item.id}>
                  <Td fontWeight="bold" textTransform="uppercase">{item.prayer}</Td>
                  <Td>
                    <Input
                      type="number"
                      maxW="100px"
                      defaultValue={item.iqomah_delay}
                      onBlur={e => handleUpdateIqomah(item.id, e.target.value)}
                      placeholder="Menit"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        {/* KANAN: Emergency & Test triggers */}
        <VStack spacing={8} align="stretch">
          {/* Emergency card */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} spacing={4} align="stretch">
            <Heading size="md" display="flex" alignItems="center" color="red.500">
              <Icon as={FaExclamationTriangle} mr={2} /> Pengumuman Darurat (Emergency)
            </Heading>
            <Textarea
              placeholder="Contoh: Terjadi korsleting listrik, mohon jamaah keluar dengan tenang..."
              value={emergencyText}
              onChange={e => setEmergencyText(e.target.value)}
              disabled={activeEmergency}
            />
            {activeEmergency ? (
              <Button colorScheme="green" onClick={handleClearEmergency}>
                Batalkan Mode Darurat
              </Button>
            ) : (
              <Button colorScheme="red" onClick={handleTriggerEmergency}>
                Aktifkan Mode Darurat di TV
              </Button>
            )}
          </VStack>

          {/* Test trigger card */}
          <VStack bg={boxBg} p={6} rounded="2xl" border="1px solid" borderColor={boxBorder} spacing={4} align="stretch">
            <Heading size="md">Uji Coba Fungsi TV</Heading>
            <Text fontSize="sm" color="gray.500">
              Uji transisi layar TV ke mode-mode spesifik secara manual tanpa menunggu waktu sholat.
            </Text>
            <SimpleGrid columns={2} spacing={4}>
              <Button colorScheme="teal" onClick={() => handleTestTrigger('adhan', 'Maghrib')}>
                Uji Layar Adzan
              </Button>
              <Button colorScheme="indigo" onClick={() => handleTestTrigger('iqomah', 'Maghrib')}>
                Uji Layar Iqomah
              </Button>
            </SimpleGrid>
          </VStack>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

// MAIN LAYOUT
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainBg = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.850');
  const borderCol = useColorModeValue('gray.200', 'gray.750');

  return (
    <Flex minH="100vh" bg={mainBg} pt="100px">
      {/* Sidebar */}
      <Box
        w="280px"
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
          <Box px={6} mb={4}>
            <Heading size="sm" color="brand.500" textTransform="uppercase" letterSpacing="wider">
              Kontrol Display Live
            </Heading>
          </Box>
          <SidebarItem icon={FaTv} to="/admin/live" isActive={location.pathname === '/admin/live'}>
            Overview
          </SidebarItem>
          <SidebarItem icon={FaImages} to="/admin/live/content" isActive={location.pathname === '/admin/live/content'}>
            Konten Display
          </SidebarItem>
          <SidebarItem icon={FaBroadcastTower} to="/admin/live/live" isActive={location.pathname === '/admin/live/live'}>
            Live Stream
          </SidebarItem>
          <SidebarItem icon={FaCalendarAlt} to="/admin/live/schedule" isActive={location.pathname === '/admin/live/schedule'}>
            Jadwal & Agenda
          </SidebarItem>
          <SidebarItem icon={FaTv} to="/admin/live/displays" isActive={location.pathname === '/admin/live/displays'}>
            Manage TV
          </SidebarItem>

          <Box px={4} pt={6} borderTop="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} mt={6}>
            <Button w="full" colorScheme="gray" variant="outline" onClick={() => navigate('/admin')}>
              Kembali ke Admin Desa
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml="280px" w="full" minH="85vh" bg={mainBg}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/content" element={<ContentManager />} />
          <Route path="/live" element={<LiveStreamControl />} />
          <Route path="/schedule" element={<ScheduleManager />} />
          <Route path="/displays" element={<DisplaysManager />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
