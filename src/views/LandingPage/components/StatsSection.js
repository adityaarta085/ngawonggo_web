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

const BRUTAL_COLORS = [
    'neo.yellow', 'neo.coral', 'neo.teal', 'brutal.purple'
];

// Counting hook
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTimestamp = null;
      let startValue = 0;
      let endValue = typeof end === 'number' ? end : parseFloat(end.toString().replace(/[^0-9.]/g, ''));

      if (isNaN(endValue)) {
          setCount(end);
          return;
      }

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeProgress * (endValue - startValue) + startValue);

        setCount(currentCount);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };

      window.requestAnimationFrame(step);
    }, [end, duration]);

    if (typeof end === 'number' || !isNaN(parseFloat(end.toString().replace(/[^0-9.]/g, '')))) {
        // If it's a number, format it, preserving any original non-numeric suffix
        const suffix = typeof end === 'string' ? end.replace(/[0-9.]/g, '') : '';
        return count.toLocaleString('id-ID') + suffix;
    }

    return end;
};

const StatCard = ({ item, index, icon }) => {
    const displayValue = useCounter(item.value);
    const accentColor = BRUTAL_COLORS[index % BRUTAL_COLORS.length];

    return (
        <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            bg="white"
            p={8}
            borderRadius="none"
            border="3px solid black"
            boxShadow={`4px 4px 0px ${accentColor}`}
            position="relative"
            textAlign="center"
            _hover={{
                transform: "translate(-4px, -4px)",
                boxShadow: `8px 8px 0px ${accentColor}`
            }}
        >
            {/* Top accent stripe */}
            <Box position="absolute" top={0} left={0} right={0} h="12px" bg={accentColor} borderBottom="3px solid black" />

            <Flex
                w={16}
                h={16}
                bg="white"
                color="black"
                border="3px solid black"
                boxShadow="brutal"
                align="center"
                justify="center"
                mx="auto"
                mt={4}
                mb={6}
            >
                <Icon as={icon} w={8} h={8} />
            </Flex>
            <Heading fontFamily="heading" color="black" fontSize={{base: "4xl", md: "5xl", lg: "6xl"}} fontWeight="900" mb={2}>
                {displayValue}
            </Heading>
            <Text fontFamily="accent" color="black" fontSize="sm" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                {item.label}
            </Text>
        </MotionBox>
    );
};

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <Skeleton key={i} height="250px" border="3px solid black" />
      ))}
    </SimpleGrid>
  );

  return (
    <Box py={24} bg="neo.warmWhite" className="bg-dot-grid" position="relative" overflow="hidden">
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          <Box textAlign="center" maxW="3xl" position="relative">
            <Box
              display="inline-block"
              bg="neo.yellow"
              border="2px solid black"
              px={4} py={1}
              mb={4}
              transform="rotate(-2deg)"
              boxShadow="brutal"
            >
                <Text fontFamily="accent" color="black" fontWeight="bold" letterSpacing="widest" fontSize="sm">
                  STATISTIK DESA
                </Text>
            </Box>

            <Box position="relative" display="inline-block">
                <Heading fontFamily="heading" color="black" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="900" mb={6} position="relative" zIndex={2}>
                    Ngawonggo Dalam Angka
                </Heading>
                <Box position="absolute" bottom="20px" left="-10px" right="-10px" h="15px" bg="neo.yellow" zIndex={1} opacity={0.6} />
            </Box>

            <Text color="black" fontSize="xl" fontWeight="500">
              Data statistik asli terintegrasi sistem untuk gambaran umum kependudukan dan geografis Desa Ngawonggo.
            </Text>
          </Box>

          <Box w="full" aria-live="polite" aria-busy={loading}>
            {loading ? renderSkeleton() : (
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8} w="full">
                {stats.map((item, index) => (
                    <StatCard key={item.id || index} item={item} index={index} icon={getIcon(item.icon)} />
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
