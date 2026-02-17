import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  useTheme,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaMoon, FaMosque, FaClock } from 'react-icons/fa';
import { RiStarFill } from 'react-icons/ri';

const MotionBox = motion(Box);

const RamadanSection = () => {
  const [timings, setTimings] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Colors based on project theme
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'rgba(15, 23, 42, 0.8)');
  const goldColor = theme.colors.ramadan.gold;
  const greenColor = theme.colors.ramadan.green;
  const headingColor = useColorModeValue(greenColor, goldColor);
  const infoBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Magelang&country=Indonesia&method=11');
      const json = await response.json();
      if (json.data) {
        setTimings(json.data.timings);
        setDate(json.data.date);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const PrayerItem = ({ label, time, isSpecial }) => (
    <VStack
      p={4}
      bg={isSpecial ? 'rgba(197, 169, 111, 0.1)' : 'transparent'}
      borderRadius="xl"
      border="1px solid"
      borderColor={isSpecial ? goldColor : 'transparent'}
      spacing={1}
      flex={1}
      minW="100px"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', bg: isSpecial ? 'rgba(197, 169, 111, 0.2)' : 'gray.50' }}
    >
      <Text fontSize="xs" fontWeight="bold" color={isSpecial ? goldColor : 'gray.500'} textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="black">
        {time}
      </Text>
    </VStack>
  );

  return (
    <Box py={20} bg={sectionBg} position="relative" overflow="hidden">
      {/* Decorative Elements */}
      <Box position="absolute" top={10} right={10} opacity={0.1} transform="rotate(20deg)">
        <Icon as={FaMoon} w={40} h={40} color={goldColor} />
      </Box>
      <Box position="absolute" bottom={-10} left={-10} opacity={0.1}>
        <Icon as={FaMosque} w={60} h={60} color={goldColor} />
      </Box>

      <Container maxW="container.xl">
        <VStack spacing={10}>
          <Box textAlign="center">
            <Badge
              bg={goldColor}
              color="white"
              mb={4}
              px={4}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              Ramadan 1447H
            </Badge>
            <Heading size="2xl" mb={4} color={headingColor}>
              Jadwal Sholat & Imsyakiyah
            </Heading>
            <Text fontSize="lg" color="gray.500" maxW="2xl" mx="auto">
               Khusus wilayah Kabupaten Magelang dan sekitarnya. Selamat menunaikan ibadah puasa Ramadan.
            </Text>
            {date && (
               <HStack justify="center" mt={4} spacing={4}>
                  <Text fontWeight="bold" color={goldColor}>{date.hijri.day} {date.hijri.month.en} {date.hijri.year} H</Text>
                  <Text color="gray.400">|</Text>
                  <Text fontWeight="semibold">{date.readable}</Text>
               </HStack>
            )}
          </Box>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            w="full"
            bg={cardBg}
            p={{ base: 6, md: 10 }}
            borderRadius="3xl"
            boxShadow="2xl"
            layerStyle="glassCard"
            border="2px solid"
            borderColor={goldColor}
            position="relative"
            zIndex={1}
          >
            {loading ? (
              <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} h="80px" borderRadius="xl" />)}
              </SimpleGrid>
            ) : (
              <VStack spacing={8}>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} w="full">
                  <PrayerItem label="Imsyak" time={timings.Imsak} isSpecial />
                  <PrayerItem label="Subuh" time={timings.Fajr} />
                  <PrayerItem label="Dzuhur" time={timings.Dhuhr} />
                  <PrayerItem label="Ashar" time={timings.Asr} />
                  <PrayerItem label="Maghrib" time={timings.Maghrib} isSpecial />
                  <PrayerItem label="Isya" time={timings.Isha} />
                </SimpleGrid>

                <Flex
                  w="full"
                  bg={infoBg}
                  p={6}
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  gap={{ base: 4, md: 8 }}
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                   <HStack>
                      <Icon as={FaClock} color={goldColor} />
                      <Text fontSize="sm" color="gray.500">Imsyak adalah 10 menit sebelum Subuh</Text>
                   </HStack>
                   <HStack>
                      <Icon as={RiStarFill} color={goldColor} />
                      <Text fontSize="sm" color="gray.500">Waktu Berbuka adalah saat Maghrib</Text>
                   </HStack>
                   <Text fontSize="xs" color="gray.400" fontStyle="italic">Sumber data: Aladhan API (Kemenag)</Text>
                </Flex>
              </VStack>
            )}
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default RamadanSection;
