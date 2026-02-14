import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import {
  People as PeopleIcon,
  Map as MapIcon,
  Grass as GrassIcon,
  Terrain as TerrainIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const iconMap = {
  FaUsers: PeopleIcon,
  FaMapMarkedAlt: MapIcon,
  FaSeedling: GrassIcon,
  FaMountain: TerrainIcon,
  FaMars: MaleIcon,
  FaVenus: FemaleIcon,
  FaMap: ExploreIcon,
};

const StatsSection = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
      if (!error && data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.length > 0 ? stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || PeopleIcon;
            return (
              <Grid item xs={6} md={3} key={stat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <IconComponent sx={{ fontSize: 40, color: stat.color || 'primary.main' }} />
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </motion.div>
              </Grid>
            );
          }) : (
            <Grid item xs={12}>
              <Typography align="center">Loading stats...</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
