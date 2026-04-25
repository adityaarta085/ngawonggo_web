import React, { useState } from 'react';
import { Box, VStack, Heading, Button, Text, HStack, Badge, Flex, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { FaGlobeAsia, FaUsers, FaUser, FaTrophy, FaUserCircle, FaMap } from 'react-icons/fa';

const maps = [
  { id: 'ngawonggo', name: 'Ngawonggo, Magelang', type: 'Village' },
  { id: 'kaliangkrik', name: 'Kaliangkrik, Magelang', type: 'District' },
  { id: 'magelang', name: 'Kab. Magelang', type: 'Regency' },
  { id: 'jateng', name: 'Jawa Tengah', type: 'Province' },
  { id: 'world', name: 'World (Coming Soon)', type: 'Global', disabled: true }
];

const MainMenu = ({ setScreen, setMap, setMode, setDifficulty, session, hasPlayedTrial }) => {
  const [selectedMode, setSelectedMode] = useState('single'); // single or multi

  const bg = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');

  const handlePlayClick = (mapId) => {
    if (!session && hasPlayedTrial) {
      alert("Kamu sudah menggunakan free trial 1 kali. Silakan login untuk terus bermain!");
      return;
    }
    setMap(mapId);
    setScreen('mode_select'); // Actually let's go straight to difficulty or lobby
  };

  return (
    <Box w="full" h="full" bg={bg} color="white" p={8} overflowY="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <HStack>
          <Icon as={FaGlobeAsia} boxSize={8} color="teal.400" />
          <Heading size="lg">GeoExplorer Nusantara</Heading>
        </HStack>
        <HStack spacing={4}>
          <Button leftIcon={<FaTrophy />} colorScheme="yellow" variant="ghost" onClick={() => setScreen('leaderboard')}>
            Leaderboard
          </Button>
          {session ? (
            <Button leftIcon={<FaUserCircle />} colorScheme="teal" variant="outline" onClick={() => setScreen('avatar')}>
              Profile & Avatar
            </Button>
          ) : (
            <Badge colorScheme={hasPlayedTrial ? 'red' : 'green'} p={2} borderRadius="md">
              {hasPlayedTrial ? 'Trial Used - Please Login' : '1 Free Trial Available!'}
            </Badge>
          )}
        </HStack>
      </Flex>

      <VStack spacing={8} align="stretch" maxW="4xl" mx="auto">
        <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl">
          <Heading size="md" mb={4}>Select Game Mode</Heading>
          <HStack spacing={4}>
            <Button
              flex={1} h="120px"
              colorScheme={selectedMode === 'single' ? 'teal' : 'gray'}
              variant={selectedMode === 'single' ? 'solid' : 'outline'}
              flexDir="column" gap={2}
              onClick={() => setSelectedMode('single')}
            >
              <Icon as={FaUser} boxSize={6} />
              <Text>Singleplayer</Text>
            </Button>
            <Button
              flex={1} h="120px"
              colorScheme={selectedMode === 'multi' ? 'purple' : 'gray'}
              variant={selectedMode === 'multi' ? 'solid' : 'outline'}
              flexDir="column" gap={2}
              onClick={() => setSelectedMode('multi')}
            >
              <Icon as={FaUsers} boxSize={6} />
              <Text>Multiplayer</Text>
            </Button>
          </HStack>
        </Box>

        {selectedMode === 'multi' && (
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl">
            <Heading size="md" mb={4}>Multiplayer Modes</Heading>
            <SimpleGrid columns={{base: 1, md: 3}} spacing={4}>
              {['Battle Royale', 'Duels', 'Team Duel', 'Streak Mode', 'Party / Play with Friend'].map(m => (
                <Button key={m} colorScheme="purple" variant="outline" h="80px" onClick={() => {
                  setMode(m);
                  setScreen('lobby');
                }}>
                  {m}
                </Button>
              ))}
            </SimpleGrid>
            <Flex mt={4} justify="center">
              <Button colorScheme="teal" onClick={() => setScreen('join_party')}>Join by Code</Button>
            </Flex>
          </Box>
        )}

        {selectedMode === 'single' && (
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl">
            <Heading size="md" mb={4}>Select Map</Heading>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
              {maps.map(map => (
                <Box
                  key={map.id}
                  p={4}
                  borderWidth="2px"
                  borderColor={map.disabled ? 'gray.600' : 'teal.500'}
                  borderRadius="lg"
                  opacity={map.disabled ? 0.5 : 1}
                  cursor={map.disabled ? 'not-allowed' : 'pointer'}
                  _hover={map.disabled ? {} : { bg: 'whiteAlpha.100', transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  onClick={() => !map.disabled && handlePlayClick(map.id)}
                >
                  <HStack mb={2}>
                    <Icon as={FaMap} color="teal.300" />
                    <Heading size="sm">{map.name}</Heading>
                  </HStack>
                  <Badge colorScheme="blue">{map.type}</Badge>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MainMenu;
