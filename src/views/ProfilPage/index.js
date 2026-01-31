import { Box, Divider, Flex, Heading, Text, Link } from '@chakra-ui/react';
import DataWilayah from './components/DataWilayah';
import VisiMisi from './components/VisiMisi';
import LogoDesa from './components/LogoDesa';
import KondisiGeo from './components/KondisiGeo';
import Sejarah from './components/Sejarah';
import Demografi from './components/Demografi';

export default function ProfilPage() {
  return (
    <Flex m="30px 10px" gap={50} flexDirection={{ base: 'column', lg: 'row' }}>
      <Box textAlign={{ base: 'left', lg: 'right' }} fontFamily="heading" minW="200px">
        <Heading mb={3}>Profil Desa</Heading>
        <Link href="#sejarah">
          <Text decoration="underline">Sejarah Desa</Text>
        </Link>
        <Link href="#visimisi">
          <Text decoration="underline">Visi Misi</Text>
        </Link>
        <Link href="#kondisigeografis">
          <Text decoration="underline">Kondisi Geografis</Text>
        </Link>
        <Link href="#datawilayah">
          <Text decoration="underline">Data Wilayah</Text>
        </Link>
        <Link href="#demografi">
          <Text decoration="underline">Demografi</Text>
        </Link>
        <Link href="#logodesa">
          <Text decoration="underline">Logo Desa</Text>
        </Link>
      </Box>
      <Box flex="1">
        <Flex flexDirection="column" gap={8}>
          <Box id="sejarah">
            <Sejarah />
          </Box>
          <Box id="visimisi">
            <Divider mb={8} />
            <VisiMisi />
          </Box>
          <Box id="kondisigeografis">
            <Divider mb={8} />
            <KondisiGeo />
          </Box>
          <Box id="datawilayah">
            <Divider mb={8} />
            <DataWilayah />
          </Box>
          <Box id="demografi">
            <Divider mb={8} />
            <Demografi />
          </Box>
          <Box id="logodesa">
            <Divider mb={8} />
            <LogoDesa />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
