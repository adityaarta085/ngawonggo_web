import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, ScaleFade, Image, useToast } from '@chakra-ui/react';
import { Turnstile } from '@marsidev/react-turnstile';
import axios from 'axios';
import Loading from './Loading';

const HumanVerification = ({ onVerified }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [token, setToken] = useState(null);
  const [verificationType, setVerificationType] = useState(0);
  const toast = useToast();

  const SITE_KEY = '0x4AAAAAACrMKtrKbQoaiY_g';

  useEffect(() => {
     // Randomize verification slightly so it's not always the same prompt text
     setVerificationType(Math.floor(Math.random() * 3));
  }, []);

  const prompts = [
    "Harap verifikasi bahwa Anda adalah manusia untuk melanjutkan ke portal digital Desa Ngawonggo.",
    "Verifikasi sistem diperlukan untuk mengamankan akses ke layanan digital Desa Ngawonggo.",
    "Pastikan Anda bukan robot untuk menikmati pengalaman digital Desa Ngawonggo 2045."
  ];

  const handleVerify = async () => {
    if (!token) return;

    setIsVerifying(true);
    try {
      const response = await axios.post('/api/verify-turnstile', { token });

      if (response.data.success) {
        onVerified();
      } else {
        toast({
          title: "Verifikasi Gagal",
          description: "Silakan coba lagi.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsVerifying(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Kesalahan Sistem",
        description: "Gagal memverifikasi status manusia. Silakan muat ulang halaman.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsVerifying(false);
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(15, 23, 42, 0.9)"
      backdropFilter="blur(15px)"
      zIndex={10000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <ScaleFade initialScale={0.9} in={true}>
        <VStack
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          spacing={6}
          boxShadow="dark-lg"
          maxW="420px"
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Subtle decoration */}
          <Box position="absolute" top={0} left={0} w="full" h="4px" bg="brand.500" />

          <Box boxSize="80px" borderRadius="full" bg="brand.50" display="flex" alignItems="center" justifyContent="center">
             <Image src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png" h="50px" />
          </Box>

          <VStack spacing={2}>
            <Heading size="md" color="gray.800">Verifikasi Keamanan</Heading>
            <Text color="gray.600" fontSize="sm">
              {prompts[verificationType]}
            </Text>
          </VStack>

          <Box
            w="full"
            display="flex"
            justifyContent="center"
            minH="65px"
          >
            {isVerifying ? (
              <VStack>
                <Loading size={30} />
                <Text fontSize="xs" color="gray.500">Memproses verifikasi...</Text>
              </VStack>
            ) : (
              <Turnstile
                siteKey={SITE_KEY}
                onSuccess={(token) => setToken(token)}
                onExpire={() => setToken(null)}
                onError={() => setToken(null)}
              />
            )}
          </Box>

          <Button
            colorScheme="brand"
            w="full"
            size="lg"
            h="56px"
            isDisabled={!token || isVerifying}
            isLoading={isVerifying}
            onClick={handleVerify}
            boxShadow="0 4px 14px 0 rgba(0, 86, 179, 0.39)"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 86, 179, 0.23)',
            }}
            transition="all 0.2s"
          >
            Lanjutkan ke Portal
          </Button>

          <Text fontSize="xs" color="gray.400">
            Powered by Cloudflare Turnstile & Desa Digital Ngawonggo
          </Text>
        </VStack>
      </ScaleFade>
    </Box>
  );
};

export default HumanVerification;
