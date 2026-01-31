import {
  Box,
  Heading,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Divider,
} from '@chakra-ui/react';

export default function PemerintahanPage() {
  return (
    <Box p={10} fontFamily="heading">
      <Heading mb={5} color="ngawonggo.green">Pemerintahan Desa</Heading>
      <Text mb={8}>
        Struktur Organisasi Pemerintah Desa Ngawonggo periode saat ini dirancang untuk memberikan pelayanan terbaik bagi seluruh masyarakat.
      </Text>

      <Heading size="md" mb={4}>Struktur Organisasi</Heading>
      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md" mb={10}>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Kepala Desa</Td>
              <Td>Heru Wibowo</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Sekretaris Desa</Td>
              <Td>Bambang Dwi Hendriyono</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Kaur Pemerintahan</Td>
              <Td>Yasin Sulthoni</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Ketua BPD</Td>
              <Td>Perlu Konfirmasi Desa</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Ketua P3A</Td>
              <Td>Rohmatul Faizin</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Divider mb={10} />

      <Heading size="md" mb={4}>Visi Pelayanan</Heading>
      <Text>
        Meningkatkan kualitas pelayanan publik melalui transformasi digital dan transparansi tata kelola pemerintahan desa.
      </Text>
    </Box>
  );
}
