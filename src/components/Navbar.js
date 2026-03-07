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
  HStack,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { FaLock, FaUserCircle } from 'react-icons/fa';

export default function Navbar({ user }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t, language, setLanguage } = useLanguage();
  const [logoIndex, setLogoIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logos = [
    { id: 'desa', content: <NgawonggoLogo h="32px" /> },
    { id: 'text', content: (
      <VStack align="start" spacing={0} ml={2}>
        <Text fontSize="xs" fontWeight="800" color="brand.500" lineHeight="1">DESA NGAWONGGO</Text>
        <Text fontSize="10px" fontWeight="600" color="gray.500">Kec. Bandongan, Kab. Magelang</Text>
      </VStack>
    )},
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % logos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [logos.length]);

  const NAV_ITEMS = [
    { label: t.home, href: '/' },
    {
      label: t.profile,
      children: [
        { label: 'Sejarah & Budaya', subLabel: 'Warisan leluhur Ngawonggo', href: '/profil' },
        { label: 'Visi & Misi', subLabel: 'Arah pembangunan desa', href: '/profil' },
        { label: 'Wilayah Desa', subLabel: 'Geografis & batas wilayah', href: '/profil' },
      ],
      href: '/profil'
    },
    { label: t.government, href: '/pemerintahan' },
    { label: t.services, href: '/layanan' },
    { label: t.explore, href: '/jelajahi' },
    { label: t.news, href: '/news' },
    { label: t.media, href: '/media' },
    { label: t.games, href: '/game-edukasi' },
    { label: t.contact, href: '/kontak' },
    { label: t.admin, href: '/admin', isSpecial: true },
  ];

  const navBg = useColorModeValue(
    isScrolled ? 'rgba(255, 255, 255, 0.45)' : 'white',
    isScrolled ? 'rgba(15, 23, 42, 0.7)' : 'rgba(15, 23, 42, 0.95)'
  );

  const navColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      p={0}
      transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      maxW="100vw"
    >
      <Flex
        layerStyle={isScrolled ? "liquidGlass" : "none"}
        bg={navBg}
        color={navColor}
        minH={'60px'}
        py={isScrolled ? 1 : 2}
        px={{ base: 4, md: 6 }}
        align={'center'}
        borderRadius={isScrolled ? { base: '2xl', md: 'full' } : 'none'}
        maxW={isScrolled ? "container.xl" : "full"}
        mx="auto"
        transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow={isScrolled ? "0 12px 40px 0 rgba(31, 38, 135, 0.12)" : "none"}
        borderBottom={isScrolled ? "none" : "1px solid"}
        borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
      >
        <Container maxW="full" display="flex" alignItems="center" px={0}>
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

          <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} alignItems="center" overflow="hidden">
            <Box h="40px" display="flex" alignItems="center" overflow="hidden" w={{ base: "150px", md: "250px", lg: "280px" }} flexShrink={0}>
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

            <Flex display={{ base: 'none', lg: 'flex' }} ml={2}>
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
                   <Tooltip label="Portal Warga">
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
                   <Tooltip label="Masuk untuk bypass splash & simpan progres">
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
    <Stack direction={'row'} spacing={2} align="center">
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                p={1.5}
                to={navItem.href ?? '#'}
                fontSize={'11px'}
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

      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
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
            children.map((child) => (
              <Box
                as={RouterLink}
                key={child.label}
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
