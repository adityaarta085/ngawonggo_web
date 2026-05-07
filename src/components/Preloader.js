import React, { useEffect } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

const Preloader = ({ onComplete, timeout = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, timeout);

    return () => clearTimeout(timer);
  }, [onComplete, timeout]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white" _dark={{ bg: "gray.800" }}
      zIndex={10000}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="brand.500" />
        <Text fontSize="lg" fontWeight="bold" color="gray.600">
          Loading Assets...
        </Text>
      </VStack>
    </Box>
  );
};

export default Preloader;
