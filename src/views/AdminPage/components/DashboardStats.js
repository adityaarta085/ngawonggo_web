import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  Visibility as EyeIcon,
  CalendarToday as CalendarAltIcon,
  Description as FileAltIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../../lib/supabase';

const DashboardStats = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [dailyViews, setDailyViews] = useState([]);
  const [topPages, setTopPages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count, error: countError } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      if (!countError) setTotalViews(count);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('viewed_at')
        .gte('viewed_at', sevenDaysAgo.toISOString());

      if (!viewsError) {
        const countsByDay = {};
        viewsData.forEach(v => {
          const date = new Date(v.viewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          countsByDay[date] = (countsByDay[date] || 0) + 1;
        });
        const chartData = Object.keys(countsByDay).map(date => ({ date, views: countsByDay[date] }));
        setDailyViews(chartData);
      }

      const { data: pagesData, error: pagesError } = await supabase
        .from('page_views')
        .select('page_path');

      if (!pagesError) {
        const pageCounts = {};
        pagesData.forEach(p => {
          pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1;
        });
        const sortedPages = Object.keys(pageCounts)
          .map(path => ({ path, count: pageCounts[path] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopPages(sortedPages);
      }
    };

    fetchStats();
  }, []);

  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard label="Total Kunjungan" number={totalViews} icon={EyeIcon} color="primary.main" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard label="Kunjungan Hari Ini" number={dailyViews[dailyViews.length - 1]?.views || 0} icon={CalendarAltIcon} color="success.main" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard label="Halaman Aktif" number={topPages.length} icon={FileAltIcon} color="secondary.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Statistik Pengunjung (7 Hari Terakhir)</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#137fec" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Halaman Populer</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Path</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Kunjungan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPages.map((page, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 600, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.path}</TableCell>
                      <TableCell align="right">{page.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

const StatCard = ({ label, number, icon: IconComponent, color }) => (
  <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>{number}</Typography>
      </Box>
      <IconComponent sx={{ fontSize: 40, color: color, opacity: 0.3 }} />
    </Stack>
  </Paper>
);

export default DashboardStats;
