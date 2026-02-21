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
} from 'react-icons/fa';
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
import SettingsManager from './components/SettingsManager';

const AdminPage = ({ setSession }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarColor = useColorModeValue('white', 'gray.800');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  const menuItems = [
    { name: 'Dashboard', icon: FaHome },
    { name: 'Berita', icon: FaNewspaper },
    { name: 'Lembaga', icon: FaImage },
    { name: 'Statistik', icon: FaChartBar },
    { name: 'Wisata', icon: FaMap },
    { name: 'Running Text', icon: FaBullhorn },
    { name: 'Popup', icon: FaWindowMaximize },
    { name: 'Pengaduan', icon: FaExclamationCircle },
    { name: 'Komentar', icon: FaComments },
    { name: 'Pengaturan', icon: FaCog },
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
            <Text fontWeight="bold">{item.name}</Text>
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
          {activeTab === 'Berita' && <NewsManager />}
          {activeTab === 'Lembaga' && <InstitutionManager />}
          {activeTab === 'Wisata' && <TravelManager />}
          {activeTab === 'Statistik' && <StatsManager />}
          {activeTab === 'Running Text' && <AnnouncementManager />}
          {activeTab === 'Popup' && <PopupManager />}
          {activeTab === 'Pengaduan' && <ComplaintManager />}
          {activeTab === 'Komentar' && <CommentManager />}
          {activeTab === 'Pengaturan' && <SettingsManager />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
