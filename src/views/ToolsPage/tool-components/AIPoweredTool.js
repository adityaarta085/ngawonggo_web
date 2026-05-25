import React, { useState, useEffect } from 'react';
import { Box, Button, Textarea, Text, VStack, useToast, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { FaPlay, FaCopy } from 'react-icons/fa';
import ToolLayout from '../components/ToolLayout';
import { supabase } from '../../../lib/supabase';

const AIPoweredTool = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({ title: 'Masukkan teks terlebih dahulu', status: 'warning', duration: 3000 });
      return;
    }

    if (!userId) {
      toast({ title: 'Login Diperlukan', description: 'Anda harus login untuk menggunakan alat ini.', status: 'error', duration: 3000 });
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          userId: userId,
          isTool: true,
          toolName: tool.name,
          toolDesc: tool.desc
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      const resultText = data.choices[0].message.content;
      setOutput(resultText);
    } catch (error) {
      toast({ title: 'Gagal memproses', description: error.message, status: 'error', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Disalin', status: 'success', duration: 2000 });
  };

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={6} align="stretch" maxW="3xl" mx="auto">
        <Alert status="info" borderRadius="md" size="sm">
          <AlertIcon />
          Alat ini didukung oleh AI. Pastikan instruksi atau input yang Anda masukkan jelas.
        </Alert>

        <Box>
          <Text mb={2} fontWeight="bold">Input</Text>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Masukkan data untuk ${tool.name}...`}
            minH="150px"
            resize="vertical"
          />
        </Box>

        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleProcess}
          isLoading={loading}
          loadingText="Memproses..."
          leftIcon={<FaPlay />}
        >
          Proses
        </Button>

        {loading && (
          <Flex justify="center" p={8} direction="column" align="center" gap={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">AI sedang memproses...</Text>
          </Flex>
        )}

        {output && !loading && (
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">Hasil Output</Text>
              <Button size="xs" leftIcon={<FaCopy />} onClick={handleCopy}>Copy</Button>
            </Flex>
            <Box
              p={4}
              bg="gray.50"
              _dark={{ bg: 'gray.900' }}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              fontFamily={tool.category === 'developer' || tool.category === 'file' ? 'monospace' : 'inherit'}
              whiteSpace="pre-wrap"
            >
              {output}
            </Box>
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default AIPoweredTool;
