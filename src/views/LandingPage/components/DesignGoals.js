import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';

const DesignGoals = () => {
  const [goals, setGoals] = useState([]);
  const bg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('design_goals')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data) setGoals(data);
    };
    fetchGoals();
  }, []);

  if (goals.length === 0) return null;

  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={4} mb={16} textAlign="center">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="widest"
          >
            Visi & Tujuan
          </Text>
          <Heading as="h2" size="2xl" fontWeight="800" color="gray.800">
            10 Tujuan Desain Desa Ngawonggo
          </Heading>
          <Text color="gray.600" maxW="2xl">
            Komitmen kami dalam membangun desa yang mandiri, modern, dan tetap menjaga keluhuran budaya lokal.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
          {goals.map((goal) => (
            <Box
              key={goal.id}
              layerStyle="glassCard"
              bg={bg}
              p={6}
              borderRadius="2xl"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
            >
              <VStack spacing={4} align="start">
                <Box
                  w="full"
                  h="120px"
                  borderRadius="xl"
                  overflow="hidden"
                  mb={2}
                >
                  <Image
                    src={goal.image_url}
                    alt={goal.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
                <Heading size="sm" color="gray.800">
                  {goal.title}
                </Heading>
                <Text fontSize="xs" color="gray.600" noOfLines={3}>
                  {goal.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default DesignGoals;
