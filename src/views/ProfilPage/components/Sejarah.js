import { Flex, Text, Box } from '@chakra-ui/react';

const Sejarah = () => {
  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Sejarah Desa
      </Text>
      <Box>
        <Text>
          Desa Ngawonggo terletak di lereng Gunung Sumbing, sebuah wilayah yang dikenal dengan kesuburan tanah dan udara yang sejuk. Secara historis, Ngawonggo berkembang sebagai pusat pemukiman agraris yang kental dengan nilai-nilai religius.
        </Text>
      </Box>
      <Box>
        <Text>
          Keberadaan beberapa Pondok Pesantren berbasis Nahdlatul Ulama (NU) telah membentuk identitas desa ini sebagai 'Desa Santri' di wilayah Kaliangkrik. Masyarakat Ngawonggo dikenal memegang teguh adat istiadat Jawa yang dipadukan dengan nafas keislaman, menciptakan harmoni sosial yang kuat selama bergenerasi.
        </Text>
      </Box>
    </Flex>
  );
};

export default Sejarah;
