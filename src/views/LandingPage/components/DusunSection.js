import React, { useEffect, useState } from 'react';
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
  useColorModeValue,
} from '@chakra-ui/react';
import { FaChevronRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useThemePreference } from '../../../contexts/ThemePreferenceContext';

const DusunSection = () => {
  const { landingTheme } = useThemePreference();
  const blobOpacity1 = useColorModeValue(0.1, 0.05);
  const borderColors = ['red.400', 'orange.400', 'yellow.400', 'green.400', 'teal.400', 'blue.400', 'cyan.400', 'purple.400', 'pink.400', 'brand.400'];
  const [dusuns, setDusuns] = useState([]);

  useEffect(() => {
    const fetchDusuns = async () => {
      const { data, error } = await supabase.from('dusuns').select('*').order('sort_order', { ascending: true });
      if (!error && data) setDusuns(data);
    };
    fetchDusuns();
  }, []);

  return (
    <Box py={24} bg={useColorModeValue('white', 'gray.800')} position="relative" overflow="hidden">
      {landingTheme === 'vibrant' && (
        <>
          {/* Playful Colorful Background Blobs */}
          <Box position="absolute" top="-10%" left="-10%" w="500px" h="500px" bg="purple.400" opacity={blobOpacity1} borderRadius="full" filter="blur(100px)" />
          <Box position="absolute" bottom="-10%" right="-5%" w="600px" h="600px" bg="orange.400" opacity={blobOpacity1} borderRadius="full" filter="blur(120px)" />
        </>
      )}
      <Container maxW="container.xl" position="relative" zIndex={1}>
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
            {dusuns.map((dusun, index) => (
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
                  boxShadow={landingTheme === 'vibrant' ? "xl" : "md"}
                  border={landingTheme === 'vibrant' ? "6px solid" : "none"}
                  borderColor={landingTheme === 'vibrant' ? borderColors[index % borderColors.length] : "transparent"}
                  transition={landingTheme === 'vibrant' ? "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "all 0.4s"}
                  _hover={landingTheme === 'vibrant' ? { transform: 'translateY(-12px) rotate(2deg)', boxShadow: '2xl', borderColor: 'white' } : { transform: 'translateY(-8px)', boxShadow: '2xl' }}
                >
                  <Image
                    src={dusun.image_url}
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
