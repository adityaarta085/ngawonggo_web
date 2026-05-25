import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import {
  FaInfoCircle,
  FaHandHoldingHeart,
  FaGavel,
  FaBullhorn,
  FaBookOpen,
  FaGamepad,
  FaNewspaper,
  FaDonate,
  FaPhotoVideo,
  FaPhoneAlt,
  FaCompass,
  FaCloudDownloadAlt,
  FaFilm,
  FaTools,
}
from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useThemePreference } from '../../../contexts/ThemePreferenceContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const QuickLinks = ({ isHero }) => {
  const { landingTheme } = useThemePreference();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: FaInfoCircle,
      href: '/profil',
      color: 'brand.400',
    },
    {
      label: language === 'id' ? 'Layanan' : 'Services',
      icon: FaHandHoldingHeart,
      href: '/layanan',
      color: 'green.400',
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: FaGavel,
      color: 'orange.400',
      children: [
        { label: 'Struktur Organisasi', href: '/pemerintahan' },
        { label: 'Dokumen Publikasi', href: '/pemerintahan/dokumen' }
      ]
    },
    {
      label: language === 'id' ? 'Berita' : 'News',
      icon: FaNewspaper,
      color: 'blue.400',
      children: [
        { label: 'Pemerintah', href: '/news' },
        { label: 'Nasional', href: '/news/nasional' }
      ]
    },
    {
      label: language === 'id' ? 'Donasi' : 'Donation',
      icon: FaDonate,
      href: '/donasi',
      color: 'pink.400',
    },
    {
        label: language === 'id' ? 'Al-Qur\'an' : 'Al-Quran',
        icon: FaBookOpen,
        href: '/quran',
        color: 'teal.400',
    },
    {
      label: language === 'id' ? 'Edu Game' : 'Edu Game',
      icon: FaGamepad,
      href: '/game',
      color: 'purple.400',
    },
    {
      label: language === 'id' ? 'Media' : 'Media',
      icon: FaPhotoVideo,
      color: 'cyan.400',
      children: [
        { label: 'Streaming & Komunitas', href: '/media' },
        { label: 'Media Pemerintah', href: '/media/pemerintah' }
      ]
    },
    {
      label: language === 'id' ? 'Jelajahi' : 'Explore',
      icon: FaCompass,
      href: '/jelajahi',
      color: 'yellow.400',
    },

    {
      label: language === 'id' ? 'Dracin' : 'Dracin',
      icon: FaFilm,
      href: '/dracin',
      color: 'red.400',
    },
    {
      label: language === 'id' ? 'Kreativitas' : 'Creativity',
      icon: FaPhotoVideo, // or FaMagic if imported
      href: '/kreativitas',
      color: 'purple.500',
    },
    {
      label: language === 'id' ? 'Unduhan' : 'Downloader',
      icon: FaCloudDownloadAlt,
      href: '/downloader',
      color: 'teal.300',
    },
    {
      label: language === 'id' ? 'Alat Universal' : 'Universal Tools',
      icon: FaTools,
      href: '/tools',
      color: 'orange.500',
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: FaBullhorn,
      href: '#pengaduan',
      color: 'red.500',
    },
    {
      label: language === 'id' ? 'Kontak' : 'Contact',
      icon: FaPhoneAlt,
      href: '/kontak',
      color: 'gray.400',
    },
  ];

  if (isHero) {
      return (
        <Box w="full" px={{ base: 4, md: 0 }}>
            <SimpleGrid columns={{ base: 3, md: 4, lg: 6 }} spacing={{ base: 4, md: 6 }}>
              {links.map((link, index) => {
                const isDropdown = !!link.children;
                const linkContent = (
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 60 }}

                    p={4}
                    bg={landingTheme === 'vibrant' ? link.color : "whiteAlpha.100"}
                    color="white"
                    backdropFilter={landingTheme === 'vibrant' ? 'none' : 'blur(10px)'}
                    borderRadius={landingTheme === 'vibrant' ? '3xl' : '2xl'}
                    border={landingTheme === 'vibrant' ? "4px solid" : "1px solid"}
                    borderColor={landingTheme === 'vibrant' ? "white" : "whiteAlpha.300"}
                    boxShadow={landingTheme === 'vibrant' ? "8px 8px 0px rgba(0,0,0,0.2)" : "none"}
                    textAlign="center"
                    height="full"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    _hover={{
                      transform: landingTheme === 'vibrant' ? 'translateY(-8px) rotate(-2deg)' : 'translateY(-5px)',
                      boxShadow: landingTheme === 'vibrant' ? '12px 12px 0px rgba(0,0,0,0.3)' : 'none',
                      filter: landingTheme === 'vibrant' ? 'brightness(1.1)' : 'none',
                      bg: landingTheme === 'vibrant' ? link.color : 'whiteAlpha.200',
                      borderColor: landingTheme === 'vibrant' ? 'white' : 'whiteAlpha.500',
                    }}
                    role="group"
                    cursor="pointer"
                    w="full"
                  >
                    <Flex
                      w={{ base: 12, md: 16 }}
                      h={{ base: 12, md: 16 }}
                      bg={landingTheme === 'vibrant' ? "white" : "whiteAlpha.200"}
                      color={landingTheme === 'vibrant' ? link.color : link.color}
                      borderRadius="xl"
                      align="center"
                      justify="center"
                      mb={3}
                      transition="all 0.3s"
                      _groupHover={{
                        transform: landingTheme === 'vibrant' ? 'scale(1.2) rotate(10deg)' : 'scale(1.1)',
                        boxShadow: landingTheme === 'vibrant' ? 'xl' : 'none',
                        bg: landingTheme === 'vibrant' ? 'white' : link.color,
                        color: landingTheme === 'vibrant' ? link.color : 'white'
                      }}
                    >
                      <Icon as={link.icon} w={{ base: 5, md: 7 }} h={{ base: 5, md: 7 }} />
                    </Flex>
                    <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} color="white">
                      {link.label}
                    </Text>
                  </MotionBox>
                );

                if (isDropdown) {
                  return (
                    <Menu key={index} matchWidth>
                      <MenuButton as={Box} w="full" _focus={{ outline: "none" }}>
                        {linkContent}
                      </MenuButton>
                      <Portal>
                        <MenuList zIndex={1400} bg="whiteAlpha.900" backdropFilter="blur(10px)">
                          {link.children.map((child, idx) => (
                            <MenuItem
                              key={idx}
                              onClick={() => navigate(child.href)}
                              _hover={{ bg: "brand.50", color: "brand.600" }}
                              fontWeight="500"
                            >
                              {child.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Portal>
                    </Menu>
                  );
                }

                return (
                  <Link
                    key={index}
                    as={link.href?.startsWith('/') ? RouterLink : 'a'}
                    to={link.href?.startsWith('/') ? link.href : undefined}
                    href={link.href?.startsWith('/') ? undefined : link.href}
                    _hover={{ textDecoration: 'none' }}
                    display="block"
                    w="full"
                  >
                    {linkContent}
                  </Link>
                );
              })}
            </SimpleGrid>
        </Box>
      );
  }

  return null; // The old standalone version is now removed since we put it in Hero. We'll handle this in LandingPage index.
};

export default QuickLinks;
