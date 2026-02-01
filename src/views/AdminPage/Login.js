
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Box,
  InputGroup,
  InputLeftElement,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import NgawonggoLogo from '../../components/NgawonggoLogo';

const Login = ({ setSession }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .rpc('check_admin_credentials', {
          p_username: username,
          p_password: password
        });

      if (error || !data || data.length === 0) {
        toast({
          title: 'Login Gagal',
          description: 'Username atau password salah',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      } else {
        const user = data[0];
        localStorage.setItem('adminSession', JSON.stringify(user));
        if (setSession) {
          setSession(user);
        }
        toast({
          title: 'Selamat Datang',
          description: `Berhasil masuk sebagai ${user.username}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        navigate('/admin');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan sistem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
      px={4}
    >
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Link to="/">
              <Button
                variant="ghost"
                leftIcon={<FaArrowLeft />}
                size="sm"
                mb={6}
                color="gray.500"
                _hover={{ color: 'brand.500' }}
              >
                Kembali ke Beranda
              </Button>
            </Link>
            <VStack spacing={4}>
              <NgawonggoLogo fontSize="3xl" iconSize={12} flexDirection="column" />
              <VStack spacing={1}>
                <Heading size="lg" color="gray.800">Panel Administrasi</Heading>
                <Text color="gray.500">Silakan masuk untuk mengelola konten desa</Text>
              </VStack>
            </VStack>
          </Box>

          <Box
            bg="white"
            p={10}
            borderRadius="2xl"
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
            border="1px solid"
            borderColor="gray.100"
          >
            <form onSubmit={handleLogin}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Username</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Masukkan username"
                      bg="gray.50"
                      border="none"
                      _focus={{ bg: 'white', boxShadow: '0 0 0 2px var(--chakra-colors-brand-500)' }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Password</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaLock} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      bg="gray.50"
                      border="none"
                      _focus={{ bg: 'white', boxShadow: '0 0 0 2px var(--chakra-colors-brand-500)' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  size="lg"
                  fontSize="md"
                  isLoading={loading}
                  loadingText="Memverifikasi..."
                  boxShadow="0 4px 12px rgba(0, 128, 0, 0.2)"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: '0 6px 15px rgba(0, 128, 0, 0.25)' }}
                  _active={{ transform: 'translateY(0)' }}
                >
                  Masuk Sekarang
                </Button>
              </VStack>
            </form>
          </Box>

          <Divider />

          <Text textAlign="center" fontSize="xs" color="gray.400" fontWeight="500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Ngawonggo. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
