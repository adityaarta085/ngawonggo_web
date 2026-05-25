import React from 'react';
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import ToolLayout from '../components/ToolLayout';

const SpecificTools = ({ tool }) => {
  // This component acts as a router/wrapper for complex tools that need their own dedicated UI
  // like Stopwatch, JSON Formatter, QR Code generator etc.

  return (
    <ToolLayout tool={tool}>
      <Box p={8} textAlign="center" border="2px dashed" borderColor="gray.300" borderRadius="xl">
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          Tool "{tool.name}" memerlukan UI kustom yang kompleks.
        </Alert>
        <Text color="gray.500">
          Struktur dasar untuk {tool.id} sudah siap. Fitur spesifik (seperti manipulasi Canvas untuk gambar,
          atau syntax highlighter untuk kode) akan diintegrasikan pada komponen ini.
        </Text>
      </Box>
    </ToolLayout>
  );
};

export default SpecificTools;
