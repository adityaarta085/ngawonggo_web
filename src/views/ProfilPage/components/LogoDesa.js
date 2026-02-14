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
          Logo menampilkan siluet Gunung Sumbing yang melambangkan identitas geografis desa di lereng gunung yang megah.
        </Text>
        <Text mt={2}>
          Warna Hijau melambangkan kesuburan tanah dan potensi pertanian sayuran organik yang menjadi tumpuan ekonomi warga.
        </Text>
        <Text mt={2}>
          Warna Biru melambangkan kejernihan sumber mata air pegunungan dan langit yang cerah di lereng Sumbing.
        </Text>
      </Box>

      <Divider my={10} />

      <DownloadSection />
    </Flex>
  );
};

export default LogoDesa;
