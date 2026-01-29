
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Cormorant Garamond, serif',
    default: 'system-ui, sans-serif',
  },
  colors: {
    ngawonggo: {
      green: '#2D5A27', // Dark green for fertility
      blue: '#1E3A8A', // Deep blue for sky/mountains
      lightGreen: '#68D391',
      lightBlue: '#63B3ED',
    },
  },
});

export default theme;
