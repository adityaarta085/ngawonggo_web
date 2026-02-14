
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Inter", sans-serif',
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
    liquidGlass: {
      bg: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(25px) saturate(200%)',
      WebkitBackdropFilter: 'blur(25px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    }
  },
  colors: {
    brand: {
      50: '#e6f0ff',
      100: '#b3d1ff',
      200: '#80b3ff',
      300: '#4d94ff',
      400: '#1a75ff',
      500: '#0056b3', // Main Blue
      600: '#004494',
      700: '#00336e',
      800: '#00224a',
      900: '#001125',
    },
    accent: {
      green: '#2D5A27', // Village Green
      lightGreen: '#4c9e43',
      blue: '#0F172A', // Very Dark Blue for footer/hero
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '600',
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
