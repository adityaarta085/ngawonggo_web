import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const GeometricMascot = ({
  isPasswordFocused = false,
  isEmailFocused = false,
  isSubmitting = false,
  height = '100%',
}) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate normalized offset (-12 to 12 pixels for pupils)
      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = 300;
      const factor = Math.min(distance / maxDistance, 1);
      const angle = Math.atan2(deltaY, deltaX);
      
      setMousePos({
        x: Math.cos(angle) * 12 * factor,
        y: Math.sin(angle) * 12 * factor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // When email input is focused, make eyes look down-right towards input box
  const eyeX = isPasswordFocused ? 0 : isEmailFocused ? 8 : mousePos.x;
  const eyeY = isPasswordFocused ? 0 : isEmailFocused ? 10 : mousePos.y;

  return (
    <Box
      ref={containerRef}
      w="full"
      h={height}
      minH={{ base: "340px", lg: "520px" }}
      bgGradient="linear(to-br, #E9E6FB, #DCD7F9, #F5F3FF)"
      _dark={{
        bgGradient: "linear(to-br, #1A1A2E, #16213E, #0F3460)",
      }}
      borderRadius="3xl"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={{ base: 6, md: 8 }}
      boxShadow="inner"
    >
      {/* Background Decorative Blobs */}
      <MotionBox
        position="absolute"
        top="-50px"
        right="-50px"
        w="220px"
        h="220px"
        bg="purple.200"
        _dark={{ bg: "purple.900" }}
        filter="blur(50px)"
        opacity={0.6}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <MotionBox
        position="absolute"
        bottom="-40px"
        left="-40px"
        w="200px"
        h="200px"
        bg="#FF9E88"
        _dark={{ bg: "#C85A44" }}
        filter="blur(50px)"
        opacity={0.5}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top Branding & Status Tag */}
      <Flex justify="space-between" align="center" zIndex={2}>
        <Badge
          colorScheme="purple"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="wide"
          boxShadow="sm"
        >
          ✨ NGAWONGGO MASCOT
        </Badge>
        <Text fontSize="xs" fontWeight="medium" color="gray.600" _dark={{ color: "gray.300" }}>
          {isPasswordFocused
            ? "🙈 Karakter menutup mata!"
            : isSubmitting
            ? "🚀 Memproses masuk..."
            : "👀 Karakter memperhatikan Anda"}
        </Text>
      </Flex>

      {/* Center SVG Mascot Group */}
      <Box
        position="relative"
        w="full"
        flex="1"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        py={4}
        zIndex={2}
      >
        <svg
          viewBox="0 0 450 380"
          style={{
            width: '100%',
            maxHeight: '380px',
            overflow: 'visible',
            filter: 'drop-shadow(0px 20px 25px rgba(0,0,0,0.12))',
          }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6C5CE7" />
              <stop offset="100%" stopColor="#5138EE" />
            </linearGradient>
            <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEAA7" />
              <stop offset="100%" stopColor="#FDCB6E" />
            </linearGradient>
            <linearGradient id="salmonPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9E88" />
              <stop offset="50%" stopColor="#FF8A65" />
              <stop offset="100%" stopColor="#FF7052" />
            </linearGradient>
            <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D3436" />
              <stop offset="100%" stopColor="#1E1E24" />
            </linearGradient>
          </defs>

          {/* 1. PURPLE TALL CHARACTER (Left Rear) */}
          <g transform="translate(70, 40)">
            <motion.rect
              x="0"
              y="0"
              width="130"
              height="300"
              rx="60"
              fill="url(#purpleGrad)"
              animate={{
                y: isSubmitting ? [0, -15, 0] : [0, -6, 0],
              }}
              transition={{
                duration: isSubmitting ? 0.4 : 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Purple Character Eyes */}
            <g transform="translate(42, 65)">
              {!isPasswordFocused ? (
                <>
                  {/* Left Eye Outer */}
                  <circle cx="0" cy="0" r="13" fill="#FFFFFF" />
                  {/* Left Pupil */}
                  <motion.circle
                    cx={eyeX * 0.7}
                    cy={eyeY * 0.7}
                    r="6"
                    fill="#1E1E24"
                    animate={{ scale: isSubmitting ? 1.2 : 1 }}
                  />

                  {/* Right Eye Outer */}
                  <circle cx="44" cy="0" r="13" fill="#FFFFFF" />
                  {/* Right Pupil */}
                  <motion.circle
                    cx={44 + eyeX * 0.7}
                    cy={eyeY * 0.7}
                    r="6"
                    fill="#1E1E24"
                    animate={{ scale: isSubmitting ? 1.2 : 1 }}
                  />
                </>
              ) : (
                /* Shy / Covered Eyes mode when password is typing */
                <g>
                  <path d="M-10,-5 Q0,10 10,-5" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M34,-5 Q44,10 54,-5" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                  {/* Cute blush dots */}
                  <circle cx="-12" cy="12" r="6" fill="#FF7675" opacity="0.7" />
                  <circle cx="56" cy="12" r="6" fill="#FF7675" opacity="0.7" />
                </g>
              )}
            </g>
          </g>

          {/* 2. BLACK / DARK PILL CHARACTER (Center Middle) */}
          <g transform="translate(175, 120)">
            <motion.rect
              x="0"
              y="0"
              width="110"
              height="220"
              rx="55"
              fill="url(#darkGrad)"
              animate={{
                y: isSubmitting ? [0, -10, 0] : [0, -4, 0],
              }}
              transition={{
                duration: isSubmitting ? 0.5 : 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
            {/* Black Character Eyes */}
            <g transform="translate(32, 50)">
              {!isPasswordFocused ? (
                <>
                  <circle cx="0" cy="0" r="11" fill="#FFFFFF" />
                  <circle cx={eyeX * 0.65} cy={eyeY * 0.65} r="5" fill="#1E1E24" />

                  <circle cx="44" cy="0" r="11" fill="#FFFFFF" />
                  <circle cx={44 + eyeX * 0.65} cy={eyeY * 0.65} r="5" fill="#1E1E24" />
                </>
              ) : (
                /* Peeking lines */
                <g transform="translate(-5, -5)">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <line x1="38" y1="5" x2="54" y2="5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}
            </g>
          </g>

          {/* 3. YELLOW ARCH CHARACTER (Right Front) */}
          <g transform="translate(265, 160)">
            <motion.path
              d="M 0 180 L 0 60 A 60 60 0 0 1 120 60 L 120 180 Z"
              fill="url(#yellowGrad)"
              animate={{
                y: isSubmitting ? [0, -20, 0] : [0, -8, 0],
              }}
              transition={{
                duration: isSubmitting ? 0.35 : 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
            {/* Yellow Character Facial Features */}
            <g transform="translate(42, 55)">
              {!isPasswordFocused ? (
                <>
                  {/* Dot Eyes */}
                  <circle cx={eyeX * 0.5} cy={eyeY * 0.5} r="5" fill="#2D3436" />
                  <circle cx={36 + eyeX * 0.5} cy={eyeY * 0.5} r="5" fill="#2D3436" />
                  {/* Mouth Line or Smile */}
                  {isSubmitting ? (
                    <path d="M 8 18 Q 18 28 28 18" fill="none" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
                  ) : (
                    <line x1="8" y1="20" x2="28" y2="20" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
                  )}
                </>
              ) : (
                /* Closed happy eyes ^ ^ */
                <g>
                  <path d="M -4,2 Q 2,-4 8,2" fill="none" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 28,2 Q 34,-4 40,2" fill="none" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 12 16 Q 18 22 24 16" fill="none" stroke="#2D3436" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
            </g>
          </g>

          {/* 4. SALMON PINK SEMI-CIRCLE BLOB (Left Bottom Front) */}
          <g transform="translate(30, 210)">
            <motion.path
              d="M 0 130 A 75 75 0 0 1 150 130 Z"
              fill="url(#salmonPinkGrad)"
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Orange Blob Eyes */}
            <g transform="translate(56, 52)">
              {!isPasswordFocused ? (
                <>
                  <circle cx={eyeX * 0.4} cy={eyeY * 0.4} r="4.5" fill="#1E1E24" />
                  <circle cx={32 + eyeX * 0.4} cy={eyeY * 0.4} r="4.5" fill="#1E1E24" />
                </>
              ) : (
                <>
                  <circle cx="0" cy="0" r="3.5" fill="#1E1E24" />
                  <circle cx="32" cy="0" r="3.5" fill="#1E1E24" />
                </>
              )}
            </g>
          </g>
        </svg>
      </Box>

      {/* Bottom Information Text Card */}
      <MotionFlex
        direction="column"
        align="center"
        textAlign="center"
        bg="white"
        _dark={{ bg: "gray.800" }}
        p={4}
        borderRadius="2xl"
        boxShadow="md"
        zIndex={2}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text fontWeight="bold" fontSize="md" color="gray.800" _dark={{ color: "white" }}>
          Selamat Datang di Ngawonggo Web!
        </Text>
        <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} mt={1}>
          Maskot interaktif kami siap menyambut dan mendampingi aktivitas digital Anda.
        </Text>
      </MotionFlex>
    </Box>
  );
};

export default GeometricMascot;
