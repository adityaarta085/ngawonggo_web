import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

import { FaMapMarkerAlt } from 'react-icons/fa';

const CardTravel = ({ title, location, image }) => {
  return (
    <Card
      bg={`url(${image})`}
      backgroundSize="cover"
      w={{ base: '150px', lg: '300px' }}
      h={{ base: '150px', lg: '300px' }}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'transform 0.3s',
      }}
      m={{ lg: '0px', md: '1px', base: '2px' }}
    >
      <CardBody></CardBody>
      <CardFooter>
        <Box>
          <Heading color="white" size={{ base: 'sm', lg: 'lg' }} mb={2}>
            {title}
          </Heading>
          <Link href={location}>
            <Button
              variant={useColorModeValue('solid', 'outline')}
              rightIcon={<FaMapMarkerAlt />}
              fontFamily="heading"
              size={{ base: 'xs', lg: 'sm' }}
              colorScheme="teal"
            >
              Cek Lokasi
            </Button>
          </Link>
        </Box>
      </CardFooter>
    </Card>
  );
};
export default CardTravel;
