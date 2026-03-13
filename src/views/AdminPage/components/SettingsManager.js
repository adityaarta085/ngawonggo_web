import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FaSave, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ImageUploadInput from './ImageUploadInput';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    groq_api_key: '',
    is_takedown: 'false',
    takedown_message: '',
    takedown_image: '',
    takedown_ai_prompt: '',
  });
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const mapped = {
        groq_api_key: '',
        is_takedown: 'false',
        takedown_message: '',
        takedown_image: '',
        takedown_ai_prompt: '',
      };
      data.forEach(item => {
        if (mapped.hasOwnProperty(item.key)) {
          mapped[item.key] = item.value;
        }
      });
      setSettings(mapped);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value)
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

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

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box pb={10}>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Heading size="md" mb={2}>Pengaturan AI & Sistem</Heading>
          <Text color="gray.500" fontSize="sm">
            Kelola konfigurasi sistem, API key, dan mode darurat (Takedown).
          </Text>
        </Box>

        {/* AI API Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="brand.500">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="xs" color="brand.600" textTransform="uppercase">Konfigurasi API</Heading>
              <FormControl>
                <FormLabel fontWeight="bold">Groq API Key</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showKey ? 'text' : 'password'}
                    placeholder="Masukkan Groq API Key"
                    value={settings.groq_api_key}
                    onChange={(e) => handleChange('groq_api_key', e.target.value)}
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
            </VStack>
          </CardBody>
        </Card>

        {/* Takedown Mode Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="red.500">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="xs" color="red.600" textTransform="uppercase">Mode Takedown (Darurat)</Heading>
                  <Text fontSize="xs" color="gray.500">Aktifkan untuk menutup akses publik dan menampilkan halaman pemeliharaan.</Text>
                </Box>
                <FormControl display="flex" alignItems="center" w="auto">
                  <Switch
                    id="takedown-mode"
                    colorScheme="red"
                    size="lg"
                    isChecked={settings.is_takedown === 'true'}
                    onChange={(e) => handleChange('is_takedown', String(e.target.checked))}
                  />
                </FormControl>
              </Flex>

              {settings.is_takedown === 'true' && (
                <Alert status="error" borderRadius="lg" variant="subtle">
                  <AlertIcon as={FaExclamationTriangle} />
                  <Box>
                    <AlertTitle>Website Sedang Offline!</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Seluruh halaman (kecuali Admin) dialihkan ke domain.com/down. Pastikan pesan dan informasi di bawah sudah benar.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">Pesan Takedown</FormLabel>
                    <Textarea
                      placeholder="Contoh: Kami sedang melakukan pemeliharaan rutin..."
                      value={settings.takedown_message}
                      onChange={(e) => handleChange('takedown_message', e.target.value)}
                      rows={4}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">System Prompt AI (Emergency Mode)</FormLabel>
                    <Textarea
                      placeholder="Berikan instruksi khusus untuk AI saat mode takedown..."
                      value={settings.takedown_ai_prompt}
                      onChange={(e) => handleChange('takedown_ai_prompt', e.target.value)}
                      rows={6}
                      fontSize="xs"
                    />
                    <Text mt={1} fontSize="10px" color="gray.500">
                      Instruksi ini akan digunakan oleh AI di halaman /down untuk memberikan bantuan penuh kepada warga.
                    </Text>
                  </FormControl>
                </VStack>

                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">Gambar Informasi</FormLabel>
                    <ImageUploadInput
                      value={settings.takedown_image}
                      onChange={(url) => handleChange('takedown_image', url)}
                    />
                    <Text mt={1} fontSize="xs" color="gray.500">
                      Gambar ini akan muncul di samping chat AI pada halaman takedown.
                    </Text>
                  </FormControl>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        <Button
          leftIcon={<FaSave />}
          colorScheme="brand"
          size="lg"
          onClick={handleSave}
          isLoading={loading}
          w="full"
          maxW="300px"
          alignSelf="center"
          boxShadow="lg"
        >
          Simpan Semua Pengaturan
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsManager;
