import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Public Sans", "Plus Jakarta Sans", sans-serif',
    body: '"Public Sans", "Inter", sans-serif',
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
      borderRadius: '2xl',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
      transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    },
    darkGlass: {
      bg: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    },
    mildGlass: {
      bg: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    mildGlassCard: {
      bg: 'white',
      _dark: {
        bg: 'gray.800',
      },
      borderRadius: '2xl',
      boxShadow: 'xl',
      transition: 'all 0.3s ease',
    }
  },
  colors: {
    brand: {
      50: '#e6f0ff',
      100: '#b3d1ff',
      200: '#80b3ff',
      300: '#4d94ff',
      400: '#1a75ff',
      500: '#137fec', // Primary IKN-style Blue
      600: '#0066cc',
      700: '#0052a3',
      800: '#003d7a',
      900: '#002952',
    },
    ikn: {
      gold: '#C5A96F',
      green: '#0F2F24',
      light: '#f6f7f8',
      dark: '#101922',
    },
    emerald: {
      50: "#ecfdf5",
      100: "#d1fae5",
      500: "#10b981",
      600: "#059669",
      900: "#064e3b",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    accent: {
      green: '#2D5A27',
      lightGreen: '#4c9e43',
      blue: '#0F172A',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'ikn.light',
        color: 'gray.800',
        _dark: {
          bg: 'ikn.dark',
          color: 'white',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: '700',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        iknGold: {
          bg: 'ikn.gold',
          color: 'white',
          _hover: {
            bg: '#b4985a',
          },
        },
        glass: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200',
          },
        }
      }
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
