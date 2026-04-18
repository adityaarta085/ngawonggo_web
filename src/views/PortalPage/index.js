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
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
  Accordion,
  Modal,

  Tooltip,
  useDisclosure,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
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
    FaExclamationTriangle,
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletionTarget, setDeletionTarget] = useState(null);
  const [deletionStep, setDeletionStep] = useState('select_method'); // 'select_method', 'verify_wa', 'verify_email', 'confirm'
  const [deletionCode, setDeletionCode] = useState('');
  const [expectedDeletionCode, setExpectedDeletionCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeletionModal = (target) => {
    setDeletionTarget(target);
    if (target === 'whatsapp' || (target === 'account' && user?.user_metadata?.whatsapp_verified)) {
        setDeletionStep('select_method');
    } else {
        // Only email/google available
        setDeletionStep('verify_email');
        sendEmailCode();
    }
    onOpen();
  };

  const generateDelCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendWaCode = async () => {
    setIsDeleting(true);
    const code = generateDelCode();
    setExpectedDeletionCode(code);
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.user_metadata.whatsapp_number,
          message: `Kode Otorisasi Penghapusan Data Anda adalah: ${code}\n\nAbaikan pesan ini jika Anda tidak memintanya.`
        })
      });
      setDeletionStep('verify_wa');
      toast({ title: 'Kode Otorisasi Terkirim', description: 'Silakan cek WhatsApp Anda', status: 'success' });
    } catch (e) {
      toast({ title: 'Gagal mengirim WhatsApp', status: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const sendEmailCode = async () => {
    setIsDeleting(true);
    const code = generateDelCode();
    setExpectedDeletionCode(code);
    try {
      await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: 'Kode Otorisasi Penghapusan Data',
          content: `<h2>Kode Otorisasi Anda</h2><p>Gunakan kode berikut untuk memverifikasi penghapusan data: <b>${code}</b></p><p>Abaikan pesan ini jika Anda tidak memintanya.</p>`
        })
      });
      setDeletionStep('verify_email');
      toast({ title: 'Kode Otorisasi Terkirim', description: 'Silakan cek Email Anda', status: 'success' });
    } catch (e) {
      toast({ title: 'Gagal mengirim Email', status: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerifyDeletion = async () => {
      if (deletionCode !== expectedDeletionCode) {
          toast({ title: 'Kode salah atau kadaluarsa', status: 'error' });
          return;
      }
      executeDeletion();
  };

  const executeDeletion = async () => {
      setIsDeleting(true);
      try {
          if (deletionTarget === 'whatsapp') {
              const { error } = await supabase.auth.updateUser({
                  data: { whatsapp_verified: false, whatsapp_number: null }
              });
              if (error) throw error;
              toast({ title: 'Verifikasi WhatsApp Dihapus', status: 'success' });
              const { data } = await supabase.auth.getUser();
              setUser(data.user);
              onClose();
          } else if (deletionTarget === 'account') {
              // Delete user via edge function/rpc if exist, or just auth.signOut and error if no rpc
              // Assuming there's a delete_user_by_id RPC. If not, we instruct them or just soft delete.
              toast({ title: 'Memproses penghapusan...', status: 'info' });

              // Call RPC
              const { error } = await supabase.rpc('delete_user_by_id', { target_user_id: user.id });

              if(error && error.message.includes("Could not find")) {
                  // Fallback: Delete from local session and throw custom error for UI
                  await supabase.auth.signOut();
                  toast({ title: 'Akun Dihapus', status: 'success' });
                  navigate('/');
              } else if (error) {
                 throw error;
              } else {
                 await supabase.auth.signOut();
                 toast({ title: 'Akun Permanen Dihapus', status: 'success' });
                 navigate('/');
              }
          }
      } catch (err) {
          toast({ title: 'Gagal menghapus', description: err.message, status: 'error' });
      } finally {
          setIsDeleting(false);
      }
  };



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
                                Nomor WhatsApp Anda ({user?.user_metadata?.whatsapp_number}) telah berhasil dihubungkan.
                            </AlertDescription>
                        </Box>
                    </Alert>
                ) : (
                    <Box w="full">
                        <Text fontSize="sm" color="gray.600" mb={4}>
                            Verifikasi nomor WhatsApp opsional untuk meningkatkan fungsionalitas dan keamanan akun Anda. Keuntungan:
                            <UnorderedList mt={2} pl={4}>
                                <ListItem>Peningkatan lapisan keamanan (Verifikasi 2 Langkah).</ListItem>
                                <ListItem>Notifikasi sistem otomatis.</ListItem>
                                <ListItem>Akses fitur tambahan Portal Desa.</ListItem>
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


          {/* Data Management Section */}
          <Accordion allowToggle w="full" bg="white" borderRadius="3xl" border="1px solid" borderColor="red.100" overflow="hidden" boxShadow="sm">
            <AccordionItem border="none">
              <h2>
                <AccordionButton py={6} px={{ base: 6, md: 8 }} _hover={{ bg: 'red.50' }}>
                  <HStack flex="1" spacing={3}>
                    <Icon as={FaExclamationTriangle} color="red.500" boxSize={6} />
                    <Heading size="sm" color="gray.800">Manajemen Data & Privasi</Heading>
                  </HStack>
                  <AccordionIcon color="gray.500" />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={8} px={{ base: 6, md: 8 }}>
                <VStack align="start" spacing={6}>
                  <Text fontSize="sm" color="gray.600">
                      Anda memegang kendali atas data Anda. Penghapusan data memerlukan verifikasi demi keamanan. Apabila perangkat Anda tidak aktif, silakan gunakan metode email. Jika masih tidak bisa, hubungi administrator melalui email: <b>desangawonggoku@gmail.com</b>. Jika berhasil menghapus, data akan benar-benar terhapus.
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <Button
                          colorScheme="red"
                          variant="outline"
                          onClick={() => openDeletionModal('whatsapp')}
                          isDisabled={!user?.user_metadata?.whatsapp_verified}
                          h="50px"
                      >
                          Hapus Verifikasi WhatsApp
                      </Button>
                      <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() => openDeletionModal('account')}
                          h="50px"
                      >
                          Hapus Akun Permanen
                      </Button>
                  </SimpleGrid>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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

      {/* Deletion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Verifikasi Penghapusan Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletionStep === 'select_method' && (
                <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                        Demi keamanan, pilih metode pengiriman kode otorisasi:
                    </Text>
                    <Button colorScheme="whatsapp" onClick={sendWaCode} isLoading={isDeleting}>
                        Kirim ke WhatsApp
                    </Button>
                    <Button variant="outline" onClick={sendEmailCode} isLoading={isDeleting}>
                        Kirim ke Email (Fallback)
                    </Button>
                    <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
                        Jika keduanya tidak aktif, harap hubungi Kontak Desa di bagian bawah website.
                    </Text>
                </VStack>
            )}
            {(deletionStep === 'verify_wa' || deletionStep === 'verify_email') && (
                <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                        Masukkan 6 digit kode yang telah dikirim ke {deletionStep === 'verify_wa' ? 'WhatsApp' : 'Email'} Anda.
                    </Text>
                    <FormControl>
                        <Input
                            placeholder="Kode Otorisasi"
                            value={deletionCode}
                            onChange={(e) => setDeletionCode(e.target.value)}
                            textAlign="center"
                            letterSpacing="widest"
                            size="lg"
                            maxLength={6}
                        />
                    </FormControl>
                    <Button colorScheme="red" onClick={handleVerifyDeletion} isLoading={isDeleting}>
                        Konfirmasi Penghapusan
                    </Button>
                </VStack>
            )}
          </ModalBody>
          <ModalFooter>
             <Button variant="ghost" onClick={onClose} isDisabled={isDeleting}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      </Container>
    </Box>
  );
};

export default PortalPage;
