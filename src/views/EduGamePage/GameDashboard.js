import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// No custom locale to avoid build error

const GameDashboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_game_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setScores(data);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  return (
    <Box py={10} minH="80vh">
      <Container maxW="container.lg">
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={8}
          onClick={() => navigate('/game')}
          fontWeight="800"
        >
          Kembali ke Hub
        </Button>

        <Box bg="white" p={8} borderRadius="3xl" boxShadow="soft">
          <VStack align="start" spacing={6} mb={8}>
            <Heading size="xl" display="flex" alignItems="center" gap={3}>
              <Icon as={FaTrophy} color="orange.400" />
              Riwayat Skor Bermain
            </Heading>
            <Text color="gray.600">
              Berikut adalah 20 catatan skor terakhir yang kamu peroleh dari berbagai game edukasi.
            </Text>
          </VStack>

          {loading ? (
            <Box py={10} textAlign="center">
              <Spinner size="xl" color="brand.500" />
            </Box>
          ) : scores.length === 0 ? (
            <Box py={10} textAlign="center" bg="gray.50" borderRadius="xl">
              <Text color="gray.500" fontWeight="bold">Belum ada data permainan.</Text>
              <Text color="gray.400" fontSize="sm">Ayo mainkan game edukasi sekarang!</Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Game</Th>
                    <Th isNumeric>Skor</Th>
                    <Th>Waktu</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {scores.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="bold" color="gray.700">
                        {item.game_name}
                      </Td>
                      <Td isNumeric>
                        <Badge colorScheme="brand" fontSize="md" px={2} borderRadius="md">
                          {item.score}
                        </Badge>
                      </Td>
                      <Td color="gray.500" fontSize="sm">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default GameDashboard;
