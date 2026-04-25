import React, { useState, useEffect } from 'react';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import MainMenu from './MainMenu';
import DifficultySelect from './DifficultySelect';
import GameScreen from './GameScreen';

const GeoGuessrMain = ({ onFinish, partyCode, onAbort }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('menu'); // menu, mode_select, playing, lobby, leaderboard, avatar

  const [mapId, setMapId] = useState('ngawonggo');
  const [mode, setMode] = useState('single');
  const [difficulty, setDifficulty] = useState('easy');

  // Check trial
  const [hasPlayedTrial, setHasPlayedTrial] = useState(() => {
    return localStorage.getItem('geo_trial_used') === 'true';
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFinishGame = (result) => {
    if (!session) {
      localStorage.setItem('geo_trial_used', 'true');
      setHasPlayedTrial(true);
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
    <Box w="full" h="100vh">
      {screen === 'menu' && (
        <MainMenu
          setScreen={setScreen}
          setMap={setMapId}
          setMode={setMode}
          session={session}
          hasPlayedTrial={hasPlayedTrial}
          partyCode={partyCode}
        />
      )}
      {screen === 'mode_select' && (
        <DifficultySelect
          setDifficulty={setDifficulty}
          setScreen={setScreen}
        />
      )}
      {screen === 'playing' && (
        <GameScreen
          mapId={mapId}
          difficulty={difficulty}
          onFinishGame={handleFinishGame}
          setScreen={setScreen}
          mode={mode}
        />
      )}
    </Box>
  )
};

export default GeoGuessrMain;
