import {
  Box,
  Divider,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  // BreadcrumbSeparator,
  // Grid,
  // GridItem,
  ButtonGroup,
  Button,
  // Card,
  Link,
} from '@chakra-ui/react';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import {
  kesehatanNews,
  pemerintahanNews,
  pendidikanNews,
  smallKesehatanNews,
  smallPemerintahanNews,
  smallPendidikanNews,
} from '../../variables/general';
// import CardNews from '../../components/CardNews';

export default function NewsPage() {
  return (
    <Flex direction="column" m={30}>
      <Box display="row" fontFamily="heading">
        <Heading>Informasi Dan Berita Daerah</Heading>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/news ">Berita</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box my={2}>
        <ButtonGroup colorScheme="teal" display={{ lg: 'table-row' }}>
          <Link href="#pemerintahan">
            <Button fontFamily={'default'} m={2}>
              Pemerintahan
            </Button>
          </Link>
          <Link href="#pendidikan">
            <Button fontFamily={'default'} m={2}>
              Pendidikan
            </Button>
          </Link>
          <Link href="#kesehatan">
            <Button fontFamily={'default'} m={2}>
              Kesehatan
            </Button>
          </Link>
        </ButtonGroup>
      </Box>
      <Box my={15} id="pemerintahan">
        <Heading size={'lg'}>Pemerintahan</Heading>
        <Divider mt={1} />
        <Flex gap={5} mt={5} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {pemerintahanNews.map(e => {
            return (
              <CardNews
                title={e.title}
                image={e.image}
                date={e.date}
                caption={e.caption}
              />
            );
          })}
          <Flex
            flexDirection={{ base: 'row', lg: 'column' }}
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            gap={5}
            justifyContent="space-between"
          >
            {smallPemerintahanNews.map(e => {
              return (
                <SmallCardNews title={e.title} image={e.image} date={e.date} />
              );
            })}
          </Flex>
        </Flex>
      </Box>
      <Box my={15} id="pendidikan">
        <Heading size={'lg'}>Pendidikan</Heading>
        <Divider mt={1} />
        <Flex gap={5} mt={5} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {pendidikanNews.map(e => {
            return (
              <CardNews
                title={e.title}
                image={e.image}
                date={e.date}
                caption={e.caption}
              />
            );
          })}
          <Flex
            flexDirection={{ base: 'row', lg: 'column' }}
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            gap={5}
            justifyContent="space-between"
          >
            {smallPendidikanNews.map(e => {
              return (
                <SmallCardNews title={e.title} image={e.image} date={e.date} />
              );
            })}
          </Flex>
        </Flex>
      </Box>
      <Box my={15} id="kesehatan">
        <Heading size={'lg'}>Kesehatan</Heading>
        <Divider mt={1} />
        <Flex gap={5} mt={5} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {kesehatanNews.map(e => {
            return (
              <CardNews
                title={e.title}
                image={e.image}
                date={e.date}
                caption={e.caption}
              />
            );
          })}
          <Flex
            flexDirection={{ base: 'row', lg: 'column' }}
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            gap={5}
            justifyContent="space-between"
          >
            {smallKesehatanNews.map(e => {
              return (
                <SmallCardNews title={e.title} image={e.image} date={e.date} />
              );
            })}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
