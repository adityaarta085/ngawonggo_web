import React, { useState, useEffect } from 'react';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import MainMenu from './MainMenu';
import DifficultySelect from './DifficultySelect';
import GameScreen from './GameScreen';
import Lobby from './Lobby';
import AvatarCustomization from './AvatarCustomization';
import Leaderboard from './Leaderboard';

const GeoGuessrMain = ({ onFinish, partyCode: initialPartyCode, onAbort }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('menu'); // menu, mode_select, playing, lobby, leaderboard, avatar

  const [mapId, setMapId] = useState('ngawonggo');
  const [mode, setMode] = useState('Classic');
  const [difficulty, setDifficulty] = useState('easy');

  const [isHost, setIsHost] = useState(true);
  const [partyCode, setPartyCode] = useState(initialPartyCode || '');

  // Check trial
  const [hasPlayedTrial, setHasPlayedTrial] = useState(() => {
    return localStorage.getItem('geo_trial_used') === 'true';
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Deep link logic
      if (initialPartyCode) {
        if (!session) {
          alert("Silakan login untuk bergabung ke Party!");
        } else {
          setIsHost(false);
          setPartyCode(initialPartyCode);
          setScreen('lobby');
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [initialPartyCode]);

  const handleFinishGame = async (result) => {
    if (!session) {
      localStorage.setItem('geo_trial_used', 'true');
      setHasPlayedTrial(true);
    } else {
      // Add XP to profile
      const { data } = await supabase.from('geo_profiles').select('xp, total_matches, level').eq('id', session.user.id).single();
      if (data) {
        const newXp = data.xp + result.score;
        const newMatches = data.total_matches + 1;
        const newLevel = Math.floor(newXp / 10000) + 1;
        await supabase.from('geo_profiles').update({ xp: newXp, total_matches: newMatches, level: newLevel }).eq('id', session.user.id);
      }
    }
    onFinish(result);
  };

  if (loading) {
    return (
      <Center h="100vh" bg="gray.900" color="white">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box w="full" h="100vh" overflow="hidden">
      {screen === 'menu' && (
        <MainMenu
          setScreen={setScreen}
          setMap={setMapId}
          setMode={setMode}
          session={session}
          hasPlayedTrial={hasPlayedTrial}
          setIsHost={setIsHost}
          setPartyCode={setPartyCode}
        />
      )}
      {screen === 'mode_select' && (
        <DifficultySelect
          setDifficulty={setDifficulty}
          setScreen={setScreen}
          nextScreen="playing"
        />
      )}
      {screen === 'mode_select_multi' && (
        <DifficultySelect
          setDifficulty={setDifficulty}
          setScreen={setScreen}
          nextScreen="lobby"
        />
      )}
      {screen === 'lobby' && (
        <Lobby
          session={session}
          partyCode={partyCode}
          setPartyCode={setPartyCode}
          mapId={mapId}
          mode={mode}
          difficulty={difficulty}
          setScreen={setScreen}
          isHost={isHost}
        />
      )}
      {screen === 'playing' && (
        <GameScreen
          mapId={mapId}
          difficulty={difficulty}
          onFinishGame={handleFinishGame}
        />
      )}
      {screen === 'avatar' && (
        <AvatarCustomization session={session} setScreen={setScreen} />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard setScreen={setScreen} />
      )}
    </Box>
  )
};

export default GeoGuessrMain;
