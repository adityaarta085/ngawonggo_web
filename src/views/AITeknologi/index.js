
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Image,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FaUpload, FaMagic, FaDownload, FaHistory } from 'react-icons/fa';
import { nanoBananaService } from '../../lib/nanoBanana';

const AITeknologi = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const toast = useToast();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResultImage(null);
    }
  };

  const processAI = async () => {
    if (!file) return;

    setLoading(true);
    try {
      setStatus('Menyiapkan email sementara...');
      const email = await nanoBananaService.createTempMail();

      setStatus('Mengambil CSRF Token...');
      const csrf = await nanoBananaService.getCSRF();

      setStatus('Mengirim kode verifikasi...');
      await nanoBananaService.sendOTP(email);

      setStatus('Menunggu OTP (ini mungkin butuh waktu)...');
      const otp = await nanoBananaService.waitOTP(email);

      setStatus('Melakukan login otomatis...');
      await nanoBananaService.submitOTP(email, otp, csrf);

      setStatus('Mengunggah foto...');
      const imageUrl = await nanoBananaService.uploadImage(file);

      setStatus('Membuat tugas AI (Ghibli Style)...');
      const taskId = await nanoBananaService.createTask(imageUrl);

      setStatus('Memproses gambar (AI sedang menggambar)...');
      const result = await nanoBananaService.waitResult(taskId);

      setResultImage(result);
      setStatus('Selesai!');
      toast({
        title: 'Berhasil!',
        description: 'Foto Anda telah berhasil diubah ke gaya Ghibli.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Gagal memproses',
        description: error.message || 'Terjadi kesalahan pada sistem AI.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.lg" py={20}>
      <VStack spacing={10} align="center" textAlign="center">
        <VStack spacing={3}>
          <Badge colorScheme="brand" p={1} px={3} borderRadius="full">TEKNOLOGI MASA DEPAN</Badge>
          <Heading size="2xl">Ngawonggo Nano Banana AI</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Pameran teknologi AI Desa Ngawonggo. Ubah foto pemandangan atau diri Anda menjadi gaya animasi Studio Ghibli yang indah secara otomatis.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} w="full">
          {/* Input Section */}
          <VStack
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.100"
            spacing={6}
          >
            <Heading size="md">1. Unggah Foto</Heading>
            <Box
              w="full"
              h="300px"
              bg="gray.50"
              borderRadius="xl"
              overflow="hidden"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px dashed"
              borderColor="gray.200"
            >
              {preview ? (
                <Image src={preview} w="full" h="full" objectFit="cover" />
              ) : (
                <VStack color="gray.400">
                  <Icon as={FaUpload} w={10} h={10} />
                  <Text>Klik tombol di bawah untuk pilih foto</Text>
                </VStack>
              )}
            </Box>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              display="none"
              onChange={handleFileChange}
            />
            <Button
              as="label"
              htmlFor="file-upload"
              leftIcon={<FaUpload />}
              cursor="pointer"
              w="full"
              variant="outline"
              isDisabled={loading}
            >
              Pilih Foto
            </Button>
            <Button
              colorScheme="brand"
              leftIcon={<FaMagic />}
              w="full"
              size="lg"
              onClick={processAI}
              isLoading={loading}
              loadingText="Memproses..."
              isDisabled={!file || loading}
            >
              Ubah ke Gaya Ghibli
            </Button>
          </VStack>

          {/* Result Section */}
          <VStack
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.100"
            spacing={6}
            justify="center"
          >
            <Heading size="md">2. Hasil AI</Heading>
            <Box
              w="full"
              h="300px"
              bg="gray.50"
              borderRadius="xl"
              overflow="hidden"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="gray.100"
            >
              {loading ? (
                <VStack spacing={4}>
                  <CircularProgress isIndeterminate color="brand.500" size="80px">
                    <CircularProgressLabel>AI</CircularProgressLabel>
                  </CircularProgress>
                  <Text fontSize="sm" fontWeight="bold" color="brand.600">{status}</Text>
                </VStack>
              ) : resultImage ? (
                <Image src={resultImage} w="full" h="full" objectFit="cover" />
              ) : (
                <VStack color="gray.400">
                  <Icon as={FaMagic} w={10} h={10} />
                  <Text>Hasil akan muncul di sini</Text>
                </VStack>
              )}
            </Box>
            {resultImage && (
              <Button
                as="a"
                href={resultImage}
                download="ngawonggo-ghibli.png"
                target="_blank"
                leftIcon={<FaDownload />}
                colorScheme="blue"
                w="full"
                size="lg"
              >
                Simpan Gambar
              </Button>
            )}
          </VStack>
        </SimpleGrid>

        <Box bg="orange.50" p={6} borderRadius="xl" border="1px solid" borderColor="orange.100" w="full">
          <VStack align="start" spacing={2}>
            <Heading size="xs" color="orange.800" display="flex" alignItems="center">
              <Icon as={FaHistory} mr={2} /> CATATAN TEKNIS
            </Heading>
            <Text fontSize="sm" color="orange.700" textAlign="left">
              Teknologi ini menggunakan scraping otomatis (Nano Banana Engine) untuk mendemonstrasikan kapabilitas AI di Desa Ngawonggo. Proses ini mungkin memakan waktu 1-2 menit karena melibatkan pembuatan akun otomatis dan antrean pemrosesan gambar.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default AITeknologi;
