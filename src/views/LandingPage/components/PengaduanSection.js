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
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);
const MotionButton = motion(Button);

const PengaduanSection = () => {
  const { language } = useLanguage();

  return (
    <Box py={20} bg="neo.warmWhite" id="pengaduan" position="relative" borderTop="4px solid black">
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: 'spring' }}
          bg="neo.coral"
          borderRadius="xl"
          border="4px solid black"
          boxShadow="6px 6px 0px black"
          p={{ base: 8, md: 16 }}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative background circle */}
          <Box
            position="absolute"
            top="-10%"
            right="-5%"
            w="300px"
            h="300px"
            border="4px dashed black"
            borderRadius="full"
            opacity={0.3}
            style={{ animation: 'spin-slow 20s linear infinite' }}
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
              <Box display="inline-block" bg="neo.yellow" border="2px solid black" px={4} py={2} w="fit-content" transform="rotate(-2deg)">
                <HStack>
                  <MotionIcon
                    as={FaBullhorn}
                    w={6} h={6}
                    color="black"
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <Text fontFamily="accent" fontWeight="900" textTransform="uppercase" letterSpacing="widest" fontSize="sm" color="black">
                    Layanan Pengaduan
                  </Text>
                </HStack>
              </Box>

              <Heading fontFamily="heading" as="h2" size="2xl" fontWeight="900" lineHeight="1.2" color="black" textTransform="uppercase">
                {language === 'id'
                  ? 'Sampaikan Aspirasi & Keluhan Anda'
                  : 'Submit Your Aspirations & Complaints'}
              </Heading>
              <Text fontFamily="body" fontSize="lg" color="black" fontWeight="bold">
                {language === 'id'
                  ? 'Pemerintah Desa Ngawonggo berkomitmen untuk selalu mendengarkan warga. Sampaikan pengaduan atau saran Anda melalui sistem pengaduan mandiri kami.'
                  : 'Ngawonggo Village Government is committed to listening to citizens. Submit your complaints or suggestions through our independent complaint system.'}
              </Text>
            </Stack>

            <MotionButton
              as={RouterLink}
              to="/layanan"
              size="xl"
              bg="black"
              color="neo.yellow"
              border="3px solid"
              borderColor="neo.yellow"
              px={10}
              py={8}
              fontSize="xl"
              fontWeight="900"
              fontFamily="heading"
              borderRadius="md"
              boxShadow="6px 6px 0px #FFE156"
              rightIcon={<FaArrowRight />}
              _hover={{
                bg: 'gray.900',
                transform: 'translate(-2px, -2px)',
                boxShadow: '8px 8px 0px #FFE156'
              }}
              _active={{
                transform: 'translate(2px, 2px)',
                boxShadow: '0px 0px 0px #FFE156',
              }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, -2, 2, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                repeatType: "reverse",
                repeatDelay: 2
              }}
            >
              {language === 'id' ? 'MULAI PENGADUAN' : 'START COMPLAINT'}
            </MotionButton>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default PengaduanSection;
