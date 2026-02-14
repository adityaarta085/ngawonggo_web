import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Slider,
  Chip,
  Paper,
  Link,
  Avatar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeMuteIcon,
  Radio as RadioIcon
} from '@mui/icons-material';

export default function RadioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="stretch">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>Radio Gemilang</Typography>
            <Chip label="98.6 FM" color="primary" sx={{ fontWeight: 800 }} />
          </Box>

          <Paper elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'primary.main', p: 6, color: 'white', textAlign: 'center' }}>
              <Stack spacing={3} alignItems="center">
                <Avatar sx={{ width: 120, height: 120, bgcolor: 'white', color: 'primary.main' }}>
                  <RadioIcon sx={{ fontSize: 64 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Radio Gemilang 98.6 FM</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Streaming Langsung dari Magelang</Typography>
                <Chip
                  label={isPlaying ? '🔴 LIVE' : '⚪ OFFLINE'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800 }}
                />
              </Stack>
            </Box>

            <Box sx={{ p: 6 }}>
              <Stack spacing={4} alignItems="center">
                <IconButton
                  onClick={togglePlay}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    boxShadow: '0 10px 20px rgba(19, 127, 236, 0.3)'
                  }}
                >
                  {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayIcon sx={{ fontSize: 40 }} />}
                </IconButton>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
                  <IconButton size="small" onClick={toggleMute}>
                    {isMuted ? <VolumeMuteIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                  </IconButton>
                  <Slider value={volume} onChange={(e, v) => setVolume(v)} size="small" />
                  <Typography variant="caption" sx={{ minWidth: 35, fontWeight: 700 }}>{volume}%</Typography>
                </Stack>
              </Stack>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: '24px' }} elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
              Tentang Radio Gemilang 98.6 FM
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              Radio Gemilang 98.6 FM adalah stasiun radio yang melayani masyarakat Kabupaten Magelang dengan berbagai program menarik dan informasi terkini.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {['Berita', 'Musik', 'Hiburan', 'Informasi'].map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
              ))}
            </Stack>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Website Resmi:</Typography>
              <Link href="https://gemilangfm.id/" target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', fontWeight: 700 }}>
                https://gemilangfm.id/
              </Link>
            </Box>
          </Paper>
        </Stack>
      </Container>
      <audio ref={audioRef} src="https://streaming-radio.magelangkab.go.id/studio" preload="none" />
    </Box>
  );
}
