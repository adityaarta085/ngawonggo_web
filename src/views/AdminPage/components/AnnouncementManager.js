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
  Switch,
  FormControlLabel,
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as TrashIcon, Add as PlusIcon } from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('id', { ascending: false });

    if (error) setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
    else setAnnouncements(data);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

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
    setFormData({ content: '', is_active: true });
    handleOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pengumuman ini?')) {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) setSnackbar({ open: true, message: 'Gagal menghapus', severity: 'error' });
      else { fetchAnnouncements(); setSnackbar({ open: true, message: 'Dihapus', severity: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('announcements').update(formData).eq('id', editingItem.id);
      if (error) setSnackbar({ open: true, message: 'Gagal update', severity: 'error' });
      else { handleClose(); fetchAnnouncements(); setSnackbar({ open: true, message: 'Berhasil diupdate', severity: 'success' }); }
    } else {
      const { error } = await supabase.from('announcements').insert([formData]);
      if (error) setSnackbar({ open: true, message: 'Gagal tambah', severity: 'error' });
      else { handleClose(); fetchAnnouncements(); setSnackbar({ open: true, message: 'Berhasil ditambah', severity: 'success' }); }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Manajemen Running Text</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddNew} sx={{ borderRadius: '100px' }}>
          Tambah Pengumuman
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Isi Pengumuman</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.content}
                </TableCell>
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

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>{editingItem ? 'Edit' : 'Tambah'} Pengumuman</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField required fullWidth label="Isi Pengumuman" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
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

export default AnnouncementManager;
