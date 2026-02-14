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
      layerStyle="glassCard"
      overflow="hidden"
      w="100%"
      border="none"
      p={0}
    >
      <Image
        src={image}
        alt='ImageNews'
        objectFit="cover"
        h="250px"
      />
      <CardHeader pb={0}>
        <Badge colorScheme="brand" fontSize="xs" mb="2" borderRadius="full" px={3}>
          {date}
        </Badge>
        <Heading size="md">
          {title}
        </Heading>
      </CardHeader>
      <CardBody fontFamily="body" pb={6}>
        <Box
          fontSize="sm"
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: caption }}
          mb={6}
          color="gray.600"
        />
        <Button
          as={RouterLink}
          to={`/news/${id}`}
          size="md"
          colorScheme="brand"
          variant="solid"
          w="full"
        >
          Baca Selengkapnya
        </Button>
      </CardBody>
    </Card>
  );
}
