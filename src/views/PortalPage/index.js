import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Icon,
  HStack,
  Badge,
  Button,
  Avatar,

  useColorModeValue,
  Skeleton,
  Flex,
  useToast,

  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import {
    FaHistory,
    FaBookOpen,
    FaGamepad,
    FaUserCircle,
    FaSignOutAlt,
    FaArrowRight,
    FaCalendarAlt,
    FaClipboardList,
    FaWhatsapp,
    FaCheckCircle,
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const StatCard = ({ title, value, subValue, icon, color, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  return (
    <Box
      p={6}
      borderRadius="2xl"
      bg={cardBg}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'md', borderColor: color }}
      transition="all 0.3s"
      cursor="pointer"
      onClick={onClick}
    >
      <HStack spacing={4} align="start">
        <Box p={3} borderRadius="xl" bg={`${color}.50`} color={`${color}.500`}>
          <Icon as={icon} boxSize={6} />
        </Box>
        <VStack align="start" spacing={0} flex={1}>
          <Text fontSize="sm" color="gray.500" fontWeight="600">{title}</Text>
          <Heading size="md" color="gray.800">{value}</Heading>
          {subValue && (
            <Text fontSize="xs" color="gray.400" mt={1}>{subValue}</Text>
          )}
        </VStack>
        <Icon as={FaArrowRight} color="gray.300" boxSize={3} mt={1} />
      </HStack>
    </Box>
  );
};

