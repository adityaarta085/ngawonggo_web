import {
  Flex,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from '@chakra-ui/react';

const Demografi = () => {
  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Demografi Penduduk
      </Text>
      <Text>
        Berdasarkan data statistik terbaru (BPS 2024), profil kependudukan Desa Ngawonggo adalah sebagai berikut:
      </Text>
      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Total Penduduk</Td>
              <Td>6.052 Jiwa</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Laki-laki</Td>
              <Td>3.088 Jiwa</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Perempuan</Td>
              <Td>2.964 Jiwa</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Kepadatan Penduduk</Td>
              <Td>1.133 jiwa/km²</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Mata Pencaharian Utama</Td>
              <Td>Petani (Kopi, Cabe, Sayuran)</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Agama Mayoritas</Td>
              <Td>Islam (100%)</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Tingkat Pendidikan Dominan</Td>
              <Td>SD / Sederajat</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Demografi;
