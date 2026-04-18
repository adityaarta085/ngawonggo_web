import React from 'react';
import {
  Box,
  Card,
  Image,
  Text,
  Stack,
  CardBody,
  Heading,

  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const SmallCardNews = ({ news }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';

  // Format date if provided, otherwise use news.created_at
  const date = news.date || (news.created_at ? new Date(news.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : '');

  return (
    <Box>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        borderRadius="2xl"
        _hover={{
          transform: 'translateY(-5px)',
          transition: 'transform 0.3s',
          borderColor: 'brand.200',
          boxShadow: 'md'
        }}
        size={{ base: "sm" }}
        bg="white"
      >
        <Box w={{ base: '100%', sm: '120px', md: '150px' }} h={{ base: '120px', sm: 'full' }} overflow="hidden" bg="gray.100">
            <Image
              objectFit="cover"
              src={news.image || news.image_url || fallbackImage}
              alt={news.title}
              w="full"
              h="full"
              fallbackSrc={fallbackImage}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
        </Box>

        <Stack flex={1}>
          <CardBody p={4}>
            <Heading size="xs" noOfLines={2} mb={2}>{news.title}</Heading>

            <Text fontSize="10px" color="gray.400" fontWeight="700" mb={2}>
              {date}
            </Text>

            <Button
                as={RouterLink}
                to={`/news/${news.id}`}
                size="xs"
                variant="link"
                color="brand.500"
                _hover={{ textDecoration: 'none', color: 'brand.600' }}
                fontWeight="800"
            >
                BACA →
            </Button>
          </CardBody>
        </Stack>
      </Card>
    </Box>
  );
};

export default SmallCardNews;
