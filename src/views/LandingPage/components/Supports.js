import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  Heading,
  Container,
  VStack,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';

const Supports = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: true });
      if (!error && data) setInstitutions(data);
    };
    fetchInstitutions();
  }, []);

  return (
    <Box py={24} bg="transparent">
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="brand.500"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2}
            >
              Kemitraan Strategis
            </Text>
            <Heading as="h2" size="2xl" fontWeight="800" color="gray.800">
              Lembaga & Program Desa
            </Heading>
          </Box>

          <Flex gap={8} justify="center" wrap="wrap">
            {institutions.map((e) => (
              <Link key={e.id} href="#" _hover={{ textDecoration: 'none' }}>
                <Box
                  role="group" layerStyle="glassCard"
                  w={{ base: "140px", md: "200px", lg: "280px" }}
                  h={{ base: "80px", md: "100px", lg: "140px" }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={6}
                  transition="all 0.3s cubic-bezier(.4,0,.2,1)"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', borderColor: 'brand.200' }}
                >
                  <Image
                    src={e.image}
                    alt={e.title}
                    objectFit="contain"
                    maxH="80%"
                    filter="grayscale(20%)"
                    opacity={0.8}
                    transition="all 0.3s"
                    _groupHover={{ filter: 'grayscale(0%)', opacity: 1 }}
                    fallback={<Text fontWeight="bold" fontSize={{ base: "xs", lg: "md" }} color="gray.400">{e.title}</Text>}
                  />
                </Box>
              </Link>
            ))}
            {institutions.length === 0 && [1, 2, 3, 4].map(i => (
               <Box key={i} role="group" layerStyle="glassCard" w="200px" h="100px" opacity={0.5} />
            ))}
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Supports;
