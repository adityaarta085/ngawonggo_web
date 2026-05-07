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
} from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BRUTAL_COLORS = [
  'neo.yellow', 'neo.coral', 'neo.teal', 'brutal.purple', 'brutal.orange', 'brutal.green', 'white'
];

const QuickLinks = ({ isHero }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const links = [
    {
      label: language === 'id' ? 'Profil Desa' : 'Village Profile',
      icon: FaInfoCircle,
      href: '/profil',
    },
    {
      label: language === 'id' ? 'Layanan' : 'Services',
      icon: FaHandHoldingHeart,
      href: '/layanan',
    },
    {
      label: language === 'id' ? 'Pemerintahan' : 'Government',
      icon: FaGavel,
      children: [
        { label: 'Struktur Organisasi', href: '/pemerintahan' },
        { label: 'Dokumen Publikasi', href: '/pemerintahan/dokumen' }
      ]
    },
    {
      label: language === 'id' ? 'Berita' : 'News',
      icon: FaNewspaper,
      children: [
        { label: 'Pemerintah', href: '/news' },
        { label: 'Nasional', href: '/news/nasional' }
      ]
    },
    {
      label: language === 'id' ? 'Donasi' : 'Donation',
      icon: FaDonate,
      href: '/donasi',
    },
    {
        label: language === 'id' ? 'Al-Qur\'an' : 'Al-Quran',
        icon: FaBookOpen,
        href: '/quran',
    },
    {
      label: language === 'id' ? 'Edu Game' : 'Edu Game',
      icon: FaGamepad,
      href: '/game',
    },
    {
      label: language === 'id' ? 'Media' : 'Media',
      icon: FaPhotoVideo,
      children: [
        { label: 'Streaming & Komunitas', href: '/media' },
        { label: 'Media Pemerintah', href: '/media/pemerintah' }
      ]
    },
    {
      label: language === 'id' ? 'Jelajahi' : 'Explore',
      icon: FaCompass,
      href: '/jelajahi',
    },
    {
      label: language === 'id' ? 'Pengaduan' : 'Complaints',
      icon: FaBullhorn,
      href: '#pengaduan',
    },
    {
      label: language === 'id' ? 'Kontak' : 'Contact',
      icon: FaPhoneAlt,
      href: '/kontak',
    },
  ];

  if (isHero) {
      return (
        <Box w="full" px={{ base: 4, md: 0 }}>
            <SimpleGrid columns={{ base: 3, md: 4, lg: 6 }} spacing={{ base: 4, md: 6 }}>
              {links.map((link, index) => {
                const isDropdown = !!link.children;
                // Assign a pseudo-random color based on index
                const cardColor = BRUTAL_COLORS[index % BRUTAL_COLORS.length];
                const rotate = index % 2 === 0 ? '-2deg' : '2deg';

                const linkContent = (
                  <MotionBox
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 100 }}
                    p={4}
                    bg={cardColor}
                    layerStyle="brutalCard"
                    transform={`rotate(${rotate})`}
                    textAlign="center"
                    height="full"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    _hover={{
                      transform: 'translate(-4px, -4px) rotate(0deg)',
                      boxShadow: '8px 8px 0px black',
                    }}
                    _active={{
                      transform: 'translate(2px, 2px)',
                      boxShadow: '2px 2px 0px black',
                    }}
                    role="group"
                    cursor="pointer"
                    w="full"
                  >
                    <Flex
                      w={{ base: 12, md: 16 }}
                      h={{ base: 12, md: 16 }}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      border="3px solid black"
                      align="center"
                      justify="center"
                      mb={3}
                      transition="all 0.3s"
                      _groupHover={{
                        transform: 'scale(1.1) rotate(10deg)',
                      }}
                    >
                      <Icon as={link.icon} w={{ base: 5, md: 7 }} h={{ base: 5, md: 7 }} />
                    </Flex>
                    <Text fontFamily="accent" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} color="black" textTransform="uppercase">
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
                        <MenuList zIndex={1400} bg="white" border="3px solid black" boxShadow="brutal" borderRadius="none">
                          {link.children.map((child, idx) => (
                            <MenuItem
                              key={idx}
                              onClick={() => navigate(child.href)}
                              _hover={{ bg: "neo.yellow", color: "black", fontWeight: 'bold' }}
                              fontWeight="500"
                              borderBottom={idx !== link.children.length - 1 ? '1px solid black' : 'none'}
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

  return null;
};

export default QuickLinks;
