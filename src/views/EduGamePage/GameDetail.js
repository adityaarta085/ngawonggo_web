import React, { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Badge,
  Flex,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaGamepad, FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa';
import { gamesData } from './GamesData';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = useMemo(() => gamesData.find(g => g.id === id), [id]);

  if (!game) {
    return <Navigate to="/game" replace />;
  }

  return (
    <Box py={10} position="relative">
      <Container maxW="container.md">
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={8}
          onClick={() => navigate('/game')}
          fontWeight="800"
        >
          Kembali ke Katalog
        </Button>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          bg="white" _dark={{ bg: "gray.800" }}
          p={{ base: 6, md: 10 }}
          borderRadius="3xl"
          boxShadow="xl"
          borderTop="8px solid"
          borderColor={`${game.color}.500`}
        >
          <Flex direction={{ base: 'column', md: 'row' }} gap={8} mb={8}>
            <Flex
              w={24}
              h={24}
              bg={`${game.color}.50`}
              color={`${game.color}.500`}
              borderRadius="2xl"
              align="center"
              justify="center"
              boxShadow="sm"
              flexShrink={0}
            >
              <Icon as={game.icon} w={12} h={12} />
            </Flex>

            <VStack align="start" spacing={3}>
              <HStack spacing={3}>
                <Badge colorScheme="gray" borderRadius="full" px={3}>{game.category}</Badge>
                <Badge colorScheme={game.difficulty === 'Mudah' ? 'green' : 'orange'} borderRadius="full" px={3}>{game.difficulty}</Badge>
              </HStack>
              <Heading size="xl" fontWeight="900" color="gray.800" _dark={{ color: "white" }}>{game.title}</Heading>
              <Text color="gray.600" fontSize="md" lineHeight="tall">{game.longDesc}</Text>
            </VStack>
          </Flex>

          <Box bg="gray.50" _dark={{ bg: "gray.900" }} p={6} borderRadius="2xl" mb={8}>
            <Heading size="sm" mb={4} color="gray.700" display="flex" alignItems="center" gap={2}>
              <Icon as={FaCheckCircle} color="brand.500" /> Cara Bermain:
            </Heading>
            <List spacing={3}>
              {game.howToPlay.map((step, idx) => (
                <ListItem key={idx} display="flex" alignItems="flex-start" color="gray.600">
                  <ListIcon as={FaStar} color="yellow.400" mt={1} />
                  <Text>{step}</Text>
                </ListItem>
              ))}
            </List>
          </Box>

          <Button
            w="full"
            colorScheme={game.color}
            size="xl"
            borderRadius="2xl"
            onClick={() => navigate(`/game/play/${game.id}`)}
            leftIcon={<FaGamepad />}
            height="70px"
            fontSize="xl"
            boxShadow="md"
            _hover={{ transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            Mulai Permainan
          </Button>

        </MotionBox>
      </Container>
    </Box>
  );
};

export default GameDetail;
