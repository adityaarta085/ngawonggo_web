import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
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
  Select,
  Badge,
  Wrap,
  WrapItem,
  Spinner,
} from '@chakra-ui/react';
import {
  FaSave,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaRobot,
  FaBolt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import ImageUploadInput from './ImageUploadInput';

const AVAILABLE_AI_MODELS = [
  { id: 'mistral-agent', name: 'AlfiXD Mistral Agent', category: 'General / Agent', desc: 'Sangat cepat, ringan, responsif untuk percakapan umum & informasi desa', recommended: true },
  { id: 'deepseek', name: 'DeepSeek V3', category: 'Reasoning & Intelligence', desc: 'Penalaran mendalam, gaya bahasa natural, cerdas menjawab pertanyaan kompleks', recommended: true },
  { id: 'islamic-ai', name: 'Islamic AI Specialist', category: 'Islamic / Religion', desc: 'Spesialis Al-Quran, Fiqih, Sholat, & Hukum Agama', recommended: true },
  { id: 'codestral', name: 'Codestral High-Logic', category: 'Logic & Code', desc: 'Optimal untuk penalaran logika, pemformatan data & JSON game Mesin Waktu' },
  { id: 'pixtral', name: 'Pixtral Vision', category: 'Vision & Multimodal', desc: 'Model multimodal untuk analisis visual dokumen' },
  { id: 'zai-glm', name: 'Z.AI GLM-4.7', category: 'Multilingual LLM', desc: 'Engine kecerdasan buatan berbasis Zhipu AI GLM' },
  { id: 'gpt5', name: 'GPT-5 Turbo Interface', category: 'Next-Gen Core', desc: 'Antarmuka komputasi OpenAI Next-Generation' },
  { id: 'claude', name: 'Claude Sonnet 4.5', category: 'High-Precision', desc: 'Pemrosesan konteks akurat tinggi Anthropic' },
  { id: 'gemini', name: 'Gemini 3 Flash', category: 'Ultra-fast Multimodal', desc: 'Google Deepmind Fast Context Engine' },
  { id: 'kimi', name: 'Kimi K2', category: 'Extended Context', desc: 'Moonshot AI Long-Contextual Assistant' }
];

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    ai_primary_model: 'mistral-agent',
    ai_fallback_models: 'deepseek,islamic-ai,codestral',
    default_ai_prompt: '',
    is_takedown: 'false',
    is_blocked: 'false',
    takedown_message: '',
    takedown_image: '',
    takedown_ai_prompt: '',
    telegram_bot_token: '',
    telegram_chat_ids: '',
  });

  const [fallbackList, setFallbackList] = useState(['deepseek', 'islamic-ai', 'codestral']);
  const [modelStatuses, setModelStatuses] = useState({});
  const [testingModels, setTestingModels] = useState(false);
  const [showTelegramKey, setShowTelegramKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const mapped = {
        ai_primary_model: 'mistral-agent',
        ai_fallback_models: 'deepseek,islamic-ai,codestral',
        default_ai_prompt: '',
        is_takedown: 'false',
        is_blocked: 'false',
        takedown_message: '',
        takedown_image: '',
        takedown_ai_prompt: '',
        telegram_bot_token: '',
        telegram_chat_ids: '',
      };

      data.forEach(item => {
        if (mapped.hasOwnProperty(item.key)) {
          mapped[item.key] = item.value;
        }
      });

      setSettings(mapped);

      if (mapped.ai_fallback_models) {
        const parsed = mapped.ai_fallback_models.split(',').map(s => s.trim()).filter(Boolean);
        setFallbackList(parsed);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Test all AI models live
  const handleTestModels = async () => {
    setTestingModels(true);
    const newStatuses = {};

    for (const m of AVAILABLE_AI_MODELS) {
      const t0 = Date.now();
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'test_model', model: m.id })
        });
        const json = await res.json();
        const latency = json.latency || (Date.now() - t0);
        newStatuses[m.id] = {
          online: json.success === true || json.status === 'online',
          latency: latency,
          reply: json.reply || json.error || ''
        };
      } catch (err) {
        newStatuses[m.id] = {
          online: false,
          latency: 0,
          reply: err.message
        };
      }
      setModelStatuses({ ...newStatuses });
    }

    setTestingModels(false);
    toast({
      title: 'Pemeriksaan Model Selesai',
      description: 'Status latensi dan ketersediaan tiap model telah diperbarui.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleToggleFallback = (modelId) => {
    if (modelId === settings.ai_primary_model) return;
    setFallbackList(prev => {
      let updated;
      if (prev.includes(modelId)) {
        updated = prev.filter(id => id !== modelId);
      } else {
        updated = [...prev, modelId];
      }
      setSettings(s => ({ ...s, ai_fallback_models: updated.join(',') }));
      return updated;
    });
  };

  const handleMoveFallback = (index, direction) => {
    setFallbackList(prev => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      setSettings(s => ({ ...s, ai_fallback_models: copy.join(',') }));
      return copy;
    });
  };

  const handlePrimaryChange = (newPrimary) => {
    setSettings(prev => {
      const updatedFallbacks = fallbackList.filter(id => id !== newPrimary);
      setFallbackList(updatedFallbacks);
      return {
        ...prev,
        ai_primary_model: newPrimary,
        ai_fallback_models: updatedFallbacks.join(',')
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...settings,
        ai_fallback_models: fallbackList.join(',')
      };

      const updates = Object.entries(payload).map(([key, value]) => ({
        key,
        value: String(value)
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: 'Pengaturan Berhasil Disimpan',
        description: 'Prioritas model AI dan konfigurasi sistem telah aktif di database.',
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
          <Heading size="md" mb={2}>Pengaturan AI & Sistem Desa Ngawonggo</Heading>
          <Text color="gray.500" fontSize="sm">
            Kelola prioritas model AI, fallback cadangan, sistem prompt, notifikasi Telegram, dan mode darurat.
          </Text>
        </Box>

        {/* AI Model Priority & Fallback Configuration */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="purple.500" shadow="sm">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
                <HStack>
                  <Box p={2} bg="purple.50" color="purple.600" borderRadius="lg">
                    <FaRobot size={22} />
                  </Box>
                  <Box>
                    <Heading size="sm" color="purple.700">Manajemen Model AI & Prioritas Fallback</Heading>
                    <Text fontSize="xs" color="gray.500">Tentukan model utama dan urutan model cadangan saat terjadi kendala jaringan</Text>
                  </Box>
                </HStack>
                <Button
                  leftIcon={testingModels ? <Spinner size="xs" /> : <FaBolt />}
                  size="sm"
                  colorScheme="purple"
                  variant="outline"
                  onClick={handleTestModels}
                  isLoading={testingModels}
                >
                  Cek Latensi & Status Model
                </Button>
              </Flex>

              <Divider />

              {/* Primary Model Selection */}
              <FormControl>
                <FormLabel fontWeight="bold" fontSize="sm" display="flex" alignItems="center" gap={2}>
                  <span>Model AI Utama (Primary Engine):</span>
                  <Badge colorScheme="purple" fontSize="xs">Utama Digunakan</Badge>
                </FormLabel>
                <Select
                  value={settings.ai_primary_model}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  size="md"
                  fontWeight="medium"
                  bg="white"
                >
                  {AVAILABLE_AI_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category}) {m.recommended ? '⭐ Rekomendasi' : ''}
                    </option>
                  ))}
                </Select>
                <Text mt={1.5} fontSize="xs" color="gray.500">
                  {AVAILABLE_AI_MODELS.find(m => m.id === settings.ai_primary_model)?.desc}
                </Text>
              </FormControl>

              {/* Fallback Priority List */}
              <Box bg="gray.50" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <FormLabel fontWeight="bold" fontSize="sm" mb={1} display="flex" alignItems="center" gap={2}>
                  <span>Urutan Prioritas Fallback (Model Cadangan):</span>
                  <Badge colorScheme="teal" fontSize="xs">{fallbackList.length} Model Aktif</Badge>
                </FormLabel>
                <Text fontSize="xs" color="gray.500" mb={3}>
                  Jika model utama gagal atau timeout, sistem secara otomatis mencoba model di bawah secara berurutan:
                </Text>

                {fallbackList.length === 0 ? (
                  <Text fontSize="xs" color="orange.600" fontStyle="italic">
                    Belum ada model cadangan yang dipilih. Pilih model dari daftar di bawah untuk dijadikan fallback.
                  </Text>
                ) : (
                  <VStack align="stretch" spacing={2} mb={4}>
                    {fallbackList.map((modelId, idx) => {
                      const modelObj = AVAILABLE_AI_MODELS.find(m => m.id === modelId);
                      const status = modelStatuses[modelId];
                      return (
                        <Flex
                          key={modelId}
                          bg="white"
                          p={2.5}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="purple.100"
                          align="center"
                          justify="space-between"
                          shadow="2xs"
                        >
                          <HStack spacing={3}>
                            <Badge colorScheme="purple" variant="solid" borderRadius="full" px={2}>
                              #{idx + 1}
                            </Badge>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {modelObj?.name || modelId}
                              </Text>
                              <Text fontSize="10px" color="gray.500">
                                {modelObj?.category}
                              </Text>
                            </Box>
                          </HStack>

                          <HStack spacing={2}>
                            {status && (
                              <Badge colorScheme={status.online ? 'green' : 'red'} fontSize="10px" px={2} py={0.5} borderRadius="full">
                                {status.online ? `🟢 ${status.latency}ms` : '🔴 Offline'}
                              </Badge>
                            )}
                            <IconButton
                              size="xs"
                              icon={<FaArrowUp />}
                              aria-label="Naikkan urutan"
                              isDisabled={idx === 0}
                              onClick={() => handleMoveFallback(idx, -1)}
                            />
                            <IconButton
                              size="xs"
                              icon={<FaArrowDown />}
                              aria-label="Turunkan urutan"
                              isDisabled={idx === fallbackList.length - 1}
                              onClick={() => handleMoveFallback(idx, 1)}
                            />
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleToggleFallback(modelId)}
                            >
                              Hapus
                            </Button>
                          </HStack>
                        </Flex>
                      );
                    })}
                  </VStack>
                )}

                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                  Klik untuk Menambah / Menghapus Model Cadangan:
                </Text>
                <Wrap spacing={2}>
                  {AVAILABLE_AI_MODELS.filter(m => m.id !== settings.ai_primary_model).map(m => {
                    const isSelected = fallbackList.includes(m.id);
                    const status = modelStatuses[m.id];
                    return (
                      <WrapItem key={m.id}>
                        <Button
                          size="xs"
                          colorScheme={isSelected ? 'purple' : 'gray'}
                          variant={isSelected ? 'solid' : 'outline'}
                          onClick={() => handleToggleFallback(m.id)}
                          leftIcon={
                            status ? (
                              status.online ? <FaCheckCircle color="#48BB78" /> : <FaTimesCircle color="#F56565" />
                            ) : undefined
                          }
                        >
                          {m.name} {status ? `(${status.latency}ms)` : ''}
                        </Button>
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </Box>

              {/* System Prompt Settings */}
              <FormControl>
                <FormLabel fontWeight="bold" fontSize="sm">System Prompt AI (Instruksi Default)</FormLabel>
                <Textarea
                  placeholder="Instruksi untuk AI asisten desa..."
                  value={settings.default_ai_prompt}
                  onChange={(e) => handleChange('default_ai_prompt', e.target.value)}
                  rows={6}
                  fontSize="xs"
                  fontFamily="monospace"
                />
                <Text mt={1.5} fontSize="xs" color="gray.500">
                  Prompt ini menjadi panduan perilaku Asisten AI Desa Ngawonggo saat merespon warga & pengunjung.
                </Text>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Telegram Bot Notification Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="#0088cc" shadow="sm">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="xs" color="#0088cc" textTransform="uppercase">Konfigurasi Notifikasi Telegram Bot</Heading>
              <Text fontSize="xs" color="gray.500">
                Kirim notifikasi instan ke admin untuk Pendaftaran User, Pengaduan Warga, Donasi, Topup Koin, dan Upgrade VIP.
              </Text>

              <FormControl>
                <FormLabel fontWeight="bold" fontSize="sm">Telegram Bot Token</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showTelegramKey ? 'text' : 'password'}
                    placeholder="Contoh: 8710371961:AAGkCX6Vgjbz9P2..."
                    value={settings.telegram_bot_token || ''}
                    onChange={(e) => handleChange('telegram_bot_token', e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowTelegramKey(!showTelegramKey)}
                      icon={showTelegramKey ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      aria-label="Toggle token"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text mt={1.5} fontSize="xs" color="gray.500">
                  Dapatkan token bot dari @BotFather di Telegram.
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" fontSize="sm">Telegram Chat IDs (Penerima Notifikasi)</FormLabel>
                <Textarea
                  placeholder="Contoh: 123456789, 987654321"
                  value={settings.telegram_chat_ids || ''}
                  onChange={(e) => handleChange('telegram_chat_ids', e.target.value)}
                  rows={2}
                  fontSize="sm"
                />
                <Text mt={1.5} fontSize="xs" color="gray.500">
                  Masukkan ID Chat Telegram Admin yang akan menerima pesan. Pisahkan dengan koma jika lebih dari satu.
                </Text>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Blocked Mode Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="orange.500" shadow="sm">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="xs" color="orange.600" textTransform="uppercase">Mode Situs Diblokir (Internet Baik)</Heading>
                  <Text fontSize="xs" color="gray.500">Aktifkan untuk mengalihkan seluruh pengunjung ke halaman peringatan Internet Baik.</Text>
                </Box>
                <FormControl display="flex" alignItems="center" w="auto">
                  <Switch
                    id="blocked-mode"
                    colorScheme="orange"
                    size="lg"
                    isChecked={settings.is_blocked === 'true'}
                    onChange={(e) => handleChange('is_blocked', String(e.target.checked))}
                  />
                </FormControl>
              </Flex>

              {settings.is_blocked === 'true' && (
                <Alert status="warning" borderRadius="lg" variant="subtle">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Situs Sedang Diblokir!</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Seluruh halaman (kecuali Admin) dialihkan ke halaman peringatan Internet Baik.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Takedown Mode Settings */}
        <Card variant="outline" borderRadius="xl" borderLeft="4px solid" borderLeftColor="red.500" shadow="sm">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="xs" color="red.600" textTransform="uppercase">Mode Takedown (Pemeliharaan Darurat)</Heading>
                  <Text fontSize="xs" color="gray.500">Tutup akses publik dan alihkan ke halaman darurat /down dengan Asisten AI Khusus.</Text>
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
                    <AlertTitle>Website Sedang Offline / Takedown!</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Seluruh halaman (kecuali Admin) dialihkan ke /down.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">Pesan Halaman Takedown</FormLabel>
                    <Textarea
                      placeholder="Contoh: Kami sedang melakukan pemeliharaan infrastruktur desa..."
                      value={settings.takedown_message}
                      onChange={(e) => handleChange('takedown_message', e.target.value)}
                      rows={4}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">System Prompt AI (Emergency Mode)</FormLabel>
                    <Textarea
                      placeholder="Instruksi darurat untuk AI di halaman /down..."
                      value={settings.takedown_ai_prompt}
                      onChange={(e) => handleChange('takedown_ai_prompt', e.target.value)}
                      rows={6}
                      fontSize="xs"
                      fontFamily="monospace"
                    />
                  </FormControl>
                </VStack>

                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize="sm">Gambar Informasi Takedown</FormLabel>
                    <ImageUploadInput
                      value={settings.takedown_image}
                      onChange={(url) => handleChange('takedown_image', url)}
                    />
                  </FormControl>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Global Save Button */}
        <Button
          leftIcon={<FaSave />}
          colorScheme="brand"
          size="lg"
          onClick={handleSave}
          isLoading={loading}
          w="full"
          maxW="320px"
          alignSelf="center"
          boxShadow="lg"
          py={6}
        >
          Simpan Semua Pengaturan
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsManager;
