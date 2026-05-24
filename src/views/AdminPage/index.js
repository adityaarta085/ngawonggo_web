import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  HStack,
  Avatar,
  Badge,
  useColorModeValue,
  Heading,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaHome,
  FaNewspaper,
  FaChartBar,
  FaImage,
  FaMap,
  FaSignOutAlt,
  FaBullhorn,
  FaWindowMaximize,
  FaComments,
  FaExclamationCircle,
  FaCog,
  FaBars,
  FaMapMarkedAlt,
  FaEnvelope,
  FaUsers,
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import NewsManager from './components/NewsManager';
import NationalNewsManager from './components/NationalNewsManager';
import DashboardStats from './components/DashboardStats';
import StatsManager from './components/StatsManager';
import InstitutionManager from './components/InstitutionManager';
import AnnouncementManager from './components/AnnouncementManager';
import PopupManager from './components/PopupManager';
import ComplaintManager from './components/ComplaintManager';
import CommentManager from './components/CommentManager';
import SettingsManager from './components/SettingsManager';
import DusunManager from './components/DusunManager';
import BroadcastManager from './components/BroadcastManager';
import PemerintahanManager from './components/PemerintahanManager';
import DokumenManager from './components/DokumenManager';
import UserManager from './components/UserManager';
import ProfilManager from './components/ProfilManager';
import DoodleManager from './components/DoodleManager';
import LogoManager from './components/LogoManager';
import CsManager from './components/CsManager';
import { FaHeadset, FaHeart } from 'react-icons/fa';
import DonasiManager from './components/DonasiManager';
import MonetizationManager from './components/MonetizationManager';
import NotificationManager from './components/NotificationManager';
import DeveloperMediaManager from './components/DeveloperMediaManager';
import MediaManager from './components/MediaManager';
import IklanManager from './components/IklanManager';
import { FaCoins, FaBell, FaAd } from 'react-icons/fa';

const AdminPage = ({ setSession }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarColor = useColorModeValue('white', 'gray.800');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  const menuItems = [
    { name: 'Dashboard', icon: FaHome },
    { name: 'Profil Desa', icon: FaNewspaper },
    { name: 'Donasi', icon: FaHeart },
    { name: 'Berita', icon: FaNewspaper },
    { name: 'Berita Nasional', icon: FaNewspaper },
    { name: '10 Dusun', icon: FaMapMarkedAlt },
    { name: 'Instansi', icon: FaImage },
    { name: 'Demografi', icon: FaChartBar },
    { name: 'Wisata', icon: FaMap },
    { name: 'Running Text', icon: FaBullhorn },
    { name: 'Google Doodles', icon: FaImage },
    { name: 'Media Pengembang', icon: FaImage },
    { name: 'Kustomisasi Logo', icon: FaImage },
    { name: 'Popup', icon: FaWindowMaximize },
    { name: 'Pengaduan', icon: FaExclamationCircle },
    { name: 'Komentar', icon: FaComments },
    { name: 'Broadcast Email', icon: FaEnvelope },
    { name: 'Kirim Notifikasi', icon: FaBell },
    { name: 'Pengaturan', icon: FaCog },
    { name: 'Monetisasi & Limit', icon: FaCoins },
    { name: 'Customer Service', icon: FaHeadset },
    { name: 'Pengguna', icon: FaUsers },
    { name: 'Pemerintahan', icon: FaUsers },
    { name: 'Dokumen & Analitik', icon: FaChartBar },
    { name: 'Manajemen Media', icon: FaImage },
    { name: 'Iklan', icon: FaAd },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminSession');
    if (setSession) setSession(null);
    navigate('/');
  };

  const SidebarContent = () => (
    <VStack align="stretch" spacing={8}>
      <Heading size="md" color="brand.500">ADMIN DESA</Heading>
      <VStack align="stretch" spacing={2}>
        {menuItems.map((item) => (
          <HStack
            key={item.name}
            p={3}
            borderRadius="xl"
            cursor="pointer"
            bg={activeTab === item.name ? 'brand.50' : 'transparent'}
            color={activeTab === item.name ? 'brand.500' : 'gray.500'}
            onClick={() => {
              setActiveTab(item.name);
              onClose();
            }}
            _hover={{ bg: 'brand.50', color: 'brand.500' }}
          >
            <Icon as={item.icon} />
            <Text fontWeight="bold" fontSize="sm">{item.name}</Text>
          </HStack>
        ))}
        <HStack
          p={3}
          borderRadius="xl"
          cursor="pointer"
          color="red.500"
          onClick={handleLogout}
          _hover={{ bg: 'red.50' }}
        >
          <Icon as={FaSignOutAlt} />
          <Text fontWeight="bold">Keluar</Text>
        </HStack>
      </VStack>
    </VStack>
  );

  return (
    <Box minH="100vh" display="flex" bg={mainBg}>
      {/* Desktop Sidebar */}
      <Box
        w={{ base: 'none', md: '280px' }}
        bg={sidebarColor}
        borderRight="1px solid"
        borderColor="gray.100"
        display={{ base: 'none', md: 'block' }}
        p={6}
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={sidebarColor}>
          <DrawerHeader borderBottomWidth="1px">Menu Navigasi</DrawerHeader>
          <DrawerBody py={6}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1} p={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center" mb={10}>
          <HStack spacing={4}>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<FaBars />}
              onClick={onOpen}
              variant="ghost"
              aria-label="Open Menu"
            />
            <Heading size={{ base: 'md', md: 'lg' }}>{activeTab}</Heading>
          </HStack>
          <HStack spacing={4}>
            <Avatar size="sm" name="Admin" />
            <VStack align="start" spacing={0} display={{ base: 'none', md: 'flex' }}>
              <Text fontWeight="bold" fontSize="xs">Administrator</Text>
              <Badge colorScheme="green" fontSize="10px">Online</Badge>
            </VStack>
          </HStack>
        </Flex>

        <Box>
          {activeTab === 'Dashboard' && <DashboardStats />}
          {activeTab === 'Donasi' && <DonasiManager />}
          {activeTab === 'Berita' && <NewsManager />}
          {activeTab === 'Berita Nasional' && <NationalNewsManager />}
          {activeTab === '10 Dusun' && <DusunManager />}
          {activeTab === 'Instansi' && <InstitutionManager />}
          {activeTab === 'Demografi' && <StatsManager />}
          {activeTab === 'Running Text' && <AnnouncementManager />}
          {activeTab === 'Popup' && <PopupManager />}
          {activeTab === 'Pengaduan' && <ComplaintManager />}
          {activeTab === 'Komentar' && <CommentManager />}
          {activeTab === 'Broadcast Email' && <BroadcastManager />}
          {activeTab === 'Kirim Notifikasi' && <NotificationManager />}
          {activeTab === 'Pengaturan' && <SettingsManager />}
          {activeTab === 'Monetisasi & Limit' && <MonetizationManager />}
          {activeTab === 'Pemerintahan' && <PemerintahanManager />}
          {activeTab === 'Dokumen & Analitik' && <DokumenManager />}
          {activeTab === 'Manajemen Media' && <MediaManager />}
          {activeTab === 'Iklan' && <IklanManager />}

          {activeTab === 'Customer Service' && <CsManager />}
          {activeTab === 'Pengguna' && <UserManager />}
          {activeTab === 'Profil Desa' && <ProfilManager />}
          {activeTab === 'Google Doodles' && <DoodleManager />}
          {activeTab === 'Media Pengembang' && <DeveloperMediaManager />}

          {activeTab === 'Kustomisasi Logo' && <LogoManager />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
