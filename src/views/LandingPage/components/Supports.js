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
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { GoogleMap } from '../../../components';

const Supports = () => {
  const [govLinks, setGovLinks] = useState([]);
  const [publicServices, setPublicServices] = useState([]);
  const [securityServices, setSecurityServices] = useState([]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('white', 'gray.700');
  const imageFilter = useColorModeValue('none', 'brightness(0.9)');

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
    <Box py={24} bg={sectionBg} id="supports">
      <Container maxW="container.xl">
        <VStack spacing={24}>
          {/* Government Links */}
          <VStack spacing={12} w="full">
            <Box textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="brand.500"
                textTransform="uppercase"
                letterSpacing="widest"
                mb={2}
              >
                Konektivitas
              </Text>
              <Heading as="h2" size="xl" fontWeight="800">
                Instansi Terkait
              </Heading>
              <Text color="gray.500" mt={2}>Akses cepat layanan publik Kabupaten Magelang.</Text>
            </Box>
            <Flex gap={8} justify="center" wrap="wrap" w="full">
              {govLinks.map((e) => (
                <Link key={e.id} href={e.website_url} isExternal _hover={{ textDecoration: 'none' }}>
                  <Box
                    layerStyle="glassCard"
                    w={{ base: "140px", md: "200px" }}
                    h="120px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={4}
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{
                      transform: 'translateY(-10px)',
                      boxShadow: '2xl',
                      borderColor: 'brand.400',
                      bg: hoverBg
                    }}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor="transparent"
                  >
                    <Image
                      src={e.image}
                      alt={e.title}
                      maxH="50px"
                      maxW="80%"
                      mb={3}
                      filter={imageFilter}
                    />
                    <Text fontSize="xs" fontWeight="800" textAlign="center" color="gray.600" noOfLines={2}>
                      {e.title}
                    </Text>
                  </Box>
                </Link>
              ))}
            </Flex>
          </VStack>

          {/* Security Services */}
          <VStack spacing={12} w="full">
            <Box textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="red.500"
                textTransform="uppercase"
                letterSpacing="widest"
                mb={2}
              >
                Tanggap & Siaga
              </Text>
              <Heading as="h2" size="xl" fontWeight="800">
                Layanan Keamanan
              </Heading>
              <Text color="gray.500" mt={2}>Layanan darurat dan keamanan di sekitar Ngawonggo.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
              {securityServices.map((e) => (
                <Box
                  key={e.id}
                  layerStyle="glassCard"
                  p={0}
                  bg={cardBg}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
                >
                  <Box p={6}>
                    <Flex w="full" justify="space-between" align="center" mb={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg="red.50" borderRadius="lg">
                          <Image src={e.image} alt={e.title} h="32px" w="32px" objectFit="contain" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Heading size="sm">{e.title}</Heading>
                          <Text fontSize="xs" color="red.500" fontWeight="bold" textTransform="uppercase">
                            {e.category}
                          </Text>
                        </VStack>
                      </HStack>
                      {e.website_url && (
                        <Link href={e.website_url} isExternal>
                          <Icon as={FaExternalLinkAlt} color="gray.400" _hover={{ color: 'brand.500' }} />
                        </Link>
                      )}
                    </Flex>
                    {e.address && (
                      <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                        {e.address}
                      </Text>
                    )}
                  </Box>
                  <Box w="full" h="200px">
                    <GoogleMap src={e.location_url} height="100%" />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Public Services */}
          <VStack spacing={12} w="full">
            <Box textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="blue.500"
                textTransform="uppercase"
                letterSpacing="widest"
                mb={2}
              >
                Fasilitas Publik
              </Text>
              <Heading as="h2" size="xl" fontWeight="800">
                Pelayanan Publik
              </Heading>
              <Text color="gray.500" mt={2}>Infrastruktur dan sarana pendukung kenyamanan warga.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
              {publicServices.map((e) => (
                <Box
                  key={e.id}
                  layerStyle="glassCard"
                  p={0}
                  bg={cardBg}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
                >
                  <Box p={6}>
                    <Flex w="full" justify="space-between" align="center" mb={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg="blue.50" borderRadius="lg">
                          <Image src={e.image} alt={e.title} h="32px" w="32px" objectFit="contain" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Heading size="sm">{e.title}</Heading>
                          <Text fontSize="xs" color="blue.500" fontWeight="bold" textTransform="uppercase">
                            {e.category}
                          </Text>
                        </VStack>
                      </HStack>
                      {e.website_url && (
                        <Link href={e.website_url} isExternal>
                          <Icon as={FaExternalLinkAlt} color="gray.400" _hover={{ color: 'brand.500' }} />
                        </Link>
                      )}
                    </Flex>
                    {e.address && (
                      <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                        {e.address}
                      </Text>
                    )}
                  </Box>
                  <Box w="full" h="200px">
                    <GoogleMap src={e.location_url} height="100%" />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Supports;
