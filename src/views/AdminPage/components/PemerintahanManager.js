import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useToast,
  IconButton,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSave, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import PemerintahanPage from '../../PemerintahanPage';

const defaultData = {
  staff: [
    { role: 'Kepala Desa', name: 'Khoirur Faidah' },
    { role: 'Sekertariat Desa', name: 'Bambang Dwi Hendriyono' },
    { role: 'Kaur Pemerintahan', name: 'Yasin Sulthoni' },
    { role: 'Ketua BPD', name: 'Perlu Konfirmasi Desa' },
    { role: 'Ketua P3A', name: 'Rohmatul Faizin' },
  ],
  vision: "Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa.",
  mission: "Komitmen kami adalah menjadikan Desa Ngawonggo sebagai desa yang mandiri, inovatif, dan melayani dengan sepenuh hati."
};

const PemerintahanManager = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: settingsData, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['pemerintahan_staff', 'pemerintahan_vision', 'pemerintahan_mission']);

      if (error) throw error;

      if (settingsData && settingsData.length > 0) {
        const newData = { ...defaultData };
        settingsData.forEach(item => {
          if (item.key === 'pemerintahan_staff' && item.value) {
            try { newData.staff = JSON.parse(item.value); } catch(e) {}
          }
          if (item.key === 'pemerintahan_vision' && item.value) {
            newData.vision = item.value;
          }
          if (item.key === 'pemerintahan_mission' && item.value) {
            newData.mission = item.value;
          }
        });
        setData(newData);
      }
    } catch (error) {
      console.error('Error fetching pemerintahan data:', error);
      toast({
        title: 'Gagal memuat data',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { key: 'pemerintahan_staff', value: JSON.stringify(data.staff) },
        { key: 'pemerintahan_vision', value: data.vision },
        { key: 'pemerintahan_mission', value: data.mission },
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: 'Data pemerintahan berhasil diperbarui',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving pemerintahan data:', error);
      toast({
        title: 'Gagal menyimpan',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStaffChange = (index, field, value) => {
    const newStaff = [...data.staff];
    newStaff[index][field] = value;
    setData({ ...data, staff: newStaff });
  };

  const addStaff = () => {
    setData({
      ...data,
      staff: [...data.staff, { role: '', name: '' }]
    });
  };

  const removeStaff = (index) => {
    const newStaff = data.staff.filter((_, i) => i !== index);
    setData({ ...data, staff: newStaff });
  };

  const moveStaff = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === data.staff.length - 1)
    ) return;

    const newStaff = [...data.staff];
    const temp = newStaff[index];
    newStaff[index] = newStaff[index + direction];
    newStaff[index + direction] = temp;

    setData({ ...data, staff: newStaff });
  };

  if (loading) return <Text>Memuat data...</Text>;

  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={8}>

        {/* Editor Section */}
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Visi & Misi Pelayanan</Heading>

                <Box>
                  <Text mb={2} fontWeight="bold">Visi</Text>
                  <Textarea
                    value={data.vision}
                    onChange={(e) => setData({ ...data, vision: e.target.value })}
                    placeholder="Masukkan Visi Pelayanan..."
                    rows={3}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="bold">Misi / Komitmen</Text>
                  <Textarea
                    value={data.mission}
                    onChange={(e) => setData({ ...data, mission: e.target.value })}
                    placeholder="Masukkan Misi / Komitmen..."
                    rows={4}
                  />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Daftar Perangkat Desa</Heading>
                  <Button leftIcon={<FaPlus />} size="sm" colorScheme="brand" onClick={addStaff}>
                    Tambah
                  </Button>
                </HStack>

                <VStack spacing={3} align="stretch">
                  {data.staff.map((staff, index) => (
                    <HStack key={index} spacing={2} p={3} borderWidth={1} borderRadius="md">
                      <VStack spacing={2} flex={1}>
                        <Input
                          placeholder="Jabatan (cth: Kepala Desa)"
                          value={staff.role}
                          onChange={(e) => handleStaffChange(index, 'role', e.target.value)}
                        />
                        <Input
                          placeholder="Nama Lengkap"
                          value={staff.name}
                          onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                        />
                      </VStack>
                      <VStack>
                        <IconButton
                          size="xs"
                          icon={<FaArrowUp />}
                          isDisabled={index === 0}
                          onClick={() => moveStaff(index, -1)}
                          aria-label="Pindah ke atas"
                        />
                        <IconButton
                          size="xs"
                          icon={<FaArrowDown />}
                          isDisabled={index === data.staff.length - 1}
                          onClick={() => moveStaff(index, 1)}
                          aria-label="Pindah ke bawah"
                        />
                      </VStack>
                      <IconButton
                        colorScheme="red"
                        variant="ghost"
                        icon={<FaTrash />}
                        onClick={() => removeStaff(index)}
                        aria-label="Hapus"
                      />
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Button
            leftIcon={<FaSave />}
            colorScheme="brand"
            size="lg"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Simpan Perubahan
          </Button>
        </VStack>

        {/* Live Preview Section */}
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Live Preview</Heading>
          <Box
            borderWidth="2px"
            borderColor="brand.500"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            h="800px" // Fixed height for scrollable preview
            boxShadow="lg"
          >
            <Box position="absolute" top={0} left={0} right={0} bg="brand.500" color="white" p={2} textAlign="center" zIndex={10}>
              <Text fontSize="sm" fontWeight="bold">PREVIEW MODE</Text>
            </Box>
            <Box pt={8} h="full" overflowY="auto" bg="gray.50">
               {/* Use the exact component, passing preview data */}
               <PemerintahanPage previewData={data} />
            </Box>
          </Box>
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};

export default PemerintahanManager;
