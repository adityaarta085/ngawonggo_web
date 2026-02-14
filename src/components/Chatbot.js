import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Collapse,
  Stack,
  Typography,
  TextField,
  Avatar,
  Paper,
  Fab,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as RobotIcon,
} from '@mui/icons-material';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Halo! Saya Asisten Digital Desa Ngawonggo. Ada yang bisa saya bantu?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleToggle = () => setOpen(!open);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages([...messages, userMsg]);
    setInput("");

    setTimeout(() => {
      let botText = "Maaf, saya belum memahami pertanyaan tersebut. Silakan hubungi kantor desa untuk informasi lebih lanjut.";
      const lowInput = input.toLowerCase();

      if (lowInput.includes("layanan") || lowInput.includes("surat")) {
        botText = "Untuk layanan surat menyurat, Anda bisa datang ke kantor desa pada jam kerja (Senin-Jumat, 08:00 - 15:00) atau cek menu Layanan Publik.";
      } else if (lowInput.includes("wisata") || lowInput.includes("jalan")) {
        botText = "Desa Ngawonggo memiliki wisata alam yang indah. Cek menu Potensi Desa untuk melihat daftar destinasi wisata kami.";
      } else if (lowInput.includes("halo") || lowInput.includes("pagi") || lowInput.includes("siang")) {
        botText = "Halo juga! Ada yang bisa saya bantu hari ini?";
      }

      setMessages(prev => [...prev, { text: botText, isBot: true }]);
    }, 1000);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: { xs: 80, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 2000 }}>
      <Collapse in={open}>
        <Paper
          elevation={24}
          sx={{
            width: { xs: '300px', md: '350px' },
            height: '450px',
            borderRadius: '24px',
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
                <RobotIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>Asisten Desa</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Online</Typography>
              </Box>
            </Stack>
            <IconButton size="small" sx={{ color: 'white' }} onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  bgcolor: msg.isBot ? 'white' : 'primary.main',
                  color: msg.isBot ? 'text.primary' : 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '16px',
                  borderTopLeftRadius: msg.isBot ? 0 : '16px',
                  borderTopRightRadius: msg.isBot ? '16px' : 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  maxWidth: '85%',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <TextField
              placeholder="Ketik pesan..."
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {!open && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleToggle}
          sx={{ width: 64, height: 64 }}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Chatbot;
