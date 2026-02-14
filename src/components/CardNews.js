import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  CardActionArea
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function CardNews({ id, title, image, caption, date }) {
  return (
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
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/news/${id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ height: 200 }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Chip
            label={date}
            size="small"
            color="success"
            sx={{ mb: 2, fontWeight: 700, borderRadius: '8px' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Box
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/news/${id}`}
          size="small"
          variant="outlined"
          fullWidth
          sx={{ borderRadius: '100px' }}
        >
          Selengkapnya
        </Button>
      </Box>
    </Card>
  );
}
