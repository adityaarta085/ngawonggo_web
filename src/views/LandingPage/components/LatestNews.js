import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Stack,
  CardActionArea,
} from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { Link as RouterLink } from 'react-router-dom';

const NewsCard = ({ id, title, date, category, image, video_url, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          borderRadius: '28px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.3s, border-color 0.3s',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            borderColor: 'primary.main'
          },
        }}
      >
        <CardActionArea component={RouterLink} to={`/news/${id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{ height: 240, objectFit: 'cover' }}
            />
            {video_url && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  p: 1.5,
                  display: 'flex'
                }}
              >
                <PlayIcon color="primary" />
              </Box>
            )}
            <Chip
              label={category}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                fontWeight: 700,
                borderRadius: '8px'
              }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
              {date}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.4, mb: 2 }}>
              {title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: 'primary.main', fontWeight: 700, display: 'flex', alignItems: 'center' }}
            >
              Selengkapnya →
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

const LatestNews = () => {
  const { language } = useLanguage();
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false })
        .limit(3);
      if (!error && data) setNewsItems(data);
    };
    fetchNews();
  }, []);

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          sx={{ mb: 6 }}
          spacing={2}
        >
          <Box>
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
              {language === 'id' ? 'Kabar Terbaru' : 'Latest Updates'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {language === 'id' ? 'Berita Desa Ngawonggo' : 'Ngawonggo Village News'}
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/news"
            variant="text"
            sx={{ fontWeight: 700, fontSize: '1rem', textTransform: 'none' }}
            endIcon={<span>→</span>}
          >
            {language === 'id' ? 'Lihat Semua' : 'View All'}
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {newsItems.map((news, index) => (
            <Grid item xs={12} md={4} key={news.id}>
              <NewsCard id={news.id} {...news} delay={index * 0.1} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestNews;
