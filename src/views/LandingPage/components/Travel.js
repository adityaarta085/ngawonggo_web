import React, { useEffect, useState } from 'react';
import {
  Text,
  Grid,
  GridItem,
  Box,
  Container,
  Heading,
  VStack,
} from '@chakra-ui/react';
import CardTravel from '../../../components/CardTravel';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';

const Travel = () => {
  const { language } = useLanguage();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data, error } = await supabase.from('travel_places').select('*').order('id', { ascending: true });
      if (!error && data) setPlaces(data);
    };
    fetchPlaces();
  }, []);

  return (
    <Box py={20} bg="accent.blue">
      <Container maxW="container.xl">
        <VStack spacing={12} align="center" textAlign="center">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="brand.400"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2}
            >
              {language === 'id' ? 'Destinasi Desa' : 'Village Destinations'}
            </Text>
            <Heading as="h2" size="xl" fontWeight="800" color="white">
              {language === 'id' ? 'Pesona Alam Ngawonggo' : 'Ngawonggo Natural Charm'}
            </Heading>
            <Text color="gray.300" maxW="2xl" mt={4}>
              {language === 'id'
                ? 'Menjelajahi keindahan alam dan kekayaan budaya di lereng Gunung Sumbing yang menawan.'
                : 'Exploring the natural beauty and cultural richness on the captivating slopes of Mount Sumbing.'}
            </Text>
          </Box>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={8}
            w="full"
          >
            {places.map((e, index) => {
              return (
                <GridItem key={e.id}>
                  <CardTravel
                    title={e.title}
                    image={e.image}
                    location={e.location}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Travel;
