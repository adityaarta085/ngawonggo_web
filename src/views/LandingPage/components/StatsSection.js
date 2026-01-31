
import { Box, Container, SimpleGrid, Text, Heading, Icon, VStack } from '@chakra-ui/react';
import { FaUsers, FaMapMarkedAlt, FaSeedling, FaMountain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const MotionBox = motion(Box);

const StatsSection = () => {
  const { language } = useLanguage();

  const stats = [
    {
      label: language === 'id' ? 'Penduduk' : 'Residents',
      value: '6.052',
      icon: FaUsers,
      color: 'blue.500',
    },
    {
      label: language === 'id' ? 'Luas Wilayah' : 'Area Size',
      value: '5,34 km²',
      icon: FaMapMarkedAlt,
      color: 'green.500',
    },
    {
      label: language === 'id' ? 'Ketinggian' : 'Altitude',
      value: '1.200 mdpl',
      icon: FaMountain,
      color: 'orange.500',
    },
    {
      label: language === 'id' ? 'Produksi Kopi' : 'Coffee Production',
      value: '12 Ton/Thn',
      icon: FaSeedling,
      color: 'red.500',
    },
  ];

  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
          {stats.map((stat, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              textAlign="center"
            >
              <VStack spacing={3}>
                <Icon as={stat.icon} w={10} h={10} color={stat.color} />
                <Heading size="xl" fontWeight="800">
                  {stat.value}
                </Heading>
                <Text color="gray.600" fontWeight="600" textTransform="uppercase" fontSize="xs" letterSpacing="widest">
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
