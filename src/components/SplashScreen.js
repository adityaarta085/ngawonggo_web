import React, { useState, useEffect } from 'react';
import { Box, VStack, Image, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import NgawonggoLogo from './NgawonggoLogo';
import DoodleLogo from './DoodleLogo';
import { supabase } from '../lib/supabase';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const SplashScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      const defaultLogos = [
        { type: 'component', component: <NgawonggoLogo fontSize="4xl" iconSize={16} flexDirection="column" /> },
        { type: 'image', src: 'https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png', label: 'Kabupaten Magelang' },
      ];

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('doodles')
        .select('*')
        .eq('is_active', true)
        .eq('use_in_splash_screen', true)
        .order('created_at', { ascending: false });

      let dynamicLogos = [...defaultLogos];

      if (data && data.length > 0) {
        const validDoodle = data.find(d => {
            if (!d.start_date && !d.end_date) return true;
            if (d.start_date && d.end_date) {
                return today >= d.start_date && today <= d.end_date;
            }
            if (d.start_date) return today >= d.start_date;
            if (d.end_date) return today <= d.end_date;
            return false;
        });

        if (validDoodle) {
            // Replace the first logo (Ngawonggo default) with the Doodle
            dynamicLogos[0] = { type: 'component', component: <DoodleLogo doodleData={validDoodle} /> };
        }
      }

      setLogos(dynamicLogos);
    };

    fetchLogos();
  }, []);

  useEffect(() => {
    if (logos.length === 0) return;

    if (step < logos.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1500); // give it a bit more time for doodles
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [step, logos.length, onComplete, logos]);

  if (logos.length === 0) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="neo.yellow"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className="bg-dot-grid"
    >
      <VStack spacing={12}>
        <AnimatePresence mode="wait">
          {logos[step] && (
            <MotionBox
              key={step}
              initial={{ x: '-100vw', rotate: -15 }}
              animate={{ x: 0, rotate: 0 }}
              exit={{ x: '100vw', rotate: 15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              p={8}
              bg="white"
              border="4px solid black"
              boxShadow="8px 8px 0px black"
              transform={step % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)'}
            >
              {logos[step].type === 'component' ? (
                logos[step].component
              ) : (
                <VStack spacing={6}>
                  <Image src={logos[step].src} h="150px" objectFit="contain" alt={logos[step].label} />
                  {logos[step].label && (
                    <Text fontFamily="heading" fontWeight="900" fontSize="2xl" color="black" letterSpacing="wide">
                      {logos[step].label.toUpperCase()}
                    </Text>
                  )}
                </VStack>
              )}
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>

      <Box position="absolute" bottom={10} textAlign="center">
        <MotionText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          fontSize="xs"
          fontFamily="accent"
          color="black"
          fontWeight="900"
          letterSpacing="widest"
          bg="white"
          px={3}
          py={1}
          border="2px solid black"
          boxShadow="2px 2px 0px black"
        >
          MADE WITH KELOMPOK 1 SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A
        </MotionText>
      </Box>
    </Box>
  );
};

export default SplashScreen;
