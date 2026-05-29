import React, { useState, useEffect, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Text, Center, Flex, Button, IconButton, useToast, VStack, HStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, Icon
} from '@chakra-ui/react';
import { FaArrowLeft, FaShareAlt, FaHeart, FaBookmark, FaListUl, FaLock, FaCoins, FaUnlock } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';
import { supabase } from '../../lib/supabase';
import { dracinTheme } from './theme';
import Confetti from 'react-confetti';
import { DracinLoader } from './components/DracinLoader';
import { FaStepForward } from 'react-icons/fa';

const DracinWatch = () => {
  const { id, episode } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const [userSession, setUserSession] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [epCost, setEpCost] = useState(0);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [unlockedEps, setUnlockedEps] = useState([]);

  const [autoplayCountdown, setAutoplayCountdown] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const epNum = parseInt(episode, 10);

  const getCost = (ep) => {
      if (ep <= 3) return 0;
      if (ep <= 10) return 5;
      if (ep <= 30) return 10;
      return 25;
  };

  useEffect(() => {
    let mounted = true;

    const fetchUserAndLockStatus = async () => {
        const cost = getCost(epNum);
        setEpCost(cost);


        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/auth');
            return;
        }
        if (session && mounted) {

            setUserSession(session);
            const { data: curr } = await supabase.from('user_currencies').select('coins').eq('user_id', session.user.id).single();
            if (curr) setUserCoins(curr.coins);

            const { data: unlocks } = await supabase.from('dracin_unlocks').select('episode_number').eq('user_id', session.user.id).eq('drama_id', id);
            const unlockedList = unlocks ? unlocks.map(u => u.episode_number) : [];
            setUnlockedEps(unlockedList);

            if (cost > 0 && !unlockedList.includes(epNum)) {
                setIsLocked(true);
            } else {
                setIsLocked(false);
                // record history
                await supabase.from('dracin_history').upsert({ user_id: session.user.id, drama_id: id, last_episode: epNum, updated_at: new Date() });
            }

            // Check like and save status
            const { data: likeData } = await supabase.from('dracin_likes').select('id').eq('user_id', session.user.id).eq('drama_id', id).single();
            if (likeData) setIsLiked(true);

            const { data: saveData } = await supabase.from('dracin_favorites').select('id').eq('user_id', session.user.id).eq('drama_id', id).single();
            if (saveData) setIsSaved(true);
        } else {
            if (cost > 0) setIsLocked(true);
        }
    };

    const loadDetail = async () => {
        try {
            const detailRes = await dracinApi.getDetail(id);
            if (mounted) setDetailData(detailRes);
        } catch (err) {
            console.error("Gagal memuat detail:", err);
        }
    };

    fetchUserAndLockStatus();
    loadDetail();

    const loadEpisode = async () => {
      setLoading(true);
      setError(null);
      setAutoplayCountdown(null);
      try {
        const res = await dracinApi.getEpisode(id, episode);
        if (mounted) {
            let foundUrl = null;
            if (res.main && res.main.indo_cdn_urls && res.main.indo_cdn_urls.length > 0) {
                foundUrl = res.main.indo_cdn_urls[0];
            } else if (res.main && res.main.indo_hd_cdn_urls && res.main.indo_hd_cdn_urls.length > 0) {
                foundUrl = res.main.indo_hd_cdn_urls[0];
            } else if (res.alt && res.alt.indo_cdn_urls && res.alt.indo_cdn_urls.length > 0) {
                foundUrl = res.alt.indo_cdn_urls[0];
            } else if (res.best_url) {
                foundUrl = res.best_url;
            } else if (res.videoList && res.videoList.length > 0) {
                const h264Video = res.videoList.find(v => v.encode === 'H264');
                foundUrl = h264Video ? h264Video.url : res.videoList[0].url;
            } else if (res.videoUrl) {
                foundUrl = res.videoUrl;
            }

            if (foundUrl) {
                setVideoUrl(foundUrl);
            } else {
                 setError("Video tidak tersedia.");
            }
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat video.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Only load episode if not locked (or load anyway but hide player)
    loadEpisode();

    return () => { mounted = false; };
  }, [id, episode, epNum, navigate]);

  const handleNextEpisode = React.useCallback(() => {
      navigate(`/dracin/detail/${id}/${epNum + 1}/play`);
  }, [navigate, id, epNum]);

  // Autoplay countdown logic
  useEffect(() => {
      let timer;
      if (autoplayCountdown !== null && autoplayCountdown > 0) {
          timer = setTimeout(() => setAutoplayCountdown(autoplayCountdown - 1), 1000);
      } else if (autoplayCountdown === 0) {
          handleNextEpisode();
      }
      return () => clearTimeout(timer);
  }, [autoplayCountdown, handleNextEpisode]);

  const handleVideoEnded = () => {
      setAutoplayCountdown(5);
  };

  const handleUnlock = async () => {
      if (!userSession) {
          toast({ title: "Login Diperlukan", status: "warning" });
          navigate('/auth');
          return;
      }
      if (userCoins < epCost) {
          toast({ title: "Koin Tidak Cukup", status: "error" });
          navigate('/topup');
          return;
      }

      setUnlockLoading(true);
      try {
          const { data: success, error } = await supabase.rpc('unlock_dracin_episode', {
              p_drama_id: id, p_episode_number: epNum, p_cost: epCost
          });
          if (error) throw new Error(error.message);

          if (success) {
              setIsLocked(false);
              setUserCoins(prev => prev - epCost);
              setUnlockedEps(prev => [...prev, epNum]);
              setShowConfetti(true);
              toast({ title: "Episode Terbuka!", status: "success" });
              setTimeout(() => setShowConfetti(false), 4000);
          } else {
              throw new Error("Gagal membuka");
          }
      } catch (err) {
          toast({ title: "Error", description: err.message, status: "error" });
      } finally {
          setUnlockLoading(false);
      }
  };

  const toggleLike = async () => {
      if (!userSession) return toast({ title: "Login Diperlukan", status: "warning" });
      try {
          if (isLiked) {
              await supabase.from('dracin_likes').delete().eq('user_id', userSession.user.id).eq('drama_id', id);
              setIsLiked(false);
          } else {
              await supabase.from('dracin_likes').insert({ user_id: userSession.user.id, drama_id: id });
              setIsLiked(true);
          }
      } catch (e) { console.error(e); }
  };

  const toggleSave = async () => {
      if (!userSession) return toast({ title: "Login Diperlukan", status: "warning" });
      try {
          if (isSaved) {
              await supabase.from('dracin_favorites').delete().eq('user_id', userSession.user.id).eq('drama_id', id);
              setIsSaved(false);
          } else {
              await supabase.from('dracin_favorites').insert({ user_id: userSession.user.id, drama_id: id });
              setIsSaved(true);
          }
      } catch (e) { console.error(e); }
  };

  const handleShare = () => {
    let titleShare = `Nonton Dracin Eps ${episode}`;
    let textShare = `Tonton Episode ${episode} di Ngawonggo Portal!`;
    if (navigator.share) {
      navigator.share({ title: titleShare, text: textShare, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Tautan disalin!", status: "success", duration: 2000 });
    }
  };

  if (loading) return <Box h="100vh"><DracinLoader /></Box>;

  return (
    <Box h="100vh" w="100vw" bg={dracinTheme.bg} position="fixed" top={0} left={0} zIndex={9999} overflow="hidden">
      <SEO title={`Eps ${episode} - Dracin`} />
      {showConfetti && <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={99999} pointerEvents="none"><Confetti recycle={false} numberOfPieces={300} /></Box>}

      {/* Container for vertical video */}
      <Center h="100%" w="100%">
          <Box
              position="relative"
              w={{ base: "100%", md: "400px" }}
              h={{ base: "100%", md: "85vh" }}
              bg="black"
              borderRadius={{ base: "none", md: "3xl" }}
              boxShadow={{ base: "none", md: `0 0 50px rgba(229,9,20,0.3)` }}
              overflow="hidden"
              border={{ base: "none", md: `4px solid #333` }}
          >
              {/* Top Back Button */}
              <Box position="absolute" top={4} left={4} zIndex={10}>
                  <IconButton
                      icon={<FaArrowLeft />}
                      onClick={() => navigate(`/dracin/detail/${id}`)}
                      bg="rgba(0,0,0,0.5)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }}
                      isRound
                  />
              </Box>

              {/* Video Player or Lock Screen */}
              {isLocked ? (
                  <Center h="100%" w="100%" bg="rgba(0,0,0,0.8)" flexDirection="column" p={6} textAlign="center" zIndex={5}>
                      <Icon as={FaLock} boxSize={12} color={dracinTheme.accentGold} mb={4} />
                      <Text color="white" fontSize="xl" fontWeight="bold" mb={2}>Episode Terkunci</Text>
                      <Text color="gray.400" mb={6}>Episode {episode} membutuhkan {epCost} Koin Desa untuk dibuka.</Text>

                      <HStack bg="rgba(255,255,255,0.1)" px={4} py={2} borderRadius="full" mb={6}>
                          <Icon as={FaCoins} color={dracinTheme.accentGold} />
                          <Text color="white">Saldo Anda: <b>{userCoins}</b></Text>
                      </HStack>

                      <Button
                          size="lg" bg={dracinTheme.accentGold} color="black" _hover={{ bg: "yellow.500" }}
                          onClick={handleUnlock} isLoading={unlockLoading} w="full" leftIcon={<FaUnlock />}
                      >
                          Buka Episode ({epCost} Koin)
                      </Button>

                      <Button variant="ghost" color="gray.400" mt={4} onClick={() => navigate('/topup')}>
                          Top Up Koin
                      </Button>
                  </Center>
              ) : videoUrl ? (
                  <Box w="100%" h="100%" bg="black" position="relative">

                      <video
                          src={videoUrl}
                          autoPlay
                          controls
                          playsInline
                          onEnded={handleVideoEnded}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
                      />
                      {/* Next Episode Floating Button */}
                      <IconButton
                          icon={<FaStepForward />}
                          position="absolute" top="50%" right={4} transform="translateY(-50%)"
                          zIndex={10} colorScheme="red" isRound size="md"
                          onClick={handleNextEpisode}
                          aria-label="Next Episode"
                          boxShadow="0 0 10px rgba(0,0,0,0.5)"
                      />


                      {/* Autoplay Overlay */}
                      {autoplayCountdown !== null && (
                          <Center position="absolute" top={0} left={0} w="100%" h="100%" bg="rgba(0,0,0,0.7)" zIndex={10} flexDirection="column">
                              <Text color="white" fontSize="xl" mb={4}>Memutar episode selanjutnya...</Text>
                              <Text color={dracinTheme.accentRed} fontSize="5xl" fontWeight="bold" mb={6}>{autoplayCountdown}</Text>
                              <HStack spacing={4}>
                                  <Button colorScheme="red" onClick={handleNextEpisode}>Putar Sekarang</Button>
                                  <Button variant="outline" colorScheme="gray" color="white" onClick={() => setAutoplayCountdown(null)}>Batal</Button>
                              </HStack>
                          </Center>
                      )}
                  </Box>
              ) : (
                  <Center h="100%" w="100%" bg="black"><Text color="red.500">{error || "Video tidak ditemukan"}</Text></Center>
              )}

              {/* Floating Right Panel */}
              <VStack position="absolute" right={4} bottom={24} zIndex={10} spacing={6}>
                  <VStack spacing={1}>
                      <IconButton icon={<FaHeart />} isRound size="lg" bg="rgba(0,0,0,0.5)" color={isLiked ? "red.500" : "white"} _hover={{ bg: "rgba(0,0,0,0.8)", transform: "scale(1.1)" }} onClick={toggleLike} />
                      <Text color="white" fontSize="xs" textShadow="1px 1px 2px black">{isLiked ? 'Suka' : ''}</Text>
                  </VStack>
                  <VStack spacing={1}>
                      <IconButton icon={<FaBookmark />} isRound size="lg" bg="rgba(0,0,0,0.5)" color={isSaved ? dracinTheme.accentGold : "white"} _hover={{ bg: "rgba(0,0,0,0.8)", transform: "scale(1.1)" }} onClick={toggleSave} />
                      <Text color="white" fontSize="xs" textShadow="1px 1px 2px black">{isSaved ? 'Tersimpan' : ''}</Text>
                  </VStack>
                  <VStack spacing={1}>
                      <IconButton icon={<FaShareAlt />} isRound size="lg" bg="rgba(0,0,0,0.5)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }} onClick={handleShare} />
                      <Text color="white" fontSize="xs" textShadow="1px 1px 2px black">Bagikan</Text>
                  </VStack>
                  <VStack spacing={1}>
                      <IconButton icon={<FaListUl />} isRound size="lg" bg="rgba(0,0,0,0.5)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }} onClick={onOpen} />
                      <Text color="white" fontSize="xs" textShadow="1px 1px 2px black">Episode</Text>
                  </VStack>
              </VStack>

              {/* Bottom Info */}
              <Box position="absolute" bottom={4} left={4} right={16} zIndex={10}>
                  <Text color="white" fontWeight="bold" fontSize="lg" textShadow="1px 1px 2px black" noOfLines={1}>
                      {detailData ? detailData.title : 'Memuat...'}
                  </Text>
                  <Text color="gray.300" fontSize="sm" textShadow="1px 1px 2px black">
                      Episode {episode} {detailData?.total_episodes ? `/ ${detailData.total_episodes}` : ''}
                  </Text>
              </Box>
          </Box>
      </Center>

      {/* Episode Drawer */}
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={dracinTheme.bg} color="white" borderTopRadius="2xl" maxH="60vh">
          <DrawerHeader borderBottomWidth="1px" borderColor={dracinTheme.glassBorder}>Pilih Episode</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody py={4}>
            {detailData && (
                <Flex wrap="wrap" gap={3} justify="center">
                    {Array.from({ length: detailData.total_episodes || 0 }, (_, i) => {
                        const ep = i + 1;
                        const isFree = ep <= 3;
                        const unlocked = isFree || unlockedEps.includes(ep);
                        const isCurrent = ep === epNum;

                        return (
                            <Button
                                key={ep}
                                onClick={() => { onClose(); navigate(`/dracin/detail/${id}/${ep}/play`); }}
                                bg={isCurrent ? dracinTheme.accentRed : dracinTheme.cardBg}
                                color={isCurrent ? "white" : "gray.300"}
                                border={`1px solid ${unlocked ? (isCurrent ? 'transparent' : 'gray') : dracinTheme.accentGold}`}
                                _hover={{ bg: "whiteAlpha.300" }}
                                w="60px" h="60px"
                                position="relative"
                            >
                                {ep}
                                {!unlocked && <Icon as={FaLock} position="absolute" top={1} right={1} color={dracinTheme.accentGold} boxSize={3} />}
                            </Button>
                        );
                    })}
                </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default DracinWatch;
