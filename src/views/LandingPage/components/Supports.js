import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Link,
  Paper,
} from '@mui/material';
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
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center" sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'block',
                mb: 1
              }}
            >
              Kemitraan Strategis
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Lembaga & Program Desa
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          {institutions.map((e) => (
            <Link key={e.id} href="#" sx={{ textDecoration: 'none' }}>
              <Paper
                elevation={0}
                sx={{
                  width: { xs: '140px', md: '200px', lg: '250px' },
                  height: { xs: '80px', md: '100px', lg: '120px' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: '24px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    borderColor: 'primary.main',
                    '& img': { filter: 'grayscale(0%)', opacity: 1 }
                  }
                }}
              >
                <Box
                  component="img"
                  src={e.image}
                  alt={e.title}
                  sx={{
                    maxHeight: '80%',
                    maxWidth: '80%',
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: 0.6,
                    transition: 'all 0.3s'
                  }}
                />
              </Paper>
            </Link>
          ))}
          {institutions.length === 0 && [1, 2, 3, 4].map(i => (
             <Paper key={i} sx={{ width: '200px', height: '100px', opacity: 0.5, borderRadius: '24px' }} variant="outlined" />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Supports;
