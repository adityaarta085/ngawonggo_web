import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Input, Button, useToast, FormControl, FormLabel
} from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MonetizationManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const keys = [
      'layanan_free_limit_days', 'layanan_free_limit_count',
      'layanan_vip_limit_days', 'layanan_vip_limit_count',
      'ai_free_daily_limit', 'quran_free_daily_limit',
      'fast_track_price', 'theme_premium_price', 'badge_vip_price', 'tafsir_ai_price'
    ];

    const { data, error } = await supabase.from('site_settings').select('*').in('key', keys);
    if (!error && data) {
      const formatted = {};
      data.forEach(item => {
        formatted[item.key] = item.value;
      });
      setSettings(formatted);
    }
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.keys(settings).map(key => ({
      key,
      value: settings[key].toString()
    }));

    const { error } = await supabase.from('site_settings').upsert(updates);

    setSaving(false);
    if (error) {
      toast({ title: 'Gagal menyimpan', status: 'error' });
    } else {
      toast({ title: 'Pengaturan Monetisasi tersimpan', status: 'success' });
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box p={6} bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm">
      <VStack align="stretch" spacing={8}>
        <Heading size="md">Pengaturan Batas & Harga (Monetisasi)</Heading>

        <Box>
            <Heading size="sm" mb={4} color="gray.600">Batas Penggunaan Layanan (Pengaduan)</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Tier Free - Batas Hari Limit Layanan</FormLabel>
                    <Input value={settings.layanan_free_limit_days || ''} onChange={(e) => handleChange('layanan_free_limit_days', e.target.value)} placeholder="Contoh: 3" />
                </FormControl>
                <FormControl>
                    <FormLabel>Tier Free - Jumlah Pengaduan</FormLabel>
                    <Input value={settings.layanan_free_limit_count || ''} onChange={(e) => handleChange('layanan_free_limit_count', e.target.value)} placeholder="Contoh: 1" />
                </FormControl>
                <FormControl>
                    <FormLabel>Tier VIP - Batas Hari Limit Layanan</FormLabel>
                    <Input value={settings.layanan_vip_limit_days || ''} onChange={(e) => handleChange('layanan_vip_limit_days', e.target.value)} placeholder="Contoh: 1" />
                </FormControl>
                <FormControl>
                    <FormLabel>Tier VIP - Jumlah Pengaduan</FormLabel>
                    <Input value={settings.layanan_vip_limit_count || ''} onChange={(e) => handleChange('layanan_vip_limit_count', e.target.value)} placeholder="Contoh: 2" />
                </FormControl>
                <FormControl>
                    <FormLabel>Batas Tanya AI (Per Hari)</FormLabel>
                    <Input value={settings.ai_free_daily_limit || ''} onChange={(e) => handleChange('ai_free_daily_limit', e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Batas Buka Tafsir (Per Hari)</FormLabel>
                    <Input value={settings.quran_free_daily_limit || ''} onChange={(e) => handleChange('quran_free_daily_limit', e.target.value)} />
                </FormControl>
            </VStack>
        </Box>

        <Box>
            <Heading size="sm" mb={4} color="gray.600">Harga Item (Koin)</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Fast Track Layanan</FormLabel>
                    <Input value={settings.fast_track_price || ''} onChange={(e) => handleChange('fast_track_price', e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Tafsir Mendalam / Tanya AI Tambahan</FormLabel>
                    <Input value={settings.tafsir_ai_price || ''} onChange={(e) => handleChange('tafsir_ai_price', e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Tema Premium</FormLabel>
                    <Input value={settings.theme_premium_price || ''} onChange={(e) => handleChange('theme_premium_price', e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Badge VIP</FormLabel>
                    <Input value={settings.badge_vip_price || ''} onChange={(e) => handleChange('badge_vip_price', e.target.value)} />
                </FormControl>
            </VStack>
        </Box>

        <Button leftIcon={<FaSave />} colorScheme="brand" onClick={handleSave} isLoading={saving}>
            Simpan Perubahan
        </Button>
      </VStack>
    </Box>
  );
};

export default MonetizationManager;
