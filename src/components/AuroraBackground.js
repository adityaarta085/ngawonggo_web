import React from 'react';
import { Box } from '@chakra-ui/react';

const AuroraBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-2}
      overflow="hidden"
      bg="white"
    >
      {/* Base Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(135deg, #f5f7ff 0%, #fff5f9 50%, #f9f5ff 100%)"
        zIndex={-3}
      />

      {/* Animated Aurora Layers */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        bgGradient="radial(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 50%)"
        animation="float 20s infinite alternate ease-in-out"
        filter="blur(80px)"
        zIndex={-2}
      />

      <Box
        position="absolute"
        top="-20%"
        right="-20%"
        width="70vw"
        height="70vw"
        bgGradient="radial(circle at 50% 50%, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0) 60%)"
        animation="float 25s infinite alternate-reverse ease-in-out"
        filter="blur(100px)"
        zIndex={-2}
      />

      <Box
        position="absolute"
        bottom="-30%"
        left="10%"
        width="80vw"
        height="80vw"
        bgGradient="radial(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 50%)"
        animation="float 30s infinite alternate ease-in-out"
        filter="blur(120px)"
        zIndex={-2}
      />

      {/* Subtle Noise or Grain (Optional, but adds premium feel) */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity="0.03"
        pointerEvents="none"
        backgroundImage="url('https://www.transparenttextures.com/patterns/asfalt-light.png')"
        zIndex={-1}
      />
    </Box>
  );
};

export default AuroraBackground;
