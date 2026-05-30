import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, Center, Badge,
  Image, VStack, HStack, Icon, Input, InputGroup,
  InputLeftElement, InputRightElement, IconButton, Button, Flex, useDisclosure
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaFire, FaStar, FaSearch, FaTimes, FaCoins, FaCalendarCheck, FaPlay, FaVideo } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';
import { dracinTheme } from './theme';
import { DracinGrid } from './components/DracinGrid';
import { DracinLoader } from './components/DracinLoader';
import { CheckInModal } from './components/CheckInModal';
import { AdsModal } from './components/AdsModal';
import { supabase } from '../../lib/supabase';
import { getById } from '../../lib/dataFetcher';



const DracinPage = () => {
  const navigate = useNavigate();
  const [dataTrending, setDataTrending] = useState([]);
  const [dataForYou, setDataForYou] = useState([]);



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [userCoins, setUserCoins] = useState(0);
  const [userSession, setUserSession] = useState(null);

  const { isOpen: isCheckInOpen, onOpen: onCheckInOpen, onClose: onCheckInClose } = useDisclosure();
  const { isOpen: isAdsOpen, onOpen: onAdsOpen, onClose: onAdsClose } = useDisclosure();


  useEffect(() => {
    let mounted = true;
    const fetchUserData = async () => {

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/auth');
            return;
        }
        if (session && mounted) {

            setUserSession(session);
            const { data } = await getById('user_currencies', session.user.id);
            if (data) setUserCoins(data.coins);

            // Fetch history
            // const { data: history } = await supabase.from('dracin_history').select('*').eq('user_id', session.user.id).order('updated_at', { ascending: false }).limit(5);
            // Fetch favorites
            // const { data: favorites } = await supabase.from('dracin_favorites').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5);

            // Note: Since dracin details need to be fetched per id, we can mock it or fetch them from API.
            // For now, let's skip populating history and favorites until we create the detail items or we just show them if we have data.
            // To simplify, we'll implement that later or omit if not critically needed in this PR scope.
        }
    };
    fetchUserData();

    const loadHome = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resTrend, resForYou] = await Promise.all([
            dracinApi.getTrending(),
            dracinApi.getForYou()
        ]);
        if (mounted) {
            setDataTrending(resTrend.collections || []);
            setDataForYou(resForYou.collections || []);
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat portal Dracin. Pastikan koneksi internet stabil.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadHome();
    return () => { mounted = false; };
  }, [navigate]);

  const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      setError(null);
      try {
          const res = await dracinApi.search(searchQuery);
          setSearchResults(res.results || []);
      } catch (err) {
          setError("Gagal mencari dracin.");
      } finally {
          setIsSearching(false);
      }
  };

  const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
  };

  const heroDrama = dataTrending.length > 0 ? dataTrending[0] : null;

  return (
    <Box pt={{ base: 20, md: 24 }} pb={20} bg={dracinTheme.bg} minH="100vh" color={dracinTheme.textPrimary}>
      <SEO title="Portal Drama Premium" description="Nonton Drama Pendek Vertikal Premium dengan sistem monetisasi." />

      {/* Header Widget */}
      <Container maxW="container.xl" mb={6}>
        <Flex justify="space-between" align="center" bg={dracinTheme.cardBg} p={4} borderRadius="xl" border={`1px solid ${dracinTheme.glassBorder}`} backdropFilter="blur(10px)">
            <HStack>
                <Icon as={FaCoins} color={dracinTheme.accentGold} boxSize={6} />
                <Text fontWeight="bold" fontSize="lg">{userCoins} Koin Desa</Text>
            </HStack>
            <HStack spacing={4} wrap="wrap" justify="flex-end">
                <Button leftIcon={<FaCalendarCheck />} size="sm" colorScheme="yellow" variant="solid" bg={dracinTheme.accentGold} color="black" _hover={{ bg: "yellow.500" }} onClick={onCheckInOpen}>
                    Check-In
                </Button>
                <Button leftIcon={<FaVideo />} size="sm" colorScheme="blue" variant="solid" onClick={onAdsOpen}>
                    Iklan
                </Button>
                <Button as={RouterLink} to="/topup" size="sm" colorScheme="red" variant="outline" borderColor={dracinTheme.accentRed} color={dracinTheme.accentRed} _hover={{ bg: "red.900" }}>
                    Top Up
                </Button>
            </HStack>
        </Flex>
      </Container>

      {/* Hero Banner */}
      {!isSearching && heroDrama && (
          <Container maxW="container.xl" mb={10}>
              <Box position="relative" h={{ base: "400px", md: "500px" }} borderRadius="2xl" overflow="hidden" boxShadow={`0 0 40px rgba(229, 9, 20, 0.2)`}>
                  <Image src={heroDrama.cover} w="100%" h="100%" objectFit="cover" filter="brightness(0.6)" />
                  <Box position="absolute" bottom={0} left={0} w="100%" p={{ base: 6, md: 10 }} bgGradient="linear(to-t, #000000 0%, transparent 100%)">
                      <Badge colorScheme="red" mb={3} px={2} py={1}>SEDANG TREN</Badge>
                      <Heading size="2xl" mb={2} color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">{heroDrama.title}</Heading>
                      <Text color="gray.300" mb={6} maxW="600px" noOfLines={2}>{heroDrama.description || "Drama pendek vertikal eksklusif."}</Text>
                      <HStack>
                          <Button as={RouterLink} to={`/dracin/detail/${heroDrama.id}`} leftIcon={<FaPlay />} size="lg" bg={dracinTheme.accentRed} color="white" _hover={{ bg: "red.700" }}>
                              Tonton Sekarang
                          </Button>
                      </HStack>
                  </Box>
              </Box>
          </Container>
      )}

      <Container maxW="container.xl">
        {/* Search Bar */}
        <Box mb={10} maxW="600px" mx="auto">
            <form onSubmit={handleSearch}>
                <InputGroup size="lg" boxShadow={`0 4px 20px rgba(0,0,0,0.5)`} borderRadius="full">
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari judul drama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg={dracinTheme.glassBg}
                        color="white"
                        border={`1px solid ${dracinTheme.glassBorder}`}
                        _focus={{ borderColor: dracinTheme.accentRed, boxShadow: `0 0 10px ${dracinTheme.accentRed}` }}
                        borderRadius="full"
                        pr="4.5rem"
                    />
                    {searchQuery && (
                        <InputRightElement w="4.5rem">
                            <IconButton
                                aria-label="Clear Search"
                                icon={<FaTimes />}
                                size="sm"
                                borderRadius="full"
                                variant="ghost"
                                color="white"
                                _hover={{ bg: "whiteAlpha.200" }}
                                onClick={clearSearch}
                            />
                        </InputRightElement>
                    )}
                </InputGroup>
            </form>
        </Box>

        {isSearching && <Center h="20vh"><DracinLoader /></Center>}
        {error && <Center h="20vh"><Text color="red.500">{error}</Text></Center>}

        {!isSearching && searchResults.length > 0 && (
            <Box mb={12}>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2} color={dracinTheme.accentRed}>
                    <Icon as={FaSearch} /> Hasil Pencarian
                </Heading>
                <DracinGrid items={searchResults} />
            </Box>
        )}

        {loading && !isSearching && <Center h="40vh"><DracinLoader /></Center>}

        {!isSearching && searchResults.length === 0 && !loading && !error && (
            <VStack spacing={12} align="stretch">
                <Box>
                    <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2} color={dracinTheme.accentGold}>
                        <Icon as={FaFire} /> Sedang Tren
                    </Heading>
                    <DracinGrid items={dataTrending} />
                </Box>
                <Box>
                    <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2} color="purple.400">
                        <Icon as={FaStar} /> Direkomendasikan Untukmu
                    </Heading>
                    <DracinGrid items={dataForYou} />
                </Box>
            </VStack>
        )}

      </Container>
      <CheckInModal
          isOpen={isCheckInOpen}
          onClose={onCheckInClose}
          userSession={userSession}
          onCheckInSuccess={(reward) => setUserCoins(prev => prev + reward)}
      />
      <AdsModal
          isOpen={isAdsOpen}
          onClose={onAdsClose}
          userSession={userSession}
          onRewardSuccess={(reward) => setUserCoins(prev => prev + reward)}
      />
    </Box>
  );
};

export default DracinPage;
