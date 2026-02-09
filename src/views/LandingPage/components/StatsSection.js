import React, { useEffect, useState } from 'react';
import { Box, Container, SimpleGrid, Text, Heading, Icon, VStack, Flex } from '@chakra-ui/react';
import { FaTree, FaMicrochip, FaUniversity } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const VisionCard = ({ icon, title, description, color, number, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    bg="white"
    _dark={{ bg: 'gray.800' }}
    p={8}
    borderRadius="2xl"
    boxShadow="2xl"
    borderTop="4px solid"
    borderColor={color}
    position="relative"
    overflow="hidden"
    role="group"
    _hover={{ transform: 'translateY(-10px)' }}
  >
    <Flex justify="space-between" align="start" mb={6}>
      <Box p={3} bg={`${color.split('.')[0]}.50`} _dark={{ bg: `${color.split('.')[0]}.900/30` }} borderRadius="xl">
        <Icon as={icon} w={10} h={10} color={color} />
      </Box>
      <Text
        position="absolute"
        top={4}
        right={4}
        fontSize="6xl"
        fontWeight="900"
        color={`${color.split('.')[0]}.500`}
        opacity={0.1}
        userSelect="none"
        _groupHover={{ opacity: 0.2 }}
        transition="opacity 0.3s"
      >
        {number}
      </Text>
    </Flex>
    <Heading size="md" mb={3} _groupHover={{ color: color }} transition="color 0.3s">
      {title}
    </Heading>
    <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" lineHeight="relaxed">
      {description}
    </Text>
  </MotionBox>
);

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

  const visions = [
    {
      icon: FaTree,
      title: language === 'id' ? 'Potensi Alam' : 'Natural Potential',
      description: language === 'id' ? 'Memanfaatkan kekayaan alam Lereng Sumbing untuk kemakmuran masyarakat desa.' : 'Leveraging the natural wealth of Mount Sumbing slopes for village prosperity.',
      color: 'emerald.500',
      number: '01'
    },
    {
      icon: FaMicrochip,
      title: language === 'id' ? 'Desa Cerdas' : 'Smart Village',
      description: language === 'id' ? 'Integrasi teknologi informasi dalam tata kelola pemerintahan dan pelayanan publik.' : 'Integration of information technology in governance and public services.',
      color: 'brand.500',
      number: '02'
    },
    {
      icon: FaUniversity,
      title: language === 'id' ? 'Budaya Lokal' : 'Local Culture',
      description: language === 'id' ? 'Melestarikan warisan budaya dan tradisi sebagai identitas luhur Desa Ngawonggo.' : 'Preserving cultural heritage and traditions as the noble identity of Ngawonggo.',
      color: 'ikn.gold',
      number: '03'
    }
  ];

  return (
    <Box position="relative" zIndex={10} mt="-80px" pb={20}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={20}>
          {visions.map((vision, index) => (
            <VisionCard key={index} {...vision} delay={index * 0.1} />
          ))}
        </SimpleGrid>

        {/* Traditional Stats Display */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {stats.map((stat, index) => (
            <MotionBox
              key={stat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              textAlign="center"
            >
              <VStack spacing={2}>
                <Heading size="xl" fontWeight="900" color="brand.500">
                  {stat.value}
                </Heading>
                <Text color="gray.500" fontWeight="700" textTransform="uppercase" fontSize="xs" letterSpacing="widest">
                  {stat.label}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default StatsSection;
