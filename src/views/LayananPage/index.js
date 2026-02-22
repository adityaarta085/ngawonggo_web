import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Icon,
  Link,
  Image,
  Container,
} from '@chakra-ui/react';
import { EmailIcon, InfoIcon, EditIcon } from '@chakra-ui/icons';
import ComplaintSystem from './ComplaintSystem';
import Supports from '../LandingPage/components/Supports';

export default function LayananPage() {
  const services = [
    {
      title: 'Kartu Keluarga (KK)',
      desc: 'Layanan pembuatan KK baru, perubahan data, atau penggantian karena hilang/rusak.',
      icon: InfoIcon,
    },
    {
      title: 'KTP Elektronik',
      desc: 'Panduan perekaman KTP-el dan pengurusan KTP yang hilang atau rusak.',
      icon: EditIcon,
    },
    {
      title: 'Surat Keterangan',
      desc: 'Pembuatan berbagai surat keterangan (Domisili, Tidak Mampu, Usaha, dll).',
      icon: EmailIcon,
    },
  ];

  return (
    <Box>
      <Container maxW="container.xl" py={20}>
        <Box textAlign="center" mb={16}>
          <Heading mb={5} size="2xl" color="ngawonggo.green">Layanan Publik</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Pemerintah Desa Ngawonggo berkomitmen memudahkan warga dalam mengurus administrasi kependudukan dan memberikan informasi layanan publik yang transparan.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={20}>
          {services.map((service, index) => (
            <Card key={index} variant="outline" layerStyle="glassCard" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}>
              <CardHeader pb={0}>
                <Icon as={service.icon} w={8} h={8} color="brand.500" mb={4} />
                <Heading size="md">{service.title}</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Text pt="2" fontSize="md" color="gray.600">
                      {service.desc}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={20}>
          <Box p={8} layerStyle="glassCard" border="1px dashed" borderColor="brand.200" bg="blue.50">
            <Heading size="md" mb={4} color="brand.600">Digitalisasi Layanan</Heading>
            <Text fontSize="md" color="gray.700">
              Sesuai Misi Desa, kami sedang mengembangkan sistem form pengajuan online untuk mempercepat proses administrasi warga. Tunggu informasi selanjutnya untuk kemudahan akses layanan desa.
            </Text>
          </Box>

          <Box p={8} layerStyle="glassCard" border="1px solid" borderColor="red.100" bg="red.50">
            <Heading size="md" mb={4} color="red.600">Aspirasi & Pengaduan (LAPOR!)</Heading>
            <Text fontSize="md" mb={6} color="gray.700">
              Pemerintah Desa Ngawonggo terintegrasi dengan SP4N-LAPOR! Sampaikan keluhan atau saran Anda melalui kanal resmi nasional untuk penanganan yang lebih cepat dan transparan.
            </Text>
            <Link href="https://prod.lapor.go.id" isExternal>
              <Image
                src="https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzIvMjEvOTFhZGU2OGEtY2JlNS00YjhmLTgzOTEtZDcxNmQ3ZDRmYWVkLnBuZw=="
                alt="Logo LAPOR"
                h="50px"
                bg="white"
                p={2}
                borderRadius="md"
                boxShadow="sm"
              />
            </Link>
          </Box>
        </SimpleGrid>

        <Box mb={20}>
          <ComplaintSystem />
        </Box>
      </Container>

      {/* Adding Supports component here */}
      <Supports />
    </Box>
  );
}
