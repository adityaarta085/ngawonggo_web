import React, { useState, useEffect } from 'react';
import {
  Box, Container, SimpleGrid, Image, Text, VStack, Progress, Button, Badge,
  Heading, Skeleton, useColorModeValue, Center, Icon, Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHeart, FaChevronRight } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0);
};

const DonasiCard = ({ campaign }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const progress = Math.min((campaign.current_amount / campaign.target_amount) * 100, 100) || 0;

  return (
    <Box bg={bg} borderRadius="xl" overflow="hidden" boxShadow="md" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}>
      <Box position="relative">
        <Image src={campaign.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'} alt={campaign.title} w="100%" h="200px" objectFit="cover" />
        <Badge position="absolute" top={2} right={2} colorScheme="brand" variant="solid" rounded="md" px={2} py={1}>
          Open Donasi
        </Badge>
      </Box>
      <VStack p={5} align="stretch" spacing={3}>
        <Heading size="md" noOfLines={2}>{campaign.title}</Heading>
        <Text fontSize="sm" color="gray.500" noOfLines={2}>{campaign.description}</Text>

        <Box pt={2}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" fontWeight="bold">Terkumpul</Text>
            <Text fontSize="xs" fontWeight="bold">Target</Text>
          </Flex>
          <Progress value={progress} size="sm" colorScheme="brand" borderRadius="full" mb={2} />
          <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="brand.500">{formatRupiah(campaign.current_amount)}</Text>
            <Text fontSize="sm" color="gray.500">{formatRupiah(campaign.target_amount)}</Text>
          </Flex>
        </Box>

        <Button as={Link} to={`/donasi/${campaign.id}`} colorScheme="brand" w="100%" mt={2} rightIcon={<FaChevronRight />}>
          Donasi Sekarang
        </Button>
      </VStack>
    </Box>
  );
};

const DonasiPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) setCampaigns(data);
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <SEO title="Open Donasi - Desa Ngawonggo" description="Mari bersama bantu saudara-saudara kita yang membutuhkan melalui fitur Open Donasi Desa Ngawonggo." />

      <Box pt={{ base: '120px', md: '140px' }} pb={10} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
        <Container maxW="container.xl">
          <Center flexDirection="column" mb={10} textAlign="center">
            <Icon as={FaHeart} w={12} h={12} color="brand.500" mb={4} />
            <Heading size="xl" mb={2}>Open Donasi</Heading>
            <Text color="gray.500" maxW="2xl">
              Salurkan kepedulian Anda untuk membantu program-program pembangunan, kegiatan sosial, dan tanggap darurat di lingkungan Desa Ngawonggo.
            </Text>
          </Center>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {[1, 2, 3].map(i => (
                <Box key={i} p={4} boxShadow="md" borderRadius="xl" bg="white" _dark={{ bg: "gray.800" }}>
                  <Skeleton height="200px" mb={4} />
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="20px" w="80%" mb={4} />
                  <Skeleton height="10px" mb={2} />
                  <Skeleton height="40px" />
                </Box>
              ))}
            </SimpleGrid>
          ) : campaigns.length === 0 ? (
            <Center p={10} flexDirection="column" bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm">
              <Icon as={FaHeart} w={10} h={10} color="gray.300" mb={3} />
              <Text color="gray.500">Belum ada campaign donasi yang aktif saat ini.</Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {campaigns.map(campaign => (
                <DonasiCard key={campaign.id} campaign={campaign} />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DonasiPage;
