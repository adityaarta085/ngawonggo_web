import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  VStack,
  Heading,
  Icon,
  Flex,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const cardHoverBg = useColorModeValue('white', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.500', 'whiteAlpha.700');
  const sectionBg = useColorModeValue('white', 'gray.900');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('village_stats')
          .select('*')
          .order('id', { ascending: true });

        if (data && !error) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent || FaIcons.FaChartBar;
  };

  return (
    <Box py={24} bg={sectionBg} position="relative" overflow="hidden">
      {/* Decorative Blur */}
      <Box position="absolute" top="-100px" right="-100px" w="400px" h="400px" bg="brand.500" opacity={0.03} borderRadius="full" filter="blur(80px)" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          <Box textAlign="center" maxW="3xl">
            <Text color="brand.500" fontWeight="800" letterSpacing="widest" fontSize="xs" mb={3}>
              STATISTIK DESA
            </Text>
            <Heading color={textColor} size="2xl" fontWeight="900" mb={6}>
              Ngawonggo Dalam Angka
            </Heading>
            <Text color={subTextColor} fontSize="xl" fontWeight="500">
              Data statistik asli terintegrasi sistem untuk gambaran umum kependudukan dan geografis Desa Ngawonggo.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="full">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="250px" borderRadius="3xl" />
              ))
            ) : (
              stats.map((item, index) => (
                <MotionBox
                  key={item.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg={cardBg}
                  p={10}
                  borderRadius="3xl"
                  border="1px solid"
                  borderColor={borderColor}
                  textAlign="center"
                  _hover={{
                      bg: cardHoverBg,
                      borderColor: "brand.200",
                      transform: "translateY(-10px)",
                      boxShadow: "2xl"
                  }}
                >
                  <Flex
                    w={16}
                    h={16}
                    bg={item.color && item.color.includes('.') ? item.color : `${item.color || 'brand'}.500`}
                    color="white"
                    borderRadius="2xl"
                    align="center"
                    justify="center"
                    mx="auto"
                    mb={8}
                    boxShadow="xl"
                  >
                    <Icon as={getIcon(item.icon)} w={8} h={8} />
                  </Flex>
                  <Heading color={textColor} size="xl" fontWeight="900" mb={2}>
                    {item.value}
                  </Heading>
                  <Text color="gray.400" fontSize="md" fontWeight="800" letterSpacing="wider" textTransform="uppercase">
                    {item.label}
                  </Text>
                </MotionBox>
              ))
            )}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default StatsSection;
