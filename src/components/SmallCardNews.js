import {
  Box,
  Card,
  Image,
  Text,
  Stack,
  CardBody,
  // CardHeader,
  Heading,
  Badge,
  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const SmallCardNews = ({ id, image, title, date }) => {
  return (
    <Box>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        _hover={{
          transform: 'translateY(-5px)',
          transition: 'transform 0.3s',
        }}
        size={{ base: "sm" }}
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px', lg : "250px" }}
          src={image}
          alt="Image News"
        />

        <Stack>
          <CardBody>
            <Heading size={{ base: "sm",lg : "md" }}>{title}</Heading>

            <Badge fontFamily="default" size={{ base: "sm" }} my={2}>
              <Text py="2">{date}</Text>
            </Badge>
            <Box mt={2}>
              <Button
                as={RouterLink}
                to={`/news/${id}`}
                size="xs"
                variant="link"
                color="brand.500"
                _hover={{ textDecoration: 'none', color: 'brand.600' }}
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
