import React, { useState } from 'react';
import { Box, Flex, Text, CloseButton, Badge } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const SiteMascot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="fixed" bottom={{ base: "70px", md: "24px" }} left="24px" zIndex={999}>
      <AnimatePresence>
        {isOpen && (
          <MotionFlex
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            direction="column"
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            p={4}
            borderRadius="2xl"
            boxShadow="2xl"
            borderWidth="1px"
            borderColor="gray.100"
            maxW="280px"
            mb={3}
            position="relative"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Badge colorScheme="purple" borderRadius="full" px={2} py={0.5} fontSize="2xs">
                Maskot Ngawonggo
              </Badge>
              <CloseButton size="sm" onClick={() => setIsOpen(false)} />
            </Flex>
            <Text fontSize="xs" color="gray.700" _dark={{ color: "gray.200" }} fontWeight="medium">
              👋 Halo Warga! Selamat datang di Portal Digital Desa Ngawonggo. Butuh bantuan atau mau baca Quran & berita terbaru?
            </Text>
          </MotionFlex>
        )}
      </AnimatePresence>

      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        bg="purple.600"
        p={2.5}
        borderRadius="full"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <svg viewBox="0 0 100 100" style={{ width: '40px', height: '40px' }}>
          {/* Mini Purple Blob Character */}
          <rect x="25" y="15" width="38" height="70" rx="19" fill="#6C5CE7" />
          <circle cx="36" cy="35" r="4" fill="#FFFFFF" />
          <circle cx="37" cy="35" r="2" fill="#1E1E24" />
          <circle cx="50" cy="35" r="4" fill="#FFFFFF" />
          <circle cx="51" cy="35" r="2" fill="#1E1E24" />

          {/* Mini Yellow Blob Character */}
          <path d="M 52 85 L 52 45 A 18 18 0 0 1 88 45 L 88 85 Z" fill="#FDCB6E" />
          <circle cx="63" cy="55" r="2" fill="#2D3436" />
          <circle cx="75" cy="55" r="2" fill="#2D3436" />

          {/* Mini Salmon Pink Blob Character */}
          <path d="M 10 85 A 24 24 0 0 1 58 85 Z" fill="#FF8A65" />
          <circle cx="26" cy="74" r="2" fill="#1E1E24" />
          <circle cx="42" cy="74" r="2" fill="#1E1E24" />
        </svg>
      </MotionBox>
    </Box>
  );
};

export default SiteMascot;
