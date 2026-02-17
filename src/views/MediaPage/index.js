import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaBroadcastTower, FaTv } from 'react-icons/fa';

const MediaCard = ({ title, subtitle, icon, color, url }) => (
  <Box
    layerStyle="glassCard"
    p={8}
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl' }}
  >
    <VStack spacing={6} align="start">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        borderRadius="2xl"
        bg={`${color}.50`}
        color={`${color}.500`}
      >
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <VStack align="start" spacing={2}>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{subtitle}</Text>
      </VStack>
      <Box w="full" h="300px" borderRadius="xl" overflow="hidden" bg="black">
        <iframe
          title={title}
          src={url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allow="autoplay"
        ></iframe>
      </Box>
    </VStack>
  </Box>
);

const MediaPage = () => {
  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={4} mb={16} textAlign="center">
          <Heading as="h1" size="2xl" color="brand.500">
            Bioskop Desa & Media
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Streaming Radio Gemilang & TVRI Nasional secara langsung.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          <MediaCard
            title="Radio Gemilang FM"
            subtitle="Suara Magelang dari hati untuk masyarakat."
            icon={FaBroadcastTower}
            color="blue"
            url="https://suaramagelang.id/player"
          />
          <MediaCard
            title="TVRI Nasional"
            subtitle="Saluran Pemersatu Bangsa."
            icon={FaTv}
            color="red"
            url="https://www.tvri.go.id/live"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default MediaPage;
