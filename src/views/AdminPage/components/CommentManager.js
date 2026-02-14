import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Check as CheckIcon, Delete as TrashIcon, Reply as ReplyIcon } from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, news(title)')
      .order('created_at', { ascending: false });
    if (!error) setComments(data);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const approveComment = async (id) => {
    const { error } = await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    if (!error) {
      setSnackbar({ open: true, message: 'Komentar disetujui', severity: 'success' });
      fetchComments();
    }
  };

  const deleteComment = async (id) => {
    if (window.confirm('Hapus komentar ini?')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) {
        setSnackbar({ open: true, message: 'Komentar dihapus', severity: 'success' });
        fetchComments();
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent) return;
    const { error } = await supabase.from('comments').insert([{
      news_id: replyingTo.news_id,
      parent_id: replyingTo.id,
      name: 'Admin Desa Ngawonggo',
      email: 'admin@ngawonggo.desa.id',
      content: replyContent,
      is_approved: true
    }]);
    if (!error) {
      setSnackbar({ open: true, message: 'Balasan terkirim', severity: 'success' });
      setOpen(false);
      setReplyContent('');
      fetchComments();
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Komentar</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Berita</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32 }}>{c.name[0]}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(c.created_at).toLocaleString()}</Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{c.news?.title || 'Unknown'}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={c.is_approved ? 'Approved' : 'Pending'}
                    size="small"
                    color={c.is_approved ? 'success' : 'warning'}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {!c.is_approved && (
                      <IconButton size="small" color="success" onClick={() => approveComment(c.id)}><CheckIcon fontSize="small" /></IconButton>
                    )}
                    <IconButton size="small" onClick={() => { setReplyingTo(c); setOpen(true); }}><ReplyIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteComment(c.id)}><TrashIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Balas Komentar</DialogTitle>
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: '16px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{replyingTo?.name}</Typography>
            <Typography variant="body2">{replyingTo?.content}</Typography>
          </Paper>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Tulis balasan admin..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleReply}>Kirim Balasan</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentManager;
