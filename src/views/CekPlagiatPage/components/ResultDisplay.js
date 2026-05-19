import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Link,
  Icon,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const getScoreColor = (score) => {
  if (score <= 15) return 'green';
  if (score <= 40) return 'yellow';
  if (score <= 70) return 'orange';
  return 'red';
};

const getScoreLabel = (score) => {
  if (score <= 15) return 'Sangat Original';
  if (score <= 40) return 'Cukup Original';
  if (score <= 70) return 'Plagiarisme Terdeteksi';
  return 'Plagiarisme Tinggi';
};

const HighlightedText = ({ text, highlights }) => {
  if (!highlights || highlights.length === 0) {
    return (
      <Text color="whiteAlpha.800" fontSize="sm" lineHeight="1.8" whiteSpace="pre-wrap">
        {text}
      </Text>
    );
  }

  // Sort highlights by start index
  const sorted = [...highlights].sort((a, b) => a.start - b.start);

  const parts = [];
  let lastEnd = 0;

  sorted.forEach((h, idx) => {
    if (h.start > lastEnd) {
      parts.push(
        <span key={`normal-${idx}`}>
          {text.slice(lastEnd, h.start)}
        </span>
      );
    }
    parts.push(
      <Box
        as="mark"
        key={`hl-${idx}`}
        bg="rgba(255, 71, 87, 0.3)"
        color="red.200"
        px={0.5}
        borderRadius="sm"
        borderBottom="2px solid"
        borderColor="red.400"
        title={h.source || 'Sumber terdeteksi'}
      >
        {text.slice(h.start, h.end)}
      </Box>
    );
    lastEnd = h.end;
  });

  if (lastEnd < text.length) {
    parts.push(<span key="last">{text.slice(lastEnd)}</span>);
  }

  return (
    <Text color="whiteAlpha.800" fontSize="sm" lineHeight="1.8" whiteSpace="pre-wrap">
      {parts}
    </Text>
  );
};

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  const { score, sources, highlights, originalText, checkedAt } = result;
  const colorScheme = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <Box
      w="full"
      p={{ base: 5, md: 8 }}
      bg="rgba(255,255,255,0.06)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"
    >
      <VStack spacing={6} align="stretch">
        {/* Score Header */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          gap={6}
          p={6}
          bg={`${colorScheme}.900`}
          bgOpacity="0.2"
          borderRadius="xl"
          borderWidth="1px"
          borderColor={`${colorScheme}.600`}
        >
          <CircularProgress
            value={score}
            size="140px"
            thickness="8px"
            color={`${colorScheme}.400`}
            trackColor="whiteAlpha.200"
          >
            <CircularProgressLabel>
              <VStack spacing={0}>
                <Text fontSize="3xl" fontWeight="800" color="white">
                  {score}%
                </Text>
                <Text fontSize="xs" color="whiteAlpha.600">
                  Kemiripan
                </Text>
              </VStack>
            </CircularProgressLabel>
          </CircularProgress>

          <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
            <HStack>
              <Icon
                as={score <= 40 ? FaShieldAlt : FaExclamationTriangle}
                color={`${colorScheme}.400`}
                boxSize={5}
              />
              <Heading size="md" color="white">
                {label}
              </Heading>
            </HStack>
            <Badge
              colorScheme={colorScheme}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              {100 - score}% konten original
            </Badge>
            {checkedAt && (
              <Text color="whiteAlpha.500" fontSize="xs">
                Dicek pada: {new Date(checkedAt).toLocaleString('id-ID')}
              </Text>
            )}
          </VStack>
        </Flex>

        {/* Sources */}
        {sources && sources.length > 0 && (
          <Box>
            <Heading size="sm" color="white" mb={3}>
              📋 Sumber Terdeteksi ({sources.length})
            </Heading>
            <VStack spacing={2} align="stretch">
              {sources.map((src, idx) => (
                <HStack
                  key={idx}
                  p={3}
                  bg="whiteAlpha.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="whiteAlpha.100"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.500' }}
                  transition="all 0.2s"
                >
                  <Badge
                    colorScheme={getScoreColor(src.similarity)}
                    minW="50px"
                    textAlign="center"
                    borderRadius="full"
                  >
                    {src.similarity}%
                  </Badge>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text color="white" fontSize="sm" fontWeight="600" noOfLines={1}>
                      {src.title || 'Sumber tidak diketahui'}
                    </Text>
                    {src.url && (
                      <Link
                        href={src.url}
                        isExternal
                        color="brand.300"
                        fontSize="xs"
                        noOfLines={1}
                      >
                        {src.url} <Icon as={FaExternalLinkAlt} mx={1} boxSize={2} />
                      </Link>
                    )}
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        <Divider borderColor="whiteAlpha.200" />

        {/* Highlighted Text */}
        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionItem border="none">
            <AccordionButton
              px={0}
              _hover={{ bg: 'transparent' }}
            >
              <Heading size="sm" color="white" flex={1} textAlign="left">
                🔍 Analisis Teks
              </Heading>
              <AccordionIcon color="whiteAlpha.600" />
            </AccordionButton>
            <AccordionPanel px={0} pt={3}>
              <Box
                p={4}
                bg="whiteAlpha.50"
                borderRadius="lg"
                maxH="400px"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                  },
                }}
              >
                <HighlightedText
                  text={originalText}
                  highlights={highlights}
                />
              </Box>
              {highlights && highlights.length > 0 && (
                <HStack mt={2} spacing={4}>
                  <HStack>
                    <Box w={3} h={3} bg="rgba(255,71,87,0.3)" borderRadius="sm" borderBottom="2px solid" borderColor="red.400" />
                    <Text color="whiteAlpha.600" fontSize="xs">
                      Teks mirip/plagiat
                    </Text>
                  </HStack>
                  <HStack>
                    <Box w={3} h={3} bg="transparent" borderRadius="sm" />
                    <Text color="whiteAlpha.600" fontSize="xs">
                      Teks original
                    </Text>
                  </HStack>
                </HStack>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default ResultDisplay;
