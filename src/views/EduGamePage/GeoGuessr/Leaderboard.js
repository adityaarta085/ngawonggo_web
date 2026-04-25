import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, HStack, Avatar, Spinner, Center, Button, useColorModeValue } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { FaArrowLeft, FaMedal } from 'react-icons/fa';

const Leaderboard = ({ setScreen }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('geo_profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);

      if (!error && data) {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <Box w="full" h="full" bg={bg} color="white" p={{ base: 4, md: 8 }} overflowY="auto">
      <Button leftIcon={<FaArrowLeft />} variant="ghost" mb={4} onClick={() => setScreen('menu')}>
        Kembali
      </Button>

      <Heading textAlign="center" mb={8} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <FaMedal color="#FFD700" /> Papan Peringkat Nusantara
      </Heading>

      {loading ? (
        <Center>
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : profiles.length === 0 ? (
        <Center mt={10}>
          <Text color="gray.400">Belum ada data.</Text>
        </Center>
      ) : (
        <VStack spacing={4} maxW="3xl" mx="auto" w="full">
          {profiles.map((p, idx) => (
            <HStack
              key={p.id}
              w="full"
              bg={cardBg}
              p={4}
              borderRadius="lg"
              justify="space-between"
              borderWidth={idx < 3 ? '2px' : '0px'}
              borderColor={idx === 0 ? 'yellow.400' : idx === 1 ? 'gray.300' : idx === 2 ? 'orange.400' : 'transparent'}
            >
              <HStack spacing={4}>
                <Text fontSize="xl" fontWeight="bold" w="30px" textAlign="center" color={idx === 0 ? 'yellow.400' : idx === 1 ? 'gray.300' : idx === 2 ? 'orange.400' : 'white'}>
                  #{idx + 1}
                </Text>
                <Avatar src={p.avatar_url} name={p.username || 'User'} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{p.username || 'Anonim'}</Text>
                  <Text fontSize="sm" color="gray.400">Level {p.level}</Text>
                </VStack>
              </HStack>
              <VStack align="end" spacing={0}>
                <Text fontWeight="bold" color="teal.300">{p.xp} XP</Text>
                <Text fontSize="xs" color="gray.500">{p.total_matches} Match</Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Leaderboard;
