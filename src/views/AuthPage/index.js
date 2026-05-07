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
} from '@chakra-ui/react';
import { FaGoogle, FaFacebook, FaDiscord, FaTwitter, FaSpotify, FaGithub, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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


        fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `<b>User Baru Mendaftar!</b>\n\n<b>Nama/Email:</b> ${email}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
        }).catch(err => console.error("Telegram error:", err));

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
            password: newPassword
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

    // Use a small delay for better UX and to ensure state is set
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
        }
      });
      if (error) throw error;
      // Note: Redirect happens automatically
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
        }
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
        }
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
        }
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
        }
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
        }
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
      bg='gray.50' _dark={{ bg: 'gray.900' }}
      position='relative'
      overflow="hidden"
      py={10}
    >
      {/* Background decoration */}
      <Box
        position='absolute'
        top="-10%"
        right="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius='full'
        filter="blur(80px)"
        opacity={0.6}
        zIndex={0}
      />
      <Box
        position='absolute'
        bottom="-10%"
        left="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius='full'
        filter="blur(80px)"
        opacity={0.6}
        zIndex={0}
      />

      <Container maxW="md" position='relative' zIndex={1}>
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
            <Box bg="brand.600" p={2} borderRadius="xl" boxShadow="md" display="inline-block"><Image src="/logo_desa.png" h="50px" fallbackSrc="https://via.placeholder.com/60" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} /></Box>
            <Heading size="lg" color="brand.600">Portal Warga</Heading>
            <Text color="gray.500" fontSize="sm">Desa Ngawonggo, Magelang</Text>
          </VStack>


          {isUpdateMode ? (
          <Box
            w='full'
            p={8}
            borderRadius="2xl"
            layerStyle="glassCard"
            bg="white" _dark={{ bg: "gray.800" }}
          >
            <VStack spacing={6} position="relative" zIndex={1}>
              <Box textAlign="center">
                <Heading size="lg" color="gray.800" _dark={{ color: "white" }} mb={2}>Buat Password Baru</Heading>
                <Text color="gray.500" fontSize="sm">Silakan masukkan password baru Anda.</Text>
              </Box>

              <form onSubmit={handleUpdatePassword} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="gray.600">Password Baru</FormLabel>
                    <InputGroup h='50px'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password baru"
                        bg="white" _dark={{ bg: "gray.800" }}
                        borderRadius='xl'
                        h='50px'
                        focusBorderColor="brand.500"
                      />
                      <InputRightElement h='50px'>
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
                    <FormLabel fontSize="sm" color="gray.600">Konfirmasi Password</FormLabel>
                    <InputGroup h='50px'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        bg="white" _dark={{ bg: "gray.800" }}
                        borderRadius='xl'
                        h='50px'
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
                    borderRadius='xl'
                    h='50px'
                    mt={2}
                  >
                    Simpan Password
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
          ) : (
          <Box
            w='full'
            p={8}
            borderRadius="2xl"
            layerStyle="glassCard"
            bg="white" _dark={{ bg: "gray.800" }}
          >


            <>
            <VStack spacing={4} w="full">
              <Button
                w='full'
                variant='outline'
                leftIcon={<FaGoogle color="#EA4335" />}
                onClick={handleGoogleLogin}
                borderRadius='xl'
                h='50px'
                isLoading={loading}
                disabled={loading}
                _hover={{ bg: 'gray.50' }}
              >
                Lanjutkan dengan Google
              </Button>

              <Accordion allowToggle w="full">
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton _hover={{ bg: 'transparent' }} px={0}>
                      <Box flex="1" textAlign="center" fontSize="sm" color="gray.500">
                        Tampilkan metode login lainnya
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={0}>
                    <VStack spacing={4}>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaGithub color="#333" />}
                        onClick={handleGithubLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan GitHub
                        <Badge colorScheme='green' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>NEW</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaDiscord color="#5865F2" />}
                        onClick={handleDiscordLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Discord
                        <Badge colorScheme='green' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>NEW</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaTwitter color="#1DA1F2" />}
                        onClick={handleTwitterLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan X
                        <Badge colorScheme='green' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>NEW</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaSpotify color="#1DB954" />}
                        onClick={handleSpotifyLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Spotify
                        <Badge colorScheme='blue' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>BETA</Badge>
                      </Button>

                      <Button
                        w='full'
                        variant='outline'
                        leftIcon={<FaFacebook color='#1877F2' />}
                        onClick={handleFacebookLogin}
                        borderRadius='xl'
                        h='50px'
                        isLoading={loading}
                        disabled={loading}
                        _hover={{ bg: 'gray.50' }}
                        position='relative'
                      >
                        Lanjutkan dengan Facebook
                        <Badge colorScheme='blue' variant='solid' position='absolute' right='-2' top='-2' borderRadius='full' fontSize='2xs' px={2}>BETA</Badge>
                      </Button>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>

            <HStack w='full' mb={6} mt={2}>
              <Divider />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">Atau gunakan Email</Text>
              <Divider />
            </HStack>

            <Tabs isFitted variant="soft-rounded" colorScheme="brand" onChange={(index) => setIsSignUp(index === 1)}>
              <TabList mb={6} bg="gray.100" _dark={{ bg: "gray.700" }} p={1} borderRadius='full'>
                <Tab borderRadius="full" fontSize="sm" fontWeight="600">Masuk</Tab>
                <Tab borderRadius="full" fontSize="sm" fontWeight="600">Daftar</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <form onSubmit={handleAuth}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan email"
                          bg="white" _dark={{ bg: "gray.800" }}
                          borderRadius='xl'
                          h='50px'
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <HStack justify="space-between" mb={2}>
                          <FormLabel fontSize="sm" color="gray.600" mb={0}>Password</FormLabel>
                          <Link fontSize="xs" color="brand.500" onClick={onResetOpen} _hover={{ textDecoration: 'underline' }}>Lupa Password?</Link>
                        </HStack>
                        <InputGroup h='50px'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            bg="white" _dark={{ bg: "gray.800" }}
                            borderRadius='xl'
                            h='50px'
                            focusBorderColor="brand.500"
                          />
                          <InputRightElement h='50px'>
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

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        size="lg"
                        isLoading={loading}
                        borderRadius='xl'
                        h='50px'
                        mt={2}
                      >
                        Masuk Sekarang
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
                <TabPanel p={0}>
                  <form onSubmit={handleAuth}>
                     <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan email"
                          bg="white" _dark={{ bg: "gray.800" }}
                          borderRadius='xl'
                          h='50px'
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" color="gray.600">Password</FormLabel>
                        <InputGroup h='50px'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Buat password"
                            bg="white" _dark={{ bg: "gray.800" }}
                            borderRadius='xl'
                            h='50px'
                            focusBorderColor="brand.500"
                          />
                          <InputRightElement h='50px'>
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

                      <Button
                        type="submit"
                        colorScheme="brand"
                        w="full"
                        size="lg"
                        isLoading={loading}
                        borderRadius='xl'
                        h='50px'
                        mt={2}
                      >
                        Daftar Sekarang
                      </Button>
                   </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
            </>

          </Box> )}



          <Box
            p={8}
            mb={8}
            borderRadius="3xl"
            bg="brand.500"
            color="white"
            position="relative"
            overflow="hidden"
            boxShadow="xl"
            w="full"
          >
             <VStack align="start" spacing={4} position="relative" zIndex={1}>
                <Badge bg="white" _dark={{ bg: "gray.800" }} color="brand.500" borderRadius="full" px={3} py={1}>INFO LOGIN</Badge>
                <Heading size="md">Kenapa Login Lebih Baik?</Heading>
                <Text fontSize="sm" opacity={0.9}>
                    Dengan masuk ke akun Anda, SplashScreen dan Verifikasi Robot akan otomatis dilewati saat Anda kembali. Kami juga menyimpan progres bacaan Quran dan skor permainan Anda secara otomatis.
                </Text>
             </VStack>
          </Box>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            Dengan masuk, Anda setuju dengan <Link as={RouterLink} to="/terms-conditions" color="brand.500">Ketentuan</Link> & <Link as={RouterLink} to="/privacy-policy" color="brand.500">Kebijakan</Link> kami.
          </Text>
        </VStack>

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
                  <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
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
              <Button variant="ghost" onClick={onResetClose} mr={3}>Batal</Button>
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
