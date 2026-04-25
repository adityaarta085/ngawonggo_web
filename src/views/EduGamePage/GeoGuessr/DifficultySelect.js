import React from 'react';
import { Box, VStack, Heading, Button, Text, useColorModeValue } from '@chakra-ui/react';

const DifficultySelect = ({ setDifficulty, setScreen, nextScreen }) => {
  const bg = useColorModeValue('gray.800', 'gray.900');

  const diffs = [
    { id: 'easy', name: 'Easy', desc: 'Boleh bergerak, pan, dan zoom.', color: 'green' },
    { id: 'medium', name: 'Medium (No Move)', desc: 'Boleh pan dan zoom, tapi tidak boleh berpindah tempat.', color: 'yellow' },
    { id: 'hardcore', name: 'Hardcore', desc: 'Tidak boleh bergerak, tidak boleh pan, tidak boleh zoom.', color: 'red' }
  ];

  return (
    <Box w="full" h="full" bg={bg} color="white" p={8} display="flex" flexDir="column" alignItems="center" justifyContent="center">
      <Heading mb={8}>Select Difficulty</Heading>
      <VStack spacing={4} maxW="md" w="full">
        {diffs.map(d => (
          <Button
            key={d.id}
            w="full"
            h="100px"
            colorScheme={d.color}
            variant="outline"
            flexDir="column"
            alignItems="flex-start"
            p={4}
            onClick={() => {
              setDifficulty(d.id);
              setScreen(nextScreen || 'playing');
            }}
          >
            <Text fontSize="xl" fontWeight="bold">{d.name}</Text>
            <Text fontSize="sm" fontWeight="normal" color="gray.300">{d.desc}</Text>
          </Button>
        ))}
      </VStack>
      <Button mt={8} variant="ghost" onClick={() => setScreen('menu')}>Back to Menu</Button>
    </Box>
  );
};

export default DifficultySelect;
