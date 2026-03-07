import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Flex,
  Link,
  Container,
  Heading,
  VStack,
} from '@chakra-ui/react';
import {
  FaInfoCircle,
  FaHandHoldingHeart,
  FaGavel,
  FaBullhorn,
  FaBookOpen,
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const QuickLinks = () => {
  const { language } = useLanguage();

  const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: FaInfoCircle,
      href: '/profil',
      color: 'brand.500',
      description: language === 'id' ? 'Kenali sejarah dan visi misi kami' : 'Get to know our history'
    },
    {
      label: language === 'id' ? 'Layanan Publik' : 'Public Services',
      icon: FaHandHoldingHeart,
      href: '/layanan',
      color: 'green.500',
      description: language === 'id' ? 'Urus dokumen & administrasi desa' : 'Manage documents'
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: FaGavel,
      href: '/pemerintahan',
      color: 'orange.500',
      description: language === 'id' ? 'Struktur organisasi perangkat desa' : 'Village organization'
    },
    {
        label: language === 'id' ? 'Al-Qur\'an Digital' : 'Digital Quran',
        icon: FaBookOpen,
        href: '/quran',
        color: 'teal.500',
        description: language === 'id' ? 'Akses kitab suci Al-Qur\'an digital' : 'Access digital holy book'
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: FaBullhorn,
      href: '#pengaduan',
      color: 'red.500',
      description: language === 'id' ? 'Sampaikan aspirasi & laporan Anda' : 'Submit your feedback'
    },
  ];

  return (
    <Box py={24} bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={4} mb={16} textAlign="center">
          <Text color="brand.500" fontWeight="800" letterSpacing="widest" fontSize="xs">
            SOLUSI DIGITAL
          </Text>
          <Heading as="h2" size="2xl" fontWeight="900" color="gray.900">
            {language === 'id' ? 'Akses Cepat Layanan' : 'Quick Service Access'}
          </Heading>
          <Box w="60px" h="4px" bg="brand.500" borderRadius="full" mt={2} />
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} spacing={8}>
          {links.map((link, index) => (
            <Link
              key={index}
              as={link.href.startsWith('/') ? RouterLink : 'a'}
              to={link.href.startsWith('/') ? link.href : undefined}
              href={link.href.startsWith('/') ? undefined : link.href}
              _hover={{ textDecoration: 'none' }}
              display="block"
            >
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                p={8}
                bg="white"
                borderRadius="3xl"
                boxShadow="soft"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                height="full"
                display="flex"
                flexDirection="column"
                alignItems="center"
                _hover={{
                  transform: 'translateY(-12px)',
                  boxShadow: 'strong',
                  borderColor: link.color,
                }}
              >
                <Flex
                  w={20}
                  h={20}
                  bg={`${link.color.split('.')[0]}.50`}
                  color={link.color}
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  mb={8}
                  transition="all 0.3s"
                  _groupHover={{ transform: 'rotate(5deg) scale(1.1)' }}
                >
                  <Icon as={link.icon} w={10} h={10} />
                </Flex>
                <Text fontWeight="900" fontSize="xl" mb={3} color="gray.800">
                  {link.label}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="tall">
                  {link.description}
                </Text>
              </MotionBox>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default QuickLinks;
