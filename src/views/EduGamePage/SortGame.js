import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import {
  Email as EnvelopeIcon,
  PhoneAndroid as MobileAltIcon,
  Keyboard as KeyboardIcon,
  Laptop as DesktopIcon,
  MenuBook as BookIcon,
  Wifi as WifiIcon,
  Mic as MicrophoneIcon
} from '@mui/icons-material';

const items = [
  { name: "Surat Kertas", type: "analog", icon: EnvelopeIcon },
  { name: "WhatsApp", type: "digital", icon: MobileAltIcon },
  { name: "Mesin Ketik", type: "analog", icon: KeyboardIcon },
  { name: "Laptop", type: "digital", icon: DesktopIcon },
  { name: "Buku Cetak", type: "analog", icon: BookIcon },
  { name: "E-Book", type: "digital", icon: WifiIcon },
  { name: "Kentongan", type: "analog", icon: MicrophoneIcon },
  { name: "E-Mail", type: "digital", icon: EnvelopeIcon },
];

const SortGame = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChoice = (choice) => {
    if (choice === items[currentIndex].type) {
      setScore(score + 1);
      setToast({ open: true, message: 'Benar!', severity: 'success' });
    } else {
      setToast({ open: true, message: 'Kurang Tepat', severity: 'error' });
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <Paper sx={{ p: 6, borderRadius: '32px', textAlign: 'center', width: '100%', maxWidth: '500px' }}>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>Permainan Selesai!</Typography>
          <Typography variant="h5">Kamu berhasil menyortir {score} dari {items.length} teknologi.</Typography>
          <Stack spacing={2}>
            <Button variant="contained" size="large" fullWidth onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsFinished(false);
            }} sx={{ borderRadius: '100px' }}>Main Lagi</Button>
            <Button variant="text" onClick={onBack}>Kembali ke Menu</Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  const currentItem = items[currentIndex];
  const IconComponent = currentItem.icon;

  return (
    <Paper sx={{ p: 4, borderRadius: '32px', width: '100%', maxWidth: '500px' }}>
      <Stack spacing={6} alignItems="stretch">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>Sortir Digital vs Analog</Typography>
          <Typography variant="body2" color="text.secondary">Tentukan kategori teknologi di bawah ini</Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 6,
            bgcolor: 'grey.50',
            borderRadius: '24px',
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'primary.light',
          }}
        >
          <IconComponent sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{currentItem.name}</Typography>
        </Paper>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              sx={{ height: 80, borderRadius: '20px', fontSize: '1.25rem', fontWeight: 800 }}
              onClick={() => handleChoice('analog')}
            >
              ANALOG
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ height: 80, borderRadius: '20px', fontSize: '1.25rem', fontWeight: 800 }}
              onClick={() => handleChoice('digital')}
            >
              DIGITAL
            </Button>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Skor: {score}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Progres: {currentIndex + 1} / {items.length}</Typography>
        </Stack>

        <Button variant="text" size="small" onClick={onBack}>Kembali</Button>
      </Stack>
      <Snackbar open={toast.open} autoHideDuration={1000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default SortGame;
