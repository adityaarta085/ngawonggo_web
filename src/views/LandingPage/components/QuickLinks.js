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
  FaPlayCircle
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
      label: language === 'id' ? 'Anime Baru' : 'New Anime',
      icon: FaPlayCircle,
      href: '/anime',
      color: 'blue.500',
      description: language === 'id' ? 'Nonton anime sub indo gratis' : 'Watch free anime sub indo'
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
    <Box py={32} bg="gray.50" position="relative">
      {/* Decorative Background Element */}
      <Box position="absolute" top="0" left="0" w="full" h="300px" bgGradient="linear(to-b, gray.100, gray.50)" zIndex={0} />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={6} mb={20} textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text color="brand.600" fontWeight="900" letterSpacing="widest" fontSize="sm" mb={2} textTransform="uppercase">
              Solusi Digital
            </Text>
            <Heading as="h2" size="2xl" fontWeight="900" color="gray.900" letterSpacing="-0.02em">
              {language === 'id' ? 'Akses Cepat Layanan' : 'Quick Service Access'}
            </Heading>
            <Box w="80px" h="6px" bgGradient="linear(to-r, brand.400, brand.600)" borderRadius="full" mt={6} mx="auto" />
          </motion.div>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 6 }} spacing={8}>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 60 }}
                p={8}
                bg="white"
                borderRadius="3xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                height="full"
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-15px)',
                  boxShadow: '2xl',
                  borderColor: link.color,
                }}
              >
                {/* Subtle Hover Glow */}
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  w="200%"
                  h="200%"
                  bg={`radial-gradient(circle, ${link.color}15 0%, transparent 60%)`}
                  opacity={0}
                  transition="opacity 0.4s"
                  _groupHover={{ opacity: 1 }}
                  zIndex={0}
                  pointerEvents="none"
                />

                <Flex
                  w={24}
                  h={24}
                  bg={`${link.color.split('.')[0]}.50`}
                  color={link.color}
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  mb={6}
                  transition="all 0.4s cubic-bezier(.4,0,.2,1)"
                  boxShadow={`0 10px 20px -5px ${link.color}40`}
                  zIndex={1}
                  _groupHover={{
                    transform: 'rotate(8deg) scale(1.15)',
                    bg: link.color,
                    color: 'white'
                  }}
                >
                  <Icon as={link.icon} w={10} h={10} />
                </Flex>
                <Text fontWeight="800" fontSize="xl" mb={3} color="gray.800" zIndex={1} letterSpacing="-0.01em">
                  {link.label}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="tall" zIndex={1} fontWeight="500">
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
