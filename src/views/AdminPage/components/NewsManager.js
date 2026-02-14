import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as TrashIcon, Add as PlusIcon } from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    video_url: '',
    date: '',
    content: '',
    category: 'pemerintahan',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchNews = useCallback(async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setSnackbar({ open: true, message: 'Error fetching news: ' + error.message, severity: 'error' });
    } else {
      setNews(data);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingNews(null);
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData(item);
    handleOpen();
  };

  const handleAddNew = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      image: '',
      video_url: '',
      date: new Date().toLocaleDateString('id-ID'),
      content: '',
      category: 'pemerintahan',
    });
    handleOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus berita ini?')) {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) {
        setSnackbar({ open: true, message: 'Error deleting: ' + error.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Berhasil dihapus', severity: 'success' });
        fetchNews();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNews) {
      const { error } = await supabase
        .from('news')
        .update(formData)
        .eq('id', editingNews.id);
      if (error) {
        setSnackbar({ open: true, message: 'Error updating: ' + error.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Berhasil diupdate', severity: 'success' });
        handleClose();
        fetchNews();
      }
    } else {
      const { error } = await supabase.from('news').insert([formData]);
      if (error) {
        setSnackbar({ open: true, message: 'Error adding: ' + error.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Berhasil ditambah', severity: 'success' });
        handleClose();
        fetchNews();
      }
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Manajemen Berita</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddNew} sx={{ borderRadius: '100px' }}>
          Tambah Berita
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Gambar</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Judul</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tanggal</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={item.image}
                    sx={{ height: 40, width: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.625rem' }} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}><TrashIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>{editingNews ? 'Edit Berita' : 'Tambah Berita'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                required
                fullWidth
                label="Judul"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="URL Gambar"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="URL Video (Opsional)"
                  value={formData.video_url}
                  placeholder="https://youtube.com/..."
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="Tanggal"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                <FormControl fullWidth>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={formData.category}
                    label="Kategori"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <MenuItem value="pemerintahan">Pemerintahan</MenuItem>
                    <MenuItem value="pendidikan">Pendidikan</MenuItem>
                    <MenuItem value="kesehatan">Kesehatan</MenuItem>
                    <MenuItem value="umum">Umum</MenuItem>
                    <MenuItem value="ekonomi">Ekonomi</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Konten Berita</Typography>
                <Box sx={{ bgcolor: 'white', color: 'black' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(val) => setFormData({...formData, content: val})}
                    modules={quillModules}
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Batal</Button>
            <Button variant="contained" type="submit">Simpan</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsManager;
