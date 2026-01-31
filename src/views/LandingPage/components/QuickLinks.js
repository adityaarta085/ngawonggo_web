import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Flex,
  Link,
} from '@chakra-ui/react';
import {
  InfoIcon,
  EmailIcon,
  StarIcon,
  SettingsIcon,
} from '@chakra-ui/icons';

const QuickLinks = () => {
  const links = [
    { label: 'Profil Desa', icon: InfoIcon, href: '/profil', color: 'blue.500' },
    { label: 'Layanan Publik', icon: EmailIcon, href: '/layanan', color: 'green.500' },
    { label: 'Potensi Desa', icon: StarIcon, href: '/potensi', color: 'orange.500' },
    { label: 'Pemerintahan', icon: SettingsIcon, href: '/pemerintahan', color: 'red.500' },
  ];

  return (
    <Box px={{ base: 5, md: 20 }} py={10}>
      <Text
        fontFamily={'heading'}
        fontSize={{ base: '20px', md: '30px' }}
        fontWeight={700}
        mb={6}
        textAlign="center"
      >
        Layanan Cepat
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            _hover={{ textDecoration: 'none' }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              p={5}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'md',
                borderColor: link.color,
              }}
            >
              <Icon as={link.icon} w={8} h={8} color={link.color} mb={3} />
              <Text fontWeight="bold" fontSize="sm" textAlign="center">
                {link.label}
              </Text>
            </Flex>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default QuickLinks;
