import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Heading,
  Text,
  Card,
  CardBody,
  Input,
} from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../../lib/supabase';

const ProfilManager = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profil_sejarah: '',
    profil_visi: '',
    profil_misi: '',
    profil_kondisi_geo: '',
    profil_data_wilayah: '',
    profil_data_wilayah_map: '',
    profil_makna_logo: '',
  });

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'profil_sejarah',
          'profil_visi',
          'profil_misi',
          'profil_kondisi_geo',
          'profil_data_wilayah',
          'profil_data_wilayah_map',
          'profil_makna_logo',
        ]);

      if (error) throw error;

      if (data) {
        const mapped = {};
        data.forEach(item => {
          if (mapped.hasOwnProperty(item.key)) {
            mapped[item.key] = item.value;
          }
        });
        setSettings(prev => ({ ...prev, ...mapped }));
      }
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
        title: 'Profil Berhasil Disimpan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Gagal Menyimpan Profil',
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
          <Heading size="md" mb={2}>Manajemen Profil Desa</Heading>
          <Text color="gray.500" fontSize="sm">
            Kelola konten halaman profil desa termasuk sejarah, visi & misi, kondisi geografis, data wilayah, dan logo.
          </Text>
        </Box>

        <Card variant="outline" borderRadius="xl">
          <CardBody>
            <VStack spacing={6} align="stretch">

              <FormControl>
                <FormLabel fontWeight="bold">Sejarah Desa</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_sejarah}
                  onChange={(val) => handleChange('profil_sejarah', val)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Visi</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_visi}
                  onChange={(val) => handleChange('profil_visi', val)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Misi</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_misi}
                  onChange={(val) => handleChange('profil_misi', val)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Kondisi Geografis</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_kondisi_geo}
                  onChange={(val) => handleChange('profil_kondisi_geo', val)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Data Wilayah</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_data_wilayah}
                  onChange={(val) => handleChange('profil_data_wilayah', val)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Link Embed Google Maps Data Wilayah</FormLabel>
                <Input
                  value={settings.profil_data_wilayah_map}
                  onChange={(e) => handleChange('profil_data_wilayah_map', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Makna Logo Desa</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={settings.profil_makna_logo}
                  onChange={(val) => handleChange('profil_makna_logo', val)}
                />
              </FormControl>

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
          Simpan Profil Desa
        </Button>
      </VStack>
    </Box>
  );
};

export default ProfilManager;
