import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Container,
  Stack,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import { supabase } from '../../lib/supabase';

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (!error && data) setAllNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const categories = ['pemerintahan', 'pendidikan', 'kesehatan', 'ekonomi', 'umum'];

  if (loading) return (
    <Box sx={{ p: 10, textAlign: 'center' }}>
      <Typography>Loading news...</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '32px',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>Informasi Dan Berita Daerah</Typography>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                sx={{ '& .MuiBreadcrumbs-li': { color: 'white' } }}
              >
                <Link component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Beranda
                </Link>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>Berita</Typography>
              </Breadcrumbs>
            </Stack>
          </Paper>

          <Box sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '4px' } }}>
            <Stack direction="row" spacing={2}>
              {categories.map(cat => (
                <Button
                  key={cat}
                  component="a"
                  href={`#${cat}`}
                  variant="outlined"
                  sx={{
                    borderRadius: '100px',
                    textTransform: 'capitalize',
                    px: 3,
                    whiteSpace: 'nowrap',
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Stack>
          </Box>

          {categories.map(category => {
            const filteredNews = allNews.filter(n => n.category?.toLowerCase() === category);
            if (filteredNews.length === 0) return null;

            return (
              <Box key={category} id={category} sx={{ scrollMarginTop: '100px', mt: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ textTransform: 'capitalize', fontWeight: 800 }}>
                    {category}
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Stack>

                <Grid container spacing={4}>
                  <Grid item xs={12} lg={7}>
                    {filteredNews.slice(0, 1).map(e => (
                      <CardNews
                        key={e.id}
                        id={e.id}
                        title={e.title}
                        image={e.image}
                        date={e.date}
                        caption={e.content}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <Stack spacing={3}>
                      {filteredNews.slice(1, 4).map(e => (
                        <SmallCardNews
                          key={e.id}
                          id={e.id}
                          title={e.title}
                          image={e.image}
                          date={e.date}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
