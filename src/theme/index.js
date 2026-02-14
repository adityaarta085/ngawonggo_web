import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#137fec', // Village Primary Blue
          container: '#d7e3ff',
          onContainer: '#001b3e',
        },
        secondary: {
          main: '#2D5A27', // Village Green
          container: '#aff3a4',
          onContainer: '#002204',
        },
        tertiary: {
          main: '#C5A96F', // IKN Gold
          container: '#ffddb3',
          onContainer: '#291800',
        },
        background: {
          default: '#fdfbff',
          paper: '#fdfbff',
        },
        surfaceVariant: {
          main: '#e0e2ec',
          onMain: '#44474e',
        },
        outline: {
          main: '#74777f',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#adc6ff',
          container: '#004494',
          onContainer: '#d7e3ff',
        },
        secondary: {
          main: '#94d78a',
          container: '#005315',
          onContainer: '#aff3a4',
        },
        tertiary: {
          main: '#efbe7b',
          container: '#5b431e',
          onContainer: '#ffddb3',
        },
        background: {
          default: '#1a1b1f',
          paper: '#1a1b1f',
        },
        surfaceVariant: {
          main: '#44474e',
          onMain: '#c4c6d0',
        },
        outline: {
          main: '#8e9099',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16, // MD3 Medium Radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // MD3 Pill Buttons
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28, // MD3 Card Radius
          boxShadow: 'none',
          backgroundColor: 'var(--mui-palette-surfaceVariant-main)', // MD3 Surface Variant for un-elevated cards
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
