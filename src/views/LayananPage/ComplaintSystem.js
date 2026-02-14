import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as PaperPlaneIcon,
  Image as ImageIcon,
  Sync as SyncIcon,
  Logout as SignOutAltIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import { uploadDeline } from '../../lib/uploader';

const generateComplaintId = () => {
  return 'NGA-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

const ComplaintSystem = () => {
  const [complaintId, setComplaintId] = useState(localStorage.getItem('complaint_id') || '');
  const [complaintData, setComplaintData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('Infrastruktur');
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchComplaint = useCallback(async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setComplaintData(data);
      const { data: msgData, error: msgError } = await supabase
        .from('complaint_messages')
        .select('*')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (!msgError && msgData) {
        setMessages(msgData);
      }
    } else {
      setComplaintId('');
      localStorage.removeItem('complaint_id');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (complaintId) {
      fetchComplaint(complaintId);
      const subscription = supabase
        .channel('complaint_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaint_messages', filter: `complaint_id=eq.${complaintId}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [complaintId, fetchComplaint]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartComplaint = async (e) => {
    e.preventDefault();
    if (!name || !contact || !newMessage) return;

    setLoading(true);
    const newId = generateComplaintId();

    try {
      const { error: cError } = await supabase
        .from('complaints')
        .insert([{
          id: newId,
          name: name,
          contact: contact,
          category: category
        }]);

      if (cError) throw cError;

      const { error: mError } = await supabase
        .from('complaint_messages')
        .insert([{
          complaint_id: newId,
          sender_type: 'user',
          message: newMessage
        }]);

      if (mError) throw mError;

      setComplaintId(newId);
      localStorage.setItem('complaint_id', newId);
      setNewMessage('');
    } catch (err) {
      setSnackbar({ open: true, message: `Gagal membuat pengaduan: ${err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (imgUrl = null) => {
    if (!newMessage && !imgUrl) return;

    try {
      const { error } = await supabase
        .from('complaint_messages')
        .insert([{
          complaint_id: complaintId,
          sender_type: 'user',
          message: newMessage,
          image_url: imgUrl
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      setSnackbar({ open: true, message: `Gagal mengirim pesan: ${err.message}`, severity: 'error' });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File terlalu besar, maksimal 2MB', severity: 'warning' });
      return;
    }

    setUploading(true);
    try {
      const link = await uploadDeline(file);
      await handleSendMessage(link);
    } catch (err) {
      setSnackbar({ open: true, message: `Gagal upload gambar: ${err.message}`, severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    setComplaintId('');
    setComplaintData(null);
    setMessages([]);
    localStorage.removeItem('complaint_id');
  };

  if (!complaintId) {
    return (
      <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', maxWidth: '800px', mx: 'auto', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 1.5 }}>Sampaikan Aspirasi & Keluhan Anda</Typography>
            <Typography variant="body1" color="text.secondary">
              Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga. Sampaikan pengaduan atau saran Anda melalui formulir ini.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {['Proses Cepat', 'Langsung Diterima', 'Kerahasiaan Terjamin'].map((text, idx) => (
              <Grid item xs={12} md={4} key={text}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: idx === 0 ? '#e6fffa' : idx === 1 ? '#ebf8ff' : '#faf5ff'
                }}>
                   <CheckCircleIcon sx={{ fontSize: 16, color: idx === 0 ? '#38a169' : idx === 1 ? '#3182ce' : '#805ad5' }} />
                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>{text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <form onSubmit={handleStartComplaint}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Kontak (WA/Email)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Kategori"
                  sx={{ borderRadius: '16px' }}
                >
                  <MenuItem value="Infrastruktur">Infrastruktur</MenuItem>
                  <MenuItem value="Pelayanan Publik">Pelayanan Publik</MenuItem>
                  <MenuItem value="Keamanan & Ketertiban">Keamanan & Ketertiban</MenuItem>
                  <MenuItem value="Saran & Kritik">Saran & Kritik</MenuItem>
                  <MenuItem value="Lainnya">Lainnya</MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Isi Pengaduan"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ceritakan detail pengaduan atau aspirasi Anda..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                size="large"
                sx={{ borderRadius: '100px', height: 56, fontWeight: 800, fontSize: '1rem' }}
              >
                {loading ? 'Mengirim...' : 'Kirim Pengaduan Sekarang'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block' }}>Sudah punya ID Pengaduan?</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="NGA-XXXXX"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if(trackId.trim()) {
                    setComplaintId(trackId.trim());
                    localStorage.setItem('complaint_id', trackId.trim());
                  }
                }}
                sx={{ borderRadius: '12px' }}
              >
                Lacak
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '800px', mx: 'auto', height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{complaintData?.name?.[0] || 'U'}</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{complaintData?.name || 'User'}</Typography>
            <Stack direction="row" spacing={1}>
               <Chip label={complaintId} size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 800, bgcolor: 'secondary.container', color: 'secondary.onContainer' }} />
               <Chip
                  label={complaintData?.status === 'resolved' ? 'Selesai' : 'Diproses'}
                  size="small"
                  color={complaintData?.status === 'resolved' ? 'success' : 'warning'}
                  sx={{ height: 16, fontSize: '9px', fontWeight: 800 }}
               />
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row">
          <IconButton size="small" onClick={() => fetchComplaint(complaintId)} disabled={loading}>
            <SyncIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleLogout} color="error">
            <SignOutAltIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1, mb: 2, '&::-webkit-scrollbar': { width: '4px' } }}>
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Box key={msg.id} sx={{ alignSelf: msg.sender_type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  bgcolor: msg.sender_type === 'user' ? 'primary.main' : 'grey.100',
                  color: msg.sender_type === 'user' ? 'white' : 'text.primary',
                  borderBottomRightRadius: msg.sender_type === 'user' ? 0 : '16px',
                  borderBottomLeftRadius: msg.sender_type === 'user' ? '16px' : 0,
                }}
              >
                {msg.message && <Typography variant="body2">{msg.message}</Typography>}
                {msg.image_url && (
                  <Box
                    component="img"
                    src={msg.image_url}
                    sx={{ mt: 1, borderRadius: '12px', maxHeight: '200px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => window.open(msg.image_url)}
                  />
                )}
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, textAlign: 'right', fontSize: '10px' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Stack>
      </Box>

      {/* Input */}
      {complaintData?.status !== 'resolved' ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }}
          />
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
          <IconButton onClick={() => fileInputRef.current.click()} disabled={uploading}>
            <ImageIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleSendMessage()} disabled={!newMessage && !uploading}>
            <PaperPlaneIcon />
          </IconButton>
        </Stack>
      ) : (
        <Alert severity="success" sx={{ borderRadius: '12px' }}>
          Pengaduan ini telah ditandai sebagai Selesai oleh Admin.
        </Alert>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ComplaintSystem;
