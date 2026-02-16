import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Checkbox, ScaleFade, Image } from '@chakra-ui/react';
import Loading from './Loading';

const HumanVerification = ({ onVerified }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [verificationType, setVerificationType] = useState(0);

  useEffect(() => {
     // Randomize verification slightly so it's not always the same prompt text
     setVerificationType(Math.floor(Math.random() * 3));
  }, []);

  const prompts = [
    "Harap verifikasi bahwa Anda adalah manusia untuk melanjutkan ke portal digital Desa Ngawonggo.",
    "Verifikasi sistem diperlukan untuk mengamankan akses ke layanan digital Desa Ngawonggo.",
    "Pastikan Anda bukan robot untuk menikmati pengalaman digital Desa Ngawonggo 2045."
  ];

  const handleVerify = () => {
    if (isChecked) {
      setIsVerifying(true);
      setTimeout(() => {
        onVerified();
      }, 1200);
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
            border="1px solid"
            borderColor="gray.200"
            p={4}
            borderRadius="xl"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bg="gray.50"
            _hover={{ borderColor: 'brand.300' }}
            transition="all 0.2s"
          >
             <Checkbox
                colorScheme="brand"
                size="lg"
                isChecked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                sx={{
                    '.chakra-checkbox__control': {
                        borderRadius: 'md',
                    }
                }}
             >
                <Text fontWeight="600" ml={2} color="gray.700">Saya bukan robot</Text>
             </Checkbox>
             {isVerifying ? <Loading size={30} /> : <Image src="https://www.gstatic.com/recaptcha/api2/logo_48.png" h="24px" opacity={0.6} />}
          </Box>

          <Button
            colorScheme="brand"
            w="full"
            size="lg"
            h="56px"
            isDisabled={!isChecked || isVerifying}
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
            Powered by Desa Digital Ngawonggo Security Stack
          </Text>
        </VStack>
      </ScaleFade>
    </Box>
  );
};

export default HumanVerification;
