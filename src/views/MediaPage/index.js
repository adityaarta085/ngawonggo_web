import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Tabs,
  Tab,
  Slider,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import {
  Radio as BroadcastTowerIcon,
  Tv as TvIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

const MediaPage = () => {
  const { language } = useLanguage();
  const t = translations[language].media;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [activeTab, setActiveTab] = useState(0);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (playerRef.current) {
      playerRef.current.volume(volume / 100);
    }
  }, [volume]);

  useEffect(() => {
    if (activeTab === 1 && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
          type: 'application/x-mpegURL'
        }]
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [activeTab]);

  const toggleRadio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip label="LIVE STREAMING" color="primary" sx={{ fontWeight: 800, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>{t.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              {t.subtitle}
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: '100px', p: 1, alignSelf: 'center', mb: 2 }} elevation={0}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': { height: 0 },
                '& .MuiTab-root': {
                  borderRadius: '100px',
                  px: 4,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' }
                }
              }}
            >
              <Tab icon={<BroadcastTowerIcon sx={{ mr: 1 }} />} label="Radio Gemilang" iconPosition="start" />
              <Tab icon={<TvIcon sx={{ mr: 1 }} />} label="TVRI Nasional" iconPosition="start" />
            </Tabs>
          </Paper>

          {activeTab === 0 ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '32px', height: '100%' }} elevation={0}>
                  <Stack spacing={4} alignItems="center">
                    <Box sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: 'primary.container', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                      <BroadcastTowerIcon sx={{ fontSize: 64 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>Radio Gemilang</Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>98.6 FM</Typography>
                    </Box>
                    <IconButton
                      onClick={toggleRadio}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: '0 8px 16px rgba(19, 127, 236, 0.3)'
                      }}
                    >
                      {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayIcon sx={{ fontSize: 40 }} />}
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 300 }}>
                      <VolumeUpIcon color="disabled" />
                      <Slider value={volume} onChange={(e, v) => setVolume(v)} size="small" />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 6, borderRadius: '32px', bgcolor: 'primary.main', color: 'white', height: '100%' }} elevation={0}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Tentang Radio Gemilang</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, mb: 4 }}>
                    Radio Gemilang 98.6 FM adalah stasiun radio pemerintah Kabupaten Magelang.
                    Menyajikan informasi terkini seputar Magelang, hiburan musik pilihan, dan program edukasi untuk masyarakat.
                  </Typography>
                  <Stack spacing={1.5}>
                    <Chip label="LIVE - 24 Jam Nonstop" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, alignSelf: 'flex-start' }} />
                    <Chip label="NEWS - Info Kabupaten" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, alignSelf: 'flex-start' }} />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Stack spacing={4}>
              <Box sx={{ borderRadius: '32px', overflow: 'hidden', bgcolor: 'black', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div data-vjs-player>
                  <video ref={videoRef} className="video-js vjs-big-play-centered vjs-16-9" />
                </div>
              </Box>
              <Paper sx={{ p: 4, borderRadius: '24px' }} elevation={0}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>TVRI Nasional</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Saksikan siaran TVRI Nasional secara langsung. Menghadirkan berita nasional, program kebudayaan, dan edukasi untuk seluruh rakyat Indonesia.
                </Typography>
              </Paper>
            </Stack>
          )}
        </Stack>
      </Container>
      <audio ref={audioRef} src="https://streaming-radio.magelangkab.go.id/studio" preload="none" />
    </Box>
  );
};

export default MediaPage;
