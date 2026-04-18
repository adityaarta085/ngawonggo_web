import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack spacing={6} textAlign="center" maxW="lg">
            <Heading color="red.500">Ups! Terjadi Kesalahan</Heading>
            <Text color="gray.600">
              Aplikasi mengalami kendala teknis. Mohon coba segarkan halaman atau hubungi administrator jika masalah berlanjut.
            </Text>
            <Box
              p={4}
              bg="gray.100"
              borderRadius="md"
              fontSize="xs"
              fontFamily="monospace"
              w="full"
              overflowX="auto"
              textAlign="left"
            >
              {this.state.error && this.state.error.toString()}
            </Box>
            <Button
              colorScheme="brand"
              onClick={() => window.location.reload()}
            >
              Segarkan Halaman
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
