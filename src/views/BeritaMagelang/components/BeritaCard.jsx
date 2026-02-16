import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Heading,
  Image,
  Box,
  Button,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function BeritaCard({ news }) {
  const { title, image, snippet, date, slug } = news;

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Card
      direction="column"
      overflow="hidden"
      variant="outline"
      layerStyle="glassCard"
      bg={cardBg}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'xl',
      }}
      h="full"
    >
      <Box position="relative" overflow="hidden">
        <Image
          objectFit="cover"
          src={image || 'https://via.placeholder.com/400x250?text=Berita+Magelang'}
          alt={title}
          h="200px"
          w="100%"
          fallbackSrc="https://via.placeholder.com/400x250?text=Berita+Magelang"
          transition="transform 0.5s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme="brand"
          borderRadius="full"
          px={3}
          py={1}
        >
          Berita Magelang
        </Badge>
      </Box>

      <CardHeader pb={2}>
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" color="brand.500" fontWeight="bold">
            {date}
          </Text>
          <Heading size="md" noOfLines={2}>
            {title}
          </Heading>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <Text fontSize="sm" color={textColor} noOfLines={3} mb={4}>
          {snippet}
        </Text>
        <Button
          as={RouterLink}
          to={`/berita-magelang/${slug}`}
          variant="outline"
          colorScheme="brand"
          size="sm"
          w="full"
          borderRadius="full"
          _hover={{ bg: 'brand.500', color: 'white' }}
        >
          Baca Selengkapnya
        </Button>
      </CardBody>
    </Card>
  );
}
