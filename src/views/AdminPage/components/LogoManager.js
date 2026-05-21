import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Image,
  Select,
  HStack,
  Text,
  Input,
  Divider,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { uploadToSupabase } from '../../../lib/uploader';

const LogoManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('logo_settings').select('*').limit(1).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
      if (data) {
        setSettings(data);
      } else {
        setSettings({
            background_image: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop',
            background_color: 'transparent',
            animation_type: 'none',
            left_ornament_url: '',
            right_ornament_url: '',
            border_style: 'none',
            glow_color: 'rgba(255,255,255,0.2)'
        });
      }
    } catch (error) {
      toast({ title: 'Error fetching logo settings', description: error.message, status: 'error' });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadToSupabase(file);
      setSettings({ ...settings, [field]: url });
      toast({ title: 'Image uploaded', status: 'success' });
    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (settings.id) {
          const { error } = await supabase.from('logo_settings').update(settings).eq('id', settings.id);
          if (error) throw error;
      } else {
          const { error } = await supabase.from('logo_settings').insert([settings]);
          if (error) throw error;
      }

      toast({ title: 'Logo settings saved', status: 'success' });
      fetchSettings();
    } catch (error) {
      toast({ title: 'Error saving logo settings', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" shadow="sm" maxW="2xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Kustomisasi Logo Kabupaten Magelang</Text>
        <Text color="gray.500">Atur tampilan logo utama (background, efek, ornamen) yang akan muncul di Navbar dan SplashScreen.</Text>
        <Divider />

        <FormControl>
            <FormLabel>Background Logo (URL/Upload, isi "none" untuk hapus background)</FormLabel>
            {settings.background_image && <Image src={settings.background_image} h="100px" objectFit="cover" borderRadius="md" mb={2} />}
            <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'background_image')} mb={2} />
            <Input value={settings.background_image} onChange={(e) => setSettings({...settings, background_image: e.target.value})} placeholder="URL Gambar Background (Isi 'none' untuk transparan)" />
        </FormControl>

        <HStack spacing={4}>
            <FormControl>
                <FormLabel>Warna Background Fallback</FormLabel>
                <Input type="color" value={settings.background_color} onChange={(e) => setSettings({...settings, background_color: e.target.value})} />
            </FormControl>

            <FormControl>
                <FormLabel>Warna Glow (Cahaya)</FormLabel>
                <Input type="color" value={settings.glow_color} onChange={(e) => setSettings({...settings, glow_color: e.target.value})} />
            </FormControl>
        </HStack>

        <FormControl>
            <FormLabel>Animasi Logo Utama</FormLabel>
            <Select value={settings.animation_type} onChange={(e) => setSettings({...settings, animation_type: e.target.value})}>
                <option value="none">Tidak Ada</option>
                <option value="pulse">Berdetak (Pulse)</option>
                <option value="float">Melayang (Float)</option>
                <option value="spin">Berputar Lambat (Spin)</option>
            </Select>
        </FormControl>

        <HStack spacing={4}>
            <FormControl>
                <FormLabel>Ornamen Kiri (Upload)</FormLabel>
                {settings.left_ornament_url && <Image src={settings.left_ornament_url} h="50px" objectFit="contain" mb={2} />}
                <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'left_ornament_url')} />
            </FormControl>

            <FormControl>
                <FormLabel>Ornamen Kanan (Upload)</FormLabel>
                {settings.right_ornament_url && <Image src={settings.right_ornament_url} h="50px" objectFit="contain" mb={2} />}
                <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'right_ornament_url')} />
            </FormControl>
        </HStack>

        <FormControl>
            <FormLabel>Style Border</FormLabel>
            <Select value={settings.border_style} onChange={(e) => setSettings({...settings, border_style: e.target.value})}>
                <option value="none">Tidak Ada</option>
                <option value="solid">Solid (Garis Penuh)</option>
                <option value="dashed">Dashed (Garis Putus)</option>
                <option value="dotted">Dotted (Titik-titik)</option>
            </Select>
        </FormControl>

        <Button colorScheme="brand" onClick={handleSave} isLoading={loading} size="lg" mt={4}>
            Simpan Konfigurasi Logo
        </Button>
      </VStack>
    </Box>
  );
};

export default LogoManager;
