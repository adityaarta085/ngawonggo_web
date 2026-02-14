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

const InstitutionManager = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', category: 'lembaga' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: false });
    if (error) setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
    else setItems(data);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
    setFormData({ title: '', image: '', category: 'lembaga' });
    handleOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus lembaga ini?')) {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) setSnackbar({ open: true, message: 'Gagal menghapus', severity: 'error' });
      else { fetchItems(); setSnackbar({ open: true, message: 'Dihapus', severity: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('institutions').update(formData).eq('id', editingItem.id);
      if (error) setSnackbar({ open: true, message: 'Gagal update', severity: 'error' });
      else { handleClose(); fetchItems(); setSnackbar({ open: true, message: 'Berhasil diupdate', severity: 'success' }); }
    } else {
      const { error } = await supabase.from('institutions').insert([formData]);
      if (error) setSnackbar({ open: true, message: 'Gagal tambah', severity: 'error' });
      else { handleClose(); fetchItems(); setSnackbar({ open: true, message: 'Berhasil ditambah', severity: 'success' }); }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Manajemen Lembaga Desa</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddNew} sx={{ borderRadius: '100px' }}>
          Tambah Lembaga
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Logo/Gambar</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nama</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={item.image}
                    sx={{ height: 40, width: 60, objectFit: 'contain', borderRadius: 1, bgcolor: 'grey.50', p: 0.5 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{item.title}</TableCell>
                <TableCell><Chip label={item.category} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.625rem' }} /></TableCell>
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
          <DialogTitle sx={{ fontWeight: 800 }}>{editingItem ? 'Edit' : 'Tambah'} Lembaga</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField required fullWidth label="Nama Lembaga" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <TextField required fullWidth label="URL Logo/Gambar" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={formData.category}
                  label="Kategori"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <MenuItem value="lembaga">Lembaga Desa</MenuItem>
                  <MenuItem value="umkm">UMKM</MenuItem>
                  <MenuItem value="organisasi">Organisasi</MenuItem>
                </Select>
              </FormControl>
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

export default InstitutionManager;
