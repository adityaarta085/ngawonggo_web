import React from 'react';
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
} from '@chakra-ui/react';
import { FaGamepad, FaBrain, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gamesData } from './GamesData';

const MotionBox = motion(Box);

const GameList = () => {
  const navigate = useNavigate();

  return (
    <Box py={12} position="relative" overflow="hidden">
      {/* Background Decor */}
      <Box position="absolute" top="-10%" left="-10%" w="40%" h="40%" bg="brand.100" opacity={0.3} filter="blur(120px)" borderRadius="full" />
      <Box position="absolute" bottom="-10%" right="-10%" w="30%" h="30%" bg="purple.100" opacity={0.3} filter="blur(100px)" borderRadius="full" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex justify="space-between" align="center" mb={12} flexDir={{ base: 'column', md: 'row' }} gap={4}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/portal')}
            fontWeight="800"
            alignSelf="flex-start"
          >
            Kembali ke Portal
          </Button>

          <Button
            rightIcon={<FaTrophy />}
            colorScheme="orange"
            variant="outline"
            onClick={() => navigate('/game/dashboard')}
            borderRadius="full"
            fontWeight="bold"
            alignSelf={{ base: 'flex-start', md: 'auto' }}
          >
            Dashboard Skor
          </Button>
        </Flex>

        <VStack spacing={6} mb={16} textAlign="center">
          <Flex align="center" gap={3} mb={2}>
            <Icon as={FaBrain} color="brand.500" w={8} h={8} />
            <Badge colorScheme="brand" p={2} borderRadius="full" px={6} fontSize="xs" fontWeight="900" letterSpacing="widest">
                GAME HUB NGAWONGGO
            </Badge>
          </Flex>
          <Heading as="h1" size="3xl" fontWeight="900" bgGradient="linear(to-r, brand.600, purple.600)" bgClip="text">
            Katalog Edukasi
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" fontWeight="500">
            Pilih permainan untuk mulai mengasah kemampuan logika dan teknologi digitalmu.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {gamesData.map((game, index) => (
            <MotionBox
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
              bg="white" _dark={{ bg: "gray.800" }}
              p={8}
              borderRadius="3xl"
              boxShadow="soft"
              _hover={{ transform: 'translateY(-10px)', boxShadow: 'strong' }}
              position="relative"
              overflow="hidden"
              border="1px solid"
              borderColor={game.highlight ? "purple.100" : "gray.100"}
              display="flex"
              flexDirection="column"
              cursor="pointer"
              onClick={() => navigate(`/game/${game.id}`)}
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

              <Flex gap={2} mb={4} wrap="wrap">
                <Badge colorScheme="gray" fontSize="2xs" px={2} py={1} borderRadius="full">{game.category}</Badge>
                <Badge colorScheme={game.difficulty === 'Mudah' ? 'green' : 'orange'} fontSize="2xs" px={2} py={1} borderRadius="full">{game.difficulty}</Badge>
              </Flex>

              <VStack align="start" spacing={6} flex={1}>
                <Flex w={16} h={16} bg={`${game.color}.50`} color={`${game.color}.500`} borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                  <Icon as={game.icon} w={8} h={8} />
                </Flex>
                <VStack align="start" spacing={2}>
                  <Heading size="md" fontWeight="900" color="gray.800" _dark={{ color: "white" }}>{game.title}</Heading>
                  <Text color="gray.500" fontSize="sm" fontWeight="500" lineHeight="tall">{game.desc}</Text>
                </VStack>
              </VStack>

              <Box mt={8}>
                 <Button
                    w="full"
                    colorScheme={game.color}
                    variant="ghost"
                    rightIcon={<FaGamepad />}
                    borderRadius="xl"
                  >
                    Lihat Detail
                 </Button>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default GameList;
