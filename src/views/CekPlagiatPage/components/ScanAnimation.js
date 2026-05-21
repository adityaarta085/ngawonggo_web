import React from 'react';
import { Box, VStack, Text, keyframes } from '@chakra-ui/react';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 1; }
`;

const wave = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
`;

const ScanAnimation = () => {
  const dots = [0, 1, 2, 3, 4];

  return (
    <VStack spacing={5} py={10}>
      {/* Scanning dots */}
      <Box display="flex" gap={2}>
        {dots.map((i) => (
          <Box
            key={i}
            w="12px"
            h="12px"
            borderRadius="full"
            bg="brand.400"
            animation={`${wave} 1.2s ease-in-out ${i * 0.15}s infinite`}
          />
        ))}
      </Box>

      {/* Pulsing ring */}
      <Box position="relative" w="60px" h="60px">
        <Box
          position="absolute"
          inset={0}
          borderRadius="full"
          border="3px solid"
          borderColor="brand.400"
          animation={`${pulse} 2s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          inset="8px"
          borderRadius="full"
          border="2px solid"
          borderColor="brand.300"
          animation={`${pulse} 2s ease-in-out 0.5s infinite`}
        />
        <Box
          position="absolute"
          inset="16px"
          borderRadius="full"
          bg="brand.500"
          animation={`${pulse} 2s ease-in-out 1s infinite`}
        />
      </Box>

      <VStack spacing={1}>
        <Text color="white" fontWeight="600" fontSize="lg">
          Menganalisis teks...
        </Text>
        <Text color="whiteAlpha.600" fontSize="sm">
          Membandingkan dengan jutaan sumber online
        </Text>
      </VStack>
    </VStack>
  );
};

export default ScanAnimation;
