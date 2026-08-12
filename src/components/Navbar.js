import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Container,
  Image,
  HStack,
  VStack,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import GlobalSearch from './GlobalSearch';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { FaUserCircle, FaLock, FaSearch } from 'react-icons/fa';

const Navbar = ({ user, isScrolled }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchOpen]);

  const { language } = useLanguage();
  const t = (translations[language] && translations[language].nav) ? translations[language].nav : {};

  const NAV_ITEMS = [
    {
      label: t.profile || 'Profil',
      href: '/profil',
      children: [
        { label: 'Sejarah Desa', subLabel: 'Asal usul Kabupaten Magelang', href: '/profil#sejarah' },
        { label: 'Visi & Misi', subLabel: 'Tujuan & cita-cita desa', href: '/profil#visimisi' },
        { label: 'Wilayah Desa', subLabel: 'Data geografis & administratif', href: '/profil#wilayah' },
      ],
    },
    {
      label: t.government || 'Pemerintahan',
      href: '/pemerintahan',
      children: [
        { label: 'Struktur Organisasi', href: '/pemerintahan' },
        { label: 'Dokumen Publikasi', href: '/pemerintahan/dokumen' },
      ],
    },
    { label: t.services || 'Layanan', href: '/layanan' },
    {
      label: t.explore || 'Jelajahi',
      href: '/jelajahi',
      children: [
        { label: 'Dusun', subLabel: 'Jelajahi wilayah dusun', href: '/jelajahi' },
        { label: 'Drama China', subLabel: 'Nonton Drama China', href: '/dracin' },
        { label: 'Mesin Waktu', subLabel: 'Simulator Timeline', href: '/game/mesin-waktu' },
        { label: 'Alat Universal', subLabel: 'Kumpulan Tools Lengkap', href: '/tools' },
        { label: 'Kreativitas', subLabel: 'AI Text-to-Image Super Realistis', href: '/kreativitas' },
      ],
    },
    { label: 'Donasi', href: '/donasi' },
    {
      label: t.news || 'Berita',
      href: '/news',
      children: [
        { label: 'Pemerintah', subLabel: 'Kabar dan kegiatan desa', href: '/news' },
        { label: 'Nasional', subLabel: 'Berita dari seluruh Indonesia', href: '/news/nasional' },
      ],
    },
    {
      label: t.media || 'Media',
      href: '/media',
      children: [
        { label: 'Streaming & Komunitas', href: '/media' },
        { label: 'Media Pemerintah', href: '/media/pemerintah' },
      ],
    },
    { label: t.contact || 'Kontak', href: '/kontak' },
  ];

  const navBg = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
    isScrolled ? 'rgba(15, 23, 42, 0.55)' : 'rgba(15, 23, 42, 0.35)'
  );

  const navBorder = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.45)',
    isScrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)'
  );

  const textColor = useColorModeValue('gray.700', 'white');
  const brandTitleColor = useColorModeValue('brand.600', 'white');
  const hamburgerHoverBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.200');
  const searchHoverBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.200');

  return (
    <Box>
      <Container maxW="container.2xl" pt={2} px={{ base: 2, sm: 3, md: 4 }}>
        <Flex
          as={'nav'}
          layerStyle="liquidGlass"
          bg={navBg}
          borderColor={navBorder}
          color={textColor}
          minH={'64px'}
          py={{ base: 2 }}
          px={{ base: 3, md: 4, xl: 5 }}
          align={'center'}
          borderRadius={isScrolled ? 'full' : '3xl'}
          transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          position="relative"
          className="liquid-nav-container liquid-sheen-effect"
        >
          {/* Mobile hamburger button */}
          <Flex
            flex={{ base: 1, lg: 'auto' }}
            ml={{ base: -1 }}
            display={{ base: 'flex', lg: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3.5} h={3.5} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              borderRadius="full"
              _hover={{
                bg: hamburgerHoverBg,
              }}
            />
          </Flex>

          {/* Logo & Brand */}
          <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} align="center">
            <HStack
              as={RouterLink}
              to="/"
              spacing={{ base: 2, md: 3 }}
              _hover={{ textDecoration: 'none' }}
              transition="transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
              _active={{ transform: 'scale(0.95)' }}
              flexShrink={0}
            >
              <Image
                src="/logo_desa.png"
                h={{ base: '32px', md: '38px' }}
                w="auto"
                objectFit="contain"
                alt="Logo Desa Ngawonggo"
                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
              />
              <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                <Text
                  fontWeight="900"
                  color={brandTitleColor}
                  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
                  letterSpacing="tight"
                  lineHeight="1"
                  fontFamily="heading"
                  whiteSpace="nowrap"
                >
                  DESA NGAWONGGO
                </Text>
                <Text fontSize="10px" fontWeight="800" color="brand.400" letterSpacing="widest" whiteSpace="nowrap">
                  KAB. MAGELANG
                </Text>
              </VStack>
            </HStack>

            {/* Desktop Navigation */}
            <Flex display={{ base: 'none', lg: 'flex' }} ml={{ lg: 2, xl: 4 }}>
              <DesktopNav navItems={NAV_ITEMS} currentPath={location.pathname} />
            </Flex>
          </Flex>

          {/* Action buttons */}
          <Stack
            flex={{ base: 1, lg: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={{ base: 1.5, sm: 2, md: 2.5 }}
            align="center"
            flexShrink={0}
          >
            <Tooltip label="Pencarian Cepat (Ctrl+K)" placement="bottom" hasArrow>
              <IconButton
                aria-label="Search"
                icon={<FaSearch />}
                variant="ghost"
                onClick={onSearchOpen}
                borderRadius="full"
                size="sm"
                _hover={{
                  bg: searchHoverBg,
                  transform: 'scale(1.08)',
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <ColorModeSwitcher justifySelf="flex-end" size="sm" borderRadius="full" />

            {user ? (
              <Tooltip label="Portal Warga" placement="bottom" hasArrow>
                <Button
                  as={RouterLink}
                  to="/portal"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={<FaUserCircle />}
                  borderRadius="full"
                  px={{ base: 3, md: 4 }}
                  size="sm"
                  maxW={{ base: '120px', md: '160px' }}
                  boxShadow="0 4px 14px rgba(19, 127, 236, 0.4)"
                  _hover={{
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(19, 127, 236, 0.5)',
                  }}
                  _active={{ transform: 'scale(0.97)' }}
                  transition="all 0.25s"
                >
                  <Text isTruncated fontSize="xs">
                    {user.email.split('@')[0]}
                  </Text>
                </Button>
              </Tooltip>
            ) : (
              <Tooltip label="Akses Layanan Digital Warga" placement="bottom" hasArrow>
                <Button
                  as={RouterLink}
                  to="/auth"
                  fontSize={'xs'}
                  fontWeight={800}
                  variant={'outline'}
                  colorScheme="brand"
                  borderRadius="full"
                  px={{ base: 3.5, md: 5 }}
                  size="sm"
                  leftIcon={<FaLock />}
                  layerStyle="liquidGlassPill"
                  _hover={{
                    bg: 'brand.500',
                    color: 'white',
                    borderColor: 'brand.500',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(19, 127, 236, 0.35)',
                  }}
                  _active={{ transform: 'scale(0.97)' }}
                  transition="all 0.25s"
                >
                  MASUK
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Flex>

        {/* Mobile Navigation Drawer */}
        <Collapse in={isOpen} animateOpacity>
          <MobileNav
            navItems={NAV_ITEMS}
            user={user}
            onClose={onClose}
            onSearchOpen={onSearchOpen}
          />
        </Collapse>
      </Container>
      <GlobalSearch isOpen={isSearchOpen} onClose={onSearchClose} />
    </Box>
  );
};

const DesktopNav = ({ navItems, currentPath }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const linkColor = useColorModeValue('gray.700', 'gray.200');
  const activeColor = useColorModeValue('brand.600', 'white');
  const popoverContentBg = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(15, 23, 42, 0.85)');
  const popoverBorder = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.15)');

  return (
    <HStack
      spacing={{ lg: 0.5, xl: 1 }}
      align="center"
      position="relative"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {navItems.map((navItem, index) => {
        const isCurrentRoute =
          navItem.href === '/'
            ? currentPath === '/'
            : currentPath.startsWith(navItem.href);

        const isHovered = hoveredIndex === index;

        return (
          <Box
            key={`${navItem.label}-${index}`}
            position="relative"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <Popover trigger={'hover'} placement={'bottom-start'} gutter={12}>
              <PopoverTrigger>
                <Box
                  as={RouterLink}
                  to={navItem.href ?? '#'}
                  py={2}
                  px={{ lg: 2, xl: 3 }}
                  fontSize={{ lg: '11px', xl: 'xs' }}
                  fontWeight={800}
                  color={isCurrentRoute ? activeColor : linkColor}
                  borderRadius="full"
                  position="relative"
                  zIndex={1}
                  transition="color 0.2s ease"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  whiteSpace="nowrap"
                  display="inline-flex"
                  alignItems="center"
                  gap={0.5}
                  _hover={{ textDecoration: 'none' }}
                >
                  {/* Dynamic Sliding Liquid Pill background */}
                  {(isHovered || (isCurrentRoute && hoveredIndex === null)) && (
                    <motion.div
                      layoutId="liquidNavPill"
                      initial={false}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '9999px',
                        background: isCurrentRoute
                          ? 'linear-gradient(135deg, rgba(19, 127, 236, 0.22) 0%, rgba(19, 127, 236, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), 0 4px 14px rgba(19, 127, 236, 0.15)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  {navItem.label}
                  {navItem.children && (
                    <Icon
                      as={ChevronDownIcon}
                      w={3.5}
                      h={3.5}
                      transition="transform 0.2s"
                      transform={isHovered ? 'rotate(180deg)' : 'none'}
                    />
                  )}
                </Box>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border="1px solid"
                  borderColor={popoverBorder}
                  boxShadow={'inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.7), 0 20px 40px rgba(0,0,0,0.15)'}
                  bg={popoverContentBg}
                  p={3}
                  rounded={'2xl'}
                  minW={'18rem'}
                  backdropFilter="blur(24px) saturate(180%)"
                  WebkitBackdropFilter="blur(24px) saturate(180%)"
                  _focus={{ boxShadow: 'none' }}
                >
                  <Stack spacing={1}>
                    {navItem.children.map((child, childIndex) => (
                      <DesktopSubNav key={`${child.label}-${childIndex}`} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </HStack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const hoverBg = useColorModeValue(
    'linear-gradient(135deg, rgba(19, 127, 236, 0.12) 0%, rgba(255, 255, 255, 0.6) 100%)',
    'linear-gradient(135deg, rgba(19, 127, 236, 0.25) 0%, rgba(30, 41, 59, 0.6) 100%)'
  );
  const titleColor = useColorModeValue('gray.800', 'white');
  const subLabelColor = useColorModeValue('gray.500', 'gray.400');
  const activeColor = 'brand.500';

  return (
    <Box
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2.5}
      rounded={'xl'}
      transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
      _hover={{
        bg: hoverBg,
        transform: 'translateX(4px)',
        textDecoration: 'none',
        boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <HStack align={'center'} justify="space-between">
        <Box>
          <Text
            transition={'all .2s ease'}
            _groupHover={{ color: activeColor }}
            fontWeight={700}
            fontSize="sm"
            color={titleColor}
          >
            {label}
          </Text>
          {subLabel && (
            <Text fontSize={'xs'} color={subLabelColor}>
              {subLabel}
            </Text>
          )}
        </Box>
        <Flex
          transition={'all .2s ease'}
          transform={'translateX(-8px)'}
          opacity={0}
          _groupHover={{ opacity: 1, transform: 'translateX(0)' }}
          align={'center'}
        >
          <Icon color={activeColor} w={4} h={4} as={ChevronRightIcon} />
        </Flex>
      </HStack>
    </Box>
  );
};

const MobileNav = ({ navItems, user, onClose, onSearchOpen }) => {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(15, 23, 42, 0.85)');
  const border = useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.12)');
  const headerBorder = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Stack
      layerStyle="liquidGlass"
      p={4}
      display={{ lg: 'none' }}
      borderRadius="2xl"
      mt={3}
      mx={1}
      boxShadow="0 20px 40px rgba(0,0,0,0.15)"
      bg={bg}
      borderColor={border}
      backdropFilter="blur(28px) saturate(200%)"
      WebkitBackdropFilter="blur(28px) saturate(200%)"
      maxH="75vh"
      overflowY="auto"
      spacing={3}
    >
      <HStack justify="space-between" align="center" pb={2} borderBottom="1px solid" borderColor={headerBorder}>
        <Text fontSize="xs" fontWeight="800" color="gray.500" letterSpacing="wider" textTransform="uppercase">
          Navigasi Utama
        </Text>
        <ColorModeSwitcher size="sm" />
      </HStack>

      <Button
        leftIcon={<FaSearch />}
        variant="ghost"
        justifyContent="space-between"
        size="md"
        borderRadius="xl"
        layerStyle="liquidGlassPill"
        onClick={() => {
          onClose();
          onSearchOpen();
        }}
        fontSize="sm"
        fontWeight="700"
      >
        <Text>Pencarian Cepat</Text>
        <Badge colorScheme="brand" borderRadius="md" px={2} fontSize="10px">
          Ctrl + K
        </Badge>
      </Button>

      {user ? (
        <Button
          key="portal-btn"
          as={RouterLink}
          to="/portal"
          leftIcon={<FaUserCircle />}
          colorScheme="brand"
          variant="solid"
          borderRadius="xl"
          onClick={onClose}
          size="md"
          boxShadow="0 4px 15px rgba(19, 127, 236, 0.4)"
        >
          Portal: {user.email.split('@')[0]}
        </Button>
      ) : (
        <Button
          key="auth-btn"
          as={RouterLink}
          to="/auth"
          leftIcon={<FaLock />}
          colorScheme="brand"
          variant="outline"
          borderRadius="xl"
          onClick={onClose}
          size="md"
          layerStyle="liquidGlassPill"
        >
          Masuk Portal Warga
        </Button>
      )}

      <Stack spacing={1} pt={1}>
        {navItems.map((navItem, index) => (
          <MobileNavItem key={`${navItem.label}-${index}`} {...navItem} onClose={onClose} />
        ))}
      </Stack>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onClose }) => {
  const { isOpen, onToggle } = useDisclosure();
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const borderColor = useColorModeValue('rgba(19, 127, 236, 0.2)', 'rgba(255, 255, 255, 0.15)');
  const itemHoverBg = useColorModeValue('rgba(19, 127, 236, 0.08)', 'rgba(255, 255, 255, 0.08)');
  const childColor = useColorModeValue('gray.600', 'gray.300');
  const childHoverBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.100');

  const handleLinkClick = (e) => {
    if (children) {
      e.preventDefault();
      onToggle();
    } else {
      onClose();
    }
  };

  return (
    <Stack spacing={1}>
      <Flex
        py={2.5}
        px={3}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        borderRadius="xl"
        transition="all 0.2s"
        _hover={{
          bg: itemHoverBg,
          textDecoration: 'none',
        }}
        onClick={handleLinkClick}
      >
        <Text fontWeight={700} fontSize="sm" color={textColor}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={5}
            h={5}
            color="gray.500"
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={1}
          ml={3}
          pl={3}
          borderLeft="2px solid"
          borderColor={borderColor}
          align={'start'}
          spacing={1}
        >
          {children &&
            children.map((child, index) => (
              <Box
                as={RouterLink}
                key={`${child.label}-${index}`}
                py={2}
                px={2}
                to={child.href}
                onClick={onClose}
                fontSize="xs"
                fontWeight="600"
                color={childColor}
                borderRadius="lg"
                width="100%"
                _hover={{
                  color: 'brand.500',
                  bg: childHoverBg,
                  textDecoration: 'none',
                }}
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar;
