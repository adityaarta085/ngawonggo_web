import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Button,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import {
  SportsEsports as GamepadIcon,
  Extension as PuzzlePieceIcon,
  HelpOutline as QuestionCircleIcon,
  Hub as NetworkWiredIcon
} from '@mui/icons-material';
import QuizGame from './QuizGame';
import SortGame from './SortGame';
import NetworkGame from './NetworkGame';

const EduGamePage = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'network',
      title: 'Ngawonggo 2045: Jaringan Digital',
      desc: 'Misi menghubungkan infrastruktur digital desa untuk masa depan.',
      icon: NetworkWiredIcon,
      color: 'secondary',
      highlight: true,
      component: <NetworkGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'quiz',
      title: 'Kuis Tekno-Sains',
      desc: 'Uji wawasanmu tentang dunia teknologi dan sains populer.',
      icon: QuestionCircleIcon,
      color: 'primary',
      component: <QuizGame onBack={() => setActiveGame(null)} />,
    },
    {
      id: 'sort',
      title: 'Sortir Digital',
      desc: 'Bedakan mana teknologi analog dan mana yang sudah digital.',
      icon: PuzzlePieceIcon,
      color: 'warning',
      component: <SortGame onBack={() => setActiveGame(null)} />,
    },
  ];

  if (activeGame) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="md">
          {games.find(g => g.id === activeGame).component}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{ mb: 6, textAlign: 'center' }}>
          <Box>
            <Chip label="TEKNOLOGI & SAINS" color="primary" sx={{ fontWeight: 800, mb: 2 }} />
            <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
              Game Edukasi Desa
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', fontWeight: 400 }}>
              Mari belajar teknologi dengan cara yang seru! Pilih permainan di bawah ini untuk memulai petualangan digitalmu.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} md={4} key={game.id}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: '32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                }}
                elevation={0}
              >
                {game.highlight && (
                  <Chip
                    label="Pilihan Utama"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700 }}
                  />
                )}
                <Stack spacing={4} sx={{ height: '100%' }}>
                  <Avatar sx={{ bgcolor: `${game.color}.lighter`, color: `${game.color}.main`, width: 64, height: 64, borderRadius: '20px' }}>
                    <game.icon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{game.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{game.desc}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color={game.color}
                    fullWidth
                    size="large"
                    onClick={() => setActiveGame(game.id)}
                    startIcon={<GamepadIcon />}
                    sx={{ mt: 'auto', borderRadius: '100px' }}
                  >
                    Main Sekarang
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default EduGamePage;
