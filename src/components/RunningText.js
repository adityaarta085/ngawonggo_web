import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, SvgIcon } from '@mui/material';
import { Campaign as CampaignIcon } from '@mui/icons-material';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const RunningText = ({ isEmbedded = false }) => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  if (announcements.length === 0) return null;

  const combinedText = announcements.map(a => a.content).join('  •  ');

  if (isEmbedded) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <CampaignIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1rem' }} />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
              {combinedText}
            </Typography>
          </motion.div>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 0.5, overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 'lg', mx: 'auto', px: 2 }}>
        <CampaignIcon sx={{ mr: 1.5 }} />
        <Box sx={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear"
            }}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {combinedText}
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default RunningText;
