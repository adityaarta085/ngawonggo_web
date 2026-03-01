import { Flex, Heading, Text, Image, Box } from '@chakra-ui/react';
import img404 from '../../assets/Image404.png';

export default function PageNotFound() {
  return (
    <Flex
      flexDirection="column"
      fontFamily="heading"
      justifyContent="center"
      alignItems="center"
    my={10}
      textAlign="center"
    >
      <Box>
        <Image
          src={img404}
          alt="page_not_found"
          boxSize={{ base: '300px', lg: '500px' }}
          fit="cover"
        />
      </Box>
      <Heading fontFamily="heading" color="gray.700" size="3xl">
        404
      </Heading>

      <Text fontSize="lg" color="gray.700" fontWeight="700">
        Page Not Found
      </Text>
      <Text fontSize="md" color="gray.700">
        Halaman ini tidak ditemukan atau dalam tahap pengembangan
      </Text>
    </Flex>
  );
}
