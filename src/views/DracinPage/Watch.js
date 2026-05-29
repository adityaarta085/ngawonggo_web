import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Text, Center, Flex, Button, IconButton, useToast, VStack, HStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, Icon
} from '@chakra-ui/react';
import { FaArrowLeft, FaShareAlt, FaListUl, FaLock, FaCoins, FaUnlock, FaStepForward, FaStepBackward, FaPlay, FaPause } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';
import { supabase } from '../../lib/supabase';
import { dracinTheme } from './theme';
import Confetti from 'react-confetti';
import { DracinLoader } from './components/DracinLoader';
import ReactPlayer from "react-player";

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
  const [unlockedEps, setUnlockedEps] = useState([]);

  const [autoplayCountdown, setAutoplayCountdown] = useState(null);

  // Custom Controls State
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

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

    loadEpisode();

    return () => { mounted = false; };
  }, [navigate, id, episode, epNum]);

  const handleNextEpisode = React.useCallback(() => {
      if (detailData && epNum < (detailData.totalEpisodes || detailData.total_episodes)) {
          navigate(`/dracin/detail/${id}/${epNum + 1}/play`);
      }
  }, [navigate, id, epNum, detailData]);

  useEffect(() => {
      let timer;
      if (autoplayCountdown !== null && autoplayCountdown > 0) {
          timer = setTimeout(() => setAutoplayCountdown(autoplayCountdown - 1), 1000);
      } else if (autoplayCountdown === 0) {
          handleNextEpisode();
      }
      return () => clearTimeout(timer);
  }, [autoplayCountdown, handleNextEpisode]);



  const handlePrevEpisode = React.useCallback(() => {
      if (epNum > 1) {
          navigate(`/dracin/detail/${id}/${epNum - 1}/play`);
      }
  }, [navigate, id, epNum]);

  const handleVideoEnded = () => {
      if (detailData && epNum < (detailData.totalEpisodes || detailData.total_episodes)) {
          setAutoplayCountdown(5);
      }
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

  // Custom Controls Logic
  const handleScreenTap = () => {
      if (isLocked || autoplayCountdown !== null) return;
      setShowControls(prev => !prev);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (!showControls) {
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      }
  };

  const togglePlayPause = (e) => {
      e.stopPropagation();
      setIsPlaying(!isPlaying);
      // Reset controls hide timer
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };


  if (loading) return <Box h="100vh" w="100vw" position="fixed" zIndex={9999} bg="black"><DracinLoader /></Box>;

  return (
    <Box h="100vh" w="100vw" bg="black" position="fixed" top={0} left={0} zIndex={9999} overflow="hidden">
      <SEO title={`Eps ${episode} - Dracin`} />
      {showConfetti && <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={99999} pointerEvents="none"><Confetti recycle={false} numberOfPieces={300} /></Box>}

      <Box h="100%" w="100%" position="relative" onClick={handleScreenTap}>

          {/* Top Back Button (Always visible or visible with controls depending on pref, making it visible with controls is cleaner) */}
          <Box position="absolute" top={4} left={4} zIndex={20} opacity={showControls || isLocked ? 1 : 0} transition="opacity 0.3s">
              <IconButton
                  icon={<FaArrowLeft />}
                  onClick={(e) => { e.stopPropagation(); navigate(`/dracin/detail/${id}`); }}
                  bg="rgba(0,0,0,0.5)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }}
                  isRound
                  size="lg"
                  aria-label="Kembali"
              />
          </Box>

          {isLocked ? (
              <Center h="100%" w="100%" bg="rgba(0,0,0,0.85)" flexDirection="column" p={6} textAlign="center" zIndex={10} position="absolute" top={0}>
                  <Icon as={FaLock} boxSize={16} color={dracinTheme.accentGold} mb={6} />
                  <Text color="white" fontSize="2xl" fontWeight="bold" mb={2}>Episode Terkunci</Text>
                  <Text color="gray.400" mb={8} fontSize="lg">Episode {episode} membutuhkan {epCost} Koin Desa.</Text>

                  <HStack bg="rgba(255,255,255,0.1)" px={6} py={3} borderRadius="full" mb={8} border={`1px solid ${dracinTheme.accentGold}`}>
                      <Icon as={FaCoins} color={dracinTheme.accentGold} boxSize={5} />
                      <Text color="white" fontSize="lg">Saldo Anda: <b>{userCoins}</b></Text>
                  </HStack>

                  <Button
                      size="lg" bg={dracinTheme.accentGold} color="black" _hover={{ bg: "yellow.500" }}
                      onClick={handleUnlock} isLoading={unlockLoading} w="full" maxW="300px" leftIcon={<FaUnlock />}
                      height="60px" fontSize="lg"
                  >
                      Buka ({epCost} Koin)
                  </Button>

                  <Button variant="ghost" color="gray.400" mt={4} onClick={() => navigate('/topup')} size="lg">
                      Top Up Koin
                  </Button>
              </Center>
          ) : videoUrl ? (
              <Box w="100%" h="100%" bg="black" position="relative">
                  <ReactPlayer
                      ref={videoRef}
                      url={videoUrl}
                      playing={isPlaying}
                      controls={false}
                      playsinline={true}
                      width="100%"
                      height="100%"
                      onEnded={handleVideoEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                      config={{ file: { attributes: { style: { objectFit: 'contain', width: '100%', height: '100%' } } } }}
                  />

                  {/* Custom Controls Overlay */}
                  <Center
                      position="absolute" top={0} left={0} w="100%" h="100%"
                      bg="rgba(0,0,0,0.4)" zIndex={10}
                      opacity={showControls ? 1 : 0}
                      transition="opacity 0.3s"
                      pointerEvents={showControls ? 'auto' : 'none'}
                  >
                      <HStack spacing={8}>
                          <IconButton
                              icon={<FaStepBackward />}
                              isRound size="lg" boxSize="60px" fontSize="24px"
                              bg="rgba(0,0,0,0.6)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)", transform: "scale(1.1)" }}
                              onClick={(e) => { e.stopPropagation(); handlePrevEpisode(); }}
                              isDisabled={epNum <= 1}
                              aria-label="Previous Episode"
                          />
                          <IconButton
                              icon={isPlaying ? <FaPause /> : <FaPlay />}
                              isRound size="lg" boxSize="80px" fontSize="32px"
                              bg="rgba(229,9,20,0.8)" color="white" _hover={{ bg: "red.600", transform: "scale(1.1)" }}
                              onClick={togglePlayPause}
                              aria-label="Play Pause"
                          />
                          <IconButton
                              icon={<FaStepForward />}
                              isRound size="lg" boxSize="60px" fontSize="24px"
                              bg="rgba(0,0,0,0.6)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)", transform: "scale(1.1)" }}
                              onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                              isDisabled={!detailData || epNum >= (detailData.totalEpisodes || detailData.total_episodes)}
                              aria-label="Next Episode"
                          />
                      </HStack>
                  </Center>

                  {/* Right Panel Actions */}
                  <VStack
                      position="absolute" right={4} bottom="20%" zIndex={15} spacing={6}
                      opacity={showControls ? 1 : 0} transition="opacity 0.3s" pointerEvents={showControls ? 'auto' : 'none'}
                  >
                      <VStack spacing={1}>
                          <IconButton icon={<FaShareAlt />} isRound size="lg" bg="rgba(0,0,0,0.6)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }} onClick={(e) => { e.stopPropagation(); handleShare(); }} />
                          <Text color="white" fontSize="xs" textShadow="1px 1px 2px black" fontWeight="bold">Bagikan</Text>
                      </VStack>
                      <VStack spacing={1}>
                          <IconButton icon={<FaListUl />} isRound size="lg" bg="rgba(0,0,0,0.6)" color="white" _hover={{ bg: "rgba(0,0,0,0.8)" }} onClick={(e) => { e.stopPropagation(); onOpen(); }} />
                          <Text color="white" fontSize="xs" textShadow="1px 1px 2px black" fontWeight="bold">Episode</Text>
                      </VStack>
                  </VStack>

                  {/* Bottom Info */}
                  <Box position="absolute" bottom={8} left={4} right={16} zIndex={15} opacity={showControls ? 1 : 0} transition="opacity 0.3s">
                      <Text color="white" fontWeight="bold" fontSize="xl" textShadow="1px 1px 4px black" noOfLines={2} mb={1}>
                          {detailData ? detailData.title : 'Memuat...'}
                      </Text>
                      <Text color={dracinTheme.accentGold} fontSize="md" fontWeight="bold" textShadow="1px 1px 4px black">
                          Episode {episode} {detailData?.total_episodes ? `/ ${(detailData.totalEpisodes || detailData.total_episodes)}` : ''}
                      </Text>
                  </Box>

                  {/* Autoplay Overlay */}
                  {autoplayCountdown !== null && (
                      <Center position="absolute" top={0} left={0} w="100%" h="100%" bg="rgba(0,0,0,0.85)" zIndex={20} flexDirection="column" onClick={(e) => e.stopPropagation()}>
                          <Text color="white" fontSize="2xl" mb={4}>Episode Selanjutnya...</Text>
                          <Text color={dracinTheme.accentRed} fontSize="7xl" fontWeight="bold" mb={8}>{autoplayCountdown}</Text>
                          <HStack spacing={6}>
                              <Button colorScheme="red" size="lg" onClick={handleNextEpisode}>Putar Sekarang</Button>
                              <Button variant="outline" colorScheme="gray" color="white" size="lg" onClick={() => setAutoplayCountdown(null)}>Batal</Button>
                          </HStack>
                      </Center>
                  )}
              </Box>
          ) : (
              <Center h="100%" w="100%" bg="black"><Text color="red.500">{error || "Video tidak ditemukan"}</Text></Center>
          )}

      </Box>

      {/* Episode Drawer */}
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={dracinTheme.bg} color="white" borderTopRadius="2xl" maxH="60vh">
          <DrawerHeader borderBottomWidth="1px" borderColor={dracinTheme.glassBorder}>Pilih Episode</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody py={6}>
            {detailData && (
                <Flex wrap="wrap" gap={3} justify="center">
                    {Array.from({ length: (detailData.totalEpisodes || detailData.total_episodes) || 0 }, (_, i) => {
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
