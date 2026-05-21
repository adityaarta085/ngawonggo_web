import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaHistory, FaTrash, FaRedo } from 'react-icons/fa';

const getScoreColor = (score) => {
  if (score <= 15) return 'green';
  if (score <= 40) return 'yellow';
  if (score <= 70) return 'orange';
  return 'red';
};

const HistoryPanel = ({ history, onRecheck, onClear }) => {
  if (!history || history.length === 0) {
    return (
      <Box
        w="full"
        p={6}
        bg="rgba(255,255,255,0.04)"
        backdropFilter="blur(8px)"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        textAlign="center"
      >
        <Icon as={FaHistory} color="whiteAlpha.300" boxSize={8} mb={3} />
        <Text color="whiteAlpha.400" fontSize="sm">
          Belum ada riwayat pengecekan.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="full"
      p={{ base: 5, md: 6 }}
      bg="rgba(255,255,255,0.04)"
      backdropFilter="blur(8px)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <HStack>
          <Icon as={FaHistory} color="brand.400" />
          <Heading size="sm" color="white">
            Riwayat Pengecekan
          </Heading>
        </HStack>
        <Button
          size="xs"
          variant="ghost"
          colorScheme="red"
          leftIcon={<FaTrash />}
          onClick={onClear}
          color="whiteAlpha.500"
          _hover={{ color: 'red.300' }}
        >
          Hapus Semua
        </Button>
      </Flex>

      <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
          },
        }}
      >
        {history.map((item, idx) => (
          <HStack
            key={idx}
            p={3}
            bg="whiteAlpha.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.300' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => onRecheck(item)}
          >
            <Badge
              colorScheme={getScoreColor(item.score)}
              fontSize="sm"
              px={2}
              py={1}
              borderRadius="full"
              minW="50px"
              textAlign="center"
            >
              {item.score}%
            </Badge>
            <VStack align="start" spacing={0} flex={1}>
              <Text color="white" fontSize="xs" fontWeight="600" noOfLines={1}>
                {item.preview}
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                {new Date(item.checkedAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </VStack>
            <Icon as={FaRedo} color="whiteAlpha.400" boxSize={3} />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default HistoryPanel;
