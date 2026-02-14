
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
  Image,
  Link,
} from '@chakra-ui/react';
import { FaChevronRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const DUSUNS = [
  { name: 'Sedayu', slug: 'sedayu', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=500' },
  { name: 'Gemuh', slug: 'gemuh', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500' },
  { name: 'Krajan Ngawonggo', slug: 'krajan-ngawonggo', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500' },
  { name: 'Baturan', slug: 'baturan', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=500' },
  { name: 'Bulusari', slug: 'bulusari', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=500' },
  { name: 'Kepering', slug: 'kepering', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=500' },
  { name: 'Nglarangan', slug: 'nglarangan', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=500' },
  { name: 'Maron', slug: 'maron', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500' },
  { name: 'Gunung Malang', slug: 'gunung-malang', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500' },
  { name: 'Pengkol', slug: 'pengkol', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=500' },
];

const DusunSection = () => {
  return (
    <Box py={24} bg="transparent" position="relative">
      <Container maxW="container.xl">
        <VStack spacing={12} align="center">
          <Box textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="brand.500"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2}
            >
              Jelajahi Wilayah Kami
            </Text>
            <Heading as="h2" size="2xl" fontWeight="800">
              Sepuluh Dusun Ngawonggo
            </Heading>
          </Box>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6} w="full">
            {DUSUNS.map((dusun) => (
              <Link
                key={dusun.slug}
                as={RouterLink}
                to={`/dusun/${dusun.slug}`}
                _hover={{ textDecoration: 'none' }}
                role="group"
              >
                <Box
                  position="relative"
                  h="200px"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="md"
                  transition="all 0.4s"
                  _hover={{ transform: 'translateY(-8px)', boxShadow: '2xl' }}
                >
                  <Image
                    src={dusun.image}
                    alt={dusun.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="all 0.5s"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
                  />
                  <Flex
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={4}
                    justify="space-between"
                    align="end"
                  >
                    <VStack align="start" spacing={0}>
                      <Text color="whiteAlpha.800" fontSize="xs">Dusun</Text>
                      <Text color="white" fontWeight="bold" fontSize="lg">{dusun.name}</Text>
                    </VStack>
                    <Icon as={FaChevronRight} color="white" />
                  </Flex>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default DusunSection;
