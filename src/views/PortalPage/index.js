import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
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
  Avatar, Center, IconButton,

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
    FaCheckCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useMonetization } from '../../contexts/MonetizationContext';
import { FaCoins, FaLock, FaBell, FaCrown, FaStore, FaPaintBrush, FaMedal, FaGift, FaTrophy, FaCreditCard } from 'react-icons/fa';
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletionTarget, setDeletionTarget] = useState(null);
  const [deletionStep, setDeletionStep] = useState('select_method'); // 'select_method', 'verify_wa', 'verify_email', 'confirm'
      const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [gachaLoading, setGachaLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const { currency, tier, deductCurrency, gachaStats, claimDailyLogin, rollGacha, activateVipCard, purchaseVipDirect } = useMonetization();


  const openDeletionModal = (target) => {
    setDeletionTarget(target);
    onOpen();
  };





    const handleDeletionRequest = async () => {
      setIsDeleting(true);
      try {
          // Get IP
          let ip = 'Unknown';
          try {
              const res = await fetch('https://api.ipify.org?format=json');
              const data = await res.json();
              ip = data.ip;
          } catch(e) { console.error('Failed to get IP', e); }

          const browserInfo = navigator.userAgent;
          const userDetails = `Target Penghapusan: Akun Permanen
ID User: ${user?.id || 'Unknown'}
Email: ${user?.email || 'Unknown'}
IP Address: ${ip}
Browser: ${browserInfo}
Alasan/Feedback: ${feedback || 'Tidak ada'}`;

          // Send Email to Admin instead of actual deletion
          await fetch('/api/broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  to: 'adityaarta085@gmail.com',
                  subject: `PENGHAPUSAN AKUN - ${user?.email || 'Unknown'}`,
                  content: `<pre>${userDetails}</pre>`
              })
          });

          toast({ title: 'Permintaan Diterima', description: 'Permintaan penghapusan akun sedang diproses oleh Admin. Anda akan dihubungi jika diperlukan.', status: 'info', duration: 7000, isClosable: true });
          onClose();

      } catch (error) {
          toast({ title: 'Terjadi Kesalahan', description: error.message, status: 'error' });
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
      try {
        const { data: ld } = await supabase.from('leaderboard_view').select('*').limit(10);
        if(ld) setLeaderboard(ld);
      } catch(e) {}

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
                    }
                });
                if (!error) {
                    localStorage.removeItem('wa_verification_token');
                    localStorage.removeItem('wa_verification_number');
                    // Refresh user data
                    const { data: { user: updatedUser } } = await supabase.auth.getUser();
                    setUser(updatedUser);
                    // Remove query param
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
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

                    {/* Economy & Status Section */}
          <Box p={{ base: 6, md: 8 }} borderRadius="3xl" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} mb={6}>
              <HStack>
                  <Icon as={FaStore} color="brand.500" />
                  <Heading size="sm" color="gray.700">Dompet & Status</Heading>
                  <IconButton icon={<Icon as={FaBell} />} colorScheme="blue" variant="ghost" isRound onClick={() => navigate("/portal/notifikasi")} aria-label="Notifikasi" ml={4} />
              </HStack>
              {gachaStats?.canClaimDaily && (
                  <Button size="sm" colorScheme="yellow" leftIcon={<FaGift />} isLoading={claimLoading} onClick={async () => {
                      setClaimLoading(true);
                      await claimDailyLogin();
                      setClaimLoading(false);
                  }}>Klaim Daily Login (+10 Koin)</Button>
              )}
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <VStack p={4} bg="yellow.50" borderRadius="xl" align="start" border="1px solid" borderColor="yellow.100">
                    <HStack color="yellow.600" justify="space-between" w="full">
                        <HStack><Icon as={FaCoins} /><Text fontWeight="bold">Koin Desa</Text></HStack>
                        <IconButton size="xs" colorScheme="yellow" variant="ghost" icon={<FaCreditCard />} onClick={() => navigate('/topup')} aria-label="Topup Koin" />
                    </HStack>
                    <Heading size="2xl" color="yellow.700">{currency?.coins || 0}</Heading>
                </VStack>
                <VStack p={4} bg="purple.50" borderRadius="xl" align="start" border="1px solid" borderColor="purple.100">
                    <HStack color="purple.600">
                        <Icon as={FaCrown} />
                        <Text fontWeight="bold">Tier Status</Text>
                    </HStack>
                    <Heading size="xl" color="purple.700">{tier?.name || 'Free'}</Heading>
                </VStack>
                <VStack p={4} bg="brand.50" borderRadius="xl" align="center" justify="center" as="button" onClick={() => navigate("/portal/toko")} _hover={{ bg: 'brand.100' }} transition="all 0.2s" border="1px solid" borderColor="brand.100">
                    <Icon as={FaStore} color="brand.500" boxSize={8} mb={1} />
                    <Text fontWeight="bold" color="brand.600" fontSize="md">Beli VIP & Gacha</Text>
                </VStack>
            </SimpleGrid>
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
                onClick={() => navigate('/game')}
              />
            </SimpleGrid>
          </VStack>

          {/* Papan Peringkat */}
          <Box p={{ base: 6, md: 8 }} borderRadius="3xl" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <HStack mb={6}>
                <Icon as={FaTrophy} color="yellow.400" boxSize={6} />
                <Heading size="md" color="gray.800">Sultan Koin & VIP (Leaderboard)</Heading>
            </HStack>
            {tier?.name !== 'VIP' ? (
                <Center p={8} bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.300">
                    <VStack spacing={3}>
                        <Icon as={FaLock} color="gray.400" boxSize={8} />
                        <Text color="gray.500" fontWeight="bold">Hanya untuk member VIP</Text>
                        <Button size="sm" colorScheme="purple" onClick={() => navigate("/portal/toko")}>Upgrade ke VIP</Button>
                    </VStack>
                </Center>
            ) : (
                <VStack align="stretch" spacing={3}>
                    {leaderboard.map((lb, i) => (
                        <Flex key={i} p={3} bg="gray.50" borderRadius="lg" justify="space-between" align="center">
                            <HStack>
                                <Badge colorScheme={i < 3 ? 'yellow' : 'gray'} borderRadius="full" w="24px" h="24px" display="flex" alignItems="center" justify="center">{i + 1}</Badge>
                                <Text fontWeight="bold">{lb.name || lb.email.split('@')[0]}</Text>
                                {lb.tier_name === 'VIP' && <Badge colorScheme="purple" fontSize="10px">VIP</Badge>}
                            </HStack>
                            <HStack color="yellow.500">
                                <Icon as={FaCoins} />
                                <Text fontWeight="bold">{lb.coins}</Text>
                            </HStack>
                        </Flex>
                    ))}
                    {leaderboard.length === 0 && <Text color="gray.500" fontSize="sm">Belum ada data Sultan.</Text>}
                </VStack>
            )}
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

                  <Accordion allowToggle w="full">
                    <AccordionItem border="none">
                      <h2>
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                          <Box flex="1" textAlign="left" fontSize="xs" color="gray.400">
                            Pengaturan Lanjutan (Penghapusan)
                          </Box>
                          <AccordionIcon color="gray.400" />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel px={0} pb={4}>
                        <VStack align="start" spacing={2} p={4} bg="red.50" borderRadius="md">
                          <Text fontSize="xs" color="red.600" fontWeight="bold">Zona Berbahaya</Text>
                          <Text fontSize="2xs" color="red.500" mb={2}>
                              Tindakan ini bersifat permanen dan akan menghapus data Anda dari sistem kami.
                          </Text>
                          <HStack spacing={2}>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                size="xs"
                                onClick={() => openDeletionModal('account')}
                            >
                                Hapus Akun Permanen
                            </Button>
                          </HStack>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          </VStack>

      {/* Store Modal */}


      {/* Deletion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Verifikasi Penghapusan Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                    Apakah Anda yakin ingin menghapus akun ini secara permanen?
                </Text>
                <FormControl>
                    <FormLabel fontSize="xs" color="gray.500">Alasan / Feedback (Opsional)</FormLabel>
                    <Box as="textarea"
                            w="full"
                            p={3}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            fontSize="sm"
                            placeholder="Mengapa Anda ingin menghapus data ini? (Opsional, sangat membantu kami)"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                    />
                </FormControl>
                <Button colorScheme="red" onClick={handleDeletionRequest} isLoading={isDeleting} size="lg" mt={2}>
                    Konfirmasi Penghapusan
                </Button>
            </VStack>
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
