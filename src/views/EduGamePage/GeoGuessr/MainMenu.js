import React, { useState } from 'react';
import { Box, VStack, Heading, Button, Text, HStack, Badge, Flex, Icon, SimpleGrid, useColorModeValue, Input } from '@chakra-ui/react';
import { FaGlobeAsia, FaUsers, FaUser, FaTrophy, FaUserCircle, FaMap } from 'react-icons/fa';

const maps = [
  { id: 'ngawonggo', name: 'Ngawonggo, Magelang', type: 'Village' },
  { id: 'kaliangkrik', name: 'Kaliangkrik, Magelang', type: 'District' },
  { id: 'magelang', name: 'Kab. Magelang', type: 'Regency' },
  { id: 'jateng', name: 'Jawa Tengah', type: 'Province' },
  { id: 'world', name: 'World (Coming Soon)', type: 'Global', disabled: true }
];

const MainMenu = ({ setScreen, setMap, setMode, session, hasPlayedTrial, setIsHost, setPartyCode }) => {
  const [selectedMode, setSelectedMode] = useState('single');
  const [joinCode, setJoinCode] = useState('');

  const bg = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');

  const handlePlayClick = (mapId) => {
    if (!session && hasPlayedTrial) {
      alert("Kamu sudah menggunakan free trial 1 kali. Silakan login untuk terus bermain!");
      return;
    }
    setMap(mapId);
    if (selectedMode === 'single') {
        setScreen('mode_select');
    } else {
        setIsHost(true);
        setScreen('mode_select_multi'); // Will select difficulty then go to lobby
    }
  };

  const handleJoinParty = () => {
    if (!session) {
      alert("Login diperlukan untuk Multiplayer!");
      return;
    }
    if (joinCode.length > 0) {
      setIsHost(false);
      setPartyCode(joinCode.toUpperCase());
      setScreen('lobby');
    }
  };

  return (
    <Box w="full" h="full" bg={bg} color="white" p={{base: 4, md: 8}} overflowY="auto">
      <Flex justify="space-between" align="center" mb={8} flexDir={{base: 'column', md: 'row'}} gap={4}>
        <HStack>
          <Icon as={FaGlobeAsia} boxSize={8} color="teal.400" />
          <Heading size={{base: "md", md: "lg"}}>GeoExplorer Nusantara</Heading>
        </HStack>
        <HStack spacing={2}>
          <Button size="sm" leftIcon={<FaTrophy />} colorScheme="yellow" variant="ghost" onClick={() => setScreen('leaderboard')}>
            Leaderboard
          </Button>
          {session ? (
            <Button size="sm" leftIcon={<FaUserCircle />} colorScheme="teal" variant="outline" onClick={() => setScreen('avatar')}>
              Profile
            </Button>
          ) : (
            <Badge colorScheme={hasPlayedTrial ? 'red' : 'green'} p={2} borderRadius="md" textAlign="center">
              {hasPlayedTrial ? 'Trial Habis' : '1 Free Trial'}
            </Badge>
          )}
        </HStack>
      </Flex>

      <VStack spacing={8} align="stretch" maxW="4xl" mx="auto">
        <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl">
          <Heading size="md" mb={4}>Select Game Mode</Heading>
          <HStack spacing={4} flexDir={{base: 'column', md: 'row'}}>
            <Button
              flex={1} h={{base: "80px", md: "120px"}} w="full"
              colorScheme={selectedMode === 'single' ? 'teal' : 'gray'}
              variant={selectedMode === 'single' ? 'solid' : 'outline'}
              flexDir="column" gap={2}
              onClick={() => setSelectedMode('single')}
            >
              <Icon as={FaUser} boxSize={6} />
              <Text>Singleplayer</Text>
            </Button>
            <Button
              flex={1} h={{base: "80px", md: "120px"}} w="full"
              colorScheme={selectedMode === 'multi' ? 'purple' : 'gray'}
              variant={selectedMode === 'multi' ? 'solid' : 'outline'}
              flexDir="column" gap={2}
              onClick={() => {
                if(!session) { alert("Login required for Multiplayer"); return; }
                setSelectedMode('multi')
              }}
            >
              <Icon as={FaUsers} boxSize={6} />
              <Text>Multiplayer</Text>
            </Button>
          </HStack>
        </Box>

        {selectedMode === 'multi' && (
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl">
            <Heading size="md" mb={4}>Multiplayer Modes</Heading>
            <SimpleGrid columns={{base: 1, md: 3}} spacing={4} mb={6}>
              {['Battle Royale', 'Duels', 'Play with Friend'].map(m => (
                <Button key={m} colorScheme="purple" variant="outline" h="60px" onClick={() => {
                  setMode(m);
                  // Multi needs map selection first
                  document.getElementById('map-select-section').scrollIntoView({behavior: 'smooth'});
                }}>
                  {m}
                </Button>
              ))}
            </SimpleGrid>
            <Heading size="sm" mb={2}>Atau Join Party Code</Heading>
            <Flex gap={2}>
              <Input
                placeholder="Enter Code (e.g., A1B2C3)"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                bg="gray.800"
                borderColor="gray.600"
                textTransform="uppercase"
              />
              <Button colorScheme="teal" onClick={handleJoinParty}>Join</Button>
            </Flex>
          </Box>
        )}

        <Box bg={cardBg} p={6} borderRadius="xl" shadow="xl" id="map-select-section">
          <Heading size="md" mb={4}>Select Map {selectedMode === 'multi' ? '(Create Party)' : ''}</Heading>
          <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
            {maps.map(map => (
              <Box
                key={map.id}
                p={4}
                borderWidth="2px"
                borderColor={map.disabled ? 'gray.600' : (selectedMode === 'multi' ? 'purple.500' : 'teal.500')}
                borderRadius="lg"
                opacity={map.disabled ? 0.5 : 1}
                cursor={map.disabled ? 'not-allowed' : 'pointer'}
                _hover={map.disabled ? {} : { bg: 'whiteAlpha.100', transform: 'scale(1.02)' }}
                transition="all 0.2s"
                onClick={() => !map.disabled && handlePlayClick(map.id)}
              >
                <HStack mb={2}>
                  <Icon as={FaMap} color={selectedMode === 'multi' ? 'purple.300' : 'teal.300'} />
                  <Heading size="sm">{map.name}</Heading>
                </HStack>
                <Badge colorScheme={map.id === 'world' ? 'red' : 'blue'}>{map.type}</Badge>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default MainMenu;
