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
  HStack,
  Tooltip,
  Image,
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

const VStack = ({ children, align, spacing, ...props }) => (
    <Stack direction="column" align={align} spacing={spacing} {...props}>
        {children}
    </Stack>
);

function Navbar({ user, isScrolled }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].nav;

  const NAV_ITEMS = [
    { label: t.home, href: '/' },
    {
      label: t.profile,
      children: [
        { label: 'Sejarah Desa', subLabel: 'Asal usul Desa Ngawonggo', href: '/profil#sejarah' },
        { label: 'Visi & Misi', subLabel: 'Tujuan dan arah desa', href: '/profil#visimisi' },
        { label: 'Wilayah Desa', subLabel: 'Data geografis & administratif', href: '/profil#wilayah' },
      ],
      href: '/profil'
    },
    { label: t.gov, href: '/pemerintahan' },
    { label: t.services, href: '/layanan' },
    { label: t.explore, href: '/jelajahi' },
    { label: t.transparency, href: '/transparansi' },
    { label: t.news, href: '/news' },
    { label: t.media, href: '/media' },
    { label: t.games, href: '/game-edukasi' },
    { label: t.contact, href: '/kontak' },
    { label: t.admin, href: '/admin', isSpecial: true },
  ];

  const navBg = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.3)',
    isScrolled ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.3)'
  );
  const navColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      p={{ base: 2, md: 4 }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      w="full"
    >
      <Flex
        layerStyle="liquidGlass"
        bg={navBg}
        color={navColor}
        minH="64px"
        py={{ base: 2 }}
        px={{ base: 4, md: 8 }}
        align="center"
        borderRadius={isScrolled ? "full" : "2xl"}
        maxW="container.xl"
        mx="auto"
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        border="1px solid"
        borderColor={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
        backdropFilter="blur(16px)"
      >
        <Container maxW="container.xl" display="flex" alignItems="center" px={0}>
          <Flex
            flex={{ base: '0 0 auto', lg: 'none' }}
            display={{ base: 'flex', lg: 'none' }}
            mr={2}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              size="sm"
            />
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} alignItems="center">
            <Box as={RouterLink} to="/" h="40px" display="flex" alignItems="center" flexShrink={0}>
                <HStack spacing={2}>
                  <Image src="/logo_desa.png" h="36px" w="auto" fallbackSrc="https://via.placeholder.com/36" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="900" fontSize="sm" color="brand.500" lineHeight="1">DESA</Text>
                    <Text fontWeight="900" fontSize="xs" color="gray.600" lineHeight="1">NGAWONGGO</Text>
                  </VStack>
                </HStack>
            </Box>

            <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
              <DesktopNav navItems={NAV_ITEMS} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: '0 0 auto', lg: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={{ base: 2, md: 3 }}
            align="center"
          >
            {/* User Auth Section */}
            <Box display={{ base: 'none', md: 'block' }}>
               {user ? (
                   <Tooltip label="Portal Warga" key="portal-tooltip">
                       <Button
                            as={RouterLink}
                            to="/portal"
                            leftIcon={<FaUserCircle />}
                            colorScheme="brand"
                            variant="solid"
                            size="xs"
                            borderRadius="full"
                            px={4}
                       >
                           {user.email.split('@')[0]}
                       </Button>
                   </Tooltip>
               ) : (
                   <Tooltip label="Masuk untuk bypass splash & simpan progres" key="auth-tooltip">
                       <Button
                            as={RouterLink}
                            to="/auth"
                            leftIcon={<FaLock />}
                            colorScheme="brand"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            px={4}
                            _hover={{ bg: 'brand.500', color: 'white' }}
                       >
                           Masuk
                       </Button>
                   </Tooltip>
               )}
            </Box>

            <HStack spacing={2}>
              <Button
                size="2xs"
                variant={language === 'id' ? 'solid' : 'ghost'}
                colorScheme="brand"
                onClick={() => setLanguage('id')}
              >
                ID
              </Button>
              <Button
                size="2xs"
                variant={language === 'en' ? 'solid' : 'ghost'}
                colorScheme="brand"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={NAV_ITEMS} user={user} onClose={onClose} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('brand.500', 'brand.300');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={1} align="center">
      {navItems.map((navItem, index) => (
        <Box key={`${navItem.label}-${index}`}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'xs'}
                fontWeight={600}
                color={navItem.isSpecial ? 'brand.500' : linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                whiteSpace="nowrap"
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
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
  return (
    <Box
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('brand.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'brand.500' }}
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
          <Icon color={'brand.500'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ navItems, user, onClose }) => {
  return (
    <Stack
      layerStyle="liquidGlass"
      p={4}
      display={{ lg: 'none' }}
      borderRadius="2xl"
      mt={2}
      mx={2}
      boxShadow="xl"
      bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(15, 23, 42, 0.95)')}
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
          color={useColorModeValue('gray.600', 'gray.200')}
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
          borderColor={useColorModeValue('gray.200', 'gray.700')}
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