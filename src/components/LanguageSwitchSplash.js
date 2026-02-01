import React from 'react';
import { Box, Text, VStack, Spinner } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitchSplash = ({ isVisible, language }) => {
  const languageNames = {
    id: 'Bahasa Indonesia',
    en: 'English',
    jv: 'Basa Jawa'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="brand.500"
          zIndex={10000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
        >
          <VStack spacing={6}>
            <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="whiteAlpha.300" color="white" />
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                Switching Language...
              </Text>
              <Text fontSize="md" opacity={0.8}>
                {languageNames[language] || language}
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default LanguageSwitchSplash;
