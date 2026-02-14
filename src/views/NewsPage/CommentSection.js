import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { Reply as ReplyIcon } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

const CommentItem = ({ comment, allComments, newsId, onCommentAdded }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyData, setReplyData] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const replies = allComments.filter(c => c.parent_id === comment.id);

  const handleReply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          news_id: newsId,
          parent_id: comment.id,
          name: replyData.name,
          email: replyData.email,
          content: replyData.content,
          is_approved: false
        }]);

      if (error) throw error;
      setSnackbar({ open: true, message: 'Balasan terkirim, menunggu persetujuan admin', severity: 'success' });
      setShowReply(false);
      setReplyData({ name: '', email: '', content: '' });
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setSnackbar({ open: true, message: `Gagal mengirim balasan: ${err.message}`, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, pl: comment.parent_id ? 4 : 0, borderLeft: comment.parent_id ? "2px solid" : "none", borderColor: 'divider' }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ width: 32, height: 32 }} src={null}>{comment.name[0]}</Avatar>
        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{comment.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(comment.created_at).toLocaleDateString()}</Typography>
          </Stack>
          <Typography variant="body2">{comment.content}</Typography>
          <Button
            size="small"
            startIcon={<ReplyIcon />}
            onClick={() => setShowReply(!showReply)}
            sx={{ alignSelf: 'flex-start', textTransform: 'none', py: 0 }}
          >
            Balas
          </Button>

          {showReply && (
            <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: '16px', bgcolor: 'grey.50' }}>
              <form onSubmit={handleReply}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      required
                      size="small"
                      label="Nama"
                      fullWidth
                      value={replyData.name}
                      onChange={(e) => setReplyData({...replyData, name: e.target.value})}
                      sx={{ bgcolor: 'white' }}
                    />
                    <TextField
                      size="small"
                      label="Email (Opsional)"
                      fullWidth
                      value={replyData.email}
                      onChange={(e) => setReplyData({...replyData, email: e.target.value})}
                      sx={{ bgcolor: 'white' }}
                    />
                  </Stack>
                  <TextField
                    required
                    multiline
                    rows={2}
                    size="small"
                    label="Tulis balasan..."
                    fullWidth
                    value={replyData.content}
                    onChange={(e) => setReplyData({...replyData, content: e.target.value})}
                    sx={{ bgcolor: 'white' }}
                  />
                  <Button size="small" variant="contained" type="submit" disabled={submitting}>
                    {submitting ? 'Mengirim...' : 'Kirim Balasan'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          )}

          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              newsId={newsId}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </Stack>
      </Stack>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const CommentSection = ({ newsId }) => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('news_id', newsId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          news_id: newsId,
          name: formData.name,
          email: formData.email,
          content: formData.content,
          is_approved: false
        }]);

      if (error) throw error;
      setSnackbar({ open: true, message: 'Komentar terkirim, menunggu persetujuan admin', severity: 'success' });
      setFormData({ name: '', email: '', content: '' });
    } catch (err) {
      setSnackbar({ open: true, message: `Gagal mengirim komentar: ${err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
        Komentar ({comments.length})
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '24px', borderStyle: 'dashed' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                label="Nama"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <TextField
                label="Email (Opsional)"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Stack>
            <TextField
              required
              multiline
              rows={3}
              label="Komentar"
              fullWidth
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Tulis komentar Anda..."
            />
            <Button variant="contained" type="submit" size="large" disabled={loading} sx={{ borderRadius: '100px' }}>
              {loading ? 'Mengirim...' : 'Kirim Komentar'}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Stack spacing={3}>
        {rootComments.length > 0 ? (
          rootComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              newsId={newsId}
              onCommentAdded={fetchComments}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Belum ada komentar yang disetujui.
          </Typography>
        )}
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentSection;
