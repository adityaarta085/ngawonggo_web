import React from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BRUTAL_COLORS = [
    'neo.yellow', 'neo.coral', 'neo.teal', 'brutal.purple', 'brutal.orange', 'brutal.green'
];

const CardNews = ({ news, isBrutalist = true, index = 0 }) => {
  const formattedDate = new Date(news.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fallbackImage = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';

  const accentColor = BRUTAL_COLORS[index % BRUTAL_COLORS.length];

  if (!isBrutalist) {
      // Return old style if explicitly requested (e.g., in other parts of the app we haven't updated yet)
      return (
        <MotionBox
          as={RouterLink}
          to={`/news/${news.id}`}
          bg="white" _dark={{ bg: "gray.800" }}
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
          {/* ... existing old render logic ... */}
          <Box position="relative" overflow="hidden" h="240px" bg="gray.100" _dark={{ bg: "gray.700" }}>
            <Image
              src={news.image || news.image_url || fallbackImage}
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
          </Box>

          <Stack p={8} spacing={4} flex={1}>
            <Heading size="md" fontWeight="900" color="gray.800" _dark={{ color: "white" }} noOfLines={2} lineHeight="1.4">
              {news.title}
            </Heading>
            <Text color="gray.500" fontSize="sm" noOfLines={3} lineHeight="tall" fontWeight="500">
              {news.content.replace(/<[^>]*>/g, '')}
            </Text>
          </Stack>
        </MotionBox>
      );
  }

  return (
    <MotionBox
      as={RouterLink}
      to={`/news/${news.id}`}
      bg="white"
      border="3px solid black"
      boxShadow={`4px 4px 0px ${accentColor}`}
      transition="all 0.2s"
      _hover={{
        transform: 'translate(-4px, -4px)',
        boxShadow: `8px 8px 0px ${accentColor}`,
      }}
      display="flex"
      flexDirection="column"
      height="full"
      role="group"
    >
      <Box position="relative" overflow="hidden" h="220px" bg="black" borderBottom="3px solid black">
        <Image
          src={news.image || news.image_url || fallbackImage}
          alt={news.title}
          objectFit="cover"
          w="full"
          h="full"
          transition="transform 0.5s"
          _groupHover={{ transform: 'scale(1.05)' }}
          loading="lazy"
          fallbackSrc={fallbackImage}
          onError={(e) => { e.target.src = fallbackImage; }}
          opacity={0.9}
        />
        <Box
          position="absolute"
          top={4}
          left={4}
          bg={accentColor}
          border="2px solid black"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          fontFamily="accent"
          textTransform="uppercase"
        >
          {news.category || 'Berita'}
        </Box>
      </Box>

      <Stack p={6} spacing={4} flex={1} bg="white">
        <Flex align="center" justify="space-between" borderBottom="2px solid black" pb={2}>
          <Text fontFamily="accent" color="black" fontSize="xs" fontWeight="bold">WARTA DESA</Text>
          <Text fontFamily="accent" color="black" fontSize="xs" fontWeight="bold">{formattedDate}</Text>
        </Flex>

        <Heading fontFamily="heading" size="md" fontWeight="900" color="black" noOfLines={3} lineHeight="1.4" textTransform="uppercase">
          {news.title}
        </Heading>

        <Text color="black" fontSize="sm" noOfLines={3} lineHeight="tall" fontWeight="500">
          {news.content.replace(/<[^>]*>/g, '')}
        </Text>
      </Stack>

      <Flex p={6} pt={0} align="center" justify="space-between" bg="white">
        <Text color="black" fontWeight="900" fontSize="sm" fontFamily="accent">
          BACA SELENGKAPNYA
        </Text>
        <Icon
            as={FaChevronRight}
            color="black"
            w={4} h={4}
            transition="transform 0.3s"
            _groupHover={{ transform: 'translateX(5px)' }}
        />
      </Flex>
    </MotionBox>
  );
};

export default CardNews;
