import React, { useState, useEffect } from 'react';
import {
  Box,

  IconButton,
  Button,
  Stack,
  Collapse,
  Container,
  Link,
  Popover,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as HamburgerIcon,
  Close as CloseIcon,

  KeyboardArrowDown as ChevronDownIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import NgawonggoLogo from './NgawonggoLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const t = translations[language].nav;

  useEffect(() => {
    const timer = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const onToggle = () => setIsOpen(!isOpen);

  const logos = [
    {
      id: 'desa',
      content: (
        <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex' }}>
          <NgawonggoLogo fontSize={isMobile ? '1rem' : '1.25rem'} />
        </Link>
      ),
    },
    {
      id: 'kab',
      content: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png"
            sx={{ height: '35px' }}
            alt="Logo Kab Magelang"
          />
          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.875rem' }, whiteSpace: 'nowrap' }}>
            Kabupaten Magelang
          </Typography>
        </Box>
      ),
    },
    {
      id: 'spbe',
      content: (
        <Link
          href="https://menpan.go.id/site/tentang-kami/kedeputian/transformasi-digital-pemerintah/sistem-pemerintahan-berbasis-elektronik-spbe-2"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png"
              sx={{ height: '35px' }}
              alt="Logo SPBE"
            />
            <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.875rem' }, whiteSpace: 'nowrap' }}>
              SPBE Digital
            </Typography>
          </Box>
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

  const glassStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(25px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        p: { xs: 1, md: 1.5 },
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg" sx={{ p: 0 }}>
        <Box
          sx={{
            ...glassStyle,
            minHeight: '70px',
            display: 'flex',
            alignItems: 'center',
            py: 1,
            px: { xs: 2, md: 4 },
            borderRadius: { xs: '24px', md: '100px' },
            mx: 'auto',
          }}
        >
          <Box sx={{ flex: 1, display: { md: 'none' }, ml: -1 }}>
            <IconButton onClick={onToggle} aria-label="Toggle Navigation">
              {isOpen ? <CloseIcon /> : <HamburgerIcon />}
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'start' }, alignItems: 'center' }}>
            <Box sx={{ height: '45px', display: 'flex', alignItems: 'center', overflow: 'hidden', width: { xs: '180px', md: '300px' }, flexShrink: 0 }}>
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

            <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 4 }}>
              <DesktopNav navItems={NAV_ITEMS} />
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flex: { xs: 1, md: 0 }, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant={language === 'id' ? 'contained' : 'text'}
              onClick={() => setLanguage('id')}
              sx={{ minWidth: '40px', borderRadius: '100px' }}
            >
              ID
            </Button>
            <Button
              size="small"
              variant={language === 'en' ? 'contained' : 'text'}
              onClick={() => setLanguage('en')}
              sx={{ minWidth: '40px', borderRadius: '100px' }}
            >
              EN
            </Button>
          </Stack>
        </Box>
      </Container>

      <Collapse in={isOpen}>
        <MobileNav navItems={NAV_ITEMS} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }) => {
  return (
    <Stack direction="row" spacing={2}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <NavItem navItem={navItem} />
        </Box>
      ))}
    </Stack>
  );
};

const NavItem = ({ navItem }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    if (navItem.children) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      <Button
        component={RouterLink}
        to={navItem.href ?? '#'}
        sx={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: navItem.isSpecial ? 'primary.main' : 'text.primary',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.04)',
            color: 'primary.main',
          },
          px: 1.5,
        }}
        endIcon={navItem.children ? <ChevronDownIcon /> : null}
      >
        {navItem.label}
      </Button>
      {navItem.children && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            pointerEvents: 'none',
          }}
          slotProps={{
            paper: {
              onMouseEnter: handleOpen,
              onMouseLeave: handleClose,
              sx: {
                pointerEvents: 'auto',
                mt: 1,
                p: 1.5,
                borderRadius: '16px',
                minWidth: '200px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }
            }
          }}
        >
          <Stack spacing={0.5}>
            {navItem.children.map((child) => (
              <Button
                key={child.label}
                component={RouterLink}
                to={child.href}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'primary.container',
                    color: 'primary.onContainer',
                  },
                  borderRadius: '12px',
                  py: 1,
                }}
              >
                {child.label}
              </Button>
            ))}
          </Stack>
        </Popover>
      )}
    </Box>
  );
};

const MobileNav = ({ navItems }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '24px',
        mt: 1,
        mx: 2,
        p: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        display: { md: 'none' },
      }}
    >
      <Stack spacing={1}>
        {navItems.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      </Stack>
    </Box>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          px: 2,
          borderRadius: '12px',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
        }}
        onClick={() => children ? setIsOpen(!isOpen) : null}
      >
        <Typography
          component={href ? RouterLink : 'div'}
          to={href ?? '#'}
          sx={{
            fontWeight: 600,
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          {label}
        </Typography>
        {children && (
          <ChevronDownIcon
            sx={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        )}
      </Box>

      {children && (
        <Collapse in={isOpen}>
          <Stack sx={{ pl: 3, mt: 0.5, borderLeft: '1px solid', borderColor: 'divider' }}>
            {children.map((child) => (
              <Button
                key={child.label}
                component={RouterLink}
                to={child.href}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  py: 1,
                }}
              >
                {child.label}
              </Button>
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}

export default Navbar;
