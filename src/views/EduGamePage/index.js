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
  Badge,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaGamepad, FaNetworkWired, FaQuestionCircle, FaPuzzlePiece, FaArrowLeft, FaBrain } from 'react-icons/fa';
import NetworkGame from './NetworkGame';
import QuizGame from './QuizGame';
import SortGame from './SortGame';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const EduGamePage = () => {
  const [activeGame, setActiveGame] = useState(null);
  const bg = useColorModeValue('gray.50', 'gray.900');

  const games = [
    {
      id: 'network',
      title: 'Labirin Jaringan',
      desc: 'Hubungkan semua titik komputer dalam desa untuk menciptakan jaringan internet yang stabil.',
      icon: FaNetworkWired,
      color: 'purple',
      highlight: true,
      component: <NetworkGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'quiz',
      title: 'Kuis Tekno-Sains',
      desc: 'Uji wawasanmu tentang dunia teknologi, sains populer, dan digitalisasi desa.',
      icon: FaQuestionCircle,
      color: 'blue',
      component: <QuizGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'sort',
      title: 'Sortir Digital',
      desc: 'Latih kecepatanmu membedakan antara perangkat teknologi analog dan digital.',
      icon: FaPuzzlePiece,
      color: 'orange',
      component: <SortGame onBack={() => setActiveGame(null)} />,
    },
  ];

  if (activeGame) {
    return (
      <Box  pt={{ base: "130px", md: "160px" }} minH="100vh" bg={bg} py={10} position="relative">
        <Container maxW="container.lg">
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            mb={8}
            onClick={() => setActiveGame(null)}
            fontWeight="800"
          >
            Kembali ke Menu Game
          </Button>
          <Flex justify="center">
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeGame}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                w="full"
              >
                {games.find(g => g.id === activeGame).component}
              </MotionBox>
            </AnimatePresence>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg} py={12} position="relative" overflow="hidden">
      {/* Background Decor */}
      <Box position="absolute" top="-10%" left="-10%" w="40%" h="40%" bg="brand.100" opacity={0.3} filter="blur(120px)" borderRadius="full" />
      <Box position="absolute" bottom="-10%" right="-10%" w="30%" h="30%" bg="purple.100" opacity={0.3} filter="blur(100px)" borderRadius="full" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={6} mb={16} textAlign="center">
          <Flex align="center" gap={3} mb={2}>
            <Icon as={FaBrain} color="brand.500" w={8} h={8} />
            <Badge colorScheme="brand" p={2} borderRadius="full" px={6} fontSize="xs" fontWeight="900" letterSpacing="widest">
                PUSAT EDUKASI DIGITAL
            </Badge>
          </Flex>
          <Heading as="h1" size="3xl" fontWeight="900" bgGradient="linear(to-r, brand.600, purple.600)" bgClip="text">
            Game Edukasi Ngawonggo
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" fontWeight="500">
            Mari asah kemampuan digitalmu melalui serangkaian permainan seru yang dirancang khusus untuk meningkatkan literasi teknologi warga.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {games.map((game, index) => (
            <MotionBox
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
              bg="white"
              p={10}
              borderRadius="3xl"
              boxShadow="soft"
              _hover={{ transform: 'translateY(-15px)', boxShadow: 'strong' }}
              position="relative"
              overflow="hidden"
              border="1px solid"
              borderColor={game.highlight ? "purple.100" : "gray.100"}
              display="flex"
              flexDirection="column"
            >
              {game.highlight && (
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  bg="purple.500"
                  color="white"
                  px={6}
                  py={1}
                  borderBottomLeftRadius="2xl"
                  fontSize="xs"
                  fontWeight="900"
                  letterSpacing="wider"
                >
                  POPULER
                </Box>
              )}
              <VStack align="start" spacing={8} flex={1}>
                <Flex w={20} h={20} bg={`${game.color}.50`} color={`${game.color}.500`} borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                  <Icon as={game.icon} w={10} h={10} />
                </Flex>
                <VStack align="start" spacing={3}>
                  <Heading size="lg" fontWeight="900" color="gray.800">{game.title}</Heading>
                  <Text color="gray.500" fontSize="md" fontWeight="500" lineHeight="tall">{game.desc}</Text>
                </VStack>
                <Button
                  w="full"
                  colorScheme={game.color}
                  size="xl"
                  borderRadius="2xl"
                  onClick={() => setActiveGame(game.id)}
                  leftIcon={<FaGamepad />}
                  height="70px"
                  fontSize="lg"
                  boxShadow="md"
                >
                  Main Sekarang
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default EduGamePage;
