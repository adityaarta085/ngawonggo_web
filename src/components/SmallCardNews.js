import React from 'react';
import {

  Card,
  CardMedia,
  Typography,
  Stack,
  CardContent,
  Chip,
  Button,
  CardActionArea
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const SmallCardNews = ({ id, image, title, date }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: '24px',
        overflow: 'hidden',
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
      <CardActionArea
        component={RouterLink}
        to={`/news/${id}`}
        sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', sm: 200, lg: 250 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
          image={image}
          alt={title}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Chip
              label={date}
              size="small"
              sx={{ alignSelf: 'flex-start', fontSize: '0.75rem', borderRadius: '8px' }}
            />
            <Button
              component={RouterLink}
              to={`/news/${id}`}
              variant="text"
              size="small"
              sx={{ alignSelf: 'flex-start', px: 0, mt: 1, textTransform: 'none', fontWeight: 700 }}
            >
              Selengkapnya →
            </Button>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SmallCardNews;
