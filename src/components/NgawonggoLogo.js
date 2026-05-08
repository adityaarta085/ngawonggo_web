import React, { useState, useEffect } from 'react';
import { Flex, Image, Text, Box } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { supabase } from '../lib/supabase';

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const NgawonggoLogo = ({ color = "accent.green", fontSize = "xl", iconSize = 8, showText = true, flexDirection = "row" }) => {
  const [settings, setSettings] = useState(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const CACHE_KEY = 'ngawonggo_logo_settings_cache';
        const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setSettings(parsed.settings);
            return;
          }
        }

        const { data } = await supabase.from('logo_settings').select('*').limit(1).single();
        if (data) {
            setSettings(data);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                settings: data,
                timestamp: Date.now()
            }));
        }
      } catch (err) {
        console.error('Failed to load logo settings', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;
    const baseTransition = { duration: 2, repeat: Infinity, ease: "easeInOut" };
    switch (settings.animation_type) {
      case 'float':
        controls.start({ y: [0, -5, 0], transition: baseTransition });
        break;
      case 'pulse':
        controls.start({ scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } });
        break;
      case 'spin':
        controls.start({ rotate: [0, 360], transition: { duration: 20, repeat: Infinity, ease: "linear" } });
        break;
      default:
        controls.start({ y: 0, scale: 1, rotate: 0 });
    }
  }, [settings, controls]);

  const bgImage = settings?.background_image || "url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop')";
  const bgColor = settings?.background_color || "brand.600";
  const glow = settings?.glow_color || "rgba(255,255,255,0.2)";
  const borderStyle = settings?.border_style === 'none' ? 'none' : `2px ${settings?.border_style || 'solid'} rgba(255,255,255,0.5)`;

  return (
    <Flex align="center" direction={flexDirection}>
      {/* Left Ornament */}
      {settings?.left_ornament_url && (
          <Image src={settings.left_ornament_url} h={iconSize} mr={2} objectFit="contain" />
      )}

      <MotionBox
        p={flexDirection === "column" ? 4 : 2}
        borderRadius="2xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgColor={bgColor}
        bgImage={bgImage.startsWith('http') || bgImage.startsWith('/') ? `url('${bgImage}')` : bgImage}
        bgSize="cover"
        bgPosition="center"
        position="relative"
        overflow="hidden"
        borderColor="whiteAlpha.300"
        borderWidth={settings?.border_style === 'none' ? "1px" : "0px"}
        border={borderStyle}
        boxShadow={`0 4px 15px ${glow}`}
        animate={controls}
      >
        <Box
          position="absolute"
          top={0} left={0} right={0} bottom={0}
          bgGradient="linear(to-br, blackAlpha.700, blackAlpha.400)"
          backdropFilter="blur(3px)"
        />
        <MotionImage
          src="/logo_desa.png"
          height={iconSize}
          width="auto"
          objectFit="contain"
          alt="Logo Kabupaten Magelang"
          position="relative"
          zIndex={1}
          style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' }}
        />
      </MotionBox>

      {/* Right Ornament */}
      {settings?.right_ornament_url && (
          <Image src={settings.right_ornament_url} h={iconSize} ml={2} objectFit="contain" />
      )}

      {showText && (
        <Text
          ml={flexDirection === "row" ? 3 : 0}
          mt={flexDirection === "column" ? 3 : 0}
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="heading"
          color={color}
          letterSpacing="tight"
        >
          Kabupaten Magelang
        </Text>
      )}
    </Flex>
  );
};

export default NgawonggoLogo;
