import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Input, Button, useToast, FormControl, FormLabel,
  Switch, SimpleGrid, Card, CardBody, Badge, Icon, Divider
} from '@chakra-ui/react';
import { FaSave, FaCoins, FaRobot, FaShieldAlt } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MonetizationManager = () => {
  const [settings, setSettings] = useState({
    monetization_enabled: 'true',
    layanan_free_limit_days: '1',
    layanan_free_limit_count: '1',
    layanan_vip_limit_days: '3',
    layanan_vip_limit_count: '3',
    ai_free_daily_limit: '3',
    quran_free_daily_limit: '5',
    fast_track_price: '50',
    theme_premium_price: '100',
    badge_vip_price: '500',
    tafsir_ai_price: '10'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const keys = [
      'monetization_enabled',
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
      setSettings(prev => ({ ...prev, ...formatted }));
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
      toast({ title: 'Gagal menyimpan', description: error.message, status: 'error' });
    } else {
      toast({ title: 'Pengaturan Monetisasi Berhasil Disimpan', description: 'Perubahan telah diterapkan langsung ke seluruh pengguna.', status: 'success' });
    }
  };

  if (loading) return <Text>Memuat pengaturan monetisasi...</Text>;

  const isEnabled = settings.monetization_enabled !== 'false';

  return (
    <Box p={{ base: 4, md: 6 }} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" boxShadow="sm">
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="md" color="purple.700" _dark={{ color: "purple.300" }}>
              💎 Manajemen Monetisasi, Kuota & Tarif Koin
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Atur kuota gratis harian, pembatasan layanan, harga item koin, dan fitur VIP yang berlaku untuk pengguna.
            </Text>
          </Box>
          <HStack bg="purple.50" _dark={{ bg: "purple.950" }} p={3} borderRadius="xl" borderWidth="1px" borderColor="purple.200">
            <VStack align="start" spacing={0} mr={2}>
              <Text fontSize="xs" fontWeight="bold">Status Monetisasi Sistem</Text>
              <Badge colorScheme={isEnabled ? "green" : "gray"}>
                {isEnabled ? "🟢 AKTIF" : "⚪ NONAKTIF (UNLIMITED)"}
              </Badge>
            </VStack>
            <Switch
              size="lg"
              colorScheme="purple"
              isChecked={isEnabled}
              onChange={(e) => handleChange('monetization_enabled', e.target.checked ? 'true' : 'false')}
            />
          </HStack>
        </HStack>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Card 1: Batas Layanan Pengaduan */}
          <Card variant="outline" borderRadius="xl">
            <CardBody>
              <HStack mb={4} color="purple.600">
                <Icon as={FaShieldAlt} boxSize={5} />
                <Heading size="sm">Batas Layanan & Pengaduan</Heading>
              </HStack>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tier Free - Jumlah Pengaduan</FormLabel>
                  <Input
                    type="number"
                    value={settings.layanan_free_limit_count || ''}
                    onChange={(e) => handleChange('layanan_free_limit_count', e.target.value)}
                    placeholder="Contoh: 1"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tier Free - Jendela Cooldown (Hari)</FormLabel>
                  <Input
                    type="number"
                    value={settings.layanan_free_limit_days || ''}
                    onChange={(e) => handleChange('layanan_free_limit_days', e.target.value)}
                    placeholder="Contoh: 1"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tier VIP - Jumlah Pengaduan</FormLabel>
                  <Input
                    type="number"
                    value={settings.layanan_vip_limit_count || ''}
                    onChange={(e) => handleChange('layanan_vip_limit_count', e.target.value)}
                    placeholder="Contoh: 3"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tier VIP - Jendela Cooldown (Hari)</FormLabel>
                  <Input
                    type="number"
                    value={settings.layanan_vip_limit_days || ''}
                    onChange={(e) => handleChange('layanan_vip_limit_days', e.target.value)}
                    placeholder="Contoh: 3"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Card 2: Kuota Harian AI & Quran */}
          <Card variant="outline" borderRadius="xl">
            <CardBody>
              <HStack mb={4} color="teal.600">
                <Icon as={FaRobot} boxSize={5} />
                <Heading size="sm">Kuota Harian AI & Al-Quran</Heading>
              </HStack>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Batas Tanya AI Akun Free (Pesan / Hari)</FormLabel>
                  <Input
                    type="number"
                    value={settings.ai_free_daily_limit || ''}
                    onChange={(e) => handleChange('ai_free_daily_limit', e.target.value)}
                    placeholder="Contoh: 3"
                    size="sm"
                    borderRadius="lg"
                  />
                  <Text fontSize="2xs" color="gray.500" mt={1}>
                    Member VIP otomatis mendapat kuota 50 chat/hari. Tamu (guest) memiliki 5 pesan.
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Batas Buka Tafsir Quran Free (Ayat / Hari)</FormLabel>
                  <Input
                    type="number"
                    value={settings.quran_free_daily_limit || ''}
                    onChange={(e) => handleChange('quran_free_daily_limit', e.target.value)}
                    placeholder="Contoh: 5"
                    size="sm"
                    borderRadius="lg"
                  />
                  <Text fontSize="2xs" color="gray.500" mt={1}>
                    Jika melebihi kuota gratis, pengguna ditawari membuka dengan koin.
                  </Text>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Card 3: Tarif Koin & Fast Track */}
          <Card variant="outline" borderRadius="xl" gridColumn={{ base: "span 1", md: "span 2" }}>
            <CardBody>
              <HStack mb={4} color="orange.600">
                <Icon as={FaCoins} boxSize={5} />
                <Heading size="sm">Tarif & Harga Item Koin</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Fast Track Layanan (Koin)</FormLabel>
                  <Input
                    type="number"
                    value={settings.fast_track_price || ''}
                    onChange={(e) => handleChange('fast_track_price', e.target.value)}
                    placeholder="Contoh: 50"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tafsir AI Tambahan (Koin)</FormLabel>
                  <Input
                    type="number"
                    value={settings.tafsir_ai_price || ''}
                    onChange={(e) => handleChange('tafsir_ai_price', e.target.value)}
                    placeholder="Contoh: 10"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Tema Premium (Koin)</FormLabel>
                  <Input
                    type="number"
                    value={settings.theme_premium_price || ''}
                    onChange={(e) => handleChange('theme_premium_price', e.target.value)}
                    placeholder="Contoh: 100"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Badge / Card VIP (Koin)</FormLabel>
                  <Input
                    type="number"
                    value={settings.badge_vip_price || ''}
                    onChange={(e) => handleChange('badge_vip_price', e.target.value)}
                    placeholder="Contoh: 500"
                    size="sm"
                    borderRadius="lg"
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Button
          leftIcon={<FaSave />}
          colorScheme="purple"
          size="lg"
          borderRadius="xl"
          onClick={handleSave}
          isLoading={saving}
          boxShadow="md"
        >
          Simpan Semua Perubahan Pengaturan
        </Button>
      </VStack>
    </Box>
  );
};

export default MonetizationManager;
