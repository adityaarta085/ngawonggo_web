import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,

  Image,
  VStack,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLanguage } from '../../../contexts/LanguageContext';

const QuickLinks = () => {
  const { language } = useLanguage();

  const visions = [
    {
      title: language === 'id' ? 'Konektivitas Digital' : 'Digital Connectivity',
      desc: language === 'id' ? 'Infrastruktur internet menjangkau seluruh pelosok dusun di Ngawonggo.' : 'Internet infrastructure reaching all corners of Ngawonggo hamlets.'
    },
    {
      title: language === 'id' ? 'Pertanian Modern' : 'Modern Agriculture',
      desc: language === 'id' ? 'Digitalisasi sektor hortikultura dan kopi untuk meningkatkan kesejahteraan petani.' : 'Digitalization of horticulture and coffee sectors to improve farmers prosperity.'
    },
    {
      title: language === 'id' ? 'Layanan 10 Menit' : '10-Minute Service',
      desc: language === 'id' ? 'Akses layanan administrasi desa yang cepat dan mudah dalam genggaman.' : 'Quick and easy access to village administrative services in your hands.'
    }
  ];

  return (
    <Box py={24} bg="white" _dark={{ bg: 'ikn.dark' }}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={16} align="center">
          <Box flex={1}>
            <VStack align="start" spacing={8}>
              <VStack align="start" spacing={4}>
                <Text color="brand.500" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" fontSize="sm">
                  {language === 'id' ? 'Visi Pembangunan' : 'Development Vision'}
                </Text>
                <Heading size="2xl" fontWeight="900" lineHeight="tight">
                  {language === 'id' ? 'Membangun Kemandirian & Era Digital 2045' : 'Building Independence & Digital Era 2045'}
                </Heading>
                <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }}>
                  {language === 'id'
                    ? 'Desa Ngawonggo berkomitmen untuk menjadi model desa digital yang mandiri, berdaya saing, dan tetap berpijak pada nilai-nilai budaya lokal.'
                    : 'Ngawonggo Village is committed to becoming a model for an independent, competitive digital village, while remaining rooted in local cultural values.'}
                </Text>
              </VStack>

              <VStack align="start" spacing={6} w="full">
                {visions.map((v, i) => (
                  <HStack key={i} spacing={4} align="start">
                    <Icon as={FaCheckCircle} color="brand.500" mt={1} />
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">{v.title}</Text>
                      <Text fontSize="sm" color="gray.500">{v.desc}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>

          <Box flex={1} position="relative" w="full">
            <Box position="relative" borderRadius="3xl" overflow="hidden" boxShadow="2xl" aspectRatio="4/3">
              <Image
                src="https://images.unsplash.com/photo-1596402184320-417d7178b2cd?auto=format&fit=crop&q=80&w=1200"
                alt="Vision Image"
                w="full"
                h="full"
                objectFit="cover"
                transition="transform 0.7s"
                _hover={{ transform: 'scale(1.1)' }}
              />
              <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.600, transparent)" />
              <Box position="absolute" bottom={6} left={6} color="white">
                <Text fontSize="xs" fontWeight="bold" opacity={0.8} textTransform="uppercase" letterSpacing="widest">
                  {language === 'id' ? 'Konsep Kawasan' : 'Area Concept'}
                </Text>
                <Text fontSize="xl" fontWeight="bold">Agrowisata Lereng Sumbing</Text>
              </Box>
            </Box>

            {/* Floating Stat Card */}
            <Box
              position="absolute"
              bottom="-8"
              left="-8"
              bg="white"
              _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
              p={6}
              borderRadius="xl"
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.100"
              maxW="200px"
              display={{ base: 'none', md: 'block' }}
            >
              <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" mb={2}>
                {language === 'id' ? 'Total Penduduk' : 'Total Population'}
              </Text>
              <Text fontSize="3xl" fontWeight="900">6.052</Text>
              <Text fontSize="xs" color="gray.500">
                {language === 'id' ? 'Jiwa (BPS 2024)' : 'Residents (BPS 2024)'}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default QuickLinks;
