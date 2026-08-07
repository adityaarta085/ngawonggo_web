import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  FaGoogle,
  FaFacebook,
  FaDiscord,
  FaTwitter,
  FaSpotify,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaKey,
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import GeometricMascot from '../../components/GeometricMascot';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle errors from OAuth redirect if any
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get('error_description');
    const type = query.get('type');
    if (type === 'recovery') {
      setIsUpdateMode(true);
    }
    if (error) {
      toast({
        title: 'Gagal Login',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [location, toast]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: 'Email diperlukan',
        description: 'Silakan masukkan email Anda',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      if (error) throw error;
      toast({
        title: 'Email Terkirim',
        description: 'Silakan cek email Anda untuk tautan reset password',
        status: 'success',
        duration: 5000,
      });
      onResetClose();
    } catch (error) {
      toast({
        title: 'Gagal',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password tidak cocok',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast({
        title: 'Password Berhasil Diubah',
        description: 'Anda sekarang dapat menggunakan password baru.',
        status: 'success',
        duration: 3000,
      });
      setIsUpdateMode(false);
      navigate('/portal');
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

        fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `<b>User Baru Mendaftar!</b>\n\n<b>Nama/Email:</b> ${email}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>`,
          }),
        }).catch((err) => console.error('Telegram error:', err));

        toast({
          title: 'Pendaftaran Berhasil',
          description: 'Silakan cek email Anda untuk verifikasi.',
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
      duration: 3000,
      isClosable: true,
    });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/portal`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login Google',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke Facebook...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login Facebook',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke GitHub...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login GitHub',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDiscordLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke Discord...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login Discord',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTwitterLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke X...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'x',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login X',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSpotifyLogin = async () => {
    setLoading(true);
    toast({
      title: 'Menghubungkan ke Spotify...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Gagal Login Spotify',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
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
      _dark={{ bg: 'gray.950' }}
      position="relative"
      overflow="hidden"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8 }}
    >
      {/* Background Soft Glows */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius="full"
        filter="blur(100px)"
        display={{ base: 'none', md: 'block' }}
        opacity={0.5}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="40%"
        h="40%"
        bg="purple.50"
        borderRadius="full"
        filter="blur(100px)"
        display={{ base: 'none', md: 'block' }}
        opacity={0.5}
        zIndex={0}
      />

      <Container maxW="7xl" position="relative" zIndex={1} px={{ base: 2, md: 6 }}>
        {/* Navigation Back Button */}
        <HStack mb={4} justify="space-between">
          <IconButton
            as={RouterLink}
            to="/"
            icon={<FaArrowLeft />}
            variant="ghost"
            aria-label="Kembali ke Beranda"
            colorScheme="brand"
            borderRadius="full"
          />
          <Badge colorScheme="brand" variant="subtle" px={3} py={1} borderRadius="full" fontSize="xs">
            Portal Digital Ngawonggo
          </Badge>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '1.1fr 1fr' }} gap={{ base: 6, lg: 10 }} alignItem="stretch">
          {/* LEFT SIDE: Geometric Mascot Banner Showcase (Desktop) */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <GeometricMascot
              isPasswordFocused={isPasswordFocused}
              isEmailFocused={isEmailFocused}
              isSubmitting={loading}
              height="100%"
            />
          </GridItem>

          {/* RIGHT SIDE: Modern Auth Card */}
          <GridItem display="flex" flexDirection="column" justifyContent="center">
            {/* Mobile Mascot Banner */}
            <Box display={{ base: 'block', lg: 'none' }} mb={4}>
              <GeometricMascot
                isPasswordFocused={isPasswordFocused}
                isEmailFocused={isEmailFocused}
                isSubmitting={loading}
                height="300px"
              />
            </Box>

            <Box
              w="full"
              p={{ base: 6, md: 8 }}
              borderRadius="3xl"
              bg="white"
              _dark={{ bg: 'gray.900', borderColor: 'gray.800' }}
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="2xl"
            >
              <VStack spacing={6} align="stretch">
                {/* Header Header Brand */}
                <VStack spacing={2} textAlign="center">
                  <HStack spacing={3} justify="center">
                    <Box bg="brand.600" p={2} borderRadius="xl" boxShadow="md">
                      <Image
                        src="/logo_desa.png"
                        h="42px"
                        fallbackSrc="https://via.placeholder.com/50"
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}
                      />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="md" color="brand.600">
                        Ngawonggo Portal
                      </Heading>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Kabupaten Magelang
                      </Text>
                    </VStack>
                  </HStack>
                  <Text color="gray.500" _dark={{ color: 'gray.400' }} fontSize="sm">
                    {isSignUp ? 'Buat akun baru untuk mengakses layanan' : 'Masuk untuk mengakses portal warga digital'}
                  </Text>
                </VStack>

                {isUpdateMode ? (
                  /* Update Password Form Mode */
                  <VStack spacing={5}>
                    <Box textAlign="center">
                      <Heading size="md" color="gray.800" _dark={{ color: 'white' }} mb={1}>
                        Buat Password Baru
                      </Heading>
                      <Text color="gray.500" fontSize="sm">
                        Silakan masukkan password baru Anda.
                      </Text>
                    </Box>

                    <form onSubmit={handleUpdatePassword} style={{ width: '100%' }}>
                      <VStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" color="gray.600">
                            Password Baru
                          </FormLabel>
                          <InputGroup h="50px">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              onFocus={() => setIsPasswordFocused(true)}
                              onBlur={() => setIsPasswordFocused(false)}
                              placeholder="Masukkan password baru"
                              bg="gray.50"
                              _dark={{ bg: 'gray.800' }}
                              borderRadius="xl"
                              h="50px"
                              focusBorderColor="brand.500"
                            />
                            <InputRightElement h="50px">
                              <IconButton
                                variant="ghost"
                                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password"
                                _hover={{ bg: 'transparent' }}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" color="gray.600">
                            Konfirmasi Password
                          </FormLabel>
                          <InputGroup h="50px">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              onFocus={() => setIsPasswordFocused(true)}
                              onBlur={() => setIsPasswordFocused(false)}
                              placeholder="Ulangi password baru"
                              bg="gray.50"
                              _dark={{ bg: 'gray.800' }}
                              borderRadius="xl"
                              h="50px"
                              focusBorderColor="brand.500"
                            />
                          </InputGroup>
                        </FormControl>

                        <Button
                          type="submit"
                          colorScheme="brand"
                          w="full"
                          size="lg"
                          isLoading={loading}
                          borderRadius="xl"
                          h="50px"
                          mt={2}
                          fontWeight="bold"
                        >
                          Simpan Password
                        </Button>
                      </VStack>
                    </form>
                  </VStack>
                ) : (
                  /* Standard Login & Registration Form */
                  <>
                    <VStack spacing={3} w="full">
                      {/* Primary SSO: Google */}
                      <Button
                        w="full"
                        variant="outline"
                        leftIcon={<FaGoogle color="#EA4335" />}
                        onClick={handleGoogleLogin}
                        borderRadius="xl"
                        h="50px"
                        isLoading={loading}
                        disabled={loading}
                        borderColor="gray.200"
                        _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                        _hover={{ bg: 'gray.50' }}
                        fontWeight="semibold"
                      >
                        Lanjutkan dengan Google
                      </Button>

                      {/* Accordion for Other Providers */}
                      <Accordion allowToggle w="full">
                        <AccordionItem border="none">
                          <h2>
                            <AccordionButton _hover={{ bg: 'transparent' }} px={0} py={2}>
                              <Box flex="1" textAlign="center" fontSize="xs" color="brand.500" fontWeight="medium">
                                Tampilkan metode login lainnya ↓
                              </Box>
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={2} px={0}>
                            <VStack spacing={3}>
                              <Button
                                w="full"
                                variant="outline"
                                leftIcon={<FaGithub color="#333" />}
                                onClick={handleGithubLogin}
                                borderRadius="xl"
                                h="46px"
                                isLoading={loading}
                                disabled={loading}
                                borderColor="gray.200"
                                _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                                _hover={{ bg: 'gray.50' }}
                                fontSize="sm"
                              >
                                Lanjutkan dengan GitHub
                              </Button>

                              <Button
                                w="full"
                                variant="outline"
                                leftIcon={<FaDiscord color="#5865F2" />}
                                onClick={handleDiscordLogin}
                                borderRadius="xl"
                                h="46px"
                                isLoading={loading}
                                disabled={loading}
                                borderColor="gray.200"
                                _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                                _hover={{ bg: 'gray.50' }}
                                fontSize="sm"
                              >
                                Lanjutkan dengan Discord
                              </Button>

                              <Button
                                w="full"
                                variant="outline"
                                leftIcon={<FaTwitter color="#1DA1F2" />}
                                onClick={handleTwitterLogin}
                                borderRadius="xl"
                                h="46px"
                                isLoading={loading}
                                disabled={loading}
                                borderColor="gray.200"
                                _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                                _hover={{ bg: 'gray.50' }}
                                fontSize="sm"
                              >
                                Lanjutkan dengan X
                              </Button>

                              <Button
                                w="full"
                                variant="outline"
                                leftIcon={<FaSpotify color="#1DB954" />}
                                onClick={handleSpotifyLogin}
                                borderRadius="xl"
                                h="46px"
                                isLoading={loading}
                                disabled={loading}
                                borderColor="gray.200"
                                _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                                _hover={{ bg: 'gray.50' }}
                                fontSize="sm"
                              >
                                Lanjutkan dengan Spotify
                              </Button>

                              <Button
                                w="full"
                                variant="outline"
                                leftIcon={<FaFacebook color="#1877F2" />}
                                onClick={handleFacebookLogin}
                                borderRadius="xl"
                                h="46px"
                                isLoading={loading}
                                disabled={loading}
                                borderColor="gray.200"
                                _dark={{ borderColor: 'gray.700', _hover: { bg: 'gray.800' } }}
                                _hover={{ bg: 'gray.50' }}
                                fontSize="sm"
                              >
                                Lanjutkan dengan Facebook
                              </Button>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </VStack>

                    <HStack w="full" my={2}>
                      <Divider />
                      <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                        Atau gunakan Email
                      </Text>
                      <Divider />
                    </HStack>

                    {/* Email/Password Tabs */}
                    <Tabs
                      isFitted
                      variant="soft-rounded"
                      colorScheme="brand"
                      onChange={(index) => setIsSignUp(index === 1)}
                    >
                      <TabList mb={5} bg="gray.100" _dark={{ bg: 'gray.800' }} p={1} borderRadius="full">
                        <Tab borderRadius="full" fontSize="sm" fontWeight="600">
                          Masuk
                        </Tab>
                        <Tab borderRadius="full" fontSize="sm" fontWeight="600">
                          Daftar
                        </Tab>
                      </TabList>

                      <TabPanels>
                        {/* TAB 1: MASUK */}
                        <TabPanel p={0}>
                          <form onSubmit={handleAuth}>
                            <VStack spacing={4}>
                              <FormControl isRequired>
                                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
                                  Email
                                </FormLabel>
                                <Input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  onFocus={() => setIsEmailFocused(true)}
                                  onBlur={() => setIsEmailFocused(false)}
                                  placeholder="Masukkan email Anda"
                                  bg="gray.50"
                                  _dark={{ bg: 'gray.800', color: 'white' }}
                                  borderRadius="xl"
                                  h="50px"
                                  focusBorderColor="brand.500"
                                />
                              </FormControl>

                              <FormControl isRequired>
                                <HStack justify="space-between" mb={1}>
                                  <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }} mb={0}>
                                    Password
                                  </FormLabel>
                                  <Link
                                    fontSize="xs"
                                    color="brand.500"
                                    onClick={onResetOpen}
                                    _hover={{ textDecoration: 'underline' }}
                                  >
                                    Lupa Password?
                                  </Link>
                                </HStack>
                                <InputGroup h="50px">
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    placeholder="Masukkan password"
                                    bg="gray.50"
                                    _dark={{ bg: 'gray.800', color: 'white' }}
                                    borderRadius="xl"
                                    h="50px"
                                    focusBorderColor="brand.500"
                                  />
                                  <InputRightElement h="50px">
                                    <IconButton
                                      variant="ghost"
                                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                      onClick={() => setShowPassword(!showPassword)}
                                      aria-label="Toggle password visibility"
                                      _hover={{ bg: 'transparent' }}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </FormControl>

                              <Button
                                type="submit"
                                colorScheme="brand"
                                w="full"
                                size="lg"
                                isLoading={loading}
                                borderRadius="xl"
                                h="50px"
                                mt={2}
                                fontWeight="bold"
                                boxShadow="md"
                              >
                                Masuk Sekarang
                              </Button>
                            </VStack>
                          </form>
                        </TabPanel>

                        {/* TAB 2: DAFTAR */}
                        <TabPanel p={0}>
                          <form onSubmit={handleAuth}>
                            <VStack spacing={4}>
                              <FormControl isRequired>
                                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
                                  Email
                                </FormLabel>
                                <Input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  onFocus={() => setIsEmailFocused(true)}
                                  onBlur={() => setIsEmailFocused(false)}
                                  placeholder="Masukkan email Anda"
                                  bg="gray.50"
                                  _dark={{ bg: 'gray.800', color: 'white' }}
                                  borderRadius="xl"
                                  h="50px"
                                  focusBorderColor="brand.500"
                                />
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
                                  Password
                                </FormLabel>
                                <InputGroup h="50px">
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    placeholder="Buat password baru"
                                    bg="gray.50"
                                    _dark={{ bg: 'gray.800', color: 'white' }}
                                    borderRadius="xl"
                                    h="50px"
                                    focusBorderColor="brand.500"
                                  />
                                  <InputRightElement h="50px">
                                    <IconButton
                                      variant="ghost"
                                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                      onClick={() => setShowPassword(!showPassword)}
                                      aria-label="Toggle password visibility"
                                      _hover={{ bg: 'transparent' }}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </FormControl>

                              <Button
                                type="submit"
                                colorScheme="brand"
                                w="full"
                                size="lg"
                                isLoading={loading}
                                borderRadius="xl"
                                h="50px"
                                mt={2}
                                fontWeight="bold"
                                boxShadow="md"
                              >
                                Daftar Sekarang
                              </Button>
                            </VStack>
                          </form>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    {/* Passkey / Biometric Option */}
                    <Button
                      w="full"
                      variant="ghost"
                      size="sm"
                      leftIcon={<FaKey color="#6C5CE7" />}
                      fontSize="xs"
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                      onClick={() =>
                        toast({
                          title: 'Passkey / Biometric',
                          description: 'Fitur Sign-in dengan Passkey akan aktif segera!',
                          status: 'info',
                          duration: 3000,
                        })
                      }
                    >
                      Masuk dengan Passkey (Biometric)
                    </Button>
                  </>
                )}

                <Text fontSize="2xs" color="gray.400" textAlign="center">
                  Dengan melanjutkan, Anda menyetujui{' '}
                  <Link as={RouterLink} to="/terms-conditions" color="brand.500">
                    Ketentuan
                  </Link>{' '}
                  &{' '}
                  <Link as={RouterLink} to="/privacy-policy" color="brand.500">
                    Kebijakan Privasi
                  </Link>{' '}
                  Ngawonggo.
                </Text>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Modal Reset Password */}
        <Modal isOpen={isResetOpen} onClose={onResetClose} isCentered>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader>Reset Password</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleResetPassword}>
              <ModalBody>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Masukkan email yang terdaftar, kami akan mengirimkan tautan untuk mengatur ulang password Anda.
                </Text>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    borderRadius="xl"
                    h="50px"
                    focusBorderColor="brand.500"
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onResetClose} mr={3}>
                  Batal
                </Button>
                <Button type="submit" colorScheme="brand" isLoading={isResetting}>
                  Kirim Tautan
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default AuthPage;
