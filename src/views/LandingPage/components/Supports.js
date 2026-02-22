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

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchInstitutions = async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: true });
      if (!error && data) {
        setGovLinks(data.filter(i => i.category === 'pemerintah'));
        setPublicServices(data.filter(i => i.category !== 'pemerintah'));
      }
    };
    fetchInstitutions();
  }, []);

  return (
    <Box py={24} bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={20}>
          {/* Government Links */}
          <VStack spacing={10} w="full">
            <Box textAlign="center">
              <Text fontSize="sm" fontWeight="bold" color="brand.500" textTransform="uppercase" letterSpacing="widest" mb={2}>
                Konektivitas
              </Text>
              <Heading as="h2" size="xl" fontWeight="800">
                Instansi Terkait
              </Heading>
            </Box>
            <Flex gap={6} justify="center" wrap="wrap">
              {govLinks.map((e) => (
                <Link key={e.id} href={e.website_url} isExternal _hover={{ textDecoration: 'none' }}>
                  <Box
                    layerStyle="glassCard"
                    w={{ base: "140px", md: "180px" }}
                    h="100px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={4}
                    transition="all 0.3s"
                    _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', borderColor: 'brand.200' }}
                    bg={cardBg}
                  >
                    <Image src={e.image} alt={e.title} maxH="50px" mb={2} />
                    <Text fontSize="xs" fontWeight="bold" textAlign="center" color="gray.600" noOfLines={1}>{e.title}</Text>
                  </Box>
                </Link>
              ))}
            </Flex>
          </VStack>

          {/* Security & Public Services */}
          <VStack spacing={10} w="full">
            <Box textAlign="center">
              <Heading as="h2" size="xl" fontWeight="800">
                Keamanan & Pelayanan Publik
              </Heading>
              <Text color="gray.500" mt={2}>Layanan di sekitar Ngawonggo untuk kenyamanan warga.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {publicServices.map((e) => (
                <Box
                  key={e.id}
                  layerStyle="glassCard"
                  p={6}
                  bg={cardBg}
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                >
                  <VStack align="start" spacing={4}>
                    <Flex w="full" justify="space-between" align="center">
                      <HStack>
                        <Image src={e.image} alt={e.title} h="40px" />
                        <VStack align="start" spacing={0}>
                          <Heading size="sm">{e.title}</Heading>
                          <Text fontSize="xs" color="brand.500" textTransform="capitalize">{e.category}</Text>
                        </VStack>
                      </HStack>
                      {e.website_url && (
                        <Link href={e.website_url} isExternal>
                          <Icon as={FaExternalLinkAlt} color="gray.400" />
                        </Link>
                      )}
                    </Flex>
                    <Box w="full">
                      <GoogleMap src={e.location_url} height="150px" borderRadius="lg" />
                    </Box>
                  </VStack>
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
