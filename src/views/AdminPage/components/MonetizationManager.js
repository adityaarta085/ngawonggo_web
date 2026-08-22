import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Input, Button, useToast, FormControl, FormLabel,
  Switch, SimpleGrid, Card, CardBody, Badge, Icon, Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { FaSave, FaRobot, FaShieldAlt, FaDownload, FaGamepad, FaHistory, FaSearch } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MonetizationManager = () => {
  const [settings, setSettings] = useState({
    monetization_enabled: 'true',
    layanan_free_limit_days: '3',
    layanan_free_limit_count: '1',
    layanan_vip_limit_days: '3',
    layanan_vip_limit_count: '3',
    fast_track_price: '50',
    ai_free_daily_limit: '5',
    ai_chat_coin_price: '2',
    ai_image_free_daily_limit: '2',
    ai_image_coin_price: '5',
    quran_free_daily_limit: '5',
    tafsir_ai_price: '5',
    downloader_free_daily_limit: '5',
    downloader_coin_price: '2',
    plagiat_free_daily_limit: '3',
    plagiat_coin_price: '5',
    badge_vip_price: '500',
    daily_login_reward: '10',
    spin_cost_coins: '10',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usageLogs, setUsageLogs] = useState([]);
  const [searchLog, setSearchLog] = useState('');
  const [stats, setStats] = useState({ totalSpent: 0, totalTransactions: 0, totalCoinsInCirculation: 0 });
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    const keys = Object.keys(settings);

    const { data, error } = await supabase.from('site_settings').select('*').in('key', keys);
    if (!error && data) {
      const formatted = {};
      data.forEach(item => {
        formatted[item.key] = item.value;
      });
      setSettings(prev => ({ ...prev, ...formatted }));
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLogsAndStats = useCallback(async () => {
    try {
      const { data: logs } = await supabase
        .from('currency_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logs) setUsageLogs(logs);

      const { data: currData } = await supabase.from('user_currencies').select('coins');
      const totalCoins = (currData || []).reduce((acc, c) => acc + (c.coins || 0), 0);

      const { count: txCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      const totalSpent = (logs || []).reduce((acc, l) => acc + (l.amount_used || 0), 0);

      setStats({
        totalCoinsInCirculation: totalCoins,
        totalTransactions: txCount || 0,
        totalSpent,
      });
    } catch (e) {
      console.warn('Error fetching logs:', e);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchLogsAndStats();
  }, [fetchSettings, fetchLogsAndStats]);

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
      toast({
        title: 'Pengaturan Monetisasi Berhasil Disimpan',
        description: 'Perubahan telah diterapkan langsung ke seluruh sistem dan pengguna.',
        status: 'success'
      });
    }
  };

  if (loading) return <Text>Memuat pengaturan monetisasi...</Text>;

  const isEnabled = settings.monetization_enabled !== 'false';

  const filteredLogs = usageLogs.filter(log =>
    log.feature_name?.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.user_id?.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <Box p={{ base: 4, md: 6 }} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" boxShadow="sm">
      <VStack align="stretch" spacing={6}>
        {/* Header Bar */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="md" color="purple.700" _dark={{ color: "purple.300" }}>
              💎 Manajemen Monetisasi, Kuota & Tarif Koin
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Atur seluruh kuota gratis harian, tarif koin, master switch monetisasi, dan pantau peredaran koin desa.
            </Text>
          </Box>
          <HStack bg="purple.50" _dark={{ bg: "purple.950" }} p={3} borderRadius="xl" borderWidth="1px" borderColor="purple.200">
            <VStack align="start" spacing={0} mr={2}>
              <Text fontSize="xs" fontWeight="bold">Master Switch Monetisasi</Text>
              <Badge colorScheme={isEnabled ? "green" : "gray"}>
                {isEnabled ? "🟢 AKTIF" : "⚪ NONAKTIF (SEMUA UNLIMITED)"}
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

        {/* Quick Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box p={4} bg="yellow.50" _dark={{ bg: "yellow.950" }} borderRadius="xl" border="1px solid" borderColor="yellow.200">
            <Text fontSize="xs" color="yellow.700" _dark={{ color: "yellow.300" }} fontWeight="bold">Total Koin Beredar di Warga</Text>
            <Heading size="lg" color="yellow.600">{stats.totalCoinsInCirculation} Koin</Heading>
          </Box>
          <Box p={4} bg="purple.50" _dark={{ bg: "purple.950" }} borderRadius="xl" border="1px solid" borderColor="purple.200">
            <Text fontSize="xs" color="purple.700" _dark={{ color: "purple.300" }} fontWeight="bold">Total Transaksi Topup</Text>
            <Heading size="lg" color="purple.600">{stats.totalTransactions} Transaksi</Heading>
          </Box>
          <Box p={4} bg="blue.50" _dark={{ bg: "blue.950" }} borderRadius="xl" border="1px solid" borderColor="blue.200">
            <Text fontSize="xs" color="blue.700" _dark={{ color: "blue.300" }} fontWeight="bold">Koin Terpakai di Fitur (Sample 100)</Text>
            <Heading size="lg" color="blue.600">{stats.totalSpent} Koin</Heading>
          </Box>
        </SimpleGrid>

        <Divider />

        {/* Main Tabs */}
        <Tabs variant="enclosed" colorScheme="purple">
          <TabList>
            <Tab fontWeight="bold">⚙️ Pengaturan Batas & Tarif Koin</Tab>
            <Tab fontWeight="bold">📜 Log Pengeluaran Koin Warga</Tab>
          </TabList>

          <TabPanels pt={4}>
            {/* Panel 1: Setting Forms */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Card 1: AI Services (Chat & Image Studio) */}
                  <Card variant="outline" borderRadius="xl">
                    <CardBody>
                      <HStack mb={4} color="teal.600">
                        <Icon as={FaRobot} boxSize={5} />
                        <Heading size="sm">Layanan Kecerdasan Buatan (AI)</Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Batas Chat AI Free (Pesan / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.ai_free_daily_limit || ''}
                            onChange={(e) => handleChange('ai_free_daily_limit', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tarif Chat Ekstra (Koin / Pesan)</FormLabel>
                          <Input
                            type="number"
                            value={settings.ai_chat_coin_price || ''}
                            onChange={(e) => handleChange('ai_chat_coin_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Batas AI Image Generator Studio (Gambar / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.ai_image_free_daily_limit || ''}
                            onChange={(e) => handleChange('ai_image_free_daily_limit', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tarif Gambar AI Tambahan (Koin / Gambar)</FormLabel>
                          <Input
                            type="number"
                            value={settings.ai_image_coin_price || ''}
                            onChange={(e) => handleChange('ai_image_coin_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Card 2: Media Tools & Content (Downloader & Plagiat) */}
                  <Card variant="outline" borderRadius="xl">
                    <CardBody>
                      <HStack mb={4} color="blue.600">
                        <Icon as={FaDownload} boxSize={5} />
                        <Heading size="sm">Media Downloader & Cek Plagiat</Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Batas Unduh Gratis (Unduhan / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.downloader_free_daily_limit || ''}
                            onChange={(e) => handleChange('downloader_free_daily_limit', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tarif Unduh Ekstra (Koin / Unduhan)</FormLabel>
                          <Input
                            type="number"
                            value={settings.downloader_coin_price || ''}
                            onChange={(e) => handleChange('downloader_coin_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Batas Cek Plagiasi Gratis (Cek / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.plagiat_free_daily_limit || ''}
                            onChange={(e) => handleChange('plagiat_free_daily_limit', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tarif Cek Plagiat Ekstra (Koin / Cek)</FormLabel>
                          <Input
                            type="number"
                            value={settings.plagiat_coin_price || ''}
                            onChange={(e) => handleChange('plagiat_coin_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Card 3: Layanan Pengaduan & Quran */}
                  <Card variant="outline" borderRadius="xl">
                    <CardBody>
                      <HStack mb={4} color="purple.600">
                        <Icon as={FaShieldAlt} boxSize={5} />
                        <Heading size="sm">Layanan Warga & Al-Quran</Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tier Free - Jumlah Laporan Pengaduan</FormLabel>
                          <Input
                            type="number"
                            value={settings.layanan_free_limit_count || ''}
                            onChange={(e) => handleChange('layanan_free_limit_count', e.target.value)}
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
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Fast Track Pengaduan (Koin)</FormLabel>
                          <Input
                            type="number"
                            value={settings.fast_track_price || ''}
                            onChange={(e) => handleChange('fast_track_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Batas Buka Tafsir Quran Free (Ayat / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.quran_free_daily_limit || ''}
                            onChange={(e) => handleChange('quran_free_daily_limit', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Tarif Buka Tafsir Ekstra (Koin)</FormLabel>
                          <Input
                            type="number"
                            value={settings.tafsir_ai_price || ''}
                            onChange={(e) => handleChange('tafsir_ai_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Card 4: Toko, Hadiah & Gamifikasi */}
                  <Card variant="outline" borderRadius="xl">
                    <CardBody>
                      <HStack mb={4} color="orange.600">
                        <Icon as={FaGamepad} boxSize={5} />
                        <Heading size="sm">Toko, VIP & Gamifikasi</Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Harga Beli Kartu VIP Langsung (Koin)</FormLabel>
                          <Input
                            type="number"
                            value={settings.badge_vip_price || ''}
                            onChange={(e) => handleChange('badge_vip_price', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Reward Daily Login (Koin / Hari)</FormLabel>
                          <Input
                            type="number"
                            value={settings.daily_login_reward || ''}
                            onChange={(e) => handleChange('daily_login_reward', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="bold">Biaya Putar Roda Keberuntungan Berbayar (Koin)</FormLabel>
                          <Input
                            type="number"
                            value={settings.spin_cost_coins || ''}
                            onChange={(e) => handleChange('spin_cost_coins', e.target.value)}
                            size="sm"
                            borderRadius="lg"
                          />
                        </FormControl>
                      </VStack>
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
                  Simpan Seluruh Pengaturan Monetisasi
                </Button>
              </VStack>
            </TabPanel>

            {/* Panel 2: Usage Logs */}
            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <InputGroup maxW="400px">
                    <InputLeftElement children={<FaSearch color="gray.400" />} />
                    <Input
                      placeholder="Cari fitur atau user ID..."
                      value={searchLog}
                      onChange={(e) => setSearchLog(e.target.value)}
                      size="sm"
                      borderRadius="lg"
                    />
                  </InputGroup>
                  <Button size="sm" leftIcon={<FaHistory />} onClick={fetchLogsAndStats}>
                    Refresh Data
                  </Button>
                </HStack>

                <Box overflowX="auto" borderWidth="1px" borderColor="gray.200" borderRadius="xl">
                  <Table size="sm" variant="simple">
                    <Thead bg="gray.50" _dark={{ bg: "gray.700" }}>
                      <Tr>
                        <Th>Waktu</Th>
                        <Th>User ID</Th>
                        <Th>Fitur yang Digunakan</Th>
                        <Th>Jenis Dompet</Th>
                        <Th isNumeric>Jumlah Koin</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredLogs.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                            Belum ada log pengeluaran koin.
                          </Td>
                        </Tr>
                      ) : (
                        filteredLogs.map(log => (
                          <Tr key={log.id}>
                            <Td fontSize="xs">{new Date(log.created_at).toLocaleString()}</Td>
                            <Td fontSize="xs" fontFamily="monospace" isTruncated maxW="120px">{log.user_id}</Td>
                            <Td fontSize="xs" fontWeight="bold">
                              <Badge colorScheme="purple">{log.feature_name}</Badge>
                            </Td>
                            <Td fontSize="xs">{log.currency_type}</Td>
                            <Td fontSize="xs" isNumeric fontWeight="bold" color="yellow.600">
                              -{log.amount_used}
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default MonetizationManager;
