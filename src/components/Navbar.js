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
  useBreakpointValue,
  useDisclosure,
  Link,
  Container,
  HStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Image } from '@chakra-ui/react';
import NgawonggoLogo from './NgawonggoLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const [logoIndex, setLogoIndex] = useState(0);
  const { language, setLanguage } = useLanguage();
  const t = translations[language].nav;
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const bgColor = useColorModeValue('white', 'accent.blue');
  const textColor = useColorModeValue('gray.600', 'white');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const logos = [
    {
      id: 'desa',
      content: (
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <NgawonggoLogo
            fontSize={useBreakpointValue({ base: 'md', md: 'lg' })}
            color={!scrolled && isHomePage ? "white" : "brand.500"}
          />
        </Link>
      ),
    },
    {
      id: 'kab',
      content: (
        <HStack spacing={3} color={!scrolled && isHomePage ? "white" : "inherit"}>
          <Image
            src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png"
            h="35px"
            alt="Logo Kab Magelang"
            filter={!scrolled && isHomePage ? "brightness(0) invert(1)" : "none"}
          />
          <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} whiteSpace="nowrap">
            Kabupaten Magelang
          </Text>
        </HStack>
      ),
    },
    {
      id: 'spbe',
      content: (
        <Link
          href="https://menpan.go.id/site/tentang-kami/kedeputian/transformasi-digital-pemerintah/sistem-pemerintahan-berbasis-elektronik-spbe-2"
          isExternal
        >
          <HStack spacing={3} color={!scrolled && isHomePage ? "white" : "inherit"}>
            <Image
              src="https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png"
              h="35px"
              alt="Logo SPBE"
              filter={!scrolled && isHomePage ? "brightness(0) invert(1)" : "none"}
            />
            <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} whiteSpace="nowrap">
              SPBE Digital
            </Text>
          </HStack>
        </Link>
      ),
    },
  ];

  const NAV_ITEMS = [
    { label: t.home, href: '/' },
    {
      label: t.profile,
      parenHref: '/profil',
      children: [
        { label: 'Sejarah', href: '/profil#sejarah' },
        { label: 'Visi Misi', href: '/profil#visimisi' },
        { label: 'Geografis', href: '/profil#kondisigeografis' },
        { label: 'Demografi', href: '/profil#demografi' },
      ],
    },
    { label: t.government, href: '/pemerintahan' },
    { label: t.services, href: '/layanan' },
    { label: 'Potensi', href: '/potensi' },
    { label: t.news, href: '/news' },
    { label: t.media, href: '/media' },
    { label: t.games, href: '/game-edukasi' },
    { label: t.contact, href: '/kontak' },
    { label: t.admin, href: '/admin', isSpecial: true },
  ];

  const navIsTransparent = !scrolled && isHomePage;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      transition="all 0.3s ease"
    >
      {navIsTransparent && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="120px"
          bgGradient="linear(to-b, blackAlpha.600, transparent)"
          pointerEvents="none"
          zIndex={-1}
        />
      )}

      <Flex
        bg={navIsTransparent ? 'transparent' : bgColor}
        color={navIsTransparent ? 'white' : textColor}
        minH={'70px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={navIsTransparent ? 0 : 1}
        borderStyle={'solid'}
        borderColor={borderColor}
        align={'center'}
        boxShadow={navIsTransparent ? "none" : "sm"}
        transition="all 0.3s ease"
      >
        <Container maxW="container.xl" display="flex" alignItems="center">
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              color={navIsTransparent ? "white" : "inherit"}
              aria-label={'Toggle Navigation'}
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} alignItems="center">
            <Box h="45px" display="flex" alignItems="center" overflow="hidden" w={{ base: "200px", md: "320px" }} flexShrink={0}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={logoIndex}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {logos[logoIndex].content}
                </motion.div>
              </AnimatePresence>
            </Box>

            <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
              <DesktopNav navItems={NAV_ITEMS} isTransparent={navIsTransparent} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={4}
          >
            <HStack spacing={1}>
              <Button
                size="xs"
                variant={language === 'id' ? 'solid' : 'ghost'}
                colorScheme={navIsTransparent ? "whiteAlpha" : "brand"}
                color={navIsTransparent && language !== 'id' ? "white" : undefined}
                onClick={() => setLanguage('id')}
              >
                ID
              </Button>
              <Button
                size="xs"
                variant={language === 'en' ? 'solid' : 'ghost'}
                colorScheme={navIsTransparent ? "whiteAlpha" : "brand"}
                color={navIsTransparent && language !== 'en' ? "white" : undefined}
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={NAV_ITEMS} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems, isTransparent }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('brand.500', 'brand.300');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={600}
                color={navItem.isSpecial ? 'brand.500' : (isTransparent ? 'white' : linkColor)}
                _hover={{
                  textDecoration: 'none',
                  color: isTransparent ? 'whiteAlpha.800' : linkHoverColor,
                }}
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
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
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

const MobileNav = ({ navItems }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
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
            children.map((child) => (
              <Box as={RouterLink} key={child.label} py={2} to={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar;
