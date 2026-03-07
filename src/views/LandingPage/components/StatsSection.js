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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUsers, FaMapMarkedAlt, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const StatsSection = () => {
  const [stats, setStats] = useState({
    population: 0,
    area: 0,
    workers: 0,
    students: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*');
      if (data && !error) {
        const mapped = data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        setStats({
          population: mapped.population || 4250,
          area: mapped.area || 12.5,
          workers: mapped.workers || 1850,
          students: mapped.students || 950
        });
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: 'Total Penduduk', value: stats.population, icon: FaUsers, color: 'blue', suffix: ' Jiwa' },
    { label: 'Luas Wilayah', value: stats.area, icon: FaMapMarkedAlt, color: 'green', suffix: ' km²' },
    { label: 'Tenaga Kerja', value: stats.workers, icon: FaBriefcase, color: 'orange', suffix: ' Orang' },
    { label: 'Pelajar/Mahasiswa', value: stats.students, icon: FaGraduationCap, color: 'purple', suffix: ' Orang' },
  ];

  return (
    <Box py={24} bg="brand.900" bgGradient="linear(to-b, brand.900, #0F172A)" position="relative" overflow="hidden">
      {/* Decorative Circles */}
      <Box position="absolute" top="-100px" right="-100px" w="400px" h="400px" bg="brand.500" opacity={0.05} borderRadius="full" filter="blur(80px)" />
      <Box position="absolute" bottom="-100px" left="-100px" w="300px" h="300px" bg="teal.500" opacity={0.05} borderRadius="full" filter="blur(60px)" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          <Box textAlign="center" maxW="3xl">
            <Text color="brand.400" fontWeight="800" letterSpacing="widest" fontSize="xs" mb={3}>
              STATISTIK DESA
            </Text>
            <Heading color="white" size="2xl" fontWeight="900" mb={6}>
              Ngawonggo Dalam Angka
            </Heading>
            <Text color="whiteAlpha.700" fontSize="xl" fontWeight="500">
              Gambaran umum kependudukan dan geografis Desa Ngawonggo yang terus berkembang menuju kemandirian digital.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="full">
            {statItems.map((item, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                bg="rgba(255, 255, 255, 0.03)"
                p={10}
                borderRadius="3xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                textAlign="center"
                backdropFilter="blur(10px)"
                _hover={{
                    bg: "rgba(255, 255, 255, 0.07)",
                    borderColor: "whiteAlpha.300",
                    transform: "translateY(-10px)"
                }}
              >
                <Flex
                  w={16}
                  h={16}
                  bg={`${item.color}.500`}
                  color="white"
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  mx="auto"
                  mb={8}
                  boxShadow="xl"
                >
                  <Icon as={item.icon} w={8} h={8} />
                </Flex>
                <Heading color="white" size="xl" fontWeight="900" mb={2}>
                  {item.value.toLocaleString('id-ID')}
                  <Text as="span" fontSize="lg" fontWeight="700" color="whiteAlpha.600">
                    {item.suffix}
                  </Text>
                </Heading>
                <Text color="whiteAlpha.600" fontSize="md" fontWeight="800" letterSpacing="wider" textTransform="uppercase">
                  {item.label}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default StatsSection;
