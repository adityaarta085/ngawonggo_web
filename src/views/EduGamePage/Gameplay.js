import React, { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Box, Container, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { gamesData } from './GamesData';

// Import game components
import NetworkGame from './NetworkGame';
import QuizGame from './QuizGame';
import SortGame from './SortGame';
import Object3DGame from './3DObjectGame';

const Gameplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = useMemo(() => gamesData.find(g => g.id === id), [id]);

  if (!game) {
    return <Navigate to="/game" replace />;
  }

  const handleGameFinish = (result) => {
    // result expected to be an object: { score, maxScore, message }
    // Pass the state to the result page
    navigate(`/game/result/${id}`, { state: { result } });
  };

  const handleAbort = () => {
    if(window.confirm('Keluar dari permainan? Progress tidak akan disimpan.')) {
        navigate(`/game/${id}`);
    }
  };

  const renderGame = () => {
    switch (id) {
      case 'network':
        return <NetworkGame onFinish={handleGameFinish} />;
      case 'quiz':
        return <QuizGame onFinish={handleGameFinish} />;
      case 'sort':
        return <SortGame onFinish={handleGameFinish} />;
      case '3d-object':
        return <Object3DGame onFinish={handleGameFinish} />;
      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" position="relative" py={8} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Tooltip label="Keluar Permainan" placement="right">
        <IconButton
          icon={<FaTimes />}
          position="absolute"
          top={6}
          left={6}
          colorScheme="whiteAlpha"
          variant="solid"
          isRound
          onClick={handleAbort}
          aria-label="Abort Game"
        />
      </Tooltip>

      <Container maxW="container.lg">
        <Flex justify="center" w="full">
            {renderGame()}
        </Flex>
      </Container>
    </Box>
  );
};

export default Gameplay;
