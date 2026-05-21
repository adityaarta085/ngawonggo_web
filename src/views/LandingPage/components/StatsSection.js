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
import {
  FaUsers,
  FaTree,
  FaBuilding,
  FaChartBar,
  FaUserFriends,
  FaMapMarkedAlt,
  FaHome,
  FaHeart
} from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const iconMap = {
  FaUsers,
  FaTree,
  FaBuilding,
  FaChartBar,
  FaUserFriends,
  FaMapMarkedAlt,
  FaHome,
  FaHeart
};

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  // Array of vivid gradients for each card
  const gradients = [
    "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(120deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(120deg, #fa709a 0%, #fee140 100%)",
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('village_stats')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data && isMounted) setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  const getIcon = (iconName) => {
    return iconMap[iconName] || FaChartBar;
  };

  const renderSkeleton = () => (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="full">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} height="250px" borderRadius="3xl" />
      ))}
    </SimpleGrid>
  );

  return (
    <Box py={24} bg={sectionBg} position="relative" overflow="hidden">
      {/* Decorative Blur */}
      {/* Playful Floating Shapes */}
      <Box position="absolute" top="-5%" right="-5%" w={{ base: "200px", md: "400px" }} h={{ base: "200px", md: "400px" }} bg="pink.400" opacity={useColorModeValue(0.15, 0.05)} borderRadius="full" filter="blur(60px)" animation="spin 20s linear infinite" />
      <Box position="absolute" bottom="-10%" left="-5%" w={{ base: "250px", md: "500px" }} h={{ base: "250px", md: "500px" }} bg="blue.400" opacity={useColorModeValue(0.15, 0.05)} borderRadius="full" filter="blur(80px)" animation="spin 25s linear infinite reverse" />
      <Box position="absolute" top="40%" left="30%" w="300px" h="300px" bg="yellow.400" opacity={useColorModeValue(0.15, 0.05)} borderRadius="full" filter="blur(70px)" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          <Box textAlign="center" maxW="3xl">
            <Text color="brand.500" fontWeight="800" letterSpacing="widest" fontSize="xs" mb={3}>
              STATISTIK DESA
            </Text>
            <Heading color={useColorModeValue('gray.800', 'white')} size="2xl" fontWeight="900" mb={6}>
              Ngawonggo Dalam Angka
            </Heading>
            <Text color={useColorModeValue('gray.500', 'whiteAlpha.700')} fontSize="xl" fontWeight="500">
              Data statistik asli terintegrasi sistem untuk gambaran umum kependudukan dan geografis Desa Ngawonggo.
            </Text>
          </Box>

          <Box w="full" aria-live="polite" aria-busy={loading}>
            {loading ? renderSkeleton() : (
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="full">
                {stats.map((item, index) => (
                  <MotionBox
                    key={item.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
                    style={{ background: gradients[index % gradients.length] }}
                    p={10}
                    borderRadius="3xl"
                    boxShadow="xl"
                    border="4px solid white"
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                    _hover={{

                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)"
                    }}
                  >
                    <Flex
                      w={16}
                      h={16}
                      bg="white"
                      color={item.color || 'blue.500'}
                      borderRadius="2xl"
                      align="center"
                      justify="center"
                      mx="auto"
                      mb={8}
                      boxShadow="xl"
                    >
                      <Icon as={getIcon(item.icon)} w={8} h={8} aria-hidden="true" focusable="false" />
                    </Flex>
                    <Heading color="gray.800" size="xl" fontWeight="900" mb={2} style={{ textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                      {typeof item.value === 'number' ? item.value.toLocaleString('id-ID') : item.value}
                    </Heading>
                    <Text color="gray.700" fontSize="md" fontWeight="800" letterSpacing="wider" textTransform="uppercase">
                      {item.label}
                    </Text>
                  </MotionBox>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default StatsSection;
