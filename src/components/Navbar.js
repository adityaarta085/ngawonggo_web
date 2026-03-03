import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  useColorModeValue,
  useDisclosure,
  HStack,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import NgawonggoLogo from './NgawonggoLogo';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].nav;
  const [user, setUser] = useState(null);
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logos = useMemo(() => [
    { content: <NgawonggoLogo h="35px" />, duration: 5000 },
    { content: <Text fontWeight="800" fontSize="md" color="brand.500" letterSpacing="tighter">DESA NGAWONGGO</Text>, duration: 3000 }
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoIndex((prev) => (prev + 1) % logos.length);
    }, logos[logoIndex].duration);
    return () => clearTimeout(timer);
  }, [logoIndex, logos]);

  const NAV_ITEMS = useMemo(() => [
    { label: t.home, href: '/' },
    { label: t.profile, href: '/profil' },
    { label: t.government, href: '/pemerintahan' },
    { label: t.services, href: '/layanan' },
    { label: t.explore, href: '/jelajahi' },
    { label: t.news, href: '/berita' },
    { label: t.media, href: '/media' },
    { label: t.games, href: '/game-edukasi' },
    { label: t.contact, href: '/kontak' },
  ], [t]);

  const navBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(15, 23, 42, 0.7)');
  const navColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');

  return (
    <Box
      position="fixed"
      top={2}
      left={0}
      right={0}
      zIndex={1000}
      px={{ base: 2, md: 4 }}
      transition="all 0.3s ease"
    >
      <Flex
        layerStyle="liquidGlass"
        bg={navBg}
        color={navColor}
        minH={'60px'}
        py={{ base: 1 }}
        px={{ base: 3, md: 6 }}
        align={'center'}
        borderRadius="full"
        maxW="container.xl"
        mx="auto"
        transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        boxShadow="0 10px 30px -5px rgba(0, 0, 0, 0.15)"
        backdropFilter="blur(16px) saturate(180%)"
        border="1px solid"
        borderColor={borderColor}
      >
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
                borderRadius="full"
                size="sm"
            />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'start' }} alignItems="center">
            <Box h="35px" display="flex" alignItems="center" overflow="hidden" w={{ base: "150px", md: "200px" }} flexShrink={0}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={logoIndex}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {logos[logoIndex].content}
                    </motion.div>
                </AnimatePresence>
            </Box>

            <Flex display={{ base: 'none', lg: 'flex' }} ml={1} flex={1} justify="center">
                <DesktopNav navItems={NAV_ITEMS} />
            </Flex>
        </Flex>

        <Stack
            flex={{ base: '0 0 auto', lg: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={{ base: 1, md: 2 }}
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
                   <Tooltip label="Masuk Portal">
                       <Button
                            as={RouterLink}
                            to="/auth"
                            leftIcon={<FaLock />}
                            colorScheme="brand"
                            variant="ghost"
                            size="xs"
                            borderRadius="full"
                            px={4}
                       >
                           Masuk
                       </Button>
                   </Tooltip>
               )}
            </Box>

            <HStack spacing={0} bg={useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)')} p={0.5} borderRadius="full">
              <Button
                size="xs"
                variant={language === 'id' ? 'solid' : 'ghost'}
                colorScheme="brand"
                onClick={() => setLanguage('id')}
                borderRadius="full"
                h="20px"
                minW="28px"
                fontSize="8px"
              >
                ID
              </Button>
              <Button
                size="xs"
                variant={language === 'en' ? 'solid' : 'ghost'}
                colorScheme="brand"
                onClick={() => setLanguage('en')}
                borderRadius="full"
                h="20px"
                minW="28px"
                fontSize="8px"
              >
                EN
              </Button>
            </HStack>
        </Stack>
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
  const activeBg = useColorModeValue('brand.50', 'rgba(19, 127, 236, 0.1)');
  const location = useLocation();

  return (
    <Stack direction={'row'} spacing={0} align="center">
      {navItems.map((navItem) => {
        const isActive = location.pathname === navItem.href;
        return (
            <Box key={navItem.label}>
              <Box
                as={RouterLink}
                px={2.5}
                py={1.5}
                to={navItem.href ?? '#'}
                fontSize={'10px'}
                fontWeight={ isActive ? 700 : 600}
                color={isActive ? 'brand.500' : linkColor}
                bg={isActive ? activeBg : 'transparent'}
                borderRadius="full"
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                  bg: activeBg
                }}
                whiteSpace="nowrap"
                transition="all 0.2s"
              >
                {navItem.label}
              </Box>
            </Box>
        );
      })}
    </Stack>
  );
};

const MobileNav = ({ navItems, user, onClose }) => {
  const navBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(15, 23, 42, 0.95)');
  const borderColor = useColorModeValue('gray.100', 'gray.800');

  return (
    <Stack
      layerStyle="liquidGlass"
      p={6}
      display={{ lg: 'none' }}
      borderRadius="3xl"
      mt={4}
      boxShadow="2xl"
      bg={navBg}
      maxH="75vh"
      overflowY="auto"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={borderColor}
    >
      {user ? (
          <Button
            as={RouterLink}
            to="/portal"
            leftIcon={<FaUserCircle />}
            colorScheme="brand"
            variant="solid"
            mb={6}
            borderRadius="2xl"
            size="lg"
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
            mb={6}
            borderRadius="2xl"
            size="lg"
            onClick={onClose}
        >
            Masuk Portal Warga
        </Button>
      )}

      <VStack align="stretch" spacing={2}>
          {navItems.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
          ))}
      </VStack>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onClose }) => {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const isActive = location.pathname === href;
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const subNavBorderColor = useColorModeValue('gray.200', 'gray.700');

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
        py={3}
        px={4}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        borderRadius="xl"
        bg={isActive ? 'brand.50' : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.50'
        }}
        onClick={handleLinkClick}
      >
        <Text
          fontWeight={isActive ? 700 : 600}
          color={isActive ? 'brand.500' : textColor}
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
          borderColor={subNavBorderColor}
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

export default Navbar;
