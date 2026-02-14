import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Chip,
  Paper,
  Snackbar,
  Alert,

  Divider,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Delete as TrashIcon,
  Check as CheckIcon,
  Send as PaperPlaneIcon,
  Image as ImageIcon,
  ArrowBack as ArrowLeftIcon,
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';
import { uploadDeline } from '../../../lib/uploader';

const ComplaintManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchComplaints = useCallback(async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setComplaints(data);
  }, []);

  const fetchMessages = useCallback(async (id) => {
    const { data, error } = await supabase
      .from('complaint_messages')
      .select('*')
      .eq('complaint_id', id)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data);
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    if (selectedComplaint) {
      fetchMessages(selectedComplaint.id);
      const sub = supabase
        .channel(`admin_complaint_${selectedComplaint.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaint_messages', filter: `complaint_id=eq.${selectedComplaint.id}` },
        payload => setMessages(prev => [...prev, payload.new]))
        .subscribe();
      return () => supabase.removeChannel(sub);
    }
  }, [selectedComplaint, fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (imgUrl = null) => {
    if (!newMessage && !imgUrl) return;
    const { error } = await supabase
      .from('complaint_messages')
      .insert([{
        complaint_id: selectedComplaint.id,
        sender_type: 'admin',
        message: newMessage,
        image_url: imgUrl
      }]);
    if (!error) setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const link = await uploadDeline(file);
      await handleSendMessage(link);
    } finally {
      setUploading(false);
    }
  };

  const markResolved = async (id) => {
    const { error } = await supabase.from('complaints').update({ status: 'resolved' }).eq('id', id);
    if (!error) {
      setSnackbar({ open: true, message: 'Selesai', severity: 'success' });
      fetchComplaints();
      if(selectedComplaint?.id === id) setSelectedComplaint({...selectedComplaint, status: 'resolved'});
    }
  };

  const deleteComplaint = async (id) => {
    if (window.confirm('Hapus pengaduan ini?')) {
      const { error } = await supabase.from('complaints').delete().eq('id', id);
      if (!error) {
        setSnackbar({ open: true, message: 'Dihapus', severity: 'success' });
        fetchComplaints();
        if(selectedComplaint?.id === id) setSelectedComplaint(null);
      }
    }
  };

  if (selectedComplaint) {
    return (
      <Paper sx={{ p: 3, borderRadius: '24px', height: '600px', display: 'flex', flexDirection: 'column' }} elevation={0}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Stack spacing={0.5}>
            <Button startIcon={<ArrowLeftIcon />} size="small" variant="text" onClick={() => setSelectedComplaint(null)} sx={{ alignSelf: 'flex-start' }}>Kembali</Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedComplaint.name}</Typography>
              <Chip label={selectedComplaint.id} size="small" sx={{ fontWeight: 700 }} />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              <b>Kontak:</b> {selectedComplaint.contact} • <b>Kategori:</b> {selectedComplaint.category}
            </Typography>
          </Stack>
          <Chip
            label={selectedComplaint.status === 'resolved' ? 'Selesai' : 'Terbuka'}
            color={selectedComplaint.status === 'resolved' ? 'success' : 'warning'}
            sx={{ fontWeight: 800 }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, mb: 2, bgcolor: 'grey.50', borderRadius: '16px', '&::-webkit-scrollbar': { width: '4px' } }}>
           <Stack spacing={2}>
             {messages.map(msg => (
               <Box key={msg.id} sx={{ alignSelf: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                 <Paper
                   elevation={0}
                   sx={{
                     p: 1.5,
                     borderRadius: '16px',
                     bgcolor: msg.sender_type === 'admin' ? 'primary.main' : 'white',
                     color: msg.sender_type === 'admin' ? 'white' : 'text.primary',
                     borderBottomRightRadius: msg.sender_type === 'admin' ? 0 : '16px',
                     borderBottomLeftRadius: msg.sender_type === 'admin' ? '16px' : 0,
                     boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                   }}
                 >
                    {msg.message && <Typography variant="body2">{msg.message}</Typography>}
                    {msg.image_url && <Box component="img" src={msg.image_url} sx={{ mt: 1, borderRadius: '12px', maxHeight: 200, width: '100%', objectFit: 'cover' }} />}
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, textAlign: 'right', fontSize: '9px' }}>
                      {new Date(msg.created_at).toLocaleString()}
                    </Typography>
                 </Paper>
               </Box>
             ))}
             <div ref={chatEndRef} />
           </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Ketik balasan admin..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '100px' } }}
          />
          <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
          <IconButton onClick={() => fileInputRef.current.click()} disabled={uploading}><ImageIcon /></IconButton>
          <IconButton color="primary" onClick={() => handleSendMessage()} disabled={!newMessage && !uploading}><PaperPlaneIcon /></IconButton>
          {selectedComplaint.status !== 'resolved' && (
            <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => markResolved(selectedComplaint.id)} sx={{ borderRadius: '100px', whiteSpace: 'nowrap' }}>Selesaikan</Button>
          )}
        </Stack>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nama & Kontak</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map(c => (
              <TableRow key={c.id}>
                <TableCell><Chip label={c.id} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.contact}</Typography>
                </TableCell>
                <TableCell><Chip label={c.category} size="small" variant="outlined" sx={{ fontWeight: 700 }} /></TableCell>
                <TableCell>
                  <Chip
                    label={c.status === 'resolved' ? 'Selesai' : 'Terbuka'}
                    size="small"
                    color={c.status === 'resolved' ? 'success' : 'warning'}
                    sx={{ fontWeight: 800 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => setSelectedComplaint(c)}><ReplyIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="success" onClick={() => markResolved(c.id)} disabled={c.status === 'resolved'}><CheckIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteComplaint(c.id)}><TrashIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplaintManager;
