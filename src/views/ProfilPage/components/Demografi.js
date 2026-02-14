import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { supabase } from '../../../lib/supabase';

const Demografi = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
      if (!error && data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Demografi Penduduk
      </Typography>
      <Typography variant="body1">
        Berdasarkan data statistik terbaru, profil kependudukan Desa Ngawonggo adalah sebagai berikut:
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '24px', overflow: 'hidden' }}>
        <Table>
          <TableBody>
            {stats.map(stat => (
              <TableRow key={stat.id}>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '40%' }}>{stat.label}</TableCell>
                <TableCell>{stat.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Demografi;
