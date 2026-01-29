import { Box, Divider, Flex, Heading, Text, Link } from '@chakra-ui/react';
import DataWilayah from './components/DataWilayah';
import VisiMisi from './components/VisiMisi';
import LogoDesa from './components/LogoDesa';
import KondisiGeo from './components/KondisiGeo';

export default function ProfilPage() {
  return (
    <Flex m="30px 10px" gap={50} flexDirection={{ base: 'column', lg: 'row' }}>
      <Box textAlign={{ base: 'left', lg: 'right' }} fontFamily="heading">
        <Heading mb={3}>Profil Desa Ngawonggo</Heading>
        <Link href="#visimisi">
          <Text decoration="underline">Visi Misi</Text>
        </Link>
        <Link href="#kondisigeografis">
          <Text decoration="underline">Kondisi Geografis</Text>
        </Link>
        <Link href="#datawilayah">
          <Text decoration="underline">Data Wilayah</Text>
        </Link>
        <Link href="#logodesa">
          <Text decoration="underline">Logo Desa</Text>
        </Link>
      </Box>
      <Box>
        <Flex flexDirection="column" gap={8}>
          <Box id="visimisi">
            <VisiMisi />
          </Box>
          <Box id="kondisigeografis">
            <Divider />
            <KondisiGeo />
          </Box>
          <Box id="datawilayah">
            <Divider />
            <DataWilayah />
          </Box>
          <Box id="logodesa">
            <Divider />
            <LogoDesa />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
