
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  useToast,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaBullhorn, FaCheckCircle } from 'react-icons/fa';
import { useLanguage } from '../../../contexts/LanguageContext';

const PengaduanSection = () => {
  const { language } = useLanguage();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: language === 'id' ? 'Laporan Terkirim' : 'Report Sent',
      description: language === 'id'
        ? 'Terima kasih atas laporan Anda. Kami akan segera menindaklanjuti.'
        : 'Thank you for your report. We will follow up soon.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box py={20} bg="white" id="pengaduan">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16} align="center">
          <VStack align="start" spacing={6}>
            <HStack color="brand.500">
              <Icon as={FaBullhorn} w={6} h={6} />
              <Text fontWeight="800" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
                Layanan Pengaduan
              </Text>
            </HStack>
            <Heading as="h2" size="xl" fontWeight="800">
              {language === 'id' ? 'Sampaikan Aspirasi & Keluhan Anda' : 'Submit Your Aspirations & Complaints'}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {language === 'id'
                ? 'Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga. Sampaikan pengaduan atau saran Anda melalui formulir ini.'
                : 'Ngawonggo Village Government is committed to listening to citizens. Submit your complaints or suggestions through this form.'}
            </Text>
            <VStack align="start" spacing={4} w="100%">
              <HStack spacing={4}>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontSize="sm" color="gray.600">Proses Cepat & Transparan</Text>
              </HStack>
              <HStack spacing={4}>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontSize="sm" color="gray.600">Langsung Diterima Perangkat Desa</Text>
              </HStack>
              <HStack spacing={4}>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontSize="sm" color="gray.600">Kerahasiaan Pelapor Terjamin</Text>
              </HStack>
            </VStack>
          </VStack>

          <Box bg="gray.50" p={8} borderRadius="3xl" boxShadow="sm" w="100%">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="700">Nama Lengkap</FormLabel>
                  <Input bg="white" borderRadius="xl" placeholder="Masukkan nama Anda" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="700">Kontak (WA/Email)</FormLabel>
                  <Input bg="white" borderRadius="xl" placeholder="Nomor WhatsApp atau Email" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="700">Kategori</FormLabel>
                  <Select bg="white" borderRadius="xl">
                    <option value="infrastruktur">Infrastruktur</option>
                    <option value="pelayanan">Pelayanan Publik</option>
                    <option value="keamanan">Keamanan & Ketertiban</option>
                    <option value="saran">Saran & Kritik</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="700">Isi Pengaduan</FormLabel>
                  <Textarea bg="white" borderRadius="xl" placeholder="Ceritakan detail pengaduan Anda" rows={4} />
                </FormControl>
                <Button type="submit" colorScheme="brand" size="lg" w="100%" borderRadius="xl" mt={4}>
                  Kirim Pengaduan
                </Button>
              </VStack>
            </form>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default PengaduanSection;
