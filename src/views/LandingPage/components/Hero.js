
import { Box, Container, Heading, Text, Button, Stack, useBreakpointValue, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';
import { FaLeaf, FaCity, FaFlag } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionStack = motion(Stack);

const highlights = [
  {
    icon: FaLeaf,
    titleId: 'Hijau & Berkelanjutan',
    titleEn: 'Green & Sustainable',
    descriptionId: 'Ruang terbuka hijau menjadi prioritas utama pembangunan.',
    descriptionEn: 'Open green spaces are a top development priority.',
    color: 'green.500',
  },
  {
    icon: FaCity,
    titleId: 'Pelayanan Modern',
    titleEn: 'Modern Services',
    descriptionId: 'Layanan publik yang cepat, mudah, dan berbasis digital.',
    descriptionEn: 'Fast, convenient, and digital public services.',
    color: 'brand.500',
  },
  {
    icon: FaFlag,
    titleId: 'Identitas Daerah',
    titleEn: 'Regional Identity',
    descriptionId: 'Menjaga nilai budaya lokal sambil melangkah ke masa depan.',
    descriptionEn: 'Preserving local culture while moving toward the future.',
    color: 'yellow.500',
  },
];

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box
      position="relative"
      minH={{ base: 'auto', md: '100vh' }}
      overflow="hidden"
      bg="gray.50"
      pt={{ base: 24, md: 32 }}
      pb={{ base: 16, md: 24 }}
    >
      <Box
        position="absolute"
        inset={0}
        bgImage="linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.75)), url('https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1600&q=80')"
        bgPos="center"
        bgSize="cover"
      />

      <Container maxW="container.xl" zIndex={1} position="relative">
        <Stack spacing={8} maxW="4xl" mx="auto" textAlign="center" align="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            px={4}
            py={2}
            borderRadius="full"
            bg="whiteAlpha.300"
            border="1px solid"
            borderColor="whiteAlpha.500"
          >
            <Text color="white" fontWeight="700" fontSize="xs" letterSpacing="widest" textTransform="uppercase">
              {language === 'id' ? 'Portal Resmi Desa Ngawonggo' : 'Official Ngawonggo Village Portal'}
            </Text>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={useBreakpointValue({ base: '4xl', md: '6xl', lg: '7xl' })}
            color="white"
            lineHeight="1.1"
            textShadow="0 8px 25px rgba(0,0,0,0.35)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.title}
          </MotionHeading>

          <MotionText
            fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}
            color="whiteAlpha.900"
            maxW="2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.subtitle}
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              as={RouterLink}
              to="/profil"
              size="lg"
              colorScheme="brand"
              px={8}
              height="56px"
              fontSize="md"
            >
              {t.cta}
            </Button>
            <Button
              as={RouterLink}
              to="/media"
              size="lg"
              variant="outline"
              color="white"
              borderColor="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.200' }}
              px={8}
              height="56px"
              fontSize="md"
            >
              {language === 'id' ? 'Lihat Video' : 'Watch Video'}
            </Button>
          </MotionStack>
        </Stack>

        <Box mt={{ base: 14, md: 20 }}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            {highlights.map((item, index) => (
              <MotionBox
                key={item.titleId}
                flex="1"
                p={6}
                bg="white"
                borderRadius="2xl"
                borderTop="4px solid"
                borderColor={item.color}
                boxShadow="0 15px 35px rgba(15,23,42,0.12)"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <HStack spacing={4} align="start">
                  <Box p={3} borderRadius="xl" bg={`${item.color.split('.')[0]}.50`}>
                    <Icon as={item.icon} boxSize={6} color={item.color} />
                  </Box>
                  <Box>
                    <Text fontWeight="800" color="gray.900" mb={1}>
                      {language === 'id' ? item.titleId : item.titleEn}
                    </Text>
                    <Text color="gray.600" fontSize="sm">
                      {language === 'id' ? item.descriptionId : item.descriptionEn}
                    </Text>
                  </Box>
                </HStack>
              </MotionBox>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
