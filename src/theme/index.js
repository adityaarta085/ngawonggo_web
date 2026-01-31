
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Inter", sans-serif',
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
