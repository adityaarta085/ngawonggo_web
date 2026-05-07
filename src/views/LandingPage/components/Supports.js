import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  Heading,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { GoogleMap } from '../../../components';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BRUTAL_COLORS = [
    'neo.yellow', 'neo.coral', 'neo.teal', 'brutal.purple', 'brutal.orange', 'brutal.green'
];

const Supports = () => {
  const [govLinks, setGovLinks] = useState([]);
  const [publicServices, setPublicServices] = useState([]);
  const [securityServices, setSecurityServices] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: true });
      if (!error && data) {
        setGovLinks(data.filter(i => i.category === 'pemerintah'));
        setSecurityServices(data.filter(i => i.category === 'keamanan'));
        setPublicServices(data.filter(i => i.category === 'layanan'));
      }
    };
    fetchInstitutions();
  }, []);

  return (
    <Box py={24} bg="neo.warmWhite" className="bg-dot-grid" id="supports" borderTop="4px solid black">
      <Container maxW="container.xl">
        <VStack spacing={24}>
          {/* Government Links */}
          <VStack spacing={12} w="full">
            <Box textAlign="center" position="relative">
              <Box position="relative" display="inline-block">
                  <Heading fontFamily="heading" color="black" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" mb={4} position="relative" zIndex={2}>
                      Instansi Terkait
                  </Heading>
                  <Box position="absolute" bottom="5px" left="-5px" right="-5px" h="12px" bg="neo.yellow" zIndex={1} />
              </Box>
              <Text fontFamily="accent" fontWeight="bold" letterSpacing="widest" color="black" textTransform="uppercase">Konektivitas</Text>
            </Box>

            <Flex gap={8} justify="center" wrap="wrap" w="full">
              {govLinks.map((e, index) => {
                const accentColor = BRUTAL_COLORS[index % BRUTAL_COLORS.length];
                return (
                <Link key={e.id} href={e.website_url} isExternal _hover={{ textDecoration: 'none' }}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    w={{ base: "140px", md: "200px" }}
                    minH="120px" h="auto"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={4}
                    bg="white"
                    border="3px solid black"
                    boxShadow="3px 3px 0px black"
                    position="relative"
                    _hover={{
                      transform: 'translate(-4px, -4px)',
                      boxShadow: `6px 6px 0px ${accentColor}`,
                      borderColor: 'black'
                    }}
                  >
                    {/* Pin effect */}
                    <Box position="absolute" top={2} right={2} w="8px" h="8px" borderRadius="full" bg={accentColor} border="1px solid black" />

                    <Image
                      src={e.image}
                      alt={e.title}
                      maxH="50px"
                      maxW="80%"
                      mb={3}
                    />
                    <Text fontFamily="accent" fontSize="xs" fontWeight="900" textAlign="center" color="black" textTransform="uppercase">
                      {e.title}
                    </Text>
                  </MotionBox>
                </Link>
              )})}
            </Flex>
          </VStack>

          {/* Security Services */}
          <VStack spacing={12} w="full">
            <Box textAlign="center" position="relative">
              <Box position="relative" display="inline-block">
                  <Heading fontFamily="heading" color="black" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" mb={4} position="relative" zIndex={2}>
                      Layanan Keamanan
                  </Heading>
                  <Box position="absolute" bottom="5px" left="-5px" right="-5px" h="12px" bg="neo.coral" zIndex={1} opacity={0.6} />
              </Box>
              <Box mt={2}>
                <Text display="inline-block" bg="neo.coral" color="white" px={3} py={1} border="2px solid black" fontFamily="accent" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" fontSize="xs">
                  Tanggap & Siaga
                </Text>
              </Box>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
              {securityServices.map((e, index) => (
                <MotionBox
                  key={e.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg="white"
                  border="3px solid black"
                  boxShadow="4px 4px 0px #FF6B6B"
                  overflow="hidden"
                  _hover={{ transform: 'translate(-4px, -4px)', boxShadow: '8px 8px 0px #FF6B6B' }}
                >
                  <Box p={6}>
                    <Flex w="full" justify="space-between" align="center" mb={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg="neo.coral" border="2px solid black" borderRadius="none">
                          <Image src={e.image} alt={e.title} h="32px" w="32px" objectFit="contain" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Heading fontFamily="heading" size="md" color="black" textTransform="uppercase">{e.title}</Heading>
                          <Box bg="black" color="white" px={2} mt={1}>
                            <Text fontFamily="accent" fontSize="10px" fontWeight="bold" textTransform="uppercase">
                              {e.category}
                            </Text>
                          </Box>
                        </VStack>
                      </HStack>
                      {e.website_url && (
                        <Link href={e.website_url} isExternal>
                          <Icon as={FaExternalLinkAlt} color="black" w={5} h={5} _hover={{ transform: 'scale(1.2)' }} transition="all 0.2s" />
                        </Link>
                      )}
                    </Flex>
                    {e.address && (
                      <Text fontFamily="body" fontSize="sm" color="black" fontWeight="bold" mb={4} >
                        {e.address}
                      </Text>
                    )}
                  </Box>
                  <Box w="full" h="200px" borderTop="4px solid black">
                    <GoogleMap src={e.location_url} height="100%" />
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Public Services */}
          <VStack spacing={12} w="full">
            <Box textAlign="center" position="relative">
              <Box position="relative" display="inline-block">
                  <Heading fontFamily="heading" color="black" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" mb={4} position="relative" zIndex={2}>
                      Pelayanan Publik
                  </Heading>
                  <Box position="absolute" bottom="5px" left="-5px" right="-5px" h="12px" bg="neo.teal" zIndex={1} opacity={0.6} />
              </Box>
              <Box mt={2}>
                <Text display="inline-block" bg="neo.teal" color="black" px={3} py={1} border="2px solid black" fontFamily="accent" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" fontSize="xs">
                  Fasilitas Publik
                </Text>
              </Box>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
              {publicServices.map((e, index) => (
                <MotionBox
                  key={e.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg="white"
                  border="3px solid black"
                  boxShadow="4px 4px 0px #4ECDC4"
                  overflow="hidden"
                  _hover={{ transform: 'translate(-4px, -4px)', boxShadow: '8px 8px 0px #4ECDC4' }}
                >
                  <Box p={6}>
                    <Flex w="full" justify="space-between" align="center" mb={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg="neo.teal" border="2px solid black" borderRadius="none">
                          <Image src={e.image} alt={e.title} h="32px" w="32px" objectFit="contain" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Heading fontFamily="heading" size="md" color="black" textTransform="uppercase">{e.title}</Heading>
                          <Box bg="black" color="white" px={2} mt={1}>
                            <Text fontFamily="accent" fontSize="10px" fontWeight="bold" textTransform="uppercase">
                              {e.category}
                            </Text>
                          </Box>
                        </VStack>
                      </HStack>
                      {e.website_url && (
                        <Link href={e.website_url} isExternal>
                          <Icon as={FaExternalLinkAlt} color="black" w={5} h={5} _hover={{ transform: 'scale(1.2)' }} transition="all 0.2s" />
                        </Link>
                      )}
                    </Flex>
                    {e.address && (
                      <Text fontFamily="body" fontSize="sm" color="black" fontWeight="bold" mb={4} >
                        {e.address}
                      </Text>
                    )}
                  </Box>
                  <Box w="full" h="200px" borderTop="4px solid black">
                    <GoogleMap src={e.location_url} height="100%" />
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Supports;
