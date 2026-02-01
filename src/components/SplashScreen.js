import React, { useState, useEffect } from 'react';
import { Box, VStack, Image, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import NgawonggoLogo from './NgawonggoLogo';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const SplashScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const logos = [
    { type: 'component', component: <NgawonggoLogo fontSize="4xl" iconSize={20} flexDirection="column" /> },
    { type: 'image', src: 'https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png', label: 'Kabupaten Magelang' },
    { type: 'image', src: 'https://www.menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png', label: 'Berakhlak' },
    { type: 'image', src: 'https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png', label: 'SPBE' },
  ];

  useEffect(() => {
    if (step < logos.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1500); // Increased slightly for smoother pacing
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [step, logos.length, onComplete]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={12}>
        <AnimatePresence mode="wait">
          {logos[step] && (
            <MotionBox
              key={step}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smoother feel
              }}
            >
              {logos[step].type === 'component' ? (
                logos[step].component
              ) : (
                <VStack spacing={6}>
                  <Image
                    src={logos[step].src}
                    h="140px"
                    objectFit="contain"
                    alt={logos[step].label}
                    filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.05))"
                  />
                  <Text
                    fontWeight="bold"
                    fontSize="2xl"
                    color="gray.700"
                    letterSpacing="wider"
                  >
                    {logos[step].label}
                  </Text>
                </VStack>
              )}
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>

      <Box position="absolute" bottom={10} textAlign="center">
        <MotionText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          fontSize="xs"
          color="gray.400"
          fontWeight="600"
          letterSpacing="widest"
          textTransform="uppercase"
        >
          Made With Kelompok 1 SMK Muhammadiyah Bandongan 2026 TJKT A
        </MotionText>
      </Box>
    </Box>
  );
};

export default SplashScreen;
