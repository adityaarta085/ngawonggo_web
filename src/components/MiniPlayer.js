import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Collapse,
  Button,
  Tabs,
  Tab,
  Slider,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Radio as BroadcastTowerIcon,
  Tv as TvIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeMuteIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const MiniPlayer = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const handleToggle = () => setOpen(!open);

  const toggleRadio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
    if (playerRef.current) {
      playerRef.current.volume(volume / 100);
      playerRef.current.muted(isMuted);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (activeTab === 1 && !playerRef.current && videoRef.current) {
      const player = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
          type: 'application/x-mpegURL'
        }]
      });
      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (isPlaying) {
      if (newValue === 1) {
        audioRef.current?.pause();
      } else {
        playerRef.current?.pause();
      }
      setIsPlaying(false);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 2000 }}>
      <Collapse in={open}>
        <Paper
          elevation={24}
          sx={{
            p: 2,
            borderRadius: '24px',
            width: { xs: '300px', md: '350px' },
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.1em' }}>
              MEDIA PLAYER
            </Typography>
            <IconButton size="small" onClick={handleToggle}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 'auto',
              mb: 2,
              '& .MuiTabs-indicator': { height: 0 },
              '& .MuiTab-root': {
                minHeight: 'auto',
                py: 1,
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'none',
              },
              '& .Mui-selected': { bgcolor: 'primary.main', color: 'white !important' },
            }}
          >
            <Tab icon={<BroadcastTowerIcon sx={{ fontSize: '1rem', mr: 0.5 }} />} label="Radio" iconPosition="start" />
            <Tab icon={<TvIcon sx={{ fontSize: '1rem', mr: 0.5 }} />} label="TVRI" iconPosition="start" />
          </Tabs>

          {activeTab === 0 ? (
            <Stack spacing={2} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: '16px', textAlign: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Gemilang FM 98.6</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Live Streaming</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  onClick={toggleRadio}
                  color="primary"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
                </IconButton>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ borderRadius: '16px', overflow: 'hidden', bgcolor: 'black' }}>
              <div data-vjs-player>
                <video ref={videoRef} className="video-js vjs-big-play-centered" />
              </div>
            </Box>
          )}

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3, px: 1 }}>
            <IconButton size="small" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeMuteIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
            <Slider
              value={volume}
              onChange={(e, v) => setVolume(v)}
              min={0}
              max={100}
              size="small"
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        </Paper>
      </Collapse>

      <Tooltip title={open ? "Minimize" : "Live Radio & TV"} placement="left">
        <Button
          onClick={handleToggle}
          variant="contained"
          size="large"
          startIcon={open ? <ChevronDownIcon /> : <BroadcastTowerIcon />}
          sx={{
            borderRadius: '100px',
            px: 4,
            height: 56,
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(19, 127, 236, 0.3)',
          }}
        >
          {open ? "Tutup" : "Live Media"}
        </Button>
      </Tooltip>

      <audio
        ref={audioRef}
        src="https://streaming-radio.magelangkab.go.id/studio"
        preload="none"
      />
    </Box>
  );
};

export default MiniPlayer;
