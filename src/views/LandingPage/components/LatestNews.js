import {
  Flex,
  Text,
  // Link,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Image,
  Badge,
  CardFooter,
  Button,
  // Box,
} from '@chakra-ui/react';

const LatestNews = () => {
  return (
    <Flex flexDirection={'column'} p={{ lg: '40px' }} m={{ lg: '5px' }}>
      <Text
        fontFamily={'heading'}
        fontSize={{ base: '25px', md: '35px', lg: '40px' }}
        fontWeight={700}
        mb={{base: "5px", lg: '10px' }}
        ml={{base: "5px", lg: '10px' }}
        color="ngawonggo.green"
      >
        Berita Desa
      </Text>
      <Grid
        templateRows={{ base : "", lg : "repeat(2, 1fr)" }}
        templateColumns={{ base : "1fr", lg : "repeat(2, 1fr)" }}
        gap={3}
        m="10px"
      >
        <GridItem rowSpan={2} colSpan={1}>
          <Card
            // size="md"
            _hover={{
              transform: 'translateY(-5px)',
              transition: 'transform 0.3s',
            }}
            h="100%"
            m={{ base: "3" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80"
              borderRadius="lg"
              m={3}
            />
            <CardHeader pb={0}>
              <Badge colorScheme="green" fontSize="md" mb="2" fontFamily="default">
                20 / 05 / 2024
              </Badge>
              <Heading size={{ base : "sm" , lg : "md" }}>
                Panen Raya, Petani Desa Ngawonggo Sukses Tingkatkan Hasil Sayuran Organik
              </Heading>
            </CardHeader>
            <CardBody fontFamily="body" pb={0}>
              <Text fontSize={{ lg : "lg", base : "sm" }} >
                Para petani di lereng Sumbing berhasil mengembangkan pertanian sayuran organik yang lebih sehat dan memiliki nilai jual tinggi, didukung oleh kesuburan tanah dan sumber air alami yang melimpah di Desa Ngawonggo.
              </Text>
            </CardBody>
            <CardFooter>
              <Button fontFamily={'heading'} colorScheme="green">
                Pertanian
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem colSpan={1} >
          <Card
            size="lg"
            _hover={{
              transform: 'translateY(-5px)',
              transition: 'transform 0.3s',
            }}
            h="100%"
            m={{ base: "3" }}
          >
            <CardHeader pb={0}>
              <Badge colorScheme="green" fontSize="md" mb="2" fontFamily="default">
                15 / 06 / 2024
              </Badge>
              <Heading size={{ base : "sm" , lg : "md" }}>
                Gelar Kesenian Tradisional, Ngawonggo Lestarikan Budaya Topeng Ireng dan Jatilan
              </Heading>
            </CardHeader>
            <CardBody fontFamily="body" pb={0}>
              <Text fontSize={{ lg : "lg", base : "sm" }} >
                Acara pentas seni tahunan di Desa Ngawonggo berlangsung semarak dengan menampilkan kesenian khas seperti Topeng Ireng dan Jatilan, sebagai upaya nyata menjaga warisan budaya dan menarik minat generasi muda.
              </Text>
            </CardBody>
            <CardFooter>
              <Button fontFamily={'heading'} colorScheme="green">
                Budaya
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          <Card
          size="md"
            _hover={{
              transform: 'translateY(-5px)',
              transition: 'transform 0.3s',
            }}
            h="100%"
            m={{ base: "3" }}
          >
            <CardHeader pb={0}>
              <Badge colorScheme="green" fontSize="md" mb="2" fontFamily="default">
                10 / 05 / 2024
              </Badge>
              <Heading size={{ base : "sm" , lg : "md" }}>
                Kerja Bakti Warga Membersihkan Jalur Sumber Mata Air Lereng Sumbing
              </Heading>
            </CardHeader>
            <CardBody fontFamily="body" pb={0}>
              <Text fontSize={{ lg : "lg", base : "sm" }}  >
                Masyarakat Desa Ngawonggo melaksanakan kegiatan gotong royong membersihkan jalur sumber mata air yang menjadi tumpuan utama untuk irigasi pertanian dan kebutuhan air bersih sehari-hari.
              </Text>
            </CardBody>
            <CardFooter>
              <Button fontFamily={'heading'} colorScheme="green">
                Lingkungan
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default LatestNews;
