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
          Mewujudkan Desa Ngawonggo yang Asri, Mandiri, dan Berbudaya Berbasis Potensi Pertanian dan Keindahan Alam.
        </Text>
      </Box>
      <Box>
        <Text fontFamily="heading" fontSize="25px">
          Misi
        </Text>
        <OrderedList fontFamily="heading">
          <ListItem>
            Meningkatkan kualitas lingkungan desa yang asri dan lestari.
          </ListItem>
          <ListItem>
            Mendorong kemandirian ekonomi masyarakat berbasis potensi pertanian lokal.
          </ListItem>
          <ListItem>
            Melestarikan nilai-nilai budaya dan kesenian tradisional desa.
          </ListItem>
          <ListItem>
            Mengoptimalkan potensi keindahan alam untuk kesejahteraan warga.
          </ListItem>
        </OrderedList>
      </Box>
    </Flex>
  );
};

export default VisiMisi;
