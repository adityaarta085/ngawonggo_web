import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

const AllProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <LanguageProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
