
import {
  Box,
  Button,
  Heading,
  Link,
} from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CardTravel = ({ title, location, image }) => {
  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      h={{ base: '300px', lg: '400px' }}
      role="group"
      cursor="pointer"
    >
      <Box
        bgImage={`url(${image})`}
        bgSize="cover"
        bgPosition="center"
        w="100%"
        h="100%"
        transition="all 0.5s ease"
        _groupHover={{ transform: 'scale(1.1)' }}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-t, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        p={6}
        color="white"
      >
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <Link href={location} isExternal _hover={{ textDecoration: 'none' }}>
          <Button
            size="sm"
            colorScheme="brand"
            leftIcon={<FaMapMarkerAlt />}
            borderRadius="full"
          >
            Cek Lokasi
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
export default CardTravel;
