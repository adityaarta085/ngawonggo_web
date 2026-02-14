import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  Container,
} from '@mui/material';

export default function PemerintahanPage() {
  const staff = [
    { role: 'Kepala Desa', name: 'Khoirur Faidah' },
    { role: 'Sekertariat Desa', name: 'Bambang Dwi Hendriyono' },
    { role: 'Kaur Pemerintahan', name: 'Yasin Sulthoni' },
    { role: 'Ketua BPD', name: 'Perlu Konfirmasi Desa' },
    { role: 'Ketua P3A', name: 'Rohmatul Faizin' },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
          Pemerintahan Desa
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary' }}>
          Struktur Organisasi Pemerintah Desa Ngawonggo periode saat ini dirancang untuk memberikan pelayanan terbaik bagi seluruh masyarakat.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Struktur Organisasi</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '24px', overflow: 'hidden', mb: 6 }}>
          <Table>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item.role}>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '40%' }}>{item.role}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 6 }} />

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Visi Pelayanan</Typography>
        <Typography variant="body1">
          Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa.
        </Typography>
      </Container>
    </Box>
  );
}
