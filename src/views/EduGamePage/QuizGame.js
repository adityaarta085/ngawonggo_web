import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  Chip,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

const questions = [
  {
    question: "Apa singkatan dari SPBE?",
    options: [
      "Sistem Pemerintahan Berbasis Elektronik",
      "Sistem Pengelolaan Berita Elektronik",
      "Sistem Pelayanan Bocah Edan",
      "Sistem Pembangunan Berbasis Ekonomi"
    ],
    answer: 0
  },
  {
    question: "Tahun berapa Desa Ngawonggo ditargetkan menjadi model Desa Digital?",
    options: ["2025", "2030", "2045", "2100"],
    answer: 2
  },
  {
    question: "Teknologi apa yang digunakan untuk mengirim data internet super cepat melalui kabel?",
    options: ["Kabel Listrik", "Fiber Optik", "Pipa Air", "Tali Jemuran"],
    answer: 1
  },
  {
    question: "Apa fungsi utama AI (Artificial Intelligence)?",
    options: [
      "Menggantikan manusia tidur",
      "Meniru kecerdasan manusia untuk tugas tertentu",
      "Membuat kopi secara otomatis",
      "Menghapus semua data internet"
    ],
    answer: 1
  }
];

const QuizGame = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleNext = () => {
    if (selected === '') {
      setSnackbar(true);
      return;
    }

    if (parseInt(selected) === questions[currentStep].answer) {
      setScore(score + 1);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected('');
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <Paper sx={{ p: 6, borderRadius: '32px', textAlign: 'center' }}>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>Kuis Selesai!</Typography>
          <Typography variant="h5">Skor Kamu: {score} / {questions.length}</Typography>
          <Chip
            label={score === questions.length ? "Luar Biasa! Ahli Teknologi!" : "Bagus! Terus Belajar!"}
            color={score === questions.length ? "success" : "primary"}
            sx={{ fontWeight: 800, py: 3, height: 'auto', borderRadius: '12px' }}
          />
          <Stack spacing={2}>
            <Button variant="contained" size="large" fullWidth onClick={() => {
              setCurrentStep(0);
              setScore(0);
              setIsFinished(false);
              setSelected('');
            }} sx={{ borderRadius: '100px' }}>Main Lagi</Button>
            <Button variant="text" onClick={onBack}>Kembali ke Menu</Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: '32px', width: '100%', maxWidth: '600px' }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>Kuis Tekno-Sains</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>{currentStep + 1} / {questions.length}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((currentStep + 1) / questions.length) * 100}
          sx={{ height: 10, borderRadius: 5 }}
        />

        <Box sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{questions[currentStep].question}</Typography>
          <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
            <Stack spacing={1.5}>
              {questions[currentStep].options.map((opt, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: 0.5,
                    px: 2,
                    borderRadius: '16px',
                    borderColor: selected === idx.toString() ? 'primary.main' : 'divider',
                    bgcolor: selected === idx.toString() ? 'primary.lighter' : 'transparent',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <FormControlLabel
                    value={idx.toString()}
                    control={<Radio />}
                    label={<Typography variant="body1">{opt}</Typography>}
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          sx={{ borderRadius: '100px', height: 56, fontWeight: 700 }}
        >
          {currentStep === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
        </Button>
        <Button variant="text" onClick={onBack}>Menyerah</Button>
      </Stack>
      <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}>
        <Alert severity="warning">Pilih jawaban dulu ya!</Alert>
      </Snackbar>
    </Paper>
  );
};

export default QuizGame;