const PortalPage = () => {
  const [waNumber, setWaNumber] = useState('');
  const [waLoading, setWaLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    complaints: 0,
    gamesPlayed: 0,
    quranProgress: 'Belum ada',
  });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('/auth');
        return;
      }
      setUser(authUser);

      // Fetch stats
      try {
        const [complaintsData, gamesData, quranData] = await Promise.all([
          supabase.from('complaints').select('id', { count: 'exact' }).eq('user_id', authUser.id),
          supabase.from('user_game_scores').select('id', { count: 'exact' }).eq('user_id', authUser.id),
          supabase.from('user_quran_progress').select('*').eq('user_id', authUser.id).single()
        ]);

        setStats({
          complaints: complaintsData.count || 0,
          gamesPlayed: gamesData.count || 0,
          quranProgress: quranData.data ? `Surah ${quranData.data.surah_number}: Ayat ${quranData.data.ayah_number}` : 'Mulai baca'
        });

        // Check for WA verification token in URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('verify_wa');
        if (token && authUser) {
            const savedToken = localStorage.getItem('wa_verification_token');
            const savedNumber = localStorage.getItem('wa_verification_number');
            if (token === savedToken && savedNumber) {
                // Verify WA
                const { error } = await supabase.auth.updateUser({
                    data: {
                        whatsapp_verified: true,
                        whatsapp_number: savedNumber
                    }
                });
                if (!error) {
                    toast({ title: 'WhatsApp berhasil diverifikasi!', status: 'success', duration: 5000 });
                    localStorage.removeItem('wa_verification_token');
                    localStorage.removeItem('wa_verification_number');
                    // Refresh user data
                    const { data: { user: updatedUser } } = await supabase.auth.getUser();
                    setUser(updatedUser);
                    // Remove query param
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    toast({ title: 'Gagal verifikasi WhatsApp', description: error.message, status: 'error', duration: 5000 });
                }
            } else {
                toast({ title: 'Link verifikasi tidak valid atau kadaluarsa', status: 'error', duration: 5000 });
            }
        }
      } catch (err) {
        console.error('Error fetching portal stats:', err);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate, toast]);

  const handleSendWaLink = async () => {
    if (!waNumber) {
        toast({ title: 'Masukkan nomor WhatsApp', status: 'warning', duration: 3000 });
        return;
    }

    // Check 3 hours limit
    const lastSent = localStorage.getItem('wa_last_sent');
    if (lastSent) {
        const timeDiff = new Date().getTime() - parseInt(lastSent);
        const hoursDiff = timeDiff / (1000 * 3600);
        if (hoursDiff < 3) {
            toast({ title: 'Tunggu 3 Jam', description: 'Anda baru saja meminta link verifikasi. Silakan tunggu 3 jam untuk meminta lagi.', status: 'warning', duration: 5000 });
            return;
        }
    }

    setWaLoading(true);
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('wa_verification_token', token);
    localStorage.setItem('wa_verification_number', waNumber);
    localStorage.setItem('wa_last_sent', new Date().getTime().toString());

    const verifyLink = `${window.location.origin}/portal?verify_wa=${token}`;

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: waNumber,
          message: `Halo! Klik link berikut untuk memverifikasi nomor WhatsApp Anda di Portal Desa Ngawonggo:\n\n${verifyLink}\n\nAbaikan pesan ini jika Anda tidak memintanya.`
        })
      });
      if (!response.ok) throw new Error('Gagal mengirim pesan');

      toast({
        title: 'Link Terkirim!',
        description: 'Silakan cek WhatsApp Anda dan klik link yang diberikan.',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
      // Reset limit so they can try again if it fails
      localStorage.removeItem('wa_last_sent');
    } finally {
      setWaLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Berhasil Keluar',
      status: 'info',
      duration: 3000,
    });
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={20}>
        <VStack spacing={8} align="stretch">
          <Skeleton h="100px" borderRadius="2xl" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Skeleton h="150px" borderRadius="2xl" />
            <Skeleton h="150px" borderRadius="2xl" />
            <Skeleton h="150px" borderRadius="2xl" />
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" pt={{ base: '80px', md: '100px' }} pb={20}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            bg="white"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={6}>
              <HStack spacing={4}>
                <Avatar
                  size="xl"
                  name={user?.email}
                  src={user?.user_metadata?.avatar_url}
                  bg="brand.500"
                  color="white"
                  boxShadow="lg"
                />
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Heading size="md" color="gray.800">Halo, Warga Digital!</Heading>
                    <Badge colorScheme="brand" variant="subtle" borderRadius="full">Aktif</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{user?.email}</Text>
                  <HStack spacing={3} mt={2}>
                    <Tooltip label="ID Pengguna">
                       <HStack fontSize="xs" color="gray.400">
                          <Icon as={FaUserCircle} />
                          <Text>{user?.id.substring(0, 8)}...</Text>
                       </HStack>
                    </Tooltip>
                    <HStack fontSize="xs" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                      <Text>Bergabung {new Date(user?.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
              <HStack spacing={3} w={{ base: 'full', md: 'auto' }}>
                <Button
                    variant="outline"
                    colorScheme="red"
                    leftIcon={<FaSignOutAlt />}
                    onClick={handleLogout}
                    size="sm"
                    borderRadius="full"
                >
                  Keluar
                </Button>
              </HStack>
            </Flex>
          </Box>

          {/* Activity Overview */}
          <VStack align="start" spacing={4}>
            <HStack>
                <Icon as={FaHistory} color="brand.500" />
                <Heading size="sm" color="gray.700">Ringkasan Aktivitas</Heading>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              <StatCard
                title="Status Pengaduan"
                value={stats.complaints}
                subValue="Laporan dikirim"
                icon={FaClipboardList}
                color="blue"
                onClick={() => navigate('/layanan')}
              />
              <StatCard
                title="Progress Quran"
                value={stats.quranProgress}
                subValue="Terakhir dibaca"
                icon={FaBookOpen}
                color="emerald"
                onClick={() => navigate('/quran')}
              />
              <StatCard
                title="Skor EduGame"
                value={stats.gamesPlayed}
                subValue="Sesi dimainkan"
                icon={FaGamepad}
                color="orange"
                onClick={() => navigate('/game-edukasi')}
              />
            </SimpleGrid>
          </VStack>

          {/* WhatsApp Verification Card */}
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            bg="white"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack align="start" spacing={4}>
                <HStack>
                    <Icon as={FaWhatsapp} color="#25D366" boxSize={6} />
                    <Heading size="md" color="gray.800">Verifikasi WhatsApp</Heading>
                </HStack>

                {user?.user_metadata?.whatsapp_verified ? (
                    <Alert status="success" borderRadius="xl">
                        <AlertIcon as={FaCheckCircle} />
                        <Box>
                            <AlertTitle>Nomor Terverifikasi</AlertTitle>
                            <AlertDescription fontSize="sm">
                                Nomor WhatsApp Anda ({user?.user_metadata?.whatsapp_number}) sudah terhubung. Anda akan menerima notifikasi dari Admin jika ada update layanan.
                            </AlertDescription>
                        </Box>
                    </Alert>
                ) : (
                    <Box w="full">
                        <Text fontSize="sm" color="gray.600" mb={4}>
                            Verifikasi nomor WhatsApp Anda (Tidak Wajib). Keuntungan:
                            <UnorderedList mt={2} pl={4}>
                                <ListItem>Menerima notifikasi update pengaduan langsung ke WA Anda.</ListItem>
                                <ListItem>Mendapatkan informasi terbaru dari Admin Desa Ngawonggo.</ListItem>
                                <ListItem>Membuka fitur eksklusif di masa mendatang.</ListItem>
                            </UnorderedList>
                        </Text>
                        <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'stretch', md: 'flex-end' }}>
                            <FormControl flex={1}>
                                <FormLabel fontSize="sm" color="gray.600">Nomor WhatsApp</FormLabel>
                                <Input
                                    type="tel"
                                    placeholder="Contoh: 62812xxxx"
                                    value={waNumber}
                                    onChange={(e) => setWaNumber(e.target.value)}
                                    borderRadius="xl"
                                    h="50px"
                                />
                            </FormControl>
                            <Button
                                colorScheme="whatsapp"
                                h="50px"
                                borderRadius="xl"
                                px={8}
                                isLoading={waLoading}
                                onClick={handleSendWaLink}
                                leftIcon={<FaWhatsapp />}
                            >
                                Kirim Link Verifikasi
                            </Button>
                        </Flex>
                        <Text fontSize="xs" color="gray.400" mt={3}>
                            *Batas permintaan link verifikasi adalah 1 kali per 3 jam untuk menghindari spam.
                        </Text>
                    </Box>
                )}
            </VStack>
          </Box>

          {/* Benefits Info Card */}
          <Box
            p={8}
            borderRadius="3xl"
            bg="brand.500"
            color="white"
            position="relative"
            overflow="hidden"
            boxShadow="xl"
          >
             <Box
                position="absolute"
                right="-20px"
                bottom="-20px"
                opacity={0.15}
                transform="rotate(-15deg)"
            >
                <Icon as={FaUserCircle} boxSize="200px" />
             </Box>
             <VStack align="start" spacing={4} maxW="md" position="relative" zIndex={1}>
                <Badge bg="white" color="brand.500" borderRadius="full" px={3} py={1}>INFO LOGIN</Badge>
                <Heading size="md">Kenapa Login Lebih Baik?</Heading>
                <Text fontSize="sm" opacity={0.9}>
                    Dengan masuk ke akun Anda, SplashScreen dan Verifikasi Robot akan otomatis dilewati saat Anda kembali. Kami juga menyimpan progres bacaan Quran dan skor permainan Anda secara otomatis.
                </Text>
                <Button
                    bg="white"
                    color="brand.500"
                    _hover={{ bg: 'gray.100' }}
                    size="sm"
                    borderRadius="full"
                    as={RouterLink}
                    to="/"
                >
                    Jelajahi Portal Sekarang
                </Button>
             </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PortalPage;
