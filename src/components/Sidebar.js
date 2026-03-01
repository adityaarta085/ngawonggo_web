import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Link,
  useColorModeValue,
  Tooltip,
  IconButton,
  Image,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaGavel,
  FaHandsHelping,
  FaCompass,
  FaNewspaper,
  FaPhotoVideo,
  FaGamepad,
  FaPhoneAlt,
  FaUserShield,
  FaUserCircle,
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const SidebarItem = ({ icon, label, href, isSpecial }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const activeColor = useColorModeValue('brand.600', 'brand.300');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Tooltip label={label} placement="right">
      <Box
        as={RouterLink}
        to={href}
        w="full"
        px={3}
        py={3}
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : (isSpecial ? 'brand.500' : inactiveColor)}
        _hover={{
          bg: activeBg,
          color: activeColor,
          textDecoration: 'none',
        }}
        transition="all 0.2s"
      >
        <Icon as={icon} boxSize={5} />
      </Box>
    </Tooltip>
  );
};

const Sidebar = ({ user }) => {
  const { language } = useLanguage();
  const t = translations[language].nav;
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');

  const NAV_ITEMS = [
    { label: t.home, href: '/', icon: FaHome },
    { label: t.profile, href: '/profil', icon: FaInfoCircle },
    { label: t.government, href: '/pemerintahan', icon: FaGavel },
    { label: t.services, href: '/layanan', icon: FaHandsHelping },
    { label: t.explore, href: '/jelajahi', icon: FaCompass },
    { label: t.news, href: '/news', icon: FaNewspaper },
    { label: t.media, href: '/media', icon: FaPhotoVideo },
    { label: t.games, href: '/game-edukasi', icon: FaGamepad },
    { label: t.contact, href: '/kontak', icon: FaPhoneAlt },
    { label: t.admin, href: '/admin', icon: FaUserShield, isSpecial: true },
  ];

  return (
    <Box
      w="80px"
      pos="fixed"
      h="100vh"
      left={0}
      top={0}
      bg={bg}
      borderRight="1px solid"
      borderColor={borderColor}
      py={6}
      display={{ base: 'none', lg: 'flex' }}
      flexDirection="column"
      alignItems="center"
      zIndex={1001}
      boxShadow="sm"
    >
      <VStack spacing={8} w="full">
        <Link as={RouterLink} to="/">
           <Image src="/logo_desa.png" h="40px" />
        </Link>

        <VStack spacing={2} w="full" px={2}>
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isSpecial={item.isSpecial}
            />
          ))}
        </VStack>
      </VStack>

      <VStack spacing={4} mt="auto" w="full" px={2}>
        <Divider />
        {user ? (
          <Tooltip label="Portal Warga" placement="right">
            <IconButton
              as={RouterLink}
              to="/portal"
              icon={<FaUserCircle />}
              variant="ghost"
              colorScheme="brand"
              borderRadius="xl"
              aria-label="Portal Warga"
            />
          </Tooltip>
        ) : (
          <Tooltip label="Masuk" placement="right">
            <IconButton
              as={RouterLink}
              to="/auth"
              icon={<FaUserCircle />}
              variant="ghost"
              borderRadius="xl"
              aria-label="Masuk"
            />
          </Tooltip>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;
