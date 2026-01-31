import React, { useEffect, useState } from 'react';
import { Box, Container, SimpleGrid, Text, Heading, Icon, VStack } from '@chakra-ui/react';
import { FaUsers, FaMapMarkedAlt, FaSeedling, FaMountain, FaMars, FaVenus, FaMap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const iconMap = {
  FaUsers,
  FaMapMarkedAlt,
  FaSeedling,
  FaMountain,
  FaMars,
  FaVenus,
  FaMap,
};

const StatsSection = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*').order('id', { ascending: true });
      if (!error && data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {stats.length > 0 ? stats.map((stat, index) => (
            <MotionBox
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              textAlign="center"
            >
              <VStack spacing={3}>
                <Icon as={iconMap[stat.icon] || FaUsers} w={10} h={10} color={stat.color} />
                <Heading size="xl" fontWeight="800">
                  {stat.value}
                </Heading>
                <Text color="gray.600" fontWeight="600" textTransform="uppercase" fontSize="xs" letterSpacing="widest">
                  {stat.label}
                </Text>
              </VStack>
            </MotionBox>
          )) : (
            <Text>Loading stats...</Text>
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default StatsSection;
