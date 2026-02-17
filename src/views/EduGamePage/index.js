import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Button,
  useColorModeValue,
  Flex,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FaGamepad, FaPuzzlePiece, FaQuestionCircle, FaNetworkWired } from 'react-icons/fa';
import QuizGame from './QuizGame';
import SortGame from './SortGame';
import NetworkGame from './NetworkGame';

const EduGamePage = () => {
  const [activeGame, setActiveGame] = useState(null);
  const bg = useColorModeValue('gray.50', 'gray.900');

  const games = [
    {
      id: 'network',
      title: 'Ngawonggo 2045: Jaringan Digital',
      desc: 'Misi menghubungkan infrastruktur digital desa untuk masa depan.',
      icon: FaNetworkWired,
      color: 'purple',
      highlight: true,
      component: <NetworkGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'quiz',
      title: 'Kuis Tekno-Sains',
      desc: 'Uji wawasanmu tentang dunia teknologi dan sains populer.',
      icon: FaQuestionCircle,
      color: 'blue',
      component: <QuizGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'sort',
      title: 'Sortir Digital',
      desc: 'Bedakan mana teknologi analog dan mana yang sudah digital.',
      icon: FaPuzzlePiece,
      color: 'orange',
      component: <SortGame onBack={() => setActiveGame(null)} />,
    },
  ];

  if (activeGame) {
    return (
      <Box minH="100vh" bg={bg} py={10}>
        <Container maxW="container.md">
          <Flex justify="center">
            {games.find(g => g.id === activeGame).component}
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg} py={16}>
      <Container maxW="container.xl">
        <VStack spacing={4} mb={12} textAlign="center">
          <Badge colorScheme="brand" p={2} borderRadius="full" px={4}>
            TEKNOLOGI & SAINS
          </Badge>
          <HStack spacing={4} justify="center">
            <Heading as="h1" size="2xl" color="brand.500">
              Game Edukasi Desa
            </Heading>
            <Badge colorScheme="red" variant="solid" borderRadius="full" px={3} py={1}>
              BETA / UJI COBA
            </Badge>
          </HStack>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Mari belajar teknologi dengan cara yang seru! Pilih permainan di bawah ini untuk memulai petualangan digitalmu.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {games.map((game) => (
            <Box
              key={game.id}
              bg="white"
              p={8}
              borderRadius="3xl"
              boxShadow="xl"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl' }}
              position="relative"
              overflow="hidden"
              border="1px solid"
              borderColor={game.highlight ? "purple.200" : "gray.100"}
            >
              {game.highlight && (
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme="purple"
                  variant="solid"
                  borderRadius="full"
                  px={3}
                >
                  Pilihan Utama
                </Badge>
              )}
              <VStack align="start" spacing={6}>
                <Box p={4} bg={`${game.color}.50`} borderRadius="2xl">
                  <Icon as={game.icon} w={10} h={10} color={`${game.color}.500`} />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md">{game.title}</Heading>
                  <Text color="gray.600">{game.desc}</Text>
                </VStack>
                <Button
                  w="full"
                  colorScheme={game.color}
                  size="lg"
                  borderRadius="xl"
                  onClick={() => setActiveGame(game.id)}
                  leftIcon={<FaGamepad />}
                >
                  Main Sekarang
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default EduGamePage;
