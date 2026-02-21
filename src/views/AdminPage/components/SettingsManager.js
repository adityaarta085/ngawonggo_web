import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  Text,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const SettingsManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'groq_api_key')
        .single();

      if (error) throw error;
      if (data) setApiKey(data.value);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'groq_api_key', value: apiKey });

      if (error) throw error;

      toast({
        title: 'Pengaturan Berhasil Disimpan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Gagal Menyimpan Pengaturan',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="md" mb={2}>Pengaturan AI & Sistem</Heading>
          <Text color="gray.500" fontSize="sm">
            Kelola konfigurasi sistem dan API key untuk layanan desa.
          </Text>
        </Box>

        <Card variant="outline" borderRadius="xl">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="bold">Groq API Key</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showKey ? 'text' : 'password'}
                    placeholder="Masukkan Groq API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowKey(!showKey)}
                      icon={showKey ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text mt={2} fontSize="xs" color="gray.500">
                  Dapatkan API Key di console.groq.com. Key ini digunakan untuk layanan Asisten AI Desa.
                </Text>
              </FormControl>

              <Button
                leftIcon={<FaSave />}
                colorScheme="brand"
                onClick={handleSave}
                isLoading={loading}
                alignSelf="flex-start"
              >
                Simpan Perubahan
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default SettingsManager;
