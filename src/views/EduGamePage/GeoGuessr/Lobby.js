import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, HStack, Avatar, Spinner, Center, useColorModeValue, useToast, Badge } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { FaPlay, FaCopy, FaTimes } from 'react-icons/fa';

const Lobby = ({ session, partyCode, mapId, mode, difficulty, setScreen, isHost, setPartyCode }) => {
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const toast = useToast();

  useEffect(() => {
    if (!session) return;

    let matchId = null;

    const setupLobby = async () => {
      if (isHost && !partyCode) {
        // Create new match
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setPartyCode(code);

        const { data, error } = await supabase.from('geo_matches').insert({
          host_id: session.user.id,
          party_code: code,
          map_id: mapId,
          mode: mode,
          difficulty: difficulty,
          status: 'waiting'
        }).select().single();

        if (error) {
          toast({ title: 'Gagal membuat lobby', status: 'error' });
          setScreen('menu');
          return;
        }
        matchId = data.id;
        setMatch(data);

        // Add self as player
        await supabase.from('geo_players').insert({
          match_id: matchId,
          user_id: session.user.id
        });
      } else if (partyCode) {
        // Join existing
        const { data, error } = await supabase.from('geo_matches')
          .select('*')
          .eq('party_code', partyCode)
          .single();

        if (error || !data) {
          toast({ title: 'Party tidak ditemukan', status: 'error' });
          setScreen('menu');
          return;
        }

        matchId = data.id;
        setMatch(data);

        // Add self
        await supabase.from('geo_players').upsert({
          match_id: matchId,
          user_id: session.user.id
        });
      }

      fetchPlayers(matchId);
      setLoading(false);
    };

    const fetchPlayers = async (mId) => {
      const { data } = await supabase
        .from('geo_players')
        .select(`
          user_id, status, score,
          geo_profiles (username, avatar_url, level)
        `)
        .eq('match_id', mId);
      if (data) setPlayers(data);
    };

    setupLobby();

    // Subscribe to changes
    const channel = supabase.channel('match_lobby')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'geo_players' }, payload => {
        if (payload.new.match_id === matchId) {
          fetchPlayers(matchId);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'geo_matches', filter: `id=eq.${matchId}` }, payload => {
        if (payload.new.status === 'playing') {
          setScreen('playing');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, isHost, partyCode, mapId, mode, difficulty, setPartyCode, setScreen, toast]);

  const handleStart = async () => {
    if (!isHost) return;
    await supabase.from('geo_matches').update({ status: 'playing' }).eq('id', match.id);
  };

  const handleLeave = async () => {
    if (match) {
      await supabase.from('geo_players').delete().match({ match_id: match.id, user_id: session.user.id });
      // If host, maybe delete match? (simplified for now)
    }
    setScreen('menu');
  };

  if (loading || !match) {
    return (
      <Center h="full" bg={bg}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box w="full" h="full" bg={bg} color="white" p={{ base: 4, md: 8 }} display="flex" flexDir="column" alignItems="center" justifyContent="center">
      <VStack spacing={8} bg={cardBg} p={8} borderRadius="xl" shadow="2xl" w="full" maxW="lg">
        <Heading size="lg">Multiplayer Lobby</Heading>

        <VStack spacing={2} bg="gray.900" p={4} borderRadius="md" w="full" position="relative">
          <Text fontSize="sm" color="gray.400">Party Code</Text>
          <Heading size="xl" letterSpacing="widest" color="teal.300">{match.party_code}</Heading>
          <Button
            size="sm"
            position="absolute"
            right={4}
            top={4}
            leftIcon={<FaCopy />}
            onClick={() => {
              navigator.clipboard.writeText(match.party_code);
              toast({ title: 'Disalin!', status: 'success', duration: 2000 });
            }}
          >
            Copy
          </Button>
          <Text fontSize="xs" mt={2} color="gray.500">Mode: {match.mode} | Map: {match.map_id}</Text>
        </VStack>

        <Box w="full">
          <Text fontWeight="bold" mb={4}>Players ({players.length})</Text>
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto" pr={2}>
            {players.map(p => (
              <HStack key={p.user_id} bg="gray.800" p={3} borderRadius="md" justify="space-between">
                <HStack>
                  <Avatar size="sm" src={p.geo_profiles?.avatar_url} name={p.geo_profiles?.username} />
                  <Text>{p.geo_profiles?.username || 'Player'}</Text>
                </HStack>
                {p.user_id === match.host_id && <Badge colorScheme="yellow">Host</Badge>}
              </HStack>
            ))}
          </VStack>
        </Box>

        <HStack w="full" spacing={4}>
          <Button flex={1} colorScheme="red" variant="outline" leftIcon={<FaTimes />} onClick={handleLeave}>
            Keluar
          </Button>
          {isHost ? (
            <Button flex={2} colorScheme="teal" leftIcon={<FaPlay />} onClick={handleStart} isDisabled={players.length < 1}>
              Mulai Game
            </Button>
          ) : (
            <Button flex={2} colorScheme="teal" isLoading loadingText="Menunggu Host...">
              Menunggu Host
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Lobby;
