import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Icon,
  Badge,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { FaTrophy, FaRedo, FaHome, FaStar } from 'react-icons/fa';
import { gamesData } from './GamesData';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const MotionBox = motion(Box);

const GameResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(true);

  const game = useMemo(() => gamesData.find(g => g.id === id), [id]);
  const result = location.state?.result;

  useEffect(() => {
    // Save to database
    const saveScore = async () => {
      if (!result || !game) {
        setIsSaving(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_game_scores').insert([{
            user_id: user.id,
            game_name: game.title,
            score: result.score
          }]);
        }
      } catch (err) {
        console.error('Failed to save score:', err);
      } finally {
        setIsSaving(false);
      }
    };

    saveScore();
  }, [result, game]);

  if (!game || !result) {
    return <Navigate to="/game" replace />;
  }

  const { score, maxScore, message } = result;
  const percentage = Math.round((score / maxScore) * 100) || 0;

  let feedbackColor = 'brand';
  let feedbackMessage = 'Bagus Sekali!';

  if (percentage === 100) {
    feedbackColor = 'green';
    feedbackMessage = 'Sempurna! Luar Biasa!';
  } else if (percentage < 50) {
    feedbackColor = 'orange';
    feedbackMessage = 'Terus Berlatih!';
  }

  return (
    <Box py={10} position="relative" minH="80vh" display="flex" alignItems="center">
      <Container maxW="container.md">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          bg="white"
          p={{ base: 8, md: 12 }}
          borderRadius="3xl"
          boxShadow="2xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Icon as={percentage === 100 ? FaTrophy : FaStar} w={20} h={20} color={`${feedbackColor}.400`} />

            <Heading size="2xl" color="gray.800">Permainan Selesai</Heading>

            <Badge colorScheme={feedbackColor} fontSize="md" px={4} py={1} borderRadius="full">
              {feedbackMessage}
            </Badge>

            <Box position="relative" py={6}>
              <CircularProgress value={percentage} color={`${game.color}.500`} size="200px" thickness="8px">
                <CircularProgressLabel>
                  <VStack spacing={0}>
                    <Text fontSize="4xl" fontWeight="900" color="gray.800">{score}</Text>
                    <Text fontSize="sm" color="gray.500">/ {maxScore}</Text>
                  </VStack>
                </CircularProgressLabel>
              </CircularProgress>
            </Box>

            {message && (
              <Text fontSize="lg" color="gray.600" fontStyle="italic" bg="gray.50" p={4} borderRadius="xl" w="full">
                "{message}"
              </Text>
            )}

            <Text fontSize="sm" color={isSaving ? 'gray.500' : 'green.500'} fontWeight="bold">
              {isSaving ? 'Menyimpan skor...' : '✓ Skor telah disimpan ke Portal'}
            </Text>

            <Flex gap={4} w="full" pt={4} direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex={1}
                size="lg"
                colorScheme={game.color}
                leftIcon={<FaRedo />}
                onClick={() => navigate(`/game/play/${game.id}`)}
                borderRadius="xl"
              >
                Main Lagi
              </Button>
              <Button
                flex={1}
                size="lg"
                variant="outline"
                leftIcon={<FaHome />}
                onClick={() => navigate('/game')}
                borderRadius="xl"
              >
                Menu Utama
              </Button>
            </Flex>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default GameResult;
