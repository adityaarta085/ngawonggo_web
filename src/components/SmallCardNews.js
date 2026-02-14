import {
  Box,
  Card,
  Image,

  Stack,
  CardBody,
  Heading,
  Badge,
  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const SmallCardNews = ({ id, image, title, date }) => {
  return (
    <Box w="100%">
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        layerStyle="glassCard"
        border="none"
        size="sm"
        p={0}
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '150px' }}
          src={image}
          alt="Image News"
        />

        <Stack flex={1}>
          <CardBody>
            <Heading size="xs" noOfLines={2} mb={2}>{title}</Heading>
            <Badge colorScheme="brand" variant="subtle" borderRadius="full" px={2} mb={3}>
              {date}
            </Badge>
            <Box>
              <Button
                as={RouterLink}
                to={`/news/${id}`}
                size="xs"
                variant="link"
                color="brand.500"
              >
                Selengkapnya →
              </Button>
            </Box>
          </CardBody>
        </Stack>
      </Card>
    </Box>
  );
};

export default SmallCardNews;
