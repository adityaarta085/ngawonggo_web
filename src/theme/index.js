import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Inter", sans-serif',
  },
  layerStyles: {
    glass: {
      bg: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    },
    glassCard: {
      bg: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '24px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
      transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
      _hover: {
        bg: 'rgba(255, 255, 255, 0.25)',
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.1)',
      }
    },
    darkGlass: {
      bg: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    },
    liquidGlass: {
      bg: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(25px) saturate(200%)',
      WebkitBackdropFilter: 'blur(25px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    }
  },
  colors: {
    brand: {
      50: '#e6f0ff',
      100: '#b3d1ff',
      200: '#80b3ff',
      300: '#4d94ff',
      400: '#1a75ff',
      500: '#137fec', // Primary Blue
      600: '#004494',
      700: '#00336e',
      800: '#00224a',
      900: '#001125',
    },
    aurora: {
      purple: '#8B5CF6',
      pink: '#EC4899',
      blue: '#3B82F6',
    }
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
        overflowX: 'hidden',
      },
      "@keyframes float": {
        "0%, 100%": { transform: "translate(0, 0)" },
        "33%": { transform: "translate(30px, -50px)" },
        "66%": { transform: "translate(-20px, 20px)" }
      }
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'scale(1.05)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'scale(0.95)',
        }
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '800',
        letterSpacing: '-0.02em',
      },
    },
  },
});

export default theme;
