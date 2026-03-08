import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Divider,
  HStack,
  useToast,
  Container,
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
} from '@chakra-ui/react';
import { FaGoogle, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: 'Pendaftaran Berhasil',
          description: 'Silakan cek email Anda untuk verifikasi (jika dikonfigurasi).',
          status: 'success',
          duration: 5000,
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
            title: 'Selamat Datang Kembali!',
            status: 'success',
            duration: 3000,
        });
        navigate('/portal');
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke Google...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/portal',
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account',
            },
        }
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Gagal Login Google',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      position="relative"
      overflow="hidden"
      py={10}
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.6}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.6}
        zIndex={0}
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <VStack spacing={6}>
            <IconButton
                as={RouterLink}
                to="/"
                icon={<FaArrowLeft />}
                variant="ghost"
                alignSelf="flex-start"
                aria-label="Kembali"
                colorScheme="brand"
            />

          <VStack spacing={2} textAlign="center">
            <Image src="/logo_desa.png" h="60px" fallbackSrc="https://via.placeholder.com/60" />
            <Heading size="lg" color="brand.600">Portal Warga</Heading>
            <Text color="gray.500" fontSize="sm">Desa Ngawonggo, Magelang</Text>
          </VStack>

          <Box
            w="full"
            p={8}
            borderRadius="2xl"
            layerStyle="glassCard"
            bg="white"
          >
            <Tabs isFitted variant="soft-rounded" colorScheme="brand" onChange={(index) => setIsSignUp(index === 1)}>
              <TabList mb={6} bg="gray.100" p={1} borderRadius="full">
                <Tab borderRadius="full">Masuk</Tab>
                <Tab borderRadius="full">Daftar</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                   <VStack spacing={4} as="form" onSubmit={handleAuth}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm">Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            borderRadius="xl"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm">Kata Sandi</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            borderRadius="xl"
                          />
                          <InputRightElement>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label="Lihat password"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        h="50px"
                        isLoading={loading}
                        borderRadius="xl"
                        boxShadow="0 4px 12px rgba(0, 86, 179, 0.2)"
                      >
                        {isSignUp ? 'Buat Akun' : 'Masuk ke Portal'}
                      </Button>
                   </VStack>
                </TabPanel>
                <TabPanel p={0}>
                    {/* Same form structure but with isSignUp active */}
                    <VStack spacing={4} as="form" onSubmit={handleAuth}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm">Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            borderRadius="xl"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm">Kata Sandi Baru</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimal 6 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            borderRadius="xl"
                          />
                          <InputRightElement>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label="Lihat password"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        h="50px"
                        isLoading={loading}
                        borderRadius="xl"
                        boxShadow="0 4px 12px rgba(0, 86, 179, 0.2)"
                      >
                        Daftar Sekarang
                      </Button>
                   </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <HStack w="full" my={6}>
              <Divider />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">Atau gunakan</Text>
              <Divider />
            </HStack>

            <Button
              w="full"
              variant="outline"
              leftIcon={<FaGoogle color="#EA4335" />}
              onClick={handleGoogleLogin}
              borderRadius="xl"
              h="50px"
              isLoading={loading}
              _hover={{ bg: 'gray.50' }}
            >
              Lanjutkan dengan Google
            </Button>
          </Box>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            Dengan masuk, Anda setuju dengan <Link as={RouterLink} to="/terms-conditions" color="brand.500">Ketentuan</Link> & <Link as={RouterLink} to="/privacy-policy" color="brand.500">Kebijakan</Link> kami.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default AuthPage;
