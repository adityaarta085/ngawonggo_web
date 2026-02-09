import React, { useEffect, useState } from 'react';
import { Box, Container, Stack, Flex, Heading, Text, Icon, Image, useColorModeValue, VStack } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';

const MotionBox = motion(Box);

const VisionSection = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('village_stats').select('*');
      if (!error && data) setStats(data);
    };
    fetchStats();
  }, []);

  const features = [
    {
      title: language === 'id' ? 'Konektivitas Digital' : 'Digital Connectivity',
      desc: language === 'id' ? 'Akses internet cepat merata di seluruh wilayah dusun untuk mendukung ekonomi kreatif.' : 'Fast internet access throughout the hamlet areas to support the creative economy.',
    },
    {
      title: language === 'id' ? 'Pelayanan Publik 24/7' : '24/7 Public Service',
      desc: language === 'id' ? 'Administrasi desa dapat diakses secara mandiri melalui aplikasi dan portal web.' : 'Village administration can be accessed independently through applications and web portals.',
    },
    {
      title: language === 'id' ? 'Pertanian Presisi' : 'Precision Agriculture',
      desc: language === 'id' ? 'Pemanfaatan teknologi IoT untuk meningkatkan hasil kopi dan hortikultura lokal.' : 'Utilization of IoT technology to increase local coffee and horticulture yields.',
    },
  ];

  return (
    <Box py={24} bg={useColorModeValue('white', 'gray.900')}>
      <Container maxW="container.xl">
        <Stack direction={{ base: 'column', lg: 'row' }} spacing={20} align="center">
          {/* Left Content */}
          <Box flex={1}>
            <VStack align="start" spacing={10}>
              <Box>
                <Text
                  color="brand.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  fontSize="sm"
                  mb={4}
                >
                  {language === 'id' ? 'Visi Pembangunan' : 'Development Vision'}
                </Text>
                <Heading size="2xl" mb={8} lineHeight="1.2">
                  {language === 'id' ? 'Transformasi Digital & Desa Mandiri' : 'Digital Transformation & Self-Sufficient Village'}
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  {language === 'id'
                    ? 'Desa Ngawonggo bertransformasi menjadi pusat inovasi digital di lereng Sumbing, mengintegrasikan kearifan lokal dengan efisiensi teknologi untuk kesejahteraan seluruh warga.'
                    : 'Ngawonggo Village is transforming into a digital innovation center on the slopes of Sumbing, integrating local wisdom with technological efficiency for the welfare of all residents.'}
                </Text>
              </Box>

              <VStack align="start" spacing={8} w="100%">
                {features.map((feature, index) => (
                  <Flex key={index} gap={5}>
                    <Icon as={FaCheckCircle} color="brand.500" mt={1} boxSize={5} />
                    <Box>
                      <Heading size="md" mb={2}>{feature.title}</Heading>
                      <Text fontSize="sm" color="gray.500" lineHeight="relaxed">{feature.desc}</Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* Right Content */}
          <Box flex={1} position="relative">
            <MotionBox
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
              position="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Village Vision"
                w="100%"
                h="550px"
                objectFit="cover"
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-t, blackAlpha.800, transparent)"
              />
              <Box position="absolute" bottom={10} left={10} color="white">
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.8} mb={2} letterSpacing="wider">
                  {language === 'id' ? 'Potensi Desa' : 'Village Potential'}
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {language === 'id' ? 'Pertanian Hortikultura & Kopi' : 'Horticulture & Coffee Farming'}
                </Text>
              </Box>
            </MotionBox>

            {/* Floating Stat Card */}
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              position="absolute"
              bottom="-30px"
              left="-30px"
              bg={useColorModeValue('white', 'gray.800')}
              p={8}
              borderRadius="2xl"
              boxShadow="2xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
              display={{ base: 'none', md: 'block' }}
              minW="220px"
            >
              <VStack align="start" spacing={2}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest">
                  {language === 'id' ? 'Luas Wilayah' : 'Area Size'}
                </Text>
                <Heading size="2xl">5.34</Heading>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  KM² (BPS 2024)
                </Text>
              </VStack>
            </MotionBox>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default VisionSection;
