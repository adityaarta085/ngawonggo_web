import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,

  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Newspaper as NewspaperIcon,
  BarChart as ChartBarIcon,
  Image as ImageIcon,
  Map as MapIcon,
  Logout as SignOutAltIcon,
  Campaign as BullhornIcon,
  Fullscreen as WindowMaximizeIcon,
  Comment as CommentsIcon,
  ErrorOutline as ExclamationCircleIcon,
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import NewsManager from './components/NewsManager';
import TravelManager from './components/TravelManager';
import DashboardStats from './components/DashboardStats';
import StatsManager from './components/StatsManager';
import InstitutionManager from './components/InstitutionManager';
import AnnouncementManager from './components/AnnouncementManager';
import PopupManager from './components/PopupManager';
import ComplaintManager from './components/ComplaintManager';
import CommentManager from './components/CommentManager';

const AdminPage = ({ setSession }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Berita', icon: NewspaperIcon },
    { name: 'Lembaga', icon: ImageIcon },
    { name: 'Statistik', icon: ChartBarIcon },
    { name: 'Wisata', icon: MapIcon },
    { name: 'Running Text', icon: BullhornIcon },
    { name: 'Popup', icon: WindowMaximizeIcon },
    { name: 'Pengaduan', icon: ExclamationCircleIcon },
    { name: 'Komentar', icon: CommentsIcon },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminSession');
    if (setSession) setSession(null);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          display: { xs: 'none', md: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider',
          p: 3,
          bgcolor: 'white'
        }}
      >
        <Stack spacing={4}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>ADMIN DESA</Typography>
          <List sx={{ px: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={activeTab === item.name}
                  onClick={() => setActiveTab(item.name)}
                  sx={{
                    borderRadius: '12px',
                    '&.Mui-selected': {
                      bgcolor: 'primary.container',
                      color: 'primary.onContainer',
                      '& .MuiListItemIcon-root': { color: 'primary.main' }
                    },
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: '12px',
                  color: 'error.main',
                  '&:hover': { bgcolor: 'error.lighter' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <SignOutAltIcon />
                </ListItemIcon>
                <ListItemText primary="Keluar" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeTab}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>Administrator</Typography>
              <Chip label="Online" color="success" size="small" sx={{ height: 16, fontSize: '10px' }} />
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ mt: 2 }}>
          {activeTab === 'Dashboard' && <DashboardStats />}
          {activeTab === 'Berita' && <NewsManager />}
          {activeTab === 'Lembaga' && <InstitutionManager />}
          {activeTab === 'Wisata' && <TravelManager />}
          {activeTab === 'Statistik' && <StatsManager />}
          {activeTab === 'Running Text' && <AnnouncementManager />}
          {activeTab === 'Popup' && <PopupManager />}
          {activeTab === 'Pengaduan' && <ComplaintManager />}
          {activeTab === 'Komentar' && <CommentManager />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
