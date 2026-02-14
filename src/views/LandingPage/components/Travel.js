import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  Container,
  Stack,
} from '@mui/material';
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
    <Box sx={{ py: 10, bgcolor: '#0F172A' }}>
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'primary.light',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'block',
                mb: 1
              }}
            >
              {language === 'id' ? 'Destinasi Desa' : 'Village Destinations'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
              {language === 'id' ? 'Pesona Alam Ngawonggo' : 'Ngawonggo Natural Charm'}
            </Typography>
            <Typography sx={{ color: 'grey.400', maxWidth: '600px', mt: 2, mx: 'auto' }}>
              {language === 'id'
                ? 'Menjelajahi keindahan alam dan kekayaan budaya di lereng Gunung Sumbing yang menawan.'
                : 'Exploring the natural beauty and cultural richness on the captivating slopes of Mount Sumbing.'}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {places.map((e) => (
            <Grid item xs={12} sm={6} md={4} key={e.id}>
              <CardTravel
                title={e.title}
                image={e.image}
                location={e.location}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Travel;
