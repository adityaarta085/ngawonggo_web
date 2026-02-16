import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Flex,
  Link,
  Container,
  Heading,
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

const QuickLinks = () => {
  const { language } = useLanguage();

  const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: FaInfoCircle,
      href: '/profil',
      color: 'brand.500',
      description: language === 'id' ? 'Kenali sejarah dan visi kami' : 'Get to know our history'
    },
    {
      label: language === 'id' ? 'Layanan Publik' : 'Public Services',
      icon: FaHandHoldingHeart,
      href: '/layanan',
      color: 'green.500',
      description: language === 'id' ? 'Urus dokumen & administrasi' : 'Manage documents'
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: FaGavel,
      href: '/pemerintahan',
      color: 'orange.500',
      description: language === 'id' ? 'Struktur organisasi desa' : 'Village organization'
    },
    {
        label: language === 'id' ? 'Al-Qur\'an Digital' : 'Digital Quran',
        icon: FaBookOpen,
        href: '/quran',
        color: 'teal.500',
        description: language === 'id' ? 'Akses kitab suci digital' : 'Access digital holy book'
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: FaBullhorn,
      href: '#pengaduan',
      color: 'red.500',
      description: language === 'id' ? 'Sampaikan aspirasi Anda' : 'Submit your feedback'
    },
  ];

  return (
    <Box py={20} bg="white">
      <Container maxW="container.xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {language === 'id' ? 'Akses Cepat Layanan' : 'Quick Service Access'}
          </Heading>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={8}>
          {links.map((link, index) => (
            <Link
              key={index}
              as={link.href.startsWith('/') ? RouterLink : 'a'}
              to={link.href.startsWith('/') ? link.href : undefined}
              href={link.href.startsWith('/') ? undefined : link.href}
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                p={8}
                bg="white"
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.3s"
                textAlign="center"
                height="full"
                _hover={{
                  transform: 'translateY(-10px)',
                  boxShadow: 'xl',
                  borderColor: link.color,
                }}
              >
                <Flex
                  w={16}
                  h={16}
                  bg={`${link.color.split('.')[0]}.50`}
                  color={link.color}
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  mb={6}
                  mx="auto"
                >
                  <Icon as={link.icon} w={8} h={8} />
                </Flex>
                <Text fontWeight="800" fontSize="lg" mb={2}>
                  {link.label}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {link.description}
                </Text>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default QuickLinks;
