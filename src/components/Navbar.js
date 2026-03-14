import React from 'react';
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
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { FaUserCircle, FaLock } from 'react-icons/fa';

const Navbar = ({ user, isScrolled }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { language } = useLanguage();
  const t = (translations[language] && translations[language].nav) ? translations[language].nav : {};

  const NAV_ITEMS = [
    {
      label: t.profile || 'Profil',
      children: [
        { label: 'Sejarah Desa', subLabel: 'Asal usul Desa Ngawonggo', href: '/profil#sejarah' },
        { label: 'Visi & Misi', subLabel: 'Tujuan & cita-cita desa', href: '/profil#visimisi' },
        { label: 'Wilayah Desa', subLabel: 'Data geografis & administratif', href: '/profil#wilayah' },
      ],
      href: '/profil'
    },
    { label: t.government || 'Pemerintahan', href: '/pemerintahan' },
    { label: t.services || 'Layanan', href: '/layanan' },
    { label: t.explore || 'Jelajahi', href: '/jelajahi' },
    { label: t.news || 'Berita', href: '/news' },
    { label: t.media || 'Media', href: '/media' },
    { label: t.games || 'Game Edukasi', href: '/game-edukasi' },
    { label: t.contact || 'Kontak', href: '/kontak' },
    { label: t.admin || 'Admin', href: '/admin', isSpecial: true },
  ];

  const navBg = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
    isScrolled ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.15)'
  );

  const navBorder = useColorModeValue(
    isScrolled ? 'whiteAlpha.500' : 'whiteAlpha.300',
    isScrolled ? 'whiteAlpha.200' : 'whiteAlpha.100'
  );

  return (
    <Box>
      <Container maxW="container.xl" pt={2} px={4}>
        <Flex
          as={'nav'}
          layerStyle="liquidGlass"
          bg={navBg}
          borderColor={navBorder}
          color={useColorModeValue('gray.600', 'white')}
          minH={'64px'}
          py={{ base: 2 }}
          px={{ base: 4, md: 8 }}
          align={'center'}
          borderRadius={isScrolled ? 'full' : '3xl'}
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          boxShadow={isScrolled ? 'xl' : 'lg'}
        >
          <Flex
            flex={{ base: 1, lg: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', lg: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              borderRadius="full"
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} align="center">
            <HStack as={RouterLink} to="/" spacing={3} _hover={{ textDecoration: 'none' }} transition="transform 0.2s" _active={{ transform: 'scale(0.95)' }}>
                <Image src="/logo_desa.png" h={{ base: "32px", md: "42px" }} alt="Logo" />
                <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                   <Text
                    fontWeight="900"
                    color={useColorModeValue('brand.600', 'white')}
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="tight"
                    lineHeight="1"
                    fontFamily="heading"
                  >
                    DESA NGAWONGGO
                  </Text>
                  <Text fontSize="10px" fontWeight="800" color="brand.400" letterSpacing="widest">KAB. MAGELANG</Text>
                </VStack>
            </HStack>

            <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
              <DesktopNav navItems={NAV_ITEMS} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, lg: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={4}
          >
             {user ? (
                <Tooltip label="Portal Warga" placement="bottom" hasArrow>
                   <Button
                      as={RouterLink}
                      to="/portal"
                      variant="solid"
                      colorScheme="brand"
                      leftIcon={<FaUserCircle />}
                      borderRadius="full"
                      px={6}
                      size="sm"
                      boxShadow="lg"
                    >
                      {user.email.split('@')[0]}
                    </Button>
                </Tooltip>
             ) : (
                <Tooltip label="Akses Layanan Digital" placement="bottom" hasArrow>
                    <Button
                      as={RouterLink}
                      to="/auth"
                      fontSize={'xs'}
                      fontWeight={800}
                      variant={'outline'}
                      colorScheme="brand"
                      borderRadius="full"
                      px={6}
                      size="sm"
                      leftIcon={<FaLock />}
                      _hover={{
                        bg: 'brand.500',
                        color: 'white',
                        transform: 'translateY(-2px)'
                      }}
                    >
                      MASUK
                    </Button>
                </Tooltip>
             )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav navItems={NAV_ITEMS} user={user} onClose={onClose} />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('brand.500', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const popoverHoverBg = useColorModeValue('brand.50', 'whiteAlpha.100');

  return (
    <Stack direction={'row'} spacing={1} overflowX="auto" maxW="full">
      {navItems.map((navItem, index) => (
        <Box key={`${navItem.label}-${index}`}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'xs'}
                fontWeight={800}
                color={linkColor}
                borderRadius="full"
                transition="all 0.2s"
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                  bg: popoverHoverBg,
                }}
                textTransform="uppercase"
                letterSpacing="wider"
                whiteSpace="nowrap"
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'2xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'2xl'}
                minW={'sm'}
                backdropFilter="blur(16px)"
              >
                <Stack>
                  {navItem.children.map((child, childIndex) => (
                    <DesktopSubNav key={`${child.label}-${childIndex}`} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const hoverBg = useColorModeValue('brand.50', 'gray.900');
  const activeColor = 'brand.500';

  return (
    <Box
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: hoverBg }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: activeColor }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={activeColor} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ navItems, user, onClose }) => {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(15, 23, 42, 0.7)');
  return (
    <Stack
      layerStyle="liquidGlass"
      p={4}
      display={{ lg: 'none' }}
      borderRadius="2xl"
      mt={2}
      mx={2}
      boxShadow="xl"
      bg={bg}
      backdropFilter="blur(24px)"
      maxH="70vh"
      overflowY="auto"
    >
      {user ? (
          <Button
            key="portal-btn"
            as={RouterLink}
            to="/portal"
            leftIcon={<FaUserCircle />}
            colorScheme="brand"
            variant="solid"
            mb={4}
            borderRadius="xl"
            onClick={onClose}
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
            mb={4}
            borderRadius="xl"
            onClick={onClose}
        >
            Masuk Portal Warga
        </Button>
      )}

      {navItems.map((navItem, index) => (
        <MobileNavItem key={`${navItem.label}-${index}`} {...navItem} onClose={onClose} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onClose }) => {
  const { isOpen, onToggle } = useDisclosure();
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLinkClick = () => {
    if (!children) {
      onClose();
    } else {
      onToggle();
    }
  };

  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
        onClick={handleLinkClick}
      >
        <Text
          fontWeight={600}
          color={textColor}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={borderColor}
          align={'start'}
        >
          {children &&
            children.map((child, index) => (
              <Box
                as={RouterLink}
                key={`${child.label}-${index}`}
                py={2}
                to={child.href}
                onClick={onClose}
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
