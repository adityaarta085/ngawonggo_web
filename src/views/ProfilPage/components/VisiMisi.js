import {
  Flex,
  ListItem,
  Text,
  OrderedList,
  Box,
} from '@chakra-ui/react';

const VisiMisi = () => {
  return (
    <Flex flexDirection="column">
      <Box my={5}>
        <Text fontFamily="heading" fontWeight="600" fontSize="35px">
          Visi Misi
        </Text>
        <Text fontFamily="heading" fontSize="25px">
          Visi
        </Text>
        <Text fontFamily="heading">
          “Mewujudkan Desa Ngawonggo yang Mandiri, Religius, dan Berbudaya Berbasis Potensi Lokal Menuju Era Digital 2045.”
        </Text>
      </Box>
      <Box>
        <Text fontFamily="heading" fontSize="25px">
          Misi
        </Text>
        <OrderedList fontFamily="heading">
          <ListItem>
            Meningkatkan kualitas pelayanan publik melalui transformasi digital.
          </ListItem>
          <ListItem>
            Mengoptimalkan potensi pertanian kopi dan hortikultura sebagai penggerak ekonomi desa.
          </ListItem>
          <ListItem>
            Melestarikan nilai-nilai budaya lokal dan memperkuat identitas desa religius.
          </ListItem>
          <ListItem>
            Membangun infrastruktur desa yang berkelanjutan dan ramah lingkungan.
          </ListItem>
        </OrderedList>
      </Box>
    </Flex>
  );
};

export default VisiMisi;
