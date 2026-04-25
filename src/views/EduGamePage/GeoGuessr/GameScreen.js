import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, Spinner, Center, HStack, Heading } from '@chakra-ui/react';
import { getRandomLocation, mapData } from './data';
import PanoramaViewer from './PanoramaViewer';
import MiniMap from './MiniMap';
import { supabase } from '../../../lib/supabase';

const MAX_ROUNDS = 5;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) { return deg * (Math.PI / 180); }

const GameScreen = ({ mapId, difficulty, onFinishGame, mode, session, partyCode }) => {
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const [guess, setGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [distance, setDistance] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);

  // Multiplayer state
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [matchId, setMatchId] = useState(null);
  const syncInterval = useRef(null);
  const guessRef = useRef(null); // Keep ref for interval

  useEffect(() => {
    // Sync guess Ref
    guessRef.current = guess;
  }, [guess]);

  useEffect(() => {
    setLoadingLoc(true);
    setGuess(null);
    setShowResult(false);

    // Pick from predefined 360 data
    const loc = getRandomLocation(mapId);
    setTargetLocation(loc);
    setLoadingLoc(false);
  }, [round, mapId]);

  useEffect(() => {
      if (mode !== 'single' && session && partyCode) {
          // Setup Realtime Sync
          const setupMultiplayer = async () => {
              const { data } = await supabase.from('geo_matches').select('id').eq('party_code', partyCode).single();
              if (data) {
                  setMatchId(data.id);

                  // Initial fetch
                  const fetchOthers = async () => {
                      const { data: players } = await supabase.from('geo_players').select('*').eq('match_id', data.id).neq('user_id', session.user.id);
                      if (players) setOtherPlayers(players);
                  };
                  fetchOthers();

                  // Sync loop every 1 second
                  syncInterval.current = setInterval(async () => {
                      if (guessRef.current && !showResult) {
                          await supabase.from('geo_players').update({
                              guess_lat: guessRef.current.lat,
                              guess_lng: guessRef.current.lng
                          }).eq('match_id', data.id).eq('user_id', session.user.id);
                      }
                  }, 1000);

                  // Subscribe to others
                  const channel = supabase.channel(`match_${data.id}`)
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'geo_players', filter: `match_id=eq.${data.id}` }, payload => {
                        if (payload.new.user_id !== session.user.id) {
                            setOtherPlayers(prev => {
                                const idx = prev.findIndex(p => p.user_id === payload.new.user_id);
                                if (idx >= 0) {
                                    const next = [...prev];
                                    next[idx] = payload.new;
                                    return next;
                                } else {
                                    return [...prev, payload.new];
                                }
                            });
                        }
                    })
                    .subscribe();

                  return () => {
                      clearInterval(syncInterval.current);
                      supabase.removeChannel(channel);
                  };
              }
          };
          setupMultiplayer();
      }
      return () => {
          if (syncInterval.current) clearInterval(syncInterval.current);
      };
  }, [mode, session, partyCode, showResult]);

  const handleMapClick = (g) => {
    if (!showResult) {
      setGuess(g);
    }
  };

  const handleGuess = async () => {
    if (!guess || !targetLocation) return;
    const dist = getDistanceFromLatLonInKm(targetLocation.lat, targetLocation.lng, guess.lat, guess.lng);
    setDistance(dist);

    const maxDist = mapData[mapId].maxDistance || 50;
    let s = Math.max(0, Math.floor(5000 * (1 - (dist / maxDist))));
    if (dist < (maxDist * 0.05)) s = 5000;

    setRoundScore(s);
    setTotalScore(prev => prev + s);
    setShowResult(true);

    if (matchId && session) {
         await supabase.from('geo_players').update({
              score: totalScore + s,
              status: 'ready' // indicate round done
          }).eq('match_id', matchId).eq('user_id', session.user.id);
    }
  };

  const nextRound = () => {
    if (round >= MAX_ROUNDS) {
        onFinishGame({ score: totalScore, maxScore: MAX_ROUNDS * 5000, message: "Game Selesai! Skor Total: " + totalScore });
    } else {
        setRound(r => r + 1);
    }
  };

  const center = mapData[mapId]?.center || mapData['ngawonggo'].center;

  return (
    <Box w="full" h="full" position="relative" bg="gray.900">
        {loadingLoc ? (
            <Center h="full" w="full" position="absolute" zIndex={20} bg="rgba(0,0,0,0.8)" color="white" flexDir="column">
                <Spinner size="xl" color="teal.500" mb={4} />
                <Text>Memuat Panorama...</Text>
            </Center>
        ) : null}

        {/* HUD */}
        <HStack position="absolute" top={4} left={4} zIndex={10} bg="rgba(0,0,0,0.6)" color="white" p={3} borderRadius="md" spacing={6}>
            <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.400">Round</Text>
                <Heading size="md">{round} / {MAX_ROUNDS}</Heading>
            </VStack>
            <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.400">Total Score</Text>
                <Heading size="md" color="teal.300">{totalScore}</Heading>
            </VStack>
            {mode !== 'single' && (
                <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.400">Players</Text>
                    <Heading size="md" color="purple.300">{otherPlayers.length + 1}</Heading>
                </VStack>
            )}
        </HStack>

        {/* 360 Panorama Viewer */}
        <Box w="full" h="full" position="absolute" top={0} left={0} zIndex={1}>
          {targetLocation && (
              <PanoramaViewer url={targetLocation.pano} difficulty={difficulty} />
          )}
        </Box>

        {/* Mini Map Overlay */}
        {targetLocation && (
            <Box
                position="absolute"
                bottom={{base: 4, md: 8}}
                right={{base: 4, md: 8}}
                zIndex={10}
                bg="rgba(0,0,0,0.5)"
                p={2}
                borderRadius="md"
                transition="all 0.3s"
                _hover={!showResult ? { transform: {md: 'scale(1.5)'}, transformOrigin: 'bottom right' } : {}}
            >
            <MiniMap
                isExpanded={showResult}
                center={showResult ? center : (guess || center)}
                zoom={showResult ? (mapId === 'jateng' ? 7 : 10) : 11}
                onGuess={handleMapClick}
                showResult={showResult}
                targetLocation={targetLocation}
                guess={guess}
                otherPlayers={otherPlayers}
            />

            {!showResult ? (
                <Button mt={2} w="full" colorScheme="teal" onClick={handleGuess} isDisabled={!guess || loadingLoc}>Tebak Lokasi</Button>
            ) : (
                <VStack mt={2} bg="gray.800" p={4} borderRadius="md" color="white">
                    <Text>Jarak: {distance.toFixed(2)} km</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="teal.300">Skor: +{roundScore}</Text>
                    <Button colorScheme="blue" onClick={nextRound} w="full">
                        {round >= MAX_ROUNDS ? 'Lihat Hasil Akhir' : 'Lanjut Ronde Berikutnya'}
                    </Button>
                </VStack>
            )}
            </Box>
        )}
    </Box>
  );
};

export default GameScreen;
