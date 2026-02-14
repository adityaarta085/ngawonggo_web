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
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as TrashIcon, Add as PlusIcon } from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

const StatsManager = () => {
  const [stats, setStats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({ label: '', value: '', icon: '', color: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchStats = useCallback(async () => {
    const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
    if (error) setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
    else setStats(data);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingStat(null);
  };

  const handleEdit = (item) => {
    setEditingStat(item);
    setFormData(item);
    handleOpen();
  };

  const handleAddNew = () => {
    setEditingStat(null);
    setFormData({ label: '', value: '', icon: 'FaUsers', color: '#137fec' });
    handleOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus statistik ini?')) {
      const { error } = await supabase.from('village_stats').delete().eq('id', id);
      if (error) setSnackbar({ open: true, message: 'Gagal menghapus', severity: 'error' });
      else { fetchStats(); setSnackbar({ open: true, message: 'Dihapus', severity: 'success' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStat) {
      const { error } = await supabase.from('village_stats').update(formData).eq('id', editingStat.id);
      if (error) setSnackbar({ open: true, message: 'Gagal update', severity: 'error' });
      else { handleClose(); fetchStats(); setSnackbar({ open: true, message: 'Berhasil diupdate', severity: 'success' }); }
    } else {
      const { error } = await supabase.from('village_stats').insert([formData]);
      if (error) setSnackbar({ open: true, message: 'Gagal tambah', severity: 'error' });
      else { handleClose(); fetchStats(); setSnackbar({ open: true, message: 'Berhasil ditambah', severity: 'success' }); }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Manajemen Statistik Desa</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddNew} sx={{ borderRadius: '100px' }}>
          Tambah Statistik
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Label</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nilai</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Icon</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Warna</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontWeight: 600 }}>{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.icon}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption">{item.color}</Typography>
                  </Box>
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
          <DialogTitle sx={{ fontWeight: 800 }}>{editingStat ? 'Edit' : 'Tambah'} Statistik</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField required fullWidth label="Label (Contoh: Total Penduduk)" value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} />
              <TextField required fullWidth label="Nilai (Contoh: 6.052)" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} />
              <TextField fullWidth label="Icon (Fa Icon Name)" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
              <TextField fullWidth label="Warna (Hex Code)" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
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

export default StatsManager;
