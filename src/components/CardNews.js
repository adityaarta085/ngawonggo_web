import React from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Flex,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CardNews = ({ news }) => {
  const formattedDate = new Date(news.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fallbackImage = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';

  return (
    <MotionBox
      as={RouterLink}
      to={`/news/${news.id}`}
      bg="white"
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="soft"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: 'translateY(-12px)',
        boxShadow: 'strong',
        borderColor: 'brand.200',
      }}
      display="flex"
      flexDirection="column"
      height="full"
      role="group"
    >
      <Box position="relative" overflow="hidden" h="240px" bg="gray.100">
        <Image
          src={news.image_url || fallbackImage}
          alt={news.title}
          objectFit="cover"
          w="full"
          h="full"
          transition="transform 0.5s"
          _groupHover={{ transform: 'scale(1.1)' }}
          loading="lazy"
          fallbackSrc={fallbackImage}
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme="brand"
          variant="solid"
          borderRadius="full"
          px={4}
          py={1}
          fontSize="xs"
          fontWeight="900"
          letterSpacing="widest"
          boxShadow="lg"
        >
          {news.category || 'Berita'}
        </Badge>
      </Box>

      <Stack p={8} spacing={4} flex={1}>
        <Flex align="center" gap={2} color="gray.400" fontSize="xs" fontWeight="700">
          <Icon as={FaCalendarAlt} />
          <Text>{formattedDate}</Text>
        </Flex>

        <Heading size="md" fontWeight="900" color="gray.800" noOfLines={2} lineHeight="1.4">
          {news.title}
        </Heading>

        <Text color="gray.500" fontSize="sm" noOfLines={3} lineHeight="tall" fontWeight="500">
          {news.content.replace(/<[^>]*>/g, '')}
        </Text>
      </Stack>

      <Flex p={8} pt={0} align="center" justify="space-between">
        <Text color="brand.500" fontWeight="800" fontSize="sm" letterSpacing="wide">
          BACA SELENGKAPNYA
        </Text>
        <Icon
            as={FaChevronRight}
            color="brand.500"
            w={4} h={4}
            transition="transform 0.3s"
            _groupHover={{ transform: 'translateX(5px)' }}
        />
      </Flex>
    </MotionBox>
  );
};

export default CardNews;
