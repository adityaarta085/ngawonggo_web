import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Center, Image, Flex,
  Badge, Button, SimpleGrid, Icon, VStack, HStack, Divider, useToast
} from '@chakra-ui/react';
import { FaPlay, FaListUl, FaArrowLeft, FaLock, FaUnlock, FaCoins } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';
import { supabase } from '../../lib/supabase';
import { getById, getList } from '../../lib/dataFetcher';
import { dracinTheme } from './theme';
import { DracinLoader } from './components/DracinLoader';
import Confetti from 'react-confetti';

const DracinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userSession, setUserSession] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [unlockedEps, setUnlockedEps] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/auth');
            return;
        }
        if (session && mounted) {

            setUserSession(session);
            const { data: curr } = await getById('user_currencies', session.user.id);
            if (curr) setUserCoins(curr.coins);

            const { data: allUnlocks } = await getList('dracin_unlocks', { limit: 1000 });
            const unlocks = allUnlocks?.filter(u => u.user_id === session.user.id && u.drama_id === id);
            if (unlocks) {
                setUnlockedEps(unlocks.map(u => u.episode_number));
            }
        }
    };
    fetchUser();

    const loadDetail = async () => {
      setLoading(true);
      try {
        const res = await dracinApi.getDetail(id);
        if (mounted) {
            setData(res);
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat detail drama.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDetail();

    return () => { mounted = false; };
  }, [id, navigate]);

  const handleUnlock = async (epNumber, cost) => {
      if (!userSession) {
          toast({ title: "Login Diperlukan", description: "Silakan login untuk membuka episode.", status: "warning" });
          navigate('/auth');
          return;
      }
      if (userCoins < cost) {
          toast({ title: "Koin Tidak Cukup", description: "Saldo Koin Desa tidak mencukupi. Silakan top up.", status: "error" });
          navigate('/topup');
          return;
      }

      setUnlockLoading(true);
      try {
          // Fake RPC call if not fully set up or use actual if it exists
          const { data: success, error } = await supabase.rpc('unlock_dracin_episode', {
              p_drama_id: id,
              p_episode_number: epNumber || 1,
              p_cost: cost
          });

          // If RPC is missing, fallback to direct inserts (requires RLS to allow)
          // For safety, assuming the RPC works. If error due to missing RPC, we show toast.
          if (error) {
              console.error(error);
              throw new Error(error.message);
          }

          if (success) {
              setUnlockedEps(prev => [...prev, epNumber]);
              setUserCoins(prev => prev - cost);
              setShowConfetti(true);
              toast({ title: "Berhasil!", description: `Episode ${epNumber} terbuka.`, status: "success" });
              setTimeout(() => setShowConfetti(false), 4000);
          } else {
              toast({ title: "Gagal", description: "Saldo koin tidak cukup atau error.", status: "error" });
          }
      } catch (err) {
          // Fallback direct update for demo purposes if RPC fails due to 'already exists' or missing
          toast({ title: "Gagal Membuka", description: err.message, status: "error" });
      } finally {
          setUnlockLoading(false);
      }
  };

  if (loading) return <Box h="100vh"><DracinLoader /></Box>;
  if (error || !data) return <Center h="100vh" bg={dracinTheme.bg}><Text color="red.500">{error || "Data tidak ditemukan"}</Text></Center>;

  const apiEpisodes = data.episodes || data.chapters;
  const episodes = apiEpisodes && apiEpisodes.length > 0 ? apiEpisodes : Array.from({ length: data.totalEpisodes || data.total_episodes || 0 }, (_, i) => ({ number: i + 1 }));
  const coverImage = data.detailCover || data.cover || ((data.cover_urls && data.cover_urls.length > 0) ? data.cover_urls[0] : data.posterImg);

  const getEpCost = (epNum) => {
      if (epNum <= 3) return 0;
      if (epNum <= 10) return 5;
      if (epNum <= 30) return 10;
      return 25;
  };

  return (
    <Box pt={{ base: 20, md: 24 }} pb={20} bg={dracinTheme.bg} minH="100vh" color={dracinTheme.textPrimary} position="relative">
      <SEO title={`${data.title} - Dracin Premium`} description={data.description || data.synopsis} />

      {showConfetti && <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={9999} pointerEvents="none"><Confetti recycle={false} numberOfPieces={300} /></Box>}

      {/* Dynamic Blur Background */}
      <Box
          position="absolute" top={0} left={0} w="100%" h="500px"
          backgroundImage={`url(${coverImage})`}
          backgroundSize="cover" backgroundPosition="center"
          filter="blur(20px) brightness(0.3)"
          zIndex={0}
      />

      <Box position="absolute" top="400px" left={0} w="100%" h="100px" bgGradient={`linear(to-b, transparent, ${dracinTheme.bg})`} zIndex={0} />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex justify="space-between" mb={6}>
            <Button as={RouterLink} to="/dracin" leftIcon={<FaArrowLeft />} variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }}>
                Kembali
            </Button>
            <HStack bg="rgba(0,0,0,0.5)" px={4} py={2} borderRadius="full" border={`1px solid ${dracinTheme.accentGold}`}>
                <Icon as={FaCoins} color={dracinTheme.accentGold} />
                <Text fontWeight="bold">{userCoins}</Text>
            </HStack>
        </Flex>

        <Flex direction={{ base: 'column', md: 'row' }} gap={8} mb={10}>
            <Box flexShrink={0} w={{ base: '100%', md: '300px' }} position="relative">
                <Image
                    src={coverImage}
                    alt={data.title}
                    borderRadius="2xl"
                    boxShadow={`0 0 30px rgba(0,0,0,0.8)`}
                    w="100%"
                    objectFit="cover"
                    border={`1px solid ${dracinTheme.glassBorder}`}
                />
                <Badge position="absolute" top={4} left={4} colorScheme="red" bg={dracinTheme.accentRed} fontSize="sm" px={3} py={1} borderRadius="md" boxShadow="dark-lg">
                    PREMIUM
                </Badge>
            </Box>
            <VStack align="start" spacing={4} flex={1}>
                <Heading size="2xl" color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">{data.title}</Heading>
                <HStack wrap="wrap" gap={2}>
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="md" bg="blue.900" border="1px solid blue">{data.episode_label || `Episodes: ${data.totalEpisodes || episodes.length}`}</Badge>
                    {data.type && <Badge colorScheme="green" px={3} py={1} borderRadius="md" bg="green.900" border="1px solid green">{data.type}</Badge>}
                </HStack>

                <Box bg="rgba(0,0,0,0.4)" p={4} borderRadius="xl" border={`1px solid ${dracinTheme.glassBorder}`} w="100%">
                    <Heading size="md" mb={2} color={dracinTheme.accentGold}>Sinopsis</Heading>
                    <Text color="gray.300" lineHeight="tall" textAlign="justify">
                        {data.description || data.synopsis || "Tidak ada sinopsis."}
                    </Text>
                </Box>

                {episodes.length > 0 && (
                    <Button
                        as={RouterLink}
                        to={`/dracin/detail/${id}/${episodes[0].episode || episodes[0].serialNumber || episodes[0].number || 1}/play`}
                        size="lg"
                        leftIcon={<FaPlay />}
                        mt={4}
                        bg={dracinTheme.accentRed}
                        color="white"
                        _hover={{ bg: "red.700", transform: "scale(1.05)" }}
                        transition="all 0.2s"
                        boxShadow={`0 0 20px rgba(229, 9, 20, 0.4)`}
                    >
                        Tonton Episode 1
                    </Button>
                )}
            </VStack>
        </Flex>

        <Divider borderColor={dracinTheme.glassBorder} mb={8} />

        {episodes.length > 0 && (
            <Box>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2} color="white">
                    <Icon as={FaListUl} color={dracinTheme.accentRed} /> Daftar Episode
                </Heading>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                    {episodes.map((ep, idx) => {
                        const epNum = ep.episode || ep.serialNumber || ep.number || ep.episodeNumber;
                        const isFree = epNum <= 3;
                        const cost = getEpCost(epNum);
                        const isUnlocked = isFree || unlockedEps.includes(epNum);

                        return (
                            <Box key={idx} position="relative">
                                {isUnlocked ? (
                                    <Button
                                        as={RouterLink}
                                        to={`/dracin/detail/${id}/${epNum}/play`}
                                        w="100%"
                                        h="60px"
                                        bg={dracinTheme.cardBg}
                                        color="white"
                                        border={`1px solid ${isFree ? 'green' : dracinTheme.accentGold}`}
                                        _hover={{ bg: "whiteAlpha.200", transform: "scale(1.02)" }}
                                        transition="all 0.2s"
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <Text>Episode {epNum}</Text>
                                        <Badge size="xs" colorScheme={isFree ? "green" : "yellow"} variant="subtle" mt={1}>
                                            {isFree ? "GRATIS" : <><Icon as={FaUnlock} mr={1} /> UNLOCKED</>}
                                        </Badge>
                                    </Button>
                                ) : (
                                    <Button
                                        w="100%"
                                        h="60px"
                                        bg="rgba(0,0,0,0.6)"
                                        color="gray.400"
                                        border={`1px solid ${dracinTheme.glassBorder}`}
                                        _hover={{ bg: "rgba(0,0,0,0.8)" }}
                                        onClick={() => handleUnlock(epNum, cost)}
                                        isLoading={unlockLoading}
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <Text>Episode {epNum}</Text>
                                        <HStack mt={1} color={dracinTheme.accentGold} fontSize="xs">
                                            <Icon as={FaLock} />
                                            <Text>{cost} Koin</Text>
                                        </HStack>
                                    </Button>
                                )}
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Box>
        )}
      </Container>
    </Box>
  );
};

export default DracinDetail;
