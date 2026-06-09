import React from 'react';
import { Box, Flex, VStack, Heading, Text, SimpleGrid, Icon, useColorModeValue, Button } from '@chakra-ui/react';
import { FaTv, FaBroadcastTower, FaCalendarAlt, FaImages } from 'react-icons/fa';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <Box p={6} bg={useColorModeValue('white', 'gray.800')} rounded="xl" shadow="sm" borderWidth="1px">
    <Flex justify="space-between" align="center">
      <VStack align="start" spacing={1}>
        <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <Heading size="lg">{value}</Heading>
      </VStack>
      <Box p={3} bg={`${color}.50`} color={`${color}.500`} rounded="lg">
        <Icon as={icon} w={6} h={6} />
      </Box>
    </Flex>
  </Box>
);

const DashboardHome = () => {
  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Overview</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard title="Total Display" value="1" icon={FaTv} color="blue" />
        <StatCard title="Konten Aktif" value="3" icon={FaImages} color="green" />
        <StatCard title="Agenda Hari Ini" value="2" icon={FaCalendarAlt} color="purple" />
        <StatCard title="Status Live" value="Offline" icon={FaBroadcastTower} color="red" />
      </SimpleGrid>
    </Box>
  );
};

const SidebarItem = ({ icon, children, to, isActive }) => (
  <Link to={to} style={{ width: '100%' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? 'brand.500' : 'transparent'}
      color={isActive ? 'white' : useColorModeValue('gray.600', 'gray.300')}
      _hover={{
        bg: isActive ? 'brand.600' : useColorModeValue('gray.100', 'gray.700'),
        color: isActive ? 'white' : useColorModeValue('gray.900', 'white'),
      }}
    >
      <Icon
        mr="4"
        fontSize="16"
        _groupHover={{ color: isActive ? 'white' : useColorModeValue('gray.900', 'white') }}
        as={icon}
      />
      {children}
    </Flex>
  </Link>
);

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} pt="100px">
      {/* Sidebar */}
      <Box
        w="250px"
        bg={useColorModeValue('white', 'gray.800')}
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        pos="fixed"
        h="full"
        py={5}
      >
        <VStack spacing={2} align="stretch">
          <SidebarItem icon={FaTv} to="/dashboardlive" isActive={location.pathname === '/dashboardlive'}>
            Overview
          </SidebarItem>
          <SidebarItem icon={FaImages} to="/dashboardlive/content" isActive={location.pathname === '/dashboardlive/content'}>
            Konten Display
          </SidebarItem>
          <SidebarItem icon={FaBroadcastTower} to="/dashboardlive/live" isActive={location.pathname === '/dashboardlive/live'}>
            Live Stream
          </SidebarItem>
          <SidebarItem icon={FaCalendarAlt} to="/dashboardlive/schedule" isActive={location.pathname === '/dashboardlive/schedule'}>
            Jadwal & Agenda
          </SidebarItem>
          <SidebarItem icon={FaTv} to="/dashboardlive/displays" isActive={location.pathname === '/dashboardlive/displays'}>
            Manage TV
          </SidebarItem>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml="250px" w="full">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/content" element={<Box p={8}><Heading size="lg">Manajemen Konten</Heading><Text mt={4}>WIP: CRUD for Contents (announcement, poster, dll)</Text></Box>} />
          <Route path="/live" element={<Box p={8}><Heading size="lg">Live Streaming Control</Heading><Text mt={4}>WIP: Start/Stop Live, YouTube URL</Text></Box>} />
          <Route path="/schedule" element={<Box p={8}><Heading size="lg">Jadwal & Agenda</Heading><Text mt={4}>WIP: CRUD for schedules</Text></Box>} />
          <Route path="/displays" element={
            <Box p={8}>
                <Heading size="lg" mb={4}>TV Displays</Heading>
                <Button colorScheme="blue" onClick={() => window.open('/live/display/DEMO-TV', '_blank')}>Buka Display DEMO-TV</Button>
            </Box>
           } />
        </Routes>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
