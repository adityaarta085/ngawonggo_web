import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
    accent: '"Syne", sans-serif',
  },
  shadows: {
    brutal: '4px 4px 0px #000000',
    brutalHover: '8px 8px 0px #000000',
    brutalInset: 'inset 4px 4px 0px #000000',
    brutalSoft: '4px 4px 0px rgba(0,0,0,0.15)',
    brutalColor: (color) => `4px 4px 0px ${color}`,
  },
  layerStyles: {
    brutalCard: {
      border: '3px solid',
      borderColor: 'black',
      boxShadow: '4px 4px 0px #000',
      borderRadius: 'xl',
      transition: 'all 0.2s',
      _hover: {
        boxShadow: '8px 8px 0px #000',
        transform: 'translate(-4px, -4px)',
      }
    },
    brutalCardAccent: {
      border: '3px solid',
      borderColor: 'black',
      bg: '#FFE156',
      boxShadow: '4px 4px 0px #000',
    }
  },
  colors: {
    brutal: {
      black: '#000000',
      bg: '#1A1A2E',
      bgDark: '#2D2D44',
      cardBg: '#F7F7F2',
      yellow: '#FFE156',
      red: '#FF6B6B',
      teal: '#4ECDC4',
      purple: '#A855F7',
      orange: '#FB923C',
      green: '#34D399',
    },
    neo: {
      midnight: '#1A1A2E',
      yellow: '#FFE156',
      coral: '#FF6B6B',
      teal: '#4ECDC4',
      warmWhite: '#F7F7F2',
      slate: '#2D2D44',
    },
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
    global: (props) => ({
      body: {
        bg: mode('white', 'neo.midnight')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
        overflowX: 'hidden',
        background: mode('none', 'none')(props), // Handle via css classes for patterns
      },
      '::selection': {
        bg: 'neo.yellow',
        color: 'black',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: 'bold',
        border: '3px solid black',
        boxShadow: '4px 4px 0px black',
        transition: 'all 0.2s',
        _hover: {
          transform: 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0px black',
        },
        _active: {
          transform: 'translate(2px, 2px)',
          boxShadow: '0px 0px 0px black',
        }
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'neo.yellow' : `${props.colorScheme}.400`,
          color: 'black',
          _hover: {
            bg: props.colorScheme === 'brand' ? '#ffeb82' : `${props.colorScheme}.500`,
          }
        }),
        outline: {
          bg: 'transparent',
          color: 'black',
          _dark: {
            color: 'white',
            borderColor: 'white',
            boxShadow: '4px 4px 0px white',
            _hover: {
              boxShadow: '6px 6px 0px white',
            },
            _active: {
              boxShadow: '0px 0px 0px white',
            }
          }
        }
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: '-0.02em',
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
