import {
  AspectRatio,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

const DataWilayah = () => {
  return (
    <Flex direction={'column'}>
      <Text fontFamily="heading" fontWeight="600" fontSize="35px">
        Data Wilayah
      </Text>
      <UnorderedList fontFamily="heading" spacing={3}>
        <ListItem>Nama Resmi : Desa Ngawonggo </ListItem>
        <ListItem>Luas Wilayah : 5,34 km² </ListItem>
        <ListItem>Kecamatan : Kaliangkrik </ListItem>
        <ListItem>Kabupaten : Magelang </ListItem>
        <ListItem>Provinsi : Jawa Tengah </ListItem>
        <ListItem>Batas Wilayah :</ListItem>
        <ListItem>Utara : Desa Adipura </ListItem>
        <ListItem>Timur : Desa Kaliangkrik </ListItem>
        <ListItem>Selatan : Desa Temanggung </ListItem>
        <ListItem>Barat : Desa Balekerto / Lereng Gunung Sumbing </ListItem>
        <ListItem>Koordinat Geografis : -7.485, 110.125 </ListItem>
        <ListItem>Potensi Utama : Kopi Arabika, Hortikultura, Wisata Religi </ListItem>
      </UnorderedList>
      <AspectRatio
        ratio={16 / 9}
        my={5}
        maxWidth={{ base: '500px', lg: '700px' }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.392070388746!2d110.0765!3d-7.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e7e7e7e7e7e%3A0x1234567890abcdef!2sNgawonggo%2C%20Kaliangkrik%2C%20Magelang%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1696338806586!5m2!1sen!2sid"
          title="embed_location"
        />
      </AspectRatio>
    </Flex>
  );
};

export default DataWilayah;
