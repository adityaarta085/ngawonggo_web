import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const PopupNotification = () => {
  const [open, setOpen] = useState(false);
  const [popups, setPopups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPopups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const sessionShown = sessionStorage.getItem('popups_shown');
        if (!sessionShown) {
          setPopups(data);
          setCurrentIndex(0);
          setOpen(true);
        }
      }
    } catch (err) {
      console.error('Error fetching popups:', err);
    }
  }, []);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const handleClose = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      sessionStorage.setItem('popups_shown', 'true');
      setOpen(false);
    }
  };

  if (popups.length === 0 || currentIndex >= popups.length) return null;

  const currentPopup = popups[currentIndex];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '24px' }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
        {currentPopup.title || 'Pengumuman Penting'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {currentPopup.type === 'image' ? (
          <Box
            component="img"
            src={currentPopup.content}
            alt={currentPopup.title}
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1">
              {currentPopup.content}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5}>
          {currentPopup.button_link && (
            <Button
              href={currentPopup.button_link}
              target="_blank"
              variant="outlined"
            >
              {currentPopup.button_label || 'Kunjungi'}
            </Button>
          )}
          <Button variant="contained" onClick={handleClose}>
            {currentIndex < popups.length - 1 ? 'Berikutnya' : 'Tutup'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default PopupNotification;
