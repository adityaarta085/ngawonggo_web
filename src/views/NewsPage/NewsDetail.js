import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CommentSection from './CommentSection';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!news) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 2 }}>
        <Typography variant="h5">Berita tidak ditemukan.</Typography>
        <Link component={RouterLink} to="/news">Kembali ke Berita</Link>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 4 }}
        >
          <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            Beranda
          </Link>
          <Link component={RouterLink} to="/news" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            Berita
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>Detail Berita</Typography>
        </Breadcrumbs>

        <Stack spacing={4}>
          <Box>
            <Chip
              label={news.category}
              color="primary"
              size="small"
              sx={{ mb: 2, fontWeight: 700, textTransform: 'capitalize', borderRadius: '8px' }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1 }}>
              {news.title}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {news.date}
            </Typography>
          </Box>

          {news.image && (
            <Box
              component="img"
              src={news.image}
              alt={news.title}
              sx={{
                width: '100%',
                maxHeight: '600px',
                objectFit: 'cover',
                borderRadius: '32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}
            />
          )}

          <Paper elevation={0} sx={{ p: { xs: 0, md: 2 } }}>
            <Box
              sx={{
                '& p': { mb: 3, fontSize: '1.125rem', lineHeight: 1.7 },
                '& img': { borderRadius: '24px', my: 3, maxWidth: '100%', height: 'auto' },
                '& ul, ol': { ml: 4, mb: 3 },
                '& h1, h2, h3, h4': { mt: 4, mb: 2, fontWeight: 700 }
              }}
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </Paper>

          <Box sx={{ mt: 6 }}>
            <CommentSection newsId={id} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default NewsDetail;
