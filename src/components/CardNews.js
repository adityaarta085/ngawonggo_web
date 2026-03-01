import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Heading,
  Image,
  Box,
  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function CardNews({ id, title, image, caption, date }) {
  return (
    <Card
      size="md"
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'transform 0.3s',
      }}
      w={"400px"}
    >
      <Image
        src={image}
        alt='ImageNews'
        objectFit="cover"
      />
      <CardHeader pb={0}>
        <Badge colorScheme="green" fontSize="xs" mb="2" fontFamily="default">
          {date}
        </Badge>
        <Heading size={{ base: 'sm', lg: 'sm' }}>
          {title}
        </Heading>
      </CardHeader>
      <CardBody fontFamily="body" pb={4}>
        <Box
          fontSize={{ lg: 'sm', base: 'xs' }}
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: caption }}
          mb={4}
        />
        <Button
          as={RouterLink}
          to={`/news/${id}`}
          size="sm"
          colorScheme="brand"
          variant="outline"
          _hover={{ bg: 'brand.500', color: 'white' }}
        >
          Selengkapnya
        </Button>
      </CardBody>
    </Card>
  );
}
