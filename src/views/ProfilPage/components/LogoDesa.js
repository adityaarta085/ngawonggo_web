import {
  Box,
  Flex,
  Text,
  Divider,
} from '@chakra-ui/react';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import DownloadSection from './DownloadSection';

const LogoDesa = () => {
  return (
    <Flex fontFamily="heading" flexDirection="column" gap={4}>
      <Text fontWeight="600" fontSize="35px">
        Logo Desa
      </Text>
      <Box display="flex" justifyContent="center" p={10}>
        <NgawonggoLogo
          fontSize={{ base: "40px", md: "60px", lg: "80px" }}
          iconSize={{ base: 20, md: 40, lg: 60 }}
          color="green.500"
          flexDirection="column"
        />
      </Box>
      <Box>
        <Text fontSize="25px">Makna Logo Desa Ngawonggo</Text>
        <Text mt={2}>
          Logo resmi Desa Ngawonggo melambangkan identitas budaya, sejarah, dan kekayaan alam desa yang luhur.
        </Text>
        <Text mt={2}>
          <b>Simbol Candi/Petirtaan:</b> Melambangkan Situs Ngawonggo sebagai warisan sejarah dan budaya peninggalan masa lalu yang menjadi identitas desa.
        </Text>
        <Text mt={2}>
          <b>Tetesan Air:</b> Melambangkan kelimpahan sumber mata air (petirtaan) pegunungan yang jernih, suci, dan memberikan kehidupan bagi masyarakat.
        </Text>
        <Text mt={2}>
          <b>Padi dan Lingkaran:</b> Melambangkan kemakmuran dalam sektor pertanian serta kesatuan dan semangat gotong royong warga Desa Ngawonggo.
        </Text>
      </Box>

      <Divider my={10} />

      <DownloadSection />
    </Flex>
  );
};

export default LogoDesa;
