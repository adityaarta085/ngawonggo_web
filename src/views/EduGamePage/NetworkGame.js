
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaServer, FaHome, FaBolt } from 'react-icons/fa';

const GRID_SIZE = 5;
const START_NODE = { r: 0, c: 0 };
const TARGET_NODES = [
  { r: 0, c: 4, label: "Dusun A" },
  { r: 4, c: 0, label: "Dusun B" },
  { r: 4, c: 4, label: "Dusun C" },
];

const NetworkGame = ({ onBack }) => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [moves, setMoves] = useState(12);
  const [isWon, setIsWon] = useState(false);
  const [connectedTargets, setConnectedTargets] = useState([]);
  const toast = useToast();

  const checkConnectivity = useCallback(() => {
    const visited = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    const queue = [START_NODE];
    visited[START_NODE.r][START_NODE.c] = true;

    const reachable = [];

    while (queue.length > 0) {
      const { r, c } = queue.shift();

      // Check if current node is a target
      TARGET_NODES.forEach((target, idx) => {
        if (target.r === r && target.c === c && !reachable.includes(idx)) {
          reachable.push(idx);
        }
      });

      // Neighbors
      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] && !visited[nr][nc]) {
          visited[nr][nc] = true;
          queue.push({ r: nr, c: nc });
        }
      }
    }

    setConnectedTargets(reachable);
    if (reachable.length === TARGET_NODES.length) {
      setIsWon(true);
    }
  }, [grid]);

  useEffect(() => {
    checkConnectivity();
  }, [grid, checkConnectivity]);

  const toggleCell = (r, c) => {
    if (isWon || (r === START_NODE.r && c === START_NODE.c)) return;

    if (!grid[r][c] && moves <= 0) {
      toast({ title: "Kabel Habis!", status: "warning", duration: 2000 });
      return;
    }

    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
    setMoves(prev => grid[r][c] ? prev + 1 : prev - 1);
  };

  const resetGame = () => {
    const initialGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    initialGrid[START_NODE.r][START_NODE.c] = true;
    setGrid(initialGrid);
    setMoves(12);
    setIsWon(false);
    setConnectedTargets([]);
  };

  useEffect(() => {
    // Set start node as active initially
    const initialGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    initialGrid[START_NODE.r][START_NODE.c] = true;
    setGrid(initialGrid);
  }, []);

  return (
    <Box p={6} bg="white" borderRadius="2xl" boxShadow="2xl" w="full" maxW="600px">
      <VStack spacing={6}>
        <VStack spacing={1}>
          <Heading size="md" color="brand.500">Ngawonggo 2045: Jaringan Digital</Heading>
          <Text fontSize="sm" textAlign="center" color="gray.600">
            Hubungkan <b>Pusat Data</b> ke semua <b>Dusun</b> dengan kabel fiber optik!
          </Text>
        </VStack>

        <HStack w="full" justify="space-around" bg="gray.50" p={3} borderRadius="xl">
          <VStack spacing={0}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500">KABEL TERSEDIA</Text>
            <Text fontSize="xl" fontWeight="800" color={moves < 3 ? "red.500" : "brand.500"}>{moves}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500">DUSUN TERHUBUNG</Text>
            <Text fontSize="xl" fontWeight="800" color="brand.500">{connectedTargets.length} / {TARGET_NODES.length}</Text>
          </VStack>
        </HStack>

        <Box
          p={2}
          bg="gray.200"
          borderRadius="lg"
          boxShadow="inner"
        >
          <SimpleGrid columns={GRID_SIZE} spacing={2}>
            {grid.map((row, r) => row.map((isActive, c) => {
              const isStart = r === START_NODE.r && c === START_NODE.c;
              const targetIdx = TARGET_NODES.findIndex(t => t.r === r && t.c === c);
              const isTarget = targetIdx !== -1;
              const isConnectedTarget = connectedTargets.includes(targetIdx);

              return (
                <Box
                  key={`${r}-${c}`}
                  w={{ base: "50px", md: "70px" }}
                  h={{ base: "50px", md: "70px" }}
                  bg={isActive ? (isStart || isConnectedTarget ? "brand.500" : "brand.200") : "white"}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor={isStart ? "default" : "pointer"}
                  onClick={() => toggleCell(r, c)}
                  transition="all 0.2s"
                  _hover={!isStart ? { transform: "scale(1.05)", bg: isActive ? "brand.300" : "gray.100" } : {}}
                  position="relative"
                >
                  {isStart && <Icon as={FaServer} color="white" w={6} h={6} />}
                  {isTarget && <Icon as={FaHome} color={isConnectedTarget ? "white" : "gray.400"} w={6} h={6} />}
                  {isActive && !isStart && !isTarget && <Icon as={FaBolt} color="white" w={4} h={4} opacity={0.6} />}
                  {isTarget && isConnectedTarget && (
                    <Box position="absolute" top={0} right={0} bg="green.400" w={3} h={3} borderRadius="full" border="2px solid white" />
                  )}
                </Box>
              );
            }))}
          </SimpleGrid>
        </Box>

        {isWon ? (
          <VStack w="full" spacing={4} p={4} bg="green.50" borderRadius="xl" border="2px solid" borderColor="green.200">
            <Heading size="sm" color="green.700">Misi Berhasil!</Heading>
            <Text fontSize="xs" textAlign="center" color="green.600">
              Selamat! Kamu telah membangun infrastruktur digital untuk Desa Ngawonggo 2045.
            </Text>
            <Button colorScheme="green" size="sm" onClick={resetGame}>Main Lagi</Button>
          </VStack>
        ) : (
          moves === 0 && connectedTargets.length < TARGET_NODES.length && (
            <Button colorScheme="red" variant="outline" size="sm" onClick={resetGame}>Ulangi Misi</Button>
          )
        )}

        <Button variant="ghost" size="sm" onClick={onBack}>Kembali ke Menu</Button>
      </VStack>
    </Box>
  );
};

export default NetworkGame;
