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
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
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

const Counter = ({ from, to }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('id-ID'));

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
};


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

  const cardBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const cardHoverBg = useColorModeValue('white', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.500', 'whiteAlpha.700');
  const sectionBg = useColorModeValue('white', 'gray.900');

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
    <Box pt={32} pb={24} bg={sectionBg} position="relative" overflow="hidden">

      {/* Decorative Wave SVG at top */}
      <Box position="absolute" top={0} left={0} w="full" overflow="hidden" lineHeight={0} transform="rotate(180deg)">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" color={useColorModeValue('white', 'gray.800')}></path>
        </svg>
      </Box>

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

          <Box w="full" aria-live="polite" aria-busy={loading}>
            {loading ? renderSkeleton() : (
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="full">
                {stats.map((item, index) => (
                  <MotionBox
                    key={item.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                    bg={cardBg}
                    p={10}
                    borderRadius="3xl"
                    border="2px solid"
                    borderColor={borderColor}
                    textAlign="center"
                    _hover={{
                        bg: cardHoverBg,
                        borderColor: "brand.200",
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)"
                    }}
                  >
                    <Flex
                      w={16}
                      h={16}
                      bg={item.color || 'blue.500'}
                      color="white"
                      borderRadius="2xl"
                      align="center"
                      justify="center"
                      mx="auto"
                      mb={8}
                      boxShadow="xl"
                    >
                      <Icon as={getIcon(item.icon)} w={8} h={8} aria-hidden="true" focusable="false" />
                    </Flex>
                    <Heading color={textColor} size="xl" fontWeight="900" mb={2}>
                      {typeof item.value === 'number' ? <Counter from={0} to={item.value} /> : item.value}
                    </Heading>
                    <Text color="gray.400" fontSize="md" fontWeight="800" letterSpacing="wider" textTransform="uppercase">
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
