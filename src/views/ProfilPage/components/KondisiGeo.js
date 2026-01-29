import { Flex, ListItem, OrderedList, Text, Box } from '@chakra-ui/react';

const KondisiGeo = () => {
  return (
    <Flex flexDirection="column" fontFamily="heading" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Kondisi Geografis
      </Text>
      <Text>
        Desa Ngawonggo terletak di lereng Gunung Sumbing, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah.
        Berada pada ketinggian yang cukup signifikan, desa ini menawarkan udara yang sejuk dan pemandangan alam yang memukau.
      </Text>
      <Box>
        <Text fontWeight={700}>Batas Wilayah Desa Ngawonggo:</Text>
        <OrderedList>
          <ListItem>Sebelah Utara : Hutan Lindung Gunung Sumbing</ListItem>
          <ListItem>Sebelah Timur : Desa Balekerto</ListItem>
          <ListItem>Sebelah Barat : Desa Butuh (Nepal van Java)</ListItem>
          <ListItem>Sebelah Selatan : Desa Adipuro</ListItem>
        </OrderedList>
      </Box>
      <Box>
        <Text>
          Topografi desa didominasi oleh perbukitan and lahan pertanian terasering yang subur.
          Kondisi tanah vulkanik dari Gunung Sumbing menjadikannya sangat cocok untuk budidaya sayuran dan tanaman pangan lainnya.
        </Text>
      </Box>
      <Box>
        <Text>
          Iklim di Desa Ngawonggo tergolong tropis basah dengan curah hujan yang cukup tinggi,
          terutama di musim penghujan, yang mendukung ketersediaan sumber air alami bagi pertanian warga.
        </Text>
      </Box>
    </Flex>
  );
};

export default KondisiGeo;
