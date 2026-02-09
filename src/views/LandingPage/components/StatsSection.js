import React from 'react';
import { Box, Container, SimpleGrid, Text, Heading, Icon, VStack, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaSeedling, FaLaptopCode, FaLandmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const MotionBox = motion(Box);

const VisionCard = ({ icon, title, description, number, color, delay }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      bg={cardBg}
      p={8}
      borderRadius="2xl"
      boxShadow="xl"
      borderTop="4px solid"
      borderTopColor={`${color}.500`}
      position="relative"
      overflow="hidden"
      _hover={{ transform: 'translateY(-10px)' }}
    >
      <Text
        position="absolute"
        top={4}
        right={4}
        fontSize="6xl"
        fontWeight="900"
        color={`${color}.500`}
        opacity={0.1}
        userSelect="none"
      >
        {number}
      </Text>

      <VStack align="start" spacing={6}>
        <Flex
          p={3}
          bg={`${color}.50`}
          borderRadius="xl"
          color={`${color}.600`}
        >
          <Icon as={icon} boxSize={8} />
        </Flex>

        <Box>
          <Heading size="md" mb={2}>{title}</Heading>
          <Text color="gray.600" fontSize="sm" lineHeight="relaxed">
            {description}
          </Text>
        </Box>
      </VStack>
    </MotionBox>
  );
};

const StatsSection = () => {
  const { language } = useLanguage();

  const visions = [
    {
      icon: FaSeedling,
      title: language === 'id' ? 'Desa Mandiri' : 'Self-Sufficient Village',
      description: language === 'id'
        ? 'Mengoptimalkan potensi lokal dan sumber daya alam untuk kemandirian ekonomi masyarakat Ngawonggo.'
        : 'Optimizing local potential and natural resources for Ngawonggo community economic independence.',
      number: '01',
      color: 'green',
    },
    {
      icon: FaLaptopCode,
      title: language === 'id' ? 'Desa Digital' : 'Digital Village',
      description: language === 'id'
        ? 'Integrasi teknologi informasi dalam tata kelola pemerintahan dan pelayanan publik yang efisien dan transparan.'
        : 'Information technology integration in governance and efficient, transparent public services.',
      number: '02',
      color: 'blue',
    },
    {
      icon: FaLandmark,
      title: language === 'id' ? 'Kearifan Lokal' : 'Local Wisdom',
      description: language === 'id'
        ? 'Melestarikan budaya, tradisi, dan nilai-nilai luhur sebagai identitas sejati masyarakat Desa Ngawonggo.'
        : 'Preserving culture, traditions, and noble values as the true identity of Ngawonggo Village people.',
      number: '03',
      color: 'orange',
    },
  ];

  return (
    <Box position="relative" zIndex={10} mt="-80px" pb={20}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {visions.map((vision, index) => (
            <VisionCard key={index} {...vision} delay={index * 0.1} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default StatsSection;
