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
  Switch,
  FormControlLabel,
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as TrashIcon, Add as PlusIcon } from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

const PopupManager = () => {
  const [popups, setPopups] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    is_active: true,
    button_label: '',
    button_link: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPopups = useCallback(async () => {
    const { data, error } = await supabase
      .from('popups')
      .select('*')
      .order('id', { ascending: false });

    if (error) setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
    else setPopups(data);
  }, []);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    handleOpen();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      type: 'text',
      is_active: true,
      button_label: '',
      button_link: '',
    });
    handleOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus popup ini?')) {
      const { error } = await supabase.from('popups').delete().eq('id', id);
      if (error) setSnackbar({ open: true, message: 'Gagal menghapus', severity: 'error' });
      else { fetchPopups(); setSnackbar({ open: true, message: 'Dihapus', severity: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('popups').update(formData).eq('id', editingItem.id);
      if (error) setSnackbar({ open: true, message: 'Gagal update', severity: 'error' });
      else { handleClose(); fetchPopups(); setSnackbar({ open: true, message: 'Berhasil diupdate', severity: 'success' }); }
    } else {
      const { error } = await supabase.from('popups').insert([formData]);
      if (error) setSnackbar({ open: true, message: 'Gagal tambah', severity: 'error' });
      else { handleClose(); fetchPopups(); setSnackbar({ open: true, message: 'Berhasil ditambah', severity: 'success' }); }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Manajemen Popup Notifikasi</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddNew} sx={{ borderRadius: '100px' }}>
          Tambah Popup
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Judul</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipe</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {popups.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontWeight: 600 }}>{item.title}</TableCell>
                <TableCell>{item.type === 'image' ? 'Gambar' : 'Teks'}</TableCell>
                <TableCell>
                  <Typography sx={{ color: item.is_active ? 'success.main' : 'error.main', fontWeight: 800, fontSize: '0.875rem' }}>
                    {item.is_active ? 'Aktif' : 'Non-aktif'}
                  </Typography>
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>{editingItem ? 'Edit' : 'Tambah'} Popup</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField required fullWidth label="Judul" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <FormControl fullWidth>
                <InputLabel>Tipe</InputLabel>
                <Select
                  value={formData.type}
                  label="Tipe"
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <MenuItem value="text">Teks</MenuItem>
                  <MenuItem value="image">Gambar (URL)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                fullWidth
                multiline={formData.type === 'text'}
                rows={formData.type === 'text' ? 3 : 1}
                label={formData.type === 'image' ? 'URL Gambar' : 'Isi Teks'}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              {formData.type === 'image' && formData.content && (
                <Box component="img" src={formData.content} sx={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 2, bgcolor: 'grey.50' }} />
              )}
              <Divider />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Aksi Tombol (Opsional)</Typography>
              <TextField fullWidth label="Label Tombol" value={formData.button_label} onChange={(e) => setFormData({...formData, button_label: e.target.value})} />
              <TextField fullWidth label="Link Tombol" value={formData.button_link} onChange={(e) => setFormData({...formData, button_link: e.target.value})} />
              <FormControlLabel
                control={<Switch checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />}
                label="Aktifkan?"
              />
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

export default PopupManager;
