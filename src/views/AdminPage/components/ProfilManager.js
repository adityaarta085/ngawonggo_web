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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { FaSave, FaEye } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../../lib/supabase';

const ProfilManager = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          mapped[item.key] = item.value;
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


        <HStack w="full" maxW="400px" alignSelf="center" spacing={4}>
          <Button
            leftIcon={<FaEye />}
            colorScheme="gray"
            size="lg"
            onClick={onOpen}
            w="full"
            boxShadow="md"
          >
            Preview
          </Button>
          <Button
            leftIcon={<FaSave />}
            colorScheme="brand"
            size="lg"
            onClick={handleSave}
            isLoading={loading}
            w="full"
            boxShadow="lg"
          >
            Simpan
          </Button>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Preview Profil Desa</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Flex flexDirection="column" gap={8} fontFamily="heading">
                <Box>
                  <Text fontWeight="600" fontSize="35px" mb={4}>Sejarah Desa</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_sejarah }} />
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="600" fontSize="35px" mb={4}>Visi Misi</Text>
                  <Text fontSize="25px">Visi</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_visi }} />
                  <Text fontSize="25px" mt={4}>Misi</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_misi }} />
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="600" fontSize="35px" mb={4}>Kondisi Geografis</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_kondisi_geo }} />
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="600" fontSize="35px" mb={4}>Data Wilayah</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_data_wilayah }} />
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="600" fontSize="35px" mb={4}>Makna Logo Desa</Text>
                  <Box dangerouslySetInnerHTML={{ __html: settings.profil_makna_logo }} />
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};
export default ProfilManager;
