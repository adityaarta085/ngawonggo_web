import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  Container,
  Icon,
  Badge,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaShieldAlt, FaTv, FaEye, FaEyeSlash, FaBroadcastTower } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setSession }) => {
  const location = useLocation();
  const isTvRoute = location.pathname.includes('/live');
  const [tabIndex, setTabIndex] = useState(isTvRoute ? 1 : 0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const bgCard = useColorModeValue('white', 'gray.850');
  const borderCard = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleTabChange = (index) => {
    setTabIndex(index);
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Input Tidak Lengkap',
        description: 'Silakan isi username dan password.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Menggunakan RPC check_admin_credentials di Supabase
      const { data, error } = await supabase
        .rpc('check_admin_credentials', {
          p_username: username.trim(),
          p_password: password.trim()
        });

      if (error || !data || data.length === 0) {
        toast({
          title: 'Login Gagal',
          description: 'Username atau password salah. Pastikan akun dan peran sesuai.',
          status: 'error',
          duration: 3500,
          isClosable: true,
        });
      } else {
        const user = data[0];
        localStorage.setItem('adminSession', JSON.stringify(user));
        if (setSession) {
          setSession(user);
        }

        if (user.role === 'tv_admin') {
          toast({
            title: 'Login Admin TV Berhasil',
            description: `Selamat datang di Master Control Room Ngawonggo TV, ${user.username}!`,
            status: 'success',
            duration: 2500,
            isClosable: true,
          });
          navigate('/admin/live');
        } else {
          toast({
            title: 'Login Super Admin Berhasil',
            description: `Selamat datang kembali, ${user.username}!`,
            status: 'success',
            duration: 2500,
            isClosable: true,
          });
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Kesalahan Sistem',
        description: 'Terjadi gangguan saat memproses login. Silakan coba lagi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 20 }}>
      <VStack
        spacing={6}
        align="stretch"
        bg={bgCard}
        p={{ base: 6, md: 10 }}
        borderRadius="3xl"
        border="1px solid"
        borderColor={borderCard}
        boxShadow="2xl"
        backdropFilter="blur(16px)"
      >
        {/* Header Branding */}
        <VStack spacing={2} align="center" textAlign="center">
          <HStack spacing={3}>
            <Box p={3} bg="brand.50" _dark={{ bg: "brand.900" }} color="brand.500" borderRadius="2xl" shadow="sm">
              <Icon as={tabIndex === 1 ? FaBroadcastTower : FaShieldAlt} w={7} h={7} />
            </Box>
          </HStack>
          <Heading size="lg" fontWeight="800">
            {tabIndex === 1 ? 'Studio Live TV Admin' : 'Admin Portal Desa'}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {tabIndex === 1
              ? 'Panel Kontrol Penyiaran & Master Siaran Ngawonggo TV'
              : 'Pusat Manajemen Data & Pelayanan Desa Ngawonggo'}
          </Text>
        </VStack>

        {/* Tab Role Switcher */}
        <Tabs
          isFitted
          variant="soft-rounded"
          colorScheme="brand"
          index={tabIndex}
          onChange={handleTabChange}
        >
          <TabList bg={useColorModeValue('gray.100', 'gray.800')} p={1.5} borderRadius="2xl">
            <Tab borderRadius="xl" fontWeight="700" fontSize="sm">
              <Icon as={FaShieldAlt} mr={2} /> Super Admin
            </Tab>
            <Tab borderRadius="xl" fontWeight="700" fontSize="sm">
              <Icon as={FaTv} mr={2} /> Admin TV
            </Tab>
          </TabList>
        </Tabs>

        {/* Information Badge */}
        <Box
          p={3.5}
          bg={tabIndex === 1 ? 'red.50' : 'blue.50'}
          _dark={{ bg: tabIndex === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)' }}
          borderRadius="2xl"
          border="1px solid"
          borderColor={tabIndex === 1 ? 'red.200' : 'blue.200'}
          _dark_border={{ borderColor: tabIndex === 1 ? 'red.800' : 'blue.800' }}
        >
          <HStack align="start" spacing={3}>
            <Badge colorScheme={tabIndex === 1 ? 'red' : 'blue'} mt={0.5} borderRadius="md">
              {tabIndex === 1 ? 'TV STUDIO' : 'PORTAL DESA'}
            </Badge>
            <Text fontSize="xs" color={tabIndex === 1 ? 'red.700' : 'blue.700'} _dark={{ color: tabIndex === 1 ? 'red.200' : 'blue.200' }}>
              {tabIndex === 1
                ? 'Gunakan akun khusus penyiaran TV (misal: admintv) untuk mengatur siaran langsung, ticker berita, dan jadwal sholat.'
                : 'Akses penuh untuk staf pengelola website dan administrasi desa.'}
            </Text>
          </HStack>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="700">Username</FormLabel>
              <Input
                size="lg"
                borderRadius="xl"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tabIndex === 1 ? 'admintv' : 'admin'}
                autoComplete="username"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="700">Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  borderRadius="xl"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  autoComplete="current-password"
                />
                <InputRightElement width="3.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme={tabIndex === 1 ? 'red' : 'brand'}
              size="lg"
              width="full"
              borderRadius="xl"
              isLoading={loading}
              loadingText="Memverifikasi..."
              shadow="md"
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
              transition="all 0.2s"
              mt={2}
            >
              {tabIndex === 1 ? 'Masuk ke Studio Penyiaran TV' : 'Masuk ke Portal Admin'}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
