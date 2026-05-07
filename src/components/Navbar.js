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
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { supabase } from '../lib/supabase';
import MegaMenu from './MegaMenu';

const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
      onClose();
  }, [location.pathname, onClose]);

  const NAV_ITEMS = [
    {
      label: language === 'id' ? 'BERANDA' : 'HOME',
      href: '/',
    },
    {
      label: language === 'id' ? 'PROFIL' : 'PROFILE',
      href: '/profil',
    },
    {
      label: language === 'id' ? 'LAYANAN' : 'SERVICES',
      href: '/layanan',
    },
    {
        label: language === 'id' ? 'PEMERINTAHAN' : 'GOVERNMENT',
        children: [
            { label: 'Struktur Organisasi', subLabel: 'Bagan dan Profil Perangkat Desa', href: '/pemerintahan' },
            { label: 'Dokumen Publik', subLabel: 'Transparansi APBDes & Peraturan', href: '/pemerintahan/dokumen' },
        ]
    },
    {
      label: language === 'id' ? 'BERITA' : 'NEWS',
      children: [
        { label: 'Berita Desa', subLabel: 'Kabar dan kegiatan terbaru di Ngawonggo', href: '/news' },
        { label: 'Berita Nasional', subLabel: 'Informasi dari Kementerian & Lembaga', href: '/news/nasional' },
      ],
    },
    {
      label: language === 'id' ? 'JELAJAHI' : 'EXPLORE',
      isMegaMenu: true,
    },
    {
      label: language === 'id' ? 'DONASI' : 'DONATION',
      href: '/donasi',
    },
  ];

  return (
    <Box
      position="fixed"
      w="full"
      top={0}
      zIndex={1000}
      transition="all 0.3s"
      pt={isScrolled ? 0 : { base: 2, md: 4 }}
      px={isScrolled ? 0 : { base: 2, md: 4 }}
    >
      <Container maxW="container.xl" px={{ base: 0, lg: isScrolled ? 4 : 0 }}>
        <Flex
          bg="white"
          border="3px solid black"
          borderTop={isScrolled ? 'none' : '3px solid black'}
          borderRadius={isScrolled ? 'none' : 'md'}
          color="black"
          minH={'64px'}
          py={{ base: 2 }}
          px={{ base: 4, md: 8 }}
          align={'center'}
          transition="all 0.3s"
          boxShadow="4px 4px 0px black"
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
              color="black"
              _hover={{ bg: 'neo.yellow' }}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} align="center">
            <HStack as={RouterLink} to="/" spacing={3} _hover={{ textDecoration: 'none' }} transition="transform 0.2s" _active={{ transform: 'scale(0.95)' }}>
                <Box bg="neo.yellow" p={1} border="2px solid black" display="flex" alignItems="center">
                  <Image src="/logo_desa.png" h={{ base: "24px", md: "32px" }} alt="Logo" />
                </Box>
                <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                   <Text
                    fontWeight="900"
                    color="black"
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="tight"
                    lineHeight="1"
                    fontFamily="heading"
                  >
                    DESA NGAWONGGO
                  </Text>
                  <Text fontFamily="accent" fontSize="10px" fontWeight="800" color="black" letterSpacing="widest">KAB. MAGELANG</Text>
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
            <ColorModeSwitcher justifySelf="flex-end" />
             {user ? (
                <Tooltip label="Portal Warga" placement="bottom" hasArrow>
                   <Button
                      as={RouterLink}
                      to="/portal"
                      variant="solid"
                      bg="black"
                      color="white"
                      border="2px solid black"
                      leftIcon={<FaUserCircle />}
                      borderRadius="none"
                      px={6}
                      size="sm"
                      boxShadow="4px 4px 0px #FFE156"
                      _hover={{ bg: 'gray.800', transform: 'translate(-2px, -2px)', boxShadow: '6px 6px 0px #FFE156' }}
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
                      fontFamily="accent"
                      variant={'outline'}
                      border="2px solid black"
                      borderRadius="none"
                      px={6}
                      size="sm"
                      leftIcon={<FaLock />}
                      _hover={{
                        bg: 'neo.yellow',
                        color: 'black',
                        transform: 'translate(-2px, -2px)',
                        boxShadow: '4px 4px 0px black'
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
  return (
    <Stack direction={'row'} spacing={2} overflowX="auto" maxW="full">
      {navItems.map((navItem, index) => {
        if (navItem.isMegaMenu) {
            return (
              <Box key={`${navItem.label}-${index}`}>
                <MegaMenu label={navItem.label} />
              </Box>
            )
        }

        return (
        <Box key={`${navItem.label}-${index}`}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'xs'}
                fontFamily="accent"
                fontWeight={800}
                color="black"
                transition="all 0.2s"
                _hover={{
                  textDecoration: 'none',
                  bg: 'neo.yellow',
                  borderBottom: '2px solid black'
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
                border="3px solid black"
                boxShadow={'brutal'}
                bg="white"
                p={4}
                rounded={'none'}
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
      )})}
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
      rounded={'none'}
      _hover={{ bg: 'neo.yellow' }}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'black' }}
            fontWeight={900}
            fontFamily="heading"
            color="black"
          >
            {label}
          </Text>
          <Text fontSize={'sm'} color="gray.600">{subLabel}</Text>
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
          <Icon color="black" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ navItems, user, onClose }) => {
  return (
    <Stack
      p={4}
      display={{ lg: 'none' }}
      mt={2}
      mx={0}
      boxShadow="4px 4px 0px black"
      bg="white"
      border="3px solid black"
      maxH="70vh"
      overflowY="auto"
    >
      <ColorModeSwitcher alignSelf="center" mb={4} />
      {user ? (
          <Button
            key="portal-btn"
            as={RouterLink}
            to="/portal"
            leftIcon={<FaUserCircle />}
            bg="black"
            color="white"
            variant="solid"
            mb={4}
            borderRadius="none"
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
            bg="neo.yellow"
            color="black"
            border="2px solid black"
            variant="solid"
            mb={4}
            borderRadius="none"
            boxShadow="brutal"
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
        borderBottom="2px solid black"
      >
        <Text
          fontWeight={900}
          fontFamily="heading"
          color="black"
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
            color="black"
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft="3px solid black"
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
                color="gray.700"
                fontWeight="bold"
                _hover={{ color: 'black', bg: 'neo.yellow', px: 2 }}
                w="full"
                transition="all 0.2s"
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
