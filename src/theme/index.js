import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Inter", sans-serif',
  },
  shadows: {
    soft: '0 8px 30px rgba(0,0,0,0.04)',
    medium: '0 12px 40px rgba(0,0,0,0.08)',
    strong: '0 20px 50px rgba(0,0,0,0.12)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  layerStyles: {
    glass: {
      bg: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    },
    glassCard: {
      bg: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '3xl',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
      transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
      _hover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
        borderColor: 'brand.200',
      }
    },
    darkGlass: {
      bg: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    },
    liquidGlass: {
      bg: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(30px) saturate(210%)',
      WebkitBackdropFilter: 'blur(30px) saturate(210%)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
    }
  },
  colors: {
    brand: {
      50: '#e6f0ff',
      100: '#b3d1ff',
      200: '#80b3ff',
      300: '#4d94ff',
      400: '#1a75ff',
      500: '#137fec', // Balanced Primary Blue
      600: '#0066cc',
      700: '#0052a3',
      800: '#003d7a',
      900: '#002952',
    },
    accent: {
      green: '#0F2F24', // Deep Village Green
      gold: '#C5A96F',  // IKN Gold
      blue: '#0F172A',
    },
    ramadan: {
      gold: '#C5A96F',
      green: '#0F2F24',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
        overflowX: 'hidden',
      },
      '::selection': {
        bg: 'brand.100',
        color: 'brand.700',
      },
      '.glass-hover': {
        transition: 'all 0.3s ease',
        _hover: {
          bg: 'rgba(255, 255, 255, 0.9)',
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        }
      }
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '700',
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
      },
      variants: {
        solid: {
          _hover: {
            transform: 'scale(1.02)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'scale(0.98)',
          }
        },
        outline: {
          borderWidth: '2px',
          _hover: {
            bg: 'brand.50',
          }
        }
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: '800',
        letterSpacing: '-0.03em',
      },
    },
    Container: {
      baseStyle: {
        maxW: 'container.xl',
      }
    }
  },
});

export default theme;
