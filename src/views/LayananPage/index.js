import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Icon,
  Link,
  Image,
  Skeleton,
} from '@chakra-ui/react';
import { EmailIcon, InfoIcon, EditIcon, StarIcon, PhoneIcon } from '@chakra-ui/icons';
import ComplaintSystem from './ComplaintSystem';
import { supabase } from '../../lib/supabase';

const iconMap = {
  'InfoIcon': InfoIcon,
  'EditIcon': EditIcon,
  'EmailIcon': EmailIcon,
  'StarIcon': StarIcon,
  'PhoneIcon': PhoneIcon,
};

export default function LayananPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('public_services')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <Box p={{ base: 6, md: 10 }} fontFamily="heading">
      <Heading mb={5} color="brand.500">Layanan Publik</Heading>
      <Text mb={8}>
        Pemerintah Desa Ngawonggo berkomitmen memudahkan warga dalam mengurus administrasi kependudukan.
      </Text>

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h="200px" borderRadius="xl" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {services.map((service, index) => (
            <Card key={index} variant="outline" layerStyle="glassCard">
              <CardHeader pb={0}>
                <Icon as={iconMap[service.icon_name] || InfoIcon} w={6} h={6} color="blue.500" mb={2} />
                <Heading size="md">{service.title}</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Text pt="2" fontSize="sm">
                      {service.description}
                    </Text>
                    {service.link && service.link !== '#' && (
                      <Link href={service.link} color="brand.500" fontSize="sm" fontWeight="bold" mt={2} display="block" isExternal>
                        Buka Layanan →
                      </Link>
                    )}
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={10}>
        <Box p={5} bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.300">
          <Heading size="sm" mb={2}>Digitalisasi Layanan</Heading>
          <Text fontSize="sm">
            Sesuai Misi Desa, kami sedang mengembangkan sistem form pengajuan online untuk mempercepat proses administrasi warga.
          </Text>
        </Box>

        <Box p={5} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.100">
          <Heading size="sm" mb={3}>Aspirasi & Pengaduan (LAPOR!)</Heading>
          <Text fontSize="sm" mb={4}>
            Pemerintah Desa Ngawonggo terintegrasi dengan SP4N-LAPOR! Sampaikan keluhan atau saran Anda melalui kanal resmi nasional.
          </Text>
          <Link href="https://prod.lapor.go.id" isExternal>
            <Image
              src="https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzIvMjEvOTFhZGU2OGEtY2JlNS00YjhmLTgzOTEtZDcxNmQ3ZDRmYWVkLnBuZw=="
              alt="Logo LAPOR"
              h="40px"
              bg="white"
              p={1}
              borderRadius="md"
            />
          </Link>
        </Box>
      </SimpleGrid>

      <Box mt={16}>
        <ComplaintSystem />
      </Box>
    </Box>
  );
}
