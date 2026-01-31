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
} from '@chakra-ui/react';
import { EmailIcon, InfoIcon, EditIcon } from '@chakra-ui/icons';

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
    <Box p={10} fontFamily="heading">
      <Heading mb={5} color="ngawonggo.green">Layanan Publik</Heading>
      <Text mb={8}>
        Pemerintah Desa Ngawonggo berkomitmen memudahkan warga dalam mengurus administrasi kependudukan.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {services.map((service, index) => (
          <Card key={index} variant="outline">
            <CardHeader pb={0}>
              <Icon as={service.icon} w={6} h={6} color="blue.500" mb={2} />
              <Heading size="md">{service.title}</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Text pt="2" fontSize="sm">
                    {service.desc}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Box mt={10} p={5} bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
        <Heading size="sm" mb={2}>Digitalisasi Layanan</Heading>
        <Text fontSize="sm">
          Sesuai Misi Desa, kami sedang mengembangkan sistem form pengajuan online untuk mempercepat proses administrasi warga.
        </Text>
      </Box>
    </Box>
  );
}
