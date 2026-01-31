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
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

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
      // Menggunakan RPC untuk keamanan (password dicek di sisi database)
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
        });
      } else {
        // Simpan sesi ke localStorage (data[0] karena rpc mengembalikan array)
        const user = data[0];
        localStorage.setItem('adminSession', JSON.stringify(user));
        if (setSession) {
          setSession(user);
        }
        toast({
          title: 'Login Berhasil',
          status: 'success',
          duration: 2000,
          isClosable: true,
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
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={2} align="center">
          <Heading size="lg">Admin Login</Heading>
          <Text color="gray.500">Desa Ngawonggo</Text>
        </VStack>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={loading}
            >
              Masuk
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
