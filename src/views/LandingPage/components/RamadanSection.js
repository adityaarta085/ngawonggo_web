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
  Image,
  useColorModeValue,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button as ChakraButton,
  useTheme,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaMoon, FaMosque, FaClock } from 'react-icons/fa';
import { RiStarFill } from 'react-icons/ri';

const MotionBox = motion(Box);

const RamadanSection = () => {
  const [timings, setTimings] = useState(null);
  const [date, setDate] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [range, setRange] = useState(1);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const getFilteredData = () => {
    if (!calendarData.length) return [];
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const todayAladhan = `${dd}-${mm}-${yyyy}`;

    const startIndex = calendarData.findIndex(d => d.date.gregorian.date === todayAladhan);
    if (startIndex === -1) return calendarData.slice(0, range);

    return calendarData.slice(startIndex, startIndex + range);
  };


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
    setLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const fetchMonth = async (m, y) => {
        const resp = await fetch(`https://api.aladhan.com/v1/calendarByCity/${y}/${m}?city=Magelang&country=Indonesia&method=11`);
        const res = await resp.json();
        return res.data || [];
      };

      const currentMonthData = await fetchMonth(month, year);

      // Fetch next month too
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const nextMonthData = await fetchMonth(nextMonth, nextYear);

      const combinedData = [...currentMonthData, ...nextMonthData];
      setCalendarData(combinedData);

      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const todayAladhan = `${dd}-${mm}-${yyyy}`;

      const todayData = combinedData.find(d => d.date.gregorian.date === todayAladhan);
      if (todayData) {
        setTimings(todayData.timings);
        setDate(todayData.date);
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
          <Box w="full" mb={8} borderRadius="3xl" overflow="hidden" boxShadow="2xl" border="4px solid" borderColor={goldColor}>
            <Image
              src="https://files.catbox.moe/13u11o.png"
              alt="Ramadan Banner"
              w="100%"
              h={{ base: '180px', md: '350px' }}
              objectFit="cover"
            />
          </Box>

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
            <HStack spacing={2} mt={8} justify="center" flexWrap="wrap">
              {[1, 7, 14, 30].map((r) => (
                <ChakraButton
                  key={r}
                  size="sm"
                  onClick={() => setRange(r)}
                  variant={range === r ? 'solid' : 'outline'}
                  bg={range === r ? goldColor : 'transparent'}
                  color={range === r ? 'white' : goldColor}
                  borderColor={goldColor}
                  _hover={{ bg: range === r ? goldColor : 'rgba(197, 169, 111, 0.1)' }}
                  borderRadius="full"
                  px={6}
                >
                  {r === 1 ? 'Hari Ini' : `${r} Hari`}
                </ChakraButton>
              ))}
            </HStack>
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
            ) : range === 1 ? (
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
            ) : (
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color={goldColor}>Tanggal</Th>
                      <Th color={goldColor}>Imsyak</Th>
                      <Th color={goldColor}>Subuh</Th>
                      <Th color={goldColor}>Dzuhur</Th>
                      <Th color={goldColor}>Ashar</Th>
                      <Th color={goldColor} bg="rgba(197, 169, 111, 0.1)">Maghrib</Th>
                      <Th color={goldColor}>Isya</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getFilteredData().map((day, idx) => (
                      <Tr key={idx} _hover={{ bg: 'blackAlpha.50' }}>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="xs">{day.date.readable}</Text>
                            <Text fontSize="2xs" color="gray.500">{day.date.hijri.day} {day.date.hijri.month.en}</Text>
                          </VStack>
                        </Td>
                        <Td fontWeight="bold">{day.timings.Imsak.split(' ')[0]}</Td>
                        <Td>{day.timings.Fajr.split(' ')[0]}</Td>
                        <Td>{day.timings.Dhuhr.split(' ')[0]}</Td>
                        <Td>{day.timings.Asr.split(' ')[0]}</Td>
                        <Td fontWeight="bold" color={goldColor} bg="rgba(197, 169, 111, 0.05)">{day.timings.Maghrib.split(' ')[0]}</Td>
                        <Td>{day.timings.Isha.split(' ')[0]}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default RamadanSection;
