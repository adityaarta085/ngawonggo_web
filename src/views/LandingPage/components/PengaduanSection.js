
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Icon,

} from '@chakra-ui/react';
import { FaBullhorn, FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const PengaduanSection = () => {
  const { language } = useLanguage();

  return (
    <Box py={20} bg="transparent" id="pengaduan">
      <Container maxW="container.xl">
        <Box
          bg="rgba(19, 127, 236, 0.8)" backdropFilter="blur(20px)" border="1px solid" borderColor="whiteAlpha.300"
          borderRadius="3xl"
          p={{ base: 8, md: 16 }}
          color="white"
          position="relative"
          overflow="hidden"
          boxShadow="2xl"
        >
          {/* Decorative background circle */}
          <Box
            position="absolute"
            top="-10%"
            right="-5%"
            w="300px"
            h="300px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />

          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align="center"
            justify="space-between"
            position="relative"
            zIndex={1}
          >
            <Stack spacing={6} maxW={{ base: 'full', md: '60%' }}>
              <HStack>
                <Icon as={FaBullhorn} w={8} h={8} />
                <Text fontWeight="800" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
                  Layanan Pengaduan
                </Text>
              </HStack>
              <Heading as="h2" size="2xl" fontWeight="800" lineHeight="1.2">
                {language === 'id'
                  ? 'Sampaikan Aspirasi & Keluhan Anda'
                  : 'Submit Your Aspirations & Complaints'}
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                {language === 'id'
                  ? 'Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga. Sampaikan pengaduan atau saran Anda melalui sistem pengaduan mandiri kami.'
                  : 'Ngawonggo Village Government is committed to listening to citizens. Submit your complaints or suggestions through our independent complaint system.'}
              </Text>
            </Stack>

            <Button
              as={RouterLink}
              to="/layanan"
              size="lg"
              bg="white"
              color="brand.500"
              px={10}
              py={8}
              fontSize="xl"
              fontWeight="bold"
              borderRadius="2xl"
              _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
              rightIcon={<FaArrowRight />}
            >
              {language === 'id' ? 'Mulai Pengaduan' : 'Start Complaint'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PengaduanSection;
